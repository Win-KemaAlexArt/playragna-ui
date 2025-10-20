import { RouterSignalLight } from "./RouterSignalLight";
import { AnimatedLogo } from "./AnimatedLogo";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Settings, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  onNewChat?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export const ChatHeader = ({ onNewChat, onSettings, onHelp }: ChatHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <AnimatedLogo size={40} />
        <h1 className="text-xl font-rajdhani font-bold metal-glow">
          PlayRAGNA
        </h1>
        <RouterSignalLight status="connected" />
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onNewChat}
          className="hover-glow"
        >
          <Plus className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover-glow">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm">
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Настройки
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onHelp}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Помощь и документация
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
