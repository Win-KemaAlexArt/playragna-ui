import { MessageSquare, Wrench, FileText, Bookmark, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TabId = "chats" | "tools" | "documents" | "bookmarks" | "history";

interface SidebarTab {
  id: TabId;
  icon: React.ElementType;
  label: string;
}

const tabs: SidebarTab[] = [
  { id: "chats", icon: MessageSquare, label: "Чаты" },
  { id: "tools", icon: Wrench, label: "MCP Tools" },
  { id: "documents", icon: FileText, label: "Документы" },
  { id: "bookmarks", icon: Bookmark, label: "Закладки" },
  { id: "history", icon: Clock, label: "История" },
];

interface ChatSidebarProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

export const ChatSidebar = ({ 
  activeTab = "chats", 
  onTabChange 
}: ChatSidebarProps) => {
  const [active, setActive] = useState<TabId>(activeTab);

  const handleTabClick = (tabId: TabId) => {
    setActive(tabId);
    onTabChange?.(tabId);
  };

  return (
    <aside className="w-16 border-r border-border bg-gradient-to-b from-muted/80 to-card/80 backdrop-blur-sm flex flex-col items-center py-4 gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 relative group",
              isActive 
                ? "bg-gradient-to-br from-primary/30 to-accent/20 border-l-2 border-primary shadow-lg" 
                : "hover:bg-muted/60"
            )}
            aria-label={tab.label}
            title={tab.label}
          >
            <Icon 
              className={cn(
                "h-5 w-5 transition-all",
                isActive 
                  ? "text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" 
                  : "text-muted-foreground group-hover:text-foreground"
              )} 
            />
            {isActive && (
              <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse-glow" />
            )}
          </button>
        );
      })}
    </aside>
  );
};
