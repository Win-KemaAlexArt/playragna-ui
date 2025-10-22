import { useState } from "react";
import { MCPToolCard } from "./MCPToolCard";
import { MCPConfigModal } from "./MCPConfigModal";
import { Button } from "@/components/ui/button";
import { Search, Globe, Database, Plug, Image, FileText, Plus, Store } from "lucide-react";
import { toast } from "sonner";

interface MCPTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  isActive: boolean;
}

const defaultTools: MCPTool[] = [
  {
    id: "file-search",
    name: "File Search",
    description: "Быстрый поиск в файлах и документах с поддержкой индексации.",
    icon: Search,
    isActive: true,
  },
  {
    id: "web-scraper",
    name: "Web Scraper",
    description: "Извлечение данных из веб-страниц с поддержкой JavaScript.",
    icon: Globe,
    isActive: true,
  },
  {
    id: "database-query",
    name: "Database Query",
    description: "Выполнение SQL-запросов к базам данных через защищенное соединение.",
    icon: Database,
    isActive: false,
  },
  {
    id: "api-caller",
    name: "API Caller",
    description: "Отправка запросов к внешним API с поддержкой OAuth и ключей.",
    icon: Plug,
    isActive: true,
  },
  {
    id: "image-processor",
    name: "Image Processor",
    description: "Обработка и анализ изображений с использованием компьютерного зрения.",
    icon: Image,
    isActive: false,
  },
  {
    id: "text-analyzer",
    name: "Text Analyzer",
    description: "Анализ текста, извлечение сущностей и классификация тональности.",
    icon: FileText,
    isActive: true,
  },
];

export const MCPToolsPanel = () => {
  const [tools] = useState<MCPTool[]>(defaultTools);
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfigure = (tool: MCPTool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleAddTool = () => {
    toast.info("Добавление нового инструмента", {
      description: "Функция будет доступна в следующей версии"
    });
  };

  const handleMCPStore = () => {
    toast.info("MCP Store", {
      description: "Магазин инструментов откроется в следующей версии"
    });
  };

  return (
    <div className="flex flex-col h-full p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Section Title */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h2 className="font-rajdhani font-semibold text-lg sm:text-xl text-foreground metal-glow">
          MCP Tools
        </h2>
      </div>

      {/* Tools Grid - Responsive: 1 col on mobile, 2 cols on tablet+ */}
      <div className="grid grid-cols-1 min-[500px]:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {tools.map((tool) => (
          <MCPToolCard
            key={tool.id}
            name={tool.name}
            description={tool.description}
            icon={tool.icon}
            isActive={tool.isActive}
            onConfigure={() => handleConfigure(tool)}
          />
        ))}
      </div>

      {/* Action Buttons - Stack on very narrow screens */}
      <div className="flex flex-col min-[400px]:flex-row gap-2 sm:gap-3">
        <Button
          onClick={handleAddTool}
          className="flex-1 bg-primary/20 border border-primary/50 text-primary hover:bg-primary/40 hover:text-foreground font-rajdhani font-semibold text-sm"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
        <Button
          onClick={handleMCPStore}
          className="flex-1 bg-card/70 border border-muted-foreground hover:bg-card/90 hover:text-foreground font-rajdhani font-semibold text-sm"
          variant="outline"
        >
          <Store className="w-4 h-4 mr-2" />
          MCP Store
        </Button>
      </div>

      {/* Config Modal */}
      {selectedTool && (
        <MCPConfigModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          toolName={selectedTool.name}
          toolDescription={selectedTool.description}
        />
      )}
    </div>
  );
};
