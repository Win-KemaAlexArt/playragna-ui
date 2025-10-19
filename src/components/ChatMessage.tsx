import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-gradient-to-br from-primary to-accent" 
          : "bg-gradient-to-br from-muted to-card border border-border"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={cn(
        "max-w-[75%] px-4 py-3 space-y-2",
        isUser ? "message-user" : "message-assistant"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
        {timestamp && (
          <p className="text-xs text-muted-foreground opacity-70">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};
