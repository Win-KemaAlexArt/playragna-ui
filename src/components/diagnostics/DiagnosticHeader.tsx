import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiagnosticHeaderProps {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
}

export const DiagnosticHeader = ({ totalLogs, errorCount, warningCount }: DiagnosticHeaderProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h2 className="font-rajdhani font-semibold text-lg sm:text-xl text-foreground metal-glow">
          Diagnostics
        </h2>
      </div>
      
      <div className="flex items-center gap-2 ml-auto flex-wrap">
        <Badge 
          variant="secondary" 
          className="text-xs bg-secondary/20 border-secondary/30"
        >
          {totalLogs} logs
        </Badge>
        
        {warningCount > 0 && (
          <Badge 
            variant="outline" 
            className="text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
          >
            {warningCount} warnings
          </Badge>
        )}
        
        {errorCount > 0 && (
          <Badge 
            variant="destructive" 
            className="text-xs bg-destructive/20 border-destructive/40"
          >
            {errorCount} errors
          </Badge>
        )}
      </div>
    </div>
  );
};
