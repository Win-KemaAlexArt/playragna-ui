import { Card } from "@/components/ui/card";
import { Activity, AlertCircle, Clock, Database } from "lucide-react";

interface DiagnosticStatsProps {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  uptime: number;
  formatDuration: (ms: number) => string;
}

export const DiagnosticStats = ({
  totalLogs,
  errorCount,
  warningCount,
  uptime,
  formatDuration,
}: DiagnosticStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <Card className="p-3 bg-card/70 border-primary/30 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Total Logs</p>
        </div>
        <p className="text-xl sm:text-2xl font-rajdhani font-bold text-primary">
          {totalLogs}
        </p>
      </Card>
      
      <Card className="p-3 bg-card/70 border-primary/30 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Uptime</p>
        </div>
        <p className="text-xl sm:text-2xl font-rajdhani font-bold text-primary">
          {formatDuration(uptime)}
        </p>
      </Card>
      
      <Card className="p-3 bg-card/70 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/10">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <p className="text-xs text-muted-foreground">Warnings</p>
        </div>
        <p className="text-xl sm:text-2xl font-rajdhani font-bold text-yellow-600 dark:text-yellow-400">
          {warningCount}
        </p>
      </Card>
      
      <Card className="p-3 bg-card/70 border-destructive/30 hover:border-destructive/50 transition-all duration-200 hover:shadow-lg hover:shadow-destructive/10">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-destructive" />
          <p className="text-xs text-muted-foreground">Errors</p>
        </div>
        <p className="text-xl sm:text-2xl font-rajdhani font-bold text-destructive">
          {errorCount}
        </p>
      </Card>
    </div>
  );
};
