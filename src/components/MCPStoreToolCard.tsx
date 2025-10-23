import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Star, TrendingUp, Verified } from "lucide-react";

interface MCPStoreToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  rating: number;
  downloads: number;
  isVerified: boolean;
  isTrending: boolean;
  isInstalled: boolean;
  price: number;
  onInstall: () => void;
  onViewDetails: () => void;
}

export const MCPStoreToolCard = ({
  name,
  description,
  icon: Icon,
  category,
  rating,
  downloads,
  isVerified,
  isTrending,
  isInstalled,
  price,
  onInstall,
  onViewDetails,
}: MCPStoreToolCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:bg-card/70 transition-all duration-300 cursor-pointer"
      onClick={onViewDetails}
    >
      {/* Trending Badge */}
      {isTrending && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-rajdhani font-semibold text-base text-foreground truncate">
                {name}
              </h3>
              {isVerified && (
                <Verified className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <Badge variant="outline" className="text-xs border-primary/30">
              {category}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-primary/10">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>{downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onInstall();
          }}
          disabled={isInstalled}
          className={`w-full font-rajdhani font-semibold ${
            isInstalled 
              ? 'bg-primary/20 text-primary cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          size="sm"
        >
          {isInstalled ? 'Installed' : price > 0 ? `Install - $${price}` : 'Install Free'}
        </Button>
      </div>
    </Card>
  );
};
