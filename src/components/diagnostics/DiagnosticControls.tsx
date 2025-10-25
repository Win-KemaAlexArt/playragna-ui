import { Play, Square, Copy, Trash2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DiagnosticControlsProps {
  isRecording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  onRefresh?: () => void;
  formatDuration: (ms: number) => string;
}

export const DiagnosticControls = ({
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  onCopy,
  onDownload,
  onClear,
  onRefresh,
  formatDuration,
}: DiagnosticControlsProps) => {
  return (
    <div className="space-y-2">
      {/* Primary Recording Control */}
      {!isRecording ? (
        <Button
          size="sm"
          onClick={onStartRecording}
          className={cn(
            "w-full bg-destructive/20 border border-destructive/30",
            "hover:bg-destructive/40 text-destructive hover:text-foreground",
            "font-rajdhani font-semibold transition-all duration-300",
            "shadow-lg hover:shadow-destructive/20"
          )}
          variant="outline"
        >
          <Play className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Start Recording</span>
          <span className="sm:hidden">Record</span>
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onStopRecording}
          className={cn(
            "w-full bg-destructive border border-destructive",
            "hover:bg-destructive/80 text-white font-rajdhani font-semibold",
            "animate-pulse shadow-lg shadow-destructive/30"
          )}
        >
          <Square className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Stop Recording</span>
          <span className="sm:hidden">Stop</span>
          <span className="ml-2 text-xs opacity-90">
            ({formatDuration(recordingDuration)})
          </span>
        </Button>
      )}
      
      {/* Secondary Action Buttons - Responsive Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onCopy}
          className={cn(
            "bg-background/70 border-primary/30 hover:bg-primary/10",
            "hover:border-primary/50 transition-all duration-200",
            "flex flex-col sm:flex-row items-center justify-center gap-1 h-auto py-2"
          )}
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
          <span className="text-[10px] sm:hidden">Copy</span>
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onDownload}
          className={cn(
            "bg-background/70 border-primary/30 hover:bg-primary/10",
            "hover:border-primary/50 transition-all duration-200",
            "flex flex-col sm:flex-row items-center justify-center gap-1 h-auto py-2"
          )}
          title="Download logs"
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px] sm:hidden">Down</span>
        </Button>
        
        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className={cn(
              "bg-background/70 border-primary/30 hover:bg-primary/10",
              "hover:border-primary/50 transition-all duration-200",
              "flex flex-col sm:flex-row items-center justify-center gap-1 h-auto py-2"
            )}
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[10px] sm:hidden">Sync</span>
          </Button>
        )}
        
        <Button
          size="sm"
          variant="outline"
          onClick={onClear}
          className={cn(
            "bg-background/70 border-muted-foreground/30",
            "hover:bg-destructive/10 hover:border-destructive/40",
            "hover:text-destructive transition-all duration-200",
            "flex flex-col sm:flex-row items-center justify-center gap-1 h-auto py-2"
          )}
          title="Clear all logs"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-[10px] sm:hidden">Clear</span>
        </Button>
      </div>
    </div>
  );
};
