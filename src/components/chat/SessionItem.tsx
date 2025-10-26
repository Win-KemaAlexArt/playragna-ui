import { cn } from "@/lib/utils";
import { MessageSquare, Pin, Star, Archive, MoreVertical, Trash2, Edit2, Download, Copy } from "lucide-react";
import { ChatSession } from "@/types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  onArchive: () => void;
  onExport: () => void;
  onDuplicate: () => void;
}

export const SessionItem = ({
  session,
  isActive,
  onClick,
  onRename,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onArchive,
  onExport,
  onDuplicate,
}: SessionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== session.title) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setEditTitle(session.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 p-3 rounded-lg transition-all duration-300 cursor-pointer",
        "border border-transparent hover:border-primary/20",
        isActive
          ? "bg-gradient-to-r from-primary/25 to-accent/15 border-l-4 border-l-primary shadow-lg shadow-primary/20 scale-[1.02]"
          : "hover:bg-gradient-to-r hover:from-muted/70 hover:to-card/70 border-l-2 border-l-transparent hover:border-l-primary/30 hover:shadow-md hover:shadow-primary/10"
      )}
      onClick={() => !isEditing && onClick()}
    >
      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 transition-all duration-300",
        isActive ? "text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" : "text-muted-foreground group-hover:text-primary/70"
      )}>
        <MessageSquare className={cn("h-4 w-4", isActive && "animate-pulse-glow")} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="h-6 text-sm"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <h4 className={cn(
                "text-sm font-rajdhani font-semibold truncate tracking-wide transition-all duration-300",
                isActive ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary))]" : "text-foreground group-hover:text-primary/80"
              )}>
                {session.title}
              </h4>
              {session.metadata.isPinned && (
                <Pin className="h-3 w-3 text-primary flex-shrink-0 drop-shadow-[0_0_4px_hsl(var(--primary))]" />
              )}
              {session.metadata.isFavorite && (
                <Star className="h-3 w-3 text-yellow-400 flex-shrink-0 fill-yellow-400 drop-shadow-[0_0_4px_hsl(45_100%_50%)]" />
              )}
              {session.metadata.isArchived && (
                <Archive className="h-3 w-3 text-muted-foreground/70 flex-shrink-0" />
              )}
            </div>
            {session.preview && (
              <p className="text-xs text-muted-foreground/80 truncate mt-0.5 group-hover:text-muted-foreground transition-colors">
                {session.preview}
              </p>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-muted-foreground/70 font-code">
                {session.metadata.messageCount} msg
              </p>
              {isActive && (
                <span className="text-[10px] text-primary/70 font-code animate-pulse">● ACTIVE</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-primary/20 hover:text-primary",
              isActive && "opacity-100"
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}>
            <Edit2 className="h-4 w-4 mr-2" />
            Переименовать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}>
            <Pin className="h-4 w-4 mr-2" />
            {session.metadata.isPinned ? "Открепить" : "Закрепить"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}>
            <Star className="h-4 w-4 mr-2" />
            {session.metadata.isFavorite ? "Убрать из избранного" : "В избранное"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}>
            <Copy className="h-4 w-4 mr-2" />
            Дублировать
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}>
            <Download className="h-4 w-4 mr-2" />
            Экспортировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}>
            <Archive className="h-4 w-4 mr-2" />
            {session.metadata.isArchived ? "Разархивировать" : "Архивировать"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
