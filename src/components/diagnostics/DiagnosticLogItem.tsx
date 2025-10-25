import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, Bug, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DiagnosticLog {
  timestamp: number;
  component: string;
  action: string;
  state: any;
  level?: "error" | "warn" | "info" | "debug";
  message?: string;
  stack?: string;
  dom?: any;
}

interface DiagnosticLogItemProps {
  log: DiagnosticLog;
  formatTime: (timestamp: number) => string;
}

export const DiagnosticLogItem = ({ log, formatTime }: DiagnosticLogItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const level = log.level || "info";
  const hasState = Object.keys(log.state || {}).length > 0;
  const hasStack = log.stack && log.stack.length > 0;
  const hasDetails = hasState || hasStack;

  const levelConfig = {
    error: {
      icon: AlertCircle,
      bg: "bg-destructive/10 border-destructive/30 hover:border-destructive/50",
      text: "text-destructive",
      badge: "bg-destructive/20 border-destructive/40 text-destructive",
    },
    warn: {
      icon: AlertTriangle,
      bg: "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50",
      text: "text-yellow-600 dark:text-yellow-400",
      badge: "bg-yellow-500/20 border-yellow-500/40 text-yellow-600 dark:text-yellow-400",
    },
    info: {
      icon: Info,
      bg: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50",
      text: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-500/20 border-blue-500/40 text-blue-600 dark:text-blue-400",
    },
    debug: {
      icon: Bug,
      bg: "bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50",
      text: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-500/20 border-purple-500/40 text-purple-600 dark:text-purple-400",
    },
  };

  const config = levelConfig[level] || levelConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "bg-card/70 border rounded-lg p-3 transition-all duration-200",
        config.bg,
        hasDetails && "cursor-pointer",
        isExpanded && "shadow-lg"
      )}
      onClick={() => hasDetails && setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.text)} />
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={cn("text-[10px]", config.badge)}>
              {log.component}
            </Badge>
            <Badge variant="outline" className="text-[10px] bg-background/50">
              {level.toUpperCase()}
            </Badge>
          </div>
          
          <p className={cn("font-semibold text-sm", config.text)}>
            {log.action}
          </p>
          
          {log.message && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {log.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-muted-foreground text-[10px] font-mono">
            {formatTime(log.timestamp)}
          </span>
          {hasDetails && (
            <ChevronRight 
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-90"
              )} 
            />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && hasDetails && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          {hasState && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">State:</p>
              <pre className="text-[10px] text-muted-foreground bg-background/70 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto font-mono">
                {JSON.stringify(log.state, null, 2)}
              </pre>
            </div>
          )}
          
          {hasStack && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Stack Trace:</p>
              <pre className="text-[10px] text-muted-foreground bg-background/70 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto font-mono">
                {log.stack}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
