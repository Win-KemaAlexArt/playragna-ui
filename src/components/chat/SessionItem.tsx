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
        "group relative flex items-center gap-2 p-3 rounded-lg transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-gradient-to-r from-primary/20 to-accent/10 border-l-2 border-primary shadow-lg"
          : "hover:bg-muted/60 border-l-2 border-transparent"
      )}
      onClick={() => !isEditing && onClick()}
    >
      {/* Icon */}
      <div className={cn(
        "flex-shrink-0",
        isActive && "text-primary"
      )}>
        <MessageSquare className="h-4 w-4" />
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
                "text-sm font-medium truncate",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {session.title}
              </h4>
              {session.metadata.isPinned && (
                <Pin className="h-3 w-3 text-primary flex-shrink-0" />
              )}
              {session.metadata.isFavorite && (
                <Star className="h-3 w-3 text-yellow-500 flex-shrink-0 fill-yellow-500" />
              )}
              {session.metadata.isArchived && (
                <Archive className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            {session.preview && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {session.preview}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              {session.metadata.messageCount} сообщений
            </p>
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
              "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
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
