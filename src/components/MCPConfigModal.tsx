import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface MCPConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  toolDescription: string;
}

export const MCPConfigModal = ({ 
  isOpen, 
  onClose, 
  toolName, 
  toolDescription 
}: MCPConfigModalProps) => {
  const [name, setName] = useState(toolName);
  const [description, setDescription] = useState(toolDescription);
  const [isEnabled, setIsEnabled] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState("https://api.playragna.com/mcp/");
  const [isNarrow, setIsNarrow] = useState(false);

  // Detect narrow viewport for Chrome extension popup
  useEffect(() => {
    const checkWidth = () => {
      setIsNarrow(window.innerWidth < 640);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleTestConnection = () => {
    toast.info("Тестирование соединения...", {
      description: "Проверяем доступность API endpoint"
    });
    setTimeout(() => {
      toast.success("Соединение успешно установлено");
    }, 1500);
  };

  const handleSave = () => {
    toast.success("Настройки сохранены", {
      description: `Конфигурация для "${name}" обновлена`
    });
    onClose();
  };

  const content = (
    <>
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="settings" className="font-rajdhani text-xs sm:text-sm">Settings</TabsTrigger>
          <TabsTrigger value="permissions" className="font-rajdhani text-xs sm:text-sm">Permissions</TabsTrigger>
          <TabsTrigger value="api-keys" className="font-rajdhani text-xs sm:text-sm">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="space-y-2">
            <Label htmlFor="tool-name" className="text-muted-foreground text-xs">
              Tool Name
            </Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/70 border-muted-foreground/30 focus:border-primary text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tool-desc" className="text-muted-foreground text-xs">
              Description
            </Label>
            <Textarea
              id="tool-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/70 border-muted-foreground/30 focus:border-primary min-h-[60px] sm:min-h-[80px] resize-y text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-tool"
              checked={isEnabled}
              onCheckedChange={(checked) => setIsEnabled(checked as boolean)}
              className="border-primary data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="enable-tool"
              className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable Tool
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-endpoint" className="text-muted-foreground text-xs">
              API Endpoint
            </Label>
            <Input
              id="api-endpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="bg-background/70 border-muted-foreground/30 focus:border-primary text-sm"
            />
          </div>

          <Button
            onClick={handleTestConnection}
            className="w-full bg-primary/20 border border-primary/30 hover:bg-primary/40 text-primary hover:text-foreground font-rajdhani text-sm"
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Test Connection
          </Button>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="text-xs sm:text-sm text-muted-foreground text-center py-6 sm:py-8">
            Настройки прав доступа будут доступны в следующей версии
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="text-xs sm:text-sm text-muted-foreground text-center py-6 sm:py-8">
            Управление API ключами будет доступно в следующей версии
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const footer = (
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        onClick={onClose}
        className="flex-1 bg-card/70 border-muted-foreground font-rajdhani hover:bg-card/90 text-sm"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        className="flex-1 bg-primary/20 border border-primary/30 hover:bg-primary/40 text-primary hover:text-foreground font-rajdhani text-sm"
      >
        Save
      </Button>
    </div>
  );

  // Use Sheet for narrow viewports (popup mode), Dialog for wider screens
  if (isNarrow) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] bg-card/95 backdrop-blur-sm border-primary/30 rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle className="font-rajdhani text-lg metal-glow">
              Configure: {toolName}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            {content}
          </div>
          <SheetFooter className="mt-4">
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-rajdhani text-xl metal-glow">
            Configure Tool: {toolName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Configuration settings for {toolName}
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="gap-2">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
