import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DiagnosticFiltersProps {
  selectedComponent: string | null;
  selectedLevel: string | null;
  componentCounts: Record<string, number>;
  levelCounts: Record<string, number>;
  totalLogs: number;
  onComponentSelect: (component: string | null) => void;
  onLevelSelect: (level: string | null) => void;
}

export const DiagnosticFilters = ({
  selectedComponent,
  selectedLevel,
  componentCounts,
  levelCounts,
  totalLogs,
  onComponentSelect,
  onLevelSelect,
}: DiagnosticFiltersProps) => {
  const componentOptions = Object.keys(componentCounts).sort();
  const levelOptions = Object.keys(levelCounts).sort();
  
  const hasActiveFilters = selectedComponent !== null || selectedLevel !== null;

  return (
    <div className="space-y-3">
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {selectedComponent && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-primary/20 border-primary/30 cursor-pointer hover:bg-primary/30"
              onClick={() => onComponentSelect(null)}
            >
              {selectedComponent}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {selectedLevel && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-primary/20 border-primary/30 cursor-pointer hover:bg-primary/30"
              onClick={() => onLevelSelect(null)}
            >
              {selectedLevel}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onComponentSelect(null);
              onLevelSelect(null);
            }}
            className="h-6 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Level Filters */}
      {levelOptions.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Log Level</label>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedLevel === null ? "default" : "outline"}
              onClick={() => onLevelSelect(null)}
              className={cn(
                "text-xs h-7",
                selectedLevel === null
                  ? "bg-primary/30 border-primary text-primary shadow-md"
                  : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
              )}
            >
              All ({totalLogs})
            </Button>
            {levelOptions.map((level) => {
              const count = levelCounts[level] || 0;
              const levelColors = {
                error: "bg-destructive/20 border-destructive/40 text-destructive hover:bg-destructive/30",
                warn: "bg-yellow-500/20 border-yellow-500/40 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30",
                info: "bg-blue-500/20 border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30",
                debug: "bg-purple-500/20 border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/30",
              };
              
              return (
                <Button
                  key={level}
                  size="sm"
                  variant="outline"
                  onClick={() => onLevelSelect(level)}
                  className={cn(
                    "text-xs h-7",
                    selectedLevel === level 
                      ? levelColors[level as keyof typeof levelColors] || "bg-primary/30 border-primary text-primary"
                      : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
                  )}
                >
                  {level} ({count})
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Component Filters */}
      {componentOptions.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Component</label>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              <Button
                size="sm"
                variant={selectedComponent === null ? "default" : "outline"}
                onClick={() => onComponentSelect(null)}
                className={cn(
                  "text-xs whitespace-nowrap h-7",
                  selectedComponent === null
                    ? "bg-primary/30 border-primary text-primary shadow-md"
                    : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
                )}
              >
                All ({totalLogs})
              </Button>
              {componentOptions.map((component) => (
                <Button
                  key={component}
                  size="sm"
                  variant={selectedComponent === component ? "default" : "outline"}
                  onClick={() => onComponentSelect(component)}
                  className={cn(
                    "text-xs whitespace-nowrap h-7",
                    selectedComponent === component
                      ? "bg-primary/30 border-primary text-primary shadow-md"
                      : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
                  )}
                >
                  {component} ({componentCounts[component] || 0})
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
