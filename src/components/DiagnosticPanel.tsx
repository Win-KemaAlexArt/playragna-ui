import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { DiagnosticHeader } from "@/components/diagnostics/DiagnosticHeader";
import { DiagnosticControls } from "@/components/diagnostics/DiagnosticControls";
import { DiagnosticFilters } from "@/components/diagnostics/DiagnosticFilters";
import { DiagnosticStats } from "@/components/diagnostics/DiagnosticStats";
import { DiagnosticLogItem } from "@/components/diagnostics/DiagnosticLogItem";

interface DiagnosticLog {
  timestamp: number;
  component: string;
  action: string;
  state: any;
  dom?: any;
  level?: "error" | "warn" | "info" | "debug";
  message?: string;
  stack?: string;
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
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

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

  // Enhanced filtering logic
  const filteredLogs = logs.filter(log => {
    if (selectedComponent && log.component !== selectedComponent) return false;
    if (selectedLevel && (log.level || "info") !== selectedLevel) return false;
    return true;
  });

  const componentCounts = statistics?.componentCounts || {};
  
  // Calculate level counts from actual logs
  const levelCounts = logs.reduce((acc, log) => {
    const level = log.level || "info";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const warningCount = logs.filter(log => log.level === "warn").length;

  // ✅ API availability check removed - using postMessage bridge now
  // Parent window always handles API calls via message passing

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Section */}
      <div className="p-3 sm:p-4 border-b border-border/50 bg-gradient-to-b from-card/80 to-card/50 backdrop-blur-sm">
        <div className="space-y-3">
          <DiagnosticHeader
            totalLogs={statistics?.totalLogs || 0}
            errorCount={statistics?.errorCount || 0}
            warningCount={warningCount}
          />

          <DiagnosticControls
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onClear={handleClear}
            onRefresh={loadData}
            formatDuration={formatDuration}
          />

          <DiagnosticFilters
            selectedComponent={selectedComponent}
            selectedLevel={selectedLevel}
            componentCounts={componentCounts}
            levelCounts={levelCounts}
            totalLogs={logs.length}
            onComponentSelect={setSelectedComponent}
            onLevelSelect={setSelectedLevel}
          />
        </div>
      </div>

      {/* Statistics Section */}
      {statistics && (
        <div className="p-3 sm:p-4 border-b border-border/50 bg-card/30">
          <DiagnosticStats
            totalLogs={statistics.totalLogs}
            errorCount={statistics.errorCount}
            warningCount={warningCount}
            uptime={statistics.uptime}
            formatDuration={formatDuration}
          />
        </div>
      )}

      {/* Logs List Section */}
      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-muted-foreground">
              <Activity className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm sm:text-base">No diagnostic logs found</p>
              {isRecording && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <p className="text-xs text-destructive font-medium">
                    Recording in progress...
                  </p>
                </div>
              )}
              {(selectedComponent || selectedLevel) && (
                <p className="text-xs mt-2 opacity-70">
                  Try adjusting your filters
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs text-muted-foreground">
                  Showing {filteredLogs.length} of {logs.length} logs
                </p>
              </div>
              {filteredLogs
                .slice()
                .reverse()
                .map((log, index) => (
                  <DiagnosticLogItem
                    key={`${log.timestamp}-${index}`}
                    log={log}
                    formatTime={formatTime}
                  />
                ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
