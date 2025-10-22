import { useState } from "react";
import { Bookmark, Star, Link as LinkIcon, Plus, Search, Folder, ExternalLink, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  addedDate: string;
}

const mockBookmarks: BookmarkItem[] = [
  {
    id: "1",
    title: "MCP Protocol Documentation",
    url: "https://docs.mcp.protocol/v2",
    description: "Complete guide to MCP protocol implementation and best practices",
    category: "Documentation",
    tags: ["MCP", "Protocol", "API"],
    isFavorite: true,
    addedDate: "2025-10-20"
  },
  {
    id: "2",
    title: "AI Model Training Guide",
    url: "https://ai-training.example.com",
    description: "Step-by-step guide for training custom AI models",
    category: "Learning",
    tags: ["AI", "ML", "Training"],
    isFavorite: false,
    addedDate: "2025-10-19"
  },
  {
    id: "3",
    title: "Supabase Database Setup",
    url: "https://supabase.com/docs",
    description: "Quick start guide for Supabase integration",
    category: "Tools",
    tags: ["Database", "Backend", "Supabase"],
    isFavorite: true,
    addedDate: "2025-10-18"
  },
  {
    id: "4",
    title: "React Best Practices 2025",
    url: "https://react.dev/best-practices",
    description: "Modern React patterns and performance optimization",
    category: "Development",
    tags: ["React", "Frontend", "JavaScript"],
    isFavorite: false,
    addedDate: "2025-10-17"
  }
];

const categories = ["All", "Documentation", "Learning", "Tools", "Development"];

export const BookmarksPanel = () => {
  const [bookmarks] = useState<BookmarkItem[]>(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleAdd = () => {
    toast.info("Add Bookmark", {
      description: "Enter URL to create a new bookmark"
    });
  };

  const handleOpen = (bookmark: BookmarkItem) => {
    toast.success(`Opening: ${bookmark.title}`);
    window.open(bookmark.url, '_blank');
  };

  const handleDelete = (bookmark: BookmarkItem) => {
    toast.warning(`Delete: ${bookmark.title}`, {
      description: "Bookmark will be removed"
    });
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || bookmark.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const favoriteCount = bookmarks.filter(b => b.isFavorite).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3 mb-4">
          <Bookmark className="w-6 h-6 text-primary" />
          <h2 className="font-rajdhani font-semibold text-xl text-foreground metal-glow">
            Bookmarks
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary">
              {bookmarks.length} total
            </Badge>
            <Badge variant="outline" className="bg-[hsl(30,100%,50%,0.15)] border-[hsl(30,100%,50%)] text-[hsl(30,100%,50%)]">
              <Star className="w-3 h-3 mr-1" />
              {favoriteCount}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/70 border-muted-foreground/30 focus:border-primary"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "text-xs whitespace-nowrap",
                selectedCategory === category
                  ? "bg-primary/30 border-primary text-primary"
                  : "bg-background/70 border-muted-foreground/30 hover:bg-muted"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookmarks List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No bookmarks found</p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className={cn(
                  "bg-card/70 border border-primary/30 rounded-lg p-4",
                  "transition-all duration-300 hover:translate-y-[-2px]",
                  "hover:shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:border-primary"
                )}
              >
                {/* Bookmark Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-background/90 border border-primary/40">
                    <LinkIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-rajdhani font-semibold text-base text-foreground truncate">
                        {bookmark.title}
                      </h3>
                      {bookmark.isFavorite && (
                        <Star className="w-4 h-4 text-[hsl(30,100%,50%)] fill-[hsl(30,100%,50%)]" />
                      )}
                    </div>
                    <p className="text-xs text-primary/80 truncate mt-1">
                      {bookmark.url}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-muted/50 border-primary/20 whitespace-nowrap"
                  >
                    <Folder className="w-3 h-3 mr-1" />
                    {bookmark.category}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                  {bookmark.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {bookmark.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-[10px] bg-muted/50 border border-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                  <span className="text-[10px] text-muted-foreground">
                    Added {bookmark.addedDate}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpen(bookmark)}
                      className="text-xs hover:bg-primary/20 hover:text-primary"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs hover:bg-primary/20 hover:text-primary"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(bookmark)}
                      className="text-xs hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add Button */}
      <div className="p-4 border-t border-border bg-card/50">
        <Button
          onClick={handleAdd}
          className="w-full bg-primary/20 border border-primary/30 hover:bg-primary/40 text-primary hover:text-foreground font-rajdhani font-semibold"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bookmark
        </Button>
      </div>
    </div>
  );
};