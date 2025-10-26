import { useState, useEffect, useRef } from "react";
import { Search, Plus, Filter, Download, Upload, Pin, Star, Archive, MessageSquare, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionItem } from "./SessionItem";
import { useChatStore } from "@/hooks/useChatStore";
import { useHotkeys, HOTKEYS } from "@/hooks/useHotkeys";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SessionListProps {
  className?: string;
}

export const SessionList = ({ className }: SessionListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pinned" | "favorites" | "archived">("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // ⌨️ Горячие клавиши
  useHotkeys([
    {
      ...HOTKEYS.SEARCH,
      callback: () => {
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      },
    },
    {
      ...HOTKEYS.NEW_CHAT,
      callback: handleNewSession,
    },
    {
      ...HOTKEYS.NEXT_SESSION,
      callback: () => {
        const currentIndex = sortedSessions.findIndex(s => s.id === currentSessionId);
        if (currentIndex < sortedSessions.length - 1) {
          switchSession(sortedSessions[currentIndex + 1].id);
        }
      },
    },
    {
      ...HOTKEYS.PREV_SESSION,
      callback: () => {
        const currentIndex = sortedSessions.findIndex(s => s.id === currentSessionId);
        if (currentIndex > 0) {
          switchSession(sortedSessions[currentIndex - 1].id);
        }
      },
    },
  ]);

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-b from-muted/50 to-card/50 backdrop-blur-sm border-r border-border/50", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50 space-y-3 bg-gradient-to-r from-card/80 to-muted/60">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-rajdhani font-bold metal-glow tracking-wide">ИСТОРИЯ СЕССИЙ</h2>
          <div className="flex gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleImport} 
              title="Импорт (Ctrl+I)"
              className="hover-glow hover:text-primary"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="default" 
              onClick={handleNewSession} 
              title="Новый чат (Ctrl+N)"
              className="bg-gradient-to-r from-primary/80 to-accent/70 hover:from-primary hover:to-accent shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search with hotkey indicator */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            ref={searchInputRef}
            placeholder="Поиск по чатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              "pl-9 pr-16 transition-all duration-300",
              "border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10",
              "bg-input/50 focus:bg-input"
            )}
          />
          {!isSearchFocused && !searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground pointer-events-none">
              <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-code">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-code">K</kbd>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4 h-auto bg-muted/50 p-1">
            <TabsTrigger 
              value="all" 
              className="text-xs py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/30 data-[state=active]:to-accent/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Все
            </TabsTrigger>
            <TabsTrigger 
              value="pinned" 
              className="text-xs py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/30 data-[state=active]:to-accent/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <Pin className="h-3 w-3 mr-1" />
              {pinnedCount > 0 && <span className="ml-0.5 font-bold">({pinnedCount})</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="text-xs py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/30 data-[state=active]:to-accent/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <Star className="h-3 w-3 mr-1" />
              {favoritesCount > 0 && <span className="ml-0.5 font-bold">({favoritesCount})</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="text-xs py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/30 data-[state=active]:to-accent/20 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <Archive className="h-3 w-3 mr-1" />
              {archivedCount > 0 && <span className="ml-0.5 font-bold">({archivedCount})</span>}
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
      <div className="p-3 border-t border-border/50 text-xs bg-gradient-to-r from-muted/60 to-card/60">
        <div className="flex justify-between items-center text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse-glow"></div>
            <span className="font-rajdhani font-semibold">{Object.keys(sessions).length}</span>
            <span>сессий</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{Object.values(sessions).reduce((sum, s) => sum + s.metadata.messageCount, 0)}</span>
            <span>сообщений</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground/70 flex items-center gap-2 justify-center">
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>Горячие клавиши: Ctrl+N (новый), Ctrl+K (поиск)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
