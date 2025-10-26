import { useState } from "react";
import { Search, Plus, Filter, Download, Upload, Pin, Star, Archive, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionItem } from "./SessionItem";
import { useChatStore } from "@/hooks/useChatStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SessionListProps {
  className?: string;
}

export const SessionList = ({ className }: SessionListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pinned" | "favorites" | "archived">("all");

  const {
    sessions,
    sessionOrder,
    currentSessionId,
    createNewSession,
    switchSession,
    renameSession,
    deleteSession,
    togglePinSession,
    toggleFavoriteSession,
    archiveSession,
    exportSession,
    importSession,
  } = useChatStore();

  // Фильтрация и поиск сессий
  const filteredSessions = sessionOrder
    .map(id => sessions[id])
    .filter(session => {
      if (!session) return false;
      
      // Применяем фильтр по табам
      if (filterTab === "pinned" && !session.metadata.isPinned) return false;
      if (filterTab === "favorites" && !session.metadata.isFavorite) return false;
      if (filterTab === "archived" && !session.metadata.isArchived) return false;
      if (filterTab === "all" && session.metadata.isArchived) return false;

      // Применяем поиск
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          session.title.toLowerCase().includes(query) ||
          session.preview?.toLowerCase().includes(query) ||
          session.messages.some(msg => msg.content.toLowerCase().includes(query))
        );
      }

      return true;
    });

  // Сортировка: закрепленные сверху
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.metadata.isPinned && !b.metadata.isPinned) return -1;
    if (!a.metadata.isPinned && b.metadata.isPinned) return 1;
    return 0;
  });

  const handleNewSession = () => {
    const newId = createNewSession();
    toast.success("Создан новый чат");
  };

  const handleExport = (sessionId: string) => {
    const data = exportSession(sessionId);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${sessionId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Чат экспортирован");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          importSession(data);
          toast.success("Чат импортирован");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDuplicate = (sessionId: string) => {
    const session = sessions[sessionId];
    if (session) {
      const data = exportSession(sessionId);
      importSession(data);
      toast.success("Чат дублирован");
    }
  };

  const handleDelete = (sessionId: string) => {
    if (Object.keys(sessions).length === 1) {
      toast.error("Нельзя удалить последний чат");
      return;
    }
    deleteSession(sessionId);
    toast.success("Чат удален");
  };

  const pinnedCount = Object.values(sessions).filter(s => s.metadata.isPinned).length;
  const favoritesCount = Object.values(sessions).filter(s => s.metadata.isFavorite).length;
  const archivedCount = Object.values(sessions).filter(s => s.metadata.isArchived).length;

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-b from-muted/50 to-card/50 backdrop-blur-sm", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-rajdhani font-bold metal-glow">История чатов</h2>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={handleImport} title="Импорт">
              <Upload className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="default" onClick={handleNewSession} title="Новый чат">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по чатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-xs py-1.5 data-[state=active]:bg-primary/20">
              <MessageSquare className="h-3 w-3 mr-1" />
              Все
            </TabsTrigger>
            <TabsTrigger value="pinned" className="text-xs py-1.5 data-[state=active]:bg-primary/20">
              <Pin className="h-3 w-3 mr-1" />
              {pinnedCount > 0 && <span className="ml-0.5">({pinnedCount})</span>}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs py-1.5 data-[state=active]:bg-primary/20">
              <Star className="h-3 w-3 mr-1" />
              {favoritesCount > 0 && <span className="ml-0.5">({favoritesCount})</span>}
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs py-1.5 data-[state=active]:bg-primary/20">
              <Archive className="h-3 w-3 mr-1" />
              {archivedCount > 0 && <span className="ml-0.5">({archivedCount})</span>}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {searchQuery ? "Ничего не найдено" : "Нет чатов"}
              </p>
            </div>
          ) : (
            sortedSessions.map(session => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={session.id === currentSessionId}
                onClick={() => switchSession(session.id)}
                onRename={(newTitle) => renameSession(session.id, newTitle)}
                onDelete={() => handleDelete(session.id)}
                onTogglePin={() => togglePinSession(session.id)}
                onToggleFavorite={() => toggleFavoriteSession(session.id)}
                onArchive={() => archiveSession(session.id)}
                onExport={() => handleExport(session.id)}
                onDuplicate={() => handleDuplicate(session.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t border-border text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Всего чатов: {Object.keys(sessions).length}</span>
          <span>Сообщений: {Object.values(sessions).reduce((sum, s) => sum + s.metadata.messageCount, 0)}</span>
        </div>
      </div>
    </div>
  );
};
