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
      "bg-card/70 border border-primary/30 rounded-lg p-4",
      "flex flex-col transition-all duration-300 hover:translate-y-[-2px]",
      "hover:shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:border-primary"
    )}>
      {/* Header - Full width row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-background/90 border border-primary/40">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="font-rajdhani font-semibold text-base text-foreground flex-1 min-w-0">
          {name}
        </div>
      </div>

      {/* Description - More space on mobile */}
      <div className="text-xs text-muted-foreground mb-4 flex-grow line-clamp-3 leading-relaxed">
        {description}
      </div>

      {/* Footer - Full width with proper spacing */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-primary/10">
        <div className={cn(
          "flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-full",
          isActive 
            ? "bg-[hsl(158,100%,50%,0.15)] border border-[hsl(158,100%,50%)] text-[hsl(158,100%,50%)]"
            : "bg-muted-foreground/15 border border-muted-foreground text-muted-foreground"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            isActive 
              ? "bg-[hsl(158,100%,50%)] shadow-[0_0_5px_rgba(0,255,136,0.5)]" 
              : "bg-muted-foreground"
          )} />
          {isActive ? "Active" : "Inactive"}
        </div>

        <button
          onClick={onConfigure}
          className={cn(
            "bg-primary/20 border border-primary/30 rounded-md px-3 py-1.5",
            "text-primary text-xs font-rajdhani font-semibold",
            "flex items-center gap-1.5 transition-all duration-300",
            "hover:bg-primary/40 hover:text-foreground"
          )}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configure
        </button>
      </div>
    </div>
  );
};
