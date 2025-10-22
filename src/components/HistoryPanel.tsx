import { useState } from "react";
import { Clock, Search, Calendar, MessageSquare, Trash2, Download, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  type: "chat" | "tool" | "document" | "bookmark";
  title: string;
  preview: string;
  timestamp: string;
  date: string;
  tokens?: number;
  status: "completed" | "error" | "pending";
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "chat",
    title: "AI Model Discussion",
    preview: "Discussed implementation of GPT-4 model for content generation and various optimization strategies...",
    timestamp: "14:35",
    date: "2025-10-22",
    tokens: 2450,
    status: "completed"
  },
  {
    id: "2",
    type: "tool",
    title: "Web Scraper Execution",
    preview: "Scraped product data from e-commerce website, extracted 150 items with prices and descriptions",
    timestamp: "12:20",
    date: "2025-10-22",
    status: "completed"
  },
  {
    id: "3",
    type: "document",
    title: "API Documentation Upload",
    preview: "Uploaded and processed API documentation (2.4 MB PDF), indexed 45 endpoints",
    timestamp: "10:15",
    date: "2025-10-21",
    status: "completed"
  },
  {
    id: "4",
    type: "chat",
    title: "Database Schema Design",
    preview: "Created PostgreSQL schema with 12 tables, discussed normalization and indexing strategies",
    timestamp: "16:45",
    date: "2025-10-20",
    tokens: 1820,
    status: "completed"
  },
  {
    id: "5",
    type: "tool",
    title: "Database Query Failed",
    preview: "Connection timeout error when querying production database",
    timestamp: "15:30",
    date: "2025-10-20",
    status: "error"
  },
  {
    id: "6",
    type: "bookmark",
    title: "Added MCP Documentation",
    preview: "Bookmarked MCP Protocol documentation v2 with tags: protocol, API, integration",
    timestamp: "14:10",
    date: "2025-10-19",
    status: "completed"
  }
];

const typeIcons = {
  chat: MessageSquare,
  tool: Clock,
  document: Filter,
  bookmark: Clock
};

const typeColors = {
  chat: "bg-[hsl(207,100%,50%,0.15)] border-[hsl(207,100%,50%)] text-[hsl(207,100%,50%)]",
  tool: "bg-[hsl(158,100%,50%,0.15)] border-[hsl(158,100%,50%)] text-[hsl(158,100%,50%)]",
  document: "bg-[hsl(30,100%,50%,0.15)] border-[hsl(30,100%,50%)] text-[hsl(30,100%,50%)]",
  bookmark: "bg-[hsl(195,100%,45%,0.15)] border-[hsl(195,100%,45%)] text-[hsl(195,100%,45%)]"
};

const statusColors = {
  completed: "bg-[hsl(158,100%,50%,0.15)] border-[hsl(158,100%,50%)] text-[hsl(158,100%,50%)]",
  error: "bg-[hsl(348,100%,60%,0.15)] border-[hsl(348,100%,60%)] text-[hsl(348,100%,60%)]",
  pending: "bg-[hsl(30,100%,50%,0.15)] border-[hsl(30,100%,50%)] text-[hsl(30,100%,50%)]"
};

export const HistoryPanel = () => {
  const [history] = useState<HistoryItem[]>(mockHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleClear = () => {
    toast.warning("Clear History", {
      description: "This will delete all history records"
    });
  };

  const handleExport = () => {
    toast.success("Export History", {
      description: "History exported as JSON"
    });
  };

  const handleDelete = (item: HistoryItem) => {
    toast.warning(`Delete: ${item.title}`, {
      description: "Item will be removed from history"
    });
  };

  const handleView = (item: HistoryItem) => {
    toast.info(`Viewing: ${item.title}`);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
    }
  };

  const typeFilter = ["chat", "tool", "document", "bookmark"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-primary" />
          <h2 className="font-rajdhani font-semibold text-xl text-foreground metal-glow">
            History
          </h2>
          <Badge variant="secondary" className="ml-auto">
            {history.length} records
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/70 border-muted-foreground/30 focus:border-primary"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => setSelectedType(null)}
            className={cn(
              "text-xs whitespace-nowrap",
              selectedType === null
                ? "bg-primary/30 border-primary text-primary"
                : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
            )}
          >
            All
          </Button>
          {typeFilter.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={cn(
                "text-xs whitespace-nowrap capitalize",
                selectedType === type
                  ? "bg-primary/30 border-primary text-primary"
                  : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
              )}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No history found</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="mb-6">
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-rajdhani font-semibold text-sm text-foreground">
                    {formatDate(date)}
                  </h3>
                  <div className="flex-1 h-px bg-border ml-2" />
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => {
                    const Icon = typeIcons[item.type];
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "bg-card/70 border border-primary/30 rounded-lg p-3",
                          "transition-all duration-300 hover:translate-y-[-2px]",
                          "hover:shadow-[0_0_15px_rgba(0,154,228,0.3)] hover:border-primary cursor-pointer"
                        )}
                        onClick={() => handleView(item)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-background/90 border border-primary/40">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-rajdhani font-semibold text-sm text-foreground truncate">
                                {item.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={cn("text-[9px] px-1.5 py-0", typeColors[item.type])}
                              >
                                {item.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                              {item.preview}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                              <span>{item.timestamp}</span>
                              {item.tokens && (
                                <>
                                  <span>•</span>
                                  <span>{item.tokens} tokens</span>
                                </>
                              )}
                              <Badge
                                variant="outline"
                                className={cn("text-[9px] px-1.5 py-0 ml-auto", statusColors[item.status])}
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item);
                              }}
                              className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex-1 bg-background/70 border-muted-foreground/30 hover:bg-muted text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1 bg-destructive/10 border-destructive/30 hover:bg-destructive/20 text-destructive text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};