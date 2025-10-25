import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MCPStoreToolCard } from "./MCPStoreToolCard";
import { MCPToolDetailModal } from "./MCPToolDetailModal";
import { Search, Filter, TrendingUp, Star, Package, Globe, Database, Plug, Image, FileText, Brain, Workflow, Code, Mail } from "lucide-react";
import { toast } from "sonner";

interface StoreTool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: any;
  category: string;
  rating: number;
  downloads: number;
  isVerified: boolean;
  isTrending: boolean;
  isInstalled: boolean;
  price: number;
  version: string;
  author: string;
  authorUrl: string;
  features: string[];
  requirements: string[];
  permissions: string[];
}

const categories = [
  { id: "all", name: "All Tools", icon: Package },
  { id: "search", name: "Search", icon: Search },
  { id: "web", name: "Web", icon: Globe },
  { id: "database", name: "Database", icon: Database },
  { id: "api", name: "API", icon: Plug },
  { id: "ai", name: "AI/ML", icon: Brain },
  { id: "media", name: "Media", icon: Image },
  { id: "workflow", name: "Workflow", icon: Workflow },
];

const storeTools: StoreTool[] = [
  {
    id: "advanced-web-scraper",
    name: "Advanced Web Scraper Pro",
    description: "Мощный инструмент для извлечения данных из любых веб-сайтов с поддержкой JavaScript и антибота.",
    longDescription: "Professional-grade web scraping solution with advanced features including JavaScript rendering, CAPTCHA bypass, proxy rotation, and intelligent rate limiting. Perfect for large-scale data extraction projects.",
    icon: Globe,
    category: "Web",
    rating: 4.8,
    downloads: 15420,
    isVerified: true,
    isTrending: true,
    isInstalled: false,
    price: 0,
    version: "2.4.1",
    author: "WebTools Inc",
    authorUrl: "https://webtools.example.com",
    features: [
      "JavaScript rendering with headless browser support",
      "Automatic CAPTCHA detection and bypass",
      "Smart proxy rotation and IP management",
      "Custom CSS and XPath selectors",
      "Rate limiting and respectful crawling",
      "Export to JSON, CSV, XML formats"
    ],
    requirements: [
      "Node.js 16.x or higher",
      "2GB RAM minimum",
      "Stable internet connection"
    ],
    permissions: [
      "Network access for web requests",
      "File system access for cache",
      "Optional proxy configuration"
    ]
  },
  {
    id: "ai-content-analyzer",
    name: "AI Content Analyzer",
    description: "Анализ текста с помощью GPT-4, определение тональности, извлечение ключевых слов и суммирование.",
    longDescription: "State-of-the-art natural language processing tool powered by GPT-4. Perform sentiment analysis, keyword extraction, text summarization, and entity recognition with unprecedented accuracy.",
    icon: Brain,
    category: "AI/ML",
    rating: 4.9,
    downloads: 23100,
    isVerified: true,
    isTrending: true,
    isInstalled: false,
    price: 0,
    version: "1.8.0",
    author: "AI Labs",
    authorUrl: "https://ailabs.example.com",
    features: [
      "GPT-4 powered text analysis",
      "Multi-language sentiment detection",
      "Automatic keyword and entity extraction",
      "Intelligent text summarization",
      "Topic modeling and classification",
      "Custom model training support"
    ],
    requirements: [
      "OpenAI API key (optional)",
      "Python 3.9+ runtime",
      "1GB RAM minimum"
    ],
    permissions: [
      "API access for AI models",
      "File read access for documents",
      "Optional cloud API integration"
    ]
  },
  {
    id: "database-query-builder",
    name: "Universal Database Connector",
    description: "Подключение к любым базам данных: PostgreSQL, MySQL, MongoDB, Redis с визуальным конструктором запросов.",
    longDescription: "Connect to any database with ease. Supports SQL and NoSQL databases with a powerful visual query builder, real-time data preview, and automatic optimization suggestions.",
    icon: Database,
    category: "Database",
    rating: 4.7,
    downloads: 18900,
    isVerified: true,
    isTrending: false,
    isInstalled: true,
    price: 0,
    version: "3.2.5",
    author: "DataTools Co",
    authorUrl: "https://datatools.example.com",
    features: [
      "Support for 15+ database types",
      "Visual query builder interface",
      "Real-time query optimization",
      "Automatic schema discovery",
      "Secure connection management",
      "Export results in multiple formats"
    ],
    requirements: [
      "Database credentials",
      "Network access to database",
      "512MB RAM minimum"
    ],
    permissions: [
      "Network access for database connections",
      "Secure credential storage",
      "File access for exports"
    ]
  },
  {
    id: "image-processor-pro",
    name: "Image Processor Pro",
    description: "Обработка изображений: сжатие, изменение размера, конвертация, OCR и AI-анализ содержимого.",
    longDescription: "Complete image processing toolkit with advanced features including AI-powered image analysis, OCR, format conversion, compression, and batch processing capabilities.",
    icon: Image,
    category: "Media",
    rating: 4.6,
    downloads: 12400,
    isVerified: true,
    isTrending: false,
    isInstalled: false,
    price: 0,
    version: "2.1.3",
    author: "MediaTech",
    authorUrl: "https://mediatech.example.com",
    features: [
      "AI-powered object detection",
      "Multi-language OCR support",
      "Format conversion (50+ formats)",
      "Smart compression algorithms",
      "Batch processing support",
      "Metadata extraction and editing"
    ],
    requirements: [
      "Python 3.8+ with PIL",
      "2GB RAM recommended",
      "GPU optional for AI features"
    ],
    permissions: [
      "File system access for images",
      "Optional GPU access",
      "Network access for AI models"
    ]
  },
  {
    id: "api-integration-hub",
    name: "API Integration Hub",
    description: "Универсальный инструмент для работы с REST, GraphQL, gRPC API с автоматической генерацией документации.",
    longDescription: "Professional API integration platform supporting REST, GraphQL, and gRPC protocols. Features automatic documentation generation, request testing, and mock server capabilities.",
    icon: Plug,
    category: "API",
    rating: 4.8,
    downloads: 19700,
    isVerified: true,
    isTrending: true,
    isInstalled: false,
    price: 0,
    version: "4.0.2",
    author: "API Systems",
    authorUrl: "https://apisystems.example.com",
    features: [
      "REST, GraphQL, gRPC support",
      "Automatic API documentation",
      "Request/response testing",
      "Mock server generation",
      "OAuth 2.0 authentication",
      "Rate limiting and caching"
    ],
    requirements: [
      "Node.js 14.x or higher",
      "Valid API credentials",
      "1GB RAM minimum"
    ],
    permissions: [
      "Network access for API calls",
      "Secure credential storage",
      "Optional webhook endpoints"
    ]
  },
  {
    id: "workflow-automator",
    name: "Workflow Automator",
    description: "Автоматизация рабочих процессов с визуальным редактором, поддержкой условий и интеграцией с 100+ сервисами.",
    longDescription: "Build complex automation workflows with a drag-and-drop visual editor. Connect to 100+ services, create conditional logic, schedule tasks, and monitor execution in real-time.",
    icon: Workflow,
    category: "Workflow",
    rating: 4.9,
    downloads: 31200,
    isVerified: true,
    isTrending: true,
    isInstalled: false,
    price: 0,
    version: "5.1.0",
    author: "AutoFlow",
    authorUrl: "https://autoflow.example.com",
    features: [
      "Visual workflow designer",
      "100+ service integrations",
      "Conditional logic and branching",
      "Task scheduling and cron jobs",
      "Real-time execution monitoring",
      "Error handling and retry logic"
    ],
    requirements: [
      "Node.js 16.x or higher",
      "2GB RAM recommended",
      "Persistent storage for workflows"
    ],
    permissions: [
      "Network access for integrations",
      "File system for workflow storage",
      "Optional webhook endpoints"
    ]
  },
  {
    id: "code-analyzer",
    name: "Smart Code Analyzer",
    description: "Анализ кода на уязвимости, качество, производительность с AI-рекомендациями для улучшения.",
    longDescription: "Advanced static code analysis tool powered by AI. Detect security vulnerabilities, code smells, performance issues, and get intelligent suggestions for improvements.",
    icon: Code,
    category: "AI/ML",
    rating: 4.7,
    downloads: 14300,
    isVerified: true,
    isTrending: false,
    isInstalled: false,
    price: 0,
    version: "3.5.1",
    author: "CodeQuality Inc",
    authorUrl: "https://codequality.example.com",
    features: [
      "Multi-language support (20+ languages)",
      "Security vulnerability detection",
      "Code quality metrics",
      "Performance optimization hints",
      "AI-powered refactoring suggestions",
      "Integration with CI/CD pipelines"
    ],
    requirements: [
      "Python 3.9+ or Node.js 16.x",
      "Git repository access",
      "1GB RAM minimum"
    ],
    permissions: [
      "File system access for code",
      "Optional Git integration",
      "Network access for AI models"
    ]
  },
  {
    id: "email-automation",
    name: "Email Automation Suite",
    description: "Отправка email кампаний, автоответчики, аналитика открытий и кликов, A/B тестирование.",
    longDescription: "Complete email marketing automation platform. Create campaigns, set up autoresponders, track engagement metrics, and optimize with A/B testing.",
    icon: Mail,
    category: "Workflow",
    rating: 4.6,
    downloads: 9800,
    isVerified: false,
    isTrending: false,
    isInstalled: false,
    price: 0,
    version: "2.3.0",
    author: "MailPro",
    authorUrl: "https://mailpro.example.com",
    features: [
      "Drag-and-drop email builder",
      "Automated campaign scheduling",
      "Real-time analytics dashboard",
      "A/B testing capabilities",
      "List segmentation",
      "SMTP and API integration"
    ],
    requirements: [
      "Email service API key",
      "Node.js 14.x or higher",
      "512MB RAM minimum"
    ],
    permissions: [
      "Network access for email sending",
      "Secure credential storage",
      "File access for templates"
    ]
  }
];

interface MCPStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MCPStoreModal = ({ isOpen, onClose }: MCPStoreModalProps) => {
  const [isNarrow, setIsNarrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");
  const [tools, setTools] = useState<StoreTool[]>(storeTools);
  const [selectedTool, setSelectedTool] = useState<StoreTool | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsNarrow(window.innerWidth < 640);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const filteredTools = tools
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || tool.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // newest would require date field
    });

  const handleInstall = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, isInstalled: true } : tool
    ));
    toast.success("Инструмент успешно установлен", {
      description: "Теперь он доступен в разделе MCP Tools"
    });
  };

  const handleViewDetails = (tool: StoreTool) => {
    setSelectedTool(tool);
    setIsDetailOpen(true);
  };

  const content = (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск инструментов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-primary/20 focus:border-primary/40"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 font-rajdhani ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "border-primary/30 hover:bg-primary/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {cat.name}
              </Button>
            );
          })}
        </div>

        {/* Sort and Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {filteredTools.length} {filteredTools.length === 1 ? 'инструмент' : 'инструментов'}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("popular")}
              className={sortBy === "popular" ? "text-primary" : "text-muted-foreground"}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Popular
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("rating")}
              className={sortBy === "rating" ? "text-primary" : "text-muted-foreground"}
            >
              <Star className="w-3.5 h-3.5 mr-1" />
              Rating
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <ScrollArea className={isNarrow ? "h-[50vh]" : "h-[60vh]"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          {filteredTools.map((tool) => (
            <MCPStoreToolCard
              key={tool.id}
              {...tool}
              onInstall={() => handleInstall(tool.id)}
              onViewDetails={() => handleViewDetails(tool)}
            />
          ))}
        </div>
        {filteredTools.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Package className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Инструменты не найдены</p>
            <p className="text-sm text-muted-foreground/70">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <>
      {isNarrow ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[90vh] bg-background border-t border-primary/20">
            <SheetHeader>
              <SheetTitle className="font-rajdhani text-xl metal-glow">MCP Store</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {content}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl bg-background border-primary/20">
            <DialogHeader>
              <DialogTitle className="font-rajdhani text-2xl metal-glow">MCP Store</DialogTitle>
              <DialogDescription className="sr-only">Browse and install MCP tools from the store</DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )}

      {selectedTool && (
        <MCPToolDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          tool={selectedTool}
          onInstall={() => handleInstall(selectedTool.id)}
        />
      )}
    </>
  );
};
