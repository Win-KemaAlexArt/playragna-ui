import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Download, Shield, Zap, Code, TrendingUp, Verified, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface MCPToolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: {
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
    screenshots?: string[];
  };
  onInstall: () => void;
}

export const MCPToolDetailModal = ({ isOpen, onClose, tool, onInstall }: MCPToolDetailModalProps) => {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsNarrow(window.innerWidth < 640);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const Icon = tool.icon;

  const content = (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-rajdhani font-bold text-2xl text-foreground">
              {tool.name}
            </h2>
            {tool.isVerified && (
              <Verified className="w-5 h-5 text-primary" />
            )}
            {tool.isTrending && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span>by {tool.author}</span>
            <span>•</span>
            <span>v{tool.version}</span>
            <span>•</span>
            <Badge variant="outline" className="border-primary/30">
              {tool.category}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-medium text-foreground">{tool.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="w-4 h-4" />
              <span>{tool.downloads >= 1000 ? `${(tool.downloads / 1000).toFixed(1)}k` : tool.downloads} installs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-muted-foreground leading-relaxed">
          {tool.longDescription}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-muted/50">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="mt-4 space-y-2">
          {tool.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="requirements" className="mt-4 space-y-2">
          {tool.requirements.map((req, index) => (
            <div key={index} className="flex items-start gap-2">
              <Code className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{req}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="permissions" className="mt-4 space-y-2">
          {tool.permissions.map((permission, index) => (
            <div key={index} className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{permission}</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-primary/10">
        <Button
          onClick={onInstall}
          disabled={tool.isInstalled}
          className={`flex-1 font-rajdhani font-semibold ${
            tool.isInstalled 
              ? 'bg-primary/20 text-primary cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {tool.isInstalled ? 'Already Installed' : tool.price > 0 ? `Install - $${tool.price}` : 'Install Free'}
        </Button>
        <Button
          variant="outline"
          className="border-primary/30 hover:bg-primary/10"
          asChild
        >
          <a href={tool.authorUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );

  if (isNarrow) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] bg-background border-t border-primary/20">
          <SheetHeader>
            <SheetTitle className="font-rajdhani text-xl">Tool Details</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-4rem)] mt-4">
            {content}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-rajdhani text-xl">Tool Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
