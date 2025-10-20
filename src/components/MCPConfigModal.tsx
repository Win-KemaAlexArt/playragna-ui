import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-card/95 backdrop-blur-sm border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-rajdhani text-xl metal-glow">
            Configure Tool: {toolName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="settings" className="font-rajdhani">Settings</TabsTrigger>
            <TabsTrigger value="permissions" className="font-rajdhani">Permissions</TabsTrigger>
            <TabsTrigger value="api-keys" className="font-rajdhani">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tool-name" className="text-muted-foreground text-xs">
                Tool Name
              </Label>
              <Input
                id="tool-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/70 border-muted-foreground/30 focus:border-primary"
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
                className="bg-background/70 border-muted-foreground/30 focus:border-primary min-h-[80px] resize-y"
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                className="bg-background/70 border-muted-foreground/30 focus:border-primary"
              />
            </div>

            <Button
              onClick={handleTestConnection}
              className="w-full bg-primary/20 border border-primary/30 hover:bg-primary/40 text-primary hover:text-foreground font-rajdhani"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Connection
            </Button>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground text-center py-8">
              Настройки прав доступа будут доступны в следующей версии
            </div>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground text-center py-8">
              Управление API ключами будет доступно в следующей версии
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-card/70 border-muted-foreground font-rajdhani hover:bg-card/90"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary/20 border border-primary/30 hover:bg-primary/40 text-primary hover:text-foreground font-rajdhani"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
