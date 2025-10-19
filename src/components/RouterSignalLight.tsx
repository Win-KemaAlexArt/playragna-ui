import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ConnectionStatus = "connecting" | "waiting" | "connected" | "disconnected";

interface RouterSignalLightProps {
  status?: ConnectionStatus;
  showTooltip?: boolean;
}

const statusLabels: Record<ConnectionStatus, string> = {
  connecting: "Устанавливается соединение...",
  waiting: "Ожидание ответа",
  connected: "Подключено",
  disconnected: "Отключено",
};

export const RouterSignalLight = ({ 
  status = "connecting", 
  showTooltip = true 
}: RouterSignalLightProps) => {
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    // Simulate latency measurement
    if (status === "connected") {
      setLatency(Math.floor(Math.random() * 50) + 20);
    }
  }, [status]);

  const lightElement = (
    <div 
      className={`router-light ${status}`}
      role="status"
      aria-label={statusLabels[status]}
    />
  );

  if (!showTooltip) return lightElement;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {lightElement}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-card border-border">
          <div className="text-xs space-y-1">
            <p className="font-medium">{statusLabels[status]}</p>
            {status === "connected" && (
              <p className="text-muted-foreground">Задержка: {latency}ms</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
