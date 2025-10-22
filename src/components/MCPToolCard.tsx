import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MCPToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  onConfigure: () => void;
}

export const MCPToolCard = ({ 
  name, 
  description, 
  icon: Icon, 
  isActive, 
  onConfigure 
}: MCPToolCardProps) => {
  return (
    <div className={cn(
      "bg-card/70 border border-primary/30 rounded-lg p-3 sm:p-4",
      "min-h-[120px] sm:min-h-[140px]",
      "flex flex-col transition-all duration-300 hover:translate-y-[-2px]",
      "hover:shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:border-primary"
    )}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-background/90 border border-primary/40">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="font-rajdhani font-semibold text-sm sm:text-base text-foreground truncate">
            {name}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-xs text-muted-foreground mb-2 sm:mb-3 flex-grow line-clamp-2">
        {description}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center gap-2">
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap",
          isActive 
            ? "bg-[hsl(158,100%,50%,0.15)] border border-[hsl(158,100%,50%)] text-[hsl(158,100%,50%)]"
            : "bg-muted-foreground/15 border border-muted-foreground text-muted-foreground"
        )}>
          <div className={cn(
            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0",
            isActive 
              ? "bg-[hsl(158,100%,50%)] shadow-[0_0_5px_rgba(0,255,136,0.5)]" 
              : "bg-muted-foreground"
          )} />
          <span className="hidden min-[350px]:inline">{isActive ? "Active" : "Inactive"}</span>
        </div>

        <button
          onClick={onConfigure}
          className={cn(
            "bg-primary/20 border border-primary/30 rounded px-2 py-1",
            "text-primary text-[10px] sm:text-xs font-rajdhani font-semibold",
            "flex items-center gap-1 transition-all duration-300 whitespace-nowrap",
            "hover:bg-primary/40 hover:text-foreground flex-shrink-0"
          )}
        >
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden min-[380px]:inline">Config</span>
        </button>
      </div>
    </div>
  );
};
