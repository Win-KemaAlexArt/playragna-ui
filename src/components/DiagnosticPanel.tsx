import { useState, useEffect } from "react";
import { Activity, Play, Square, Copy, Trash2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DiagnosticLog {
  timestamp: number;
  component: string;
  action: string;
  state: any;
  dom?: any;
}

interface DiagnosticStatistics {
  totalLogs: number;
  totalSnapshots: number;
  errorCount: number;
  componentCounts: Record<string, number>;
  firstLogTimestamp: number | null;
  lastLogTimestamp: number | null;
  uptime: number;
}

interface DiagnosticSettings {
  diagnosticMode: boolean;
  autoExport: boolean;
  maxLogs: number;
  persistToStorage: boolean;
  isRecording: boolean;
  recordingStartedAt: number | null;
}

declare global {
  interface Window {
    playragnaDiagnostics?: {
      getLogs: () => Promise<DiagnosticLog[]>;
      getStatistics: () => Promise<DiagnosticStatistics>;
      getSettings: () => Promise<DiagnosticSettings>;
      startRecording: () => Promise<void>;
      stopRecording: () => Promise<{ logs: DiagnosticLog[]; duration: number }>;
      copyToClipboard: () => Promise<boolean>;
      clear: () => Promise<void>;
      export: () => Promise<string>;
    };
  }
}

export const DiagnosticPanel = () => {
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [statistics, setStatistics] = useState<DiagnosticStatistics | null>(null);
  const [settings, setSettings] = useState<DiagnosticSettings | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Auto-refresh every 2 seconds
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Update recording duration
  useEffect(() => {
    if (!settings?.isRecording) return;
    
    const interval = setInterval(() => {
      if (settings.recordingStartedAt) {
        setRecordingDuration(Date.now() - settings.recordingStartedAt);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [settings?.isRecording, settings?.recordingStartedAt]);

  // ✅ Helper to call parent window API via postMessage
  const callDiagnosticAPI = async (method: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7)
      
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'diagnostic-api-response' && event.data.id === id) {
          window.removeEventListener('message', handler)
          
          if (event.data.error) {
            reject(new Error(event.data.error))
          } else {
            resolve(event.data.result)
          }
        }
      }
      
      window.addEventListener('message', handler)
      
      // Send request to parent window
      window.parent.postMessage({
        type: 'diagnostic-api-call',
        method,
        id
      }, '*')
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('message', handler)
        reject(new Error(`API call timeout: ${method}`))
      }, 5000)
    })
  }

  const loadData = async () => {
    try {
      const [logsData, statsData, settingsData] = await Promise.all([
        callDiagnosticAPI('getLogs'),
        callDiagnosticAPI('getStatistics'),
        callDiagnosticAPI('getSettings')
      ]);
      
      setLogs(logsData);
      setStatistics(statsData);
      setSettings(settingsData);
      setIsRecording(settingsData.isRecording);
    } catch (error) {
      console.error('[DiagnosticPanel] Load failed:', error);
    }
  };

  const handleStartRecording = async () => {
    try {
      await callDiagnosticAPI('startRecording');
      setIsRecording(true);
      toast.success("🔴 Recording started", {
        description: "All diagnostic logs are being captured"
      });
      await loadData();
    } catch (error) {
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await callDiagnosticAPI('stopRecording');
      setIsRecording(false);
      setRecordingDuration(0);
      
      toast.success(`⏹️ Recording stopped`, {
        description: `Captured ${result.logs.length} logs in ${(result.duration / 1000).toFixed(1)}s`
      });
      
      await loadData();
    } catch (error) {
      toast.error("Failed to stop recording");
    }
  };

  const handleCopy = async () => {
    try {
      const exported = await callDiagnosticAPI('export');
      await navigator.clipboard.writeText(exported);
      
      toast.success("📋 Copied to clipboard", {
        description: `${logs.length} logs exported as JSON`
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = async () => {
    try {
      const exported = await callDiagnosticAPI('export');
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playragna-diagnostic-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("💾 Downloaded", {
        description: "Diagnostic logs saved as JSON file"
      });
    } catch (error) {
      toast.error("Failed to download logs");
    }
  };

  const handleClear = async () => {
    try {
      await callDiagnosticAPI('clear');
      await loadData();
      
      toast.success("🗑️ Logs cleared");
    } catch (error) {
      toast.error("Failed to clear logs");
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const filteredLogs = selectedComponent 
    ? logs.filter(log => log.component === selectedComponent)
    : logs;

  const componentOptions = statistics 
    ? Object.keys(statistics.componentCounts).sort()
    : [];

  // ✅ API availability check removed - using postMessage bridge now
  // Parent window always handles API calls via message passing

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="font-rajdhani font-semibold text-xl text-foreground metal-glow">
            Diagnostics
          </h2>
          <div className="ml-auto flex items-center gap-2">
            {statistics && (
              <>
                <Badge variant="secondary">
                  {statistics.totalLogs} logs
                </Badge>
                {statistics.errorCount > 0 && (
                  <Badge variant="destructive">
                    {statistics.errorCount} errors
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="space-y-2 mb-3">
          {/* Primary action (full width) */}
          {!isRecording ? (
            <Button
              size="sm"
              onClick={handleStartRecording}
              className="w-full bg-destructive/20 border border-destructive/30 hover:bg-destructive/40 text-destructive hover:text-foreground font-rajdhani font-semibold"
              variant="outline"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleStopRecording}
              className="w-full bg-destructive border border-destructive hover:bg-destructive/80 text-white font-rajdhani font-semibold animate-pulse"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop ({formatDuration(recordingDuration)})
            </Button>
          )}
          
          {/* Secondary actions (row) */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="flex-1 bg-background/70 border-muted-foreground/30 hover:bg-muted"
            >
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="flex-1 bg-background/70 border-muted-foreground/30 hover:bg-muted"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="flex-1 bg-background/70 border-muted-foreground/30 hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Component Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            size="sm"
            variant={selectedComponent === null ? "default" : "outline"}
            onClick={() => setSelectedComponent(null)}
            className={cn(
              "text-xs whitespace-nowrap",
              selectedComponent === null
                ? "bg-primary/30 border-primary text-primary"
                : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
            )}
          >
            All ({logs.length})
          </Button>
          {componentOptions.map((component) => (
            <Button
              key={component}
              size="sm"
              variant={selectedComponent === component ? "default" : "outline"}
              onClick={() => setSelectedComponent(component)}
              className={cn(
                "text-xs whitespace-nowrap",
                selectedComponent === component
                  ? "bg-primary/30 border-primary text-primary"
                  : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
              )}
            >
              {component} ({statistics?.componentCounts[component] || 0})
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="p-4 flex flex-col gap-2 border-b border-border bg-card/30">
          <Card className="p-3 bg-card/70 border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Total Logs</p>
            <p className="text-2xl font-rajdhani font-bold text-primary">
              {statistics.totalLogs}
            </p>
          </Card>
          <Card className="p-3 bg-card/70 border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Uptime</p>
            <p className="text-2xl font-rajdhani font-bold text-primary">
              {formatDuration(statistics.uptime)}
            </p>
          </Card>
          <Card className="p-3 bg-card/70 border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Errors</p>
            <p className="text-2xl font-rajdhani font-bold text-destructive">
              {statistics.errorCount}
            </p>
          </Card>
        </div>
      )}

      {/* Logs List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No diagnostic logs</p>
              {isRecording && (
                <p className="text-xs mt-2 text-destructive animate-pulse">
                  🔴 Recording in progress...
                </p>
              )}
            </div>
          ) : (
            filteredLogs.slice().reverse().map((log, index) => (
              <div
                key={index}
                className={cn(
                  "bg-card/70 border border-primary/20 rounded-lg p-3",
                  "transition-all duration-200 hover:border-primary/40",
                  "font-mono text-xs"
                )}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {log.component}
                  </Badge>
                  <span className="text-primary font-semibold">
                    {log.action}
                  </span>
                  <span className="ml-auto text-muted-foreground text-[10px]">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                {Object.keys(log.state).length > 0 && (
                  <pre className="text-[10px] text-muted-foreground bg-background/50 p-2 rounded overflow-x-auto max-w-full">
                    {JSON.stringify(log.state, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
