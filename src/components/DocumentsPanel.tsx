import { useState } from "react";
import { FileText, Upload, Search, Filter, Download, Trash2, Eye, Edit, FolderOpen, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  tags: string[];
  status: "processed" | "processing" | "error";
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "API Documentation.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2025-10-20",
    tags: ["API", "Documentation"],
    status: "processed"
  },
  {
    id: "2",
    name: "Product Roadmap.docx",
    type: "DOCX",
    size: "1.8 MB",
    uploadDate: "2025-10-19",
    tags: ["Roadmap", "Planning"],
    status: "processed"
  },
  {
    id: "3",
    name: "Database Schema.xlsx",
    type: "XLSX",
    size: "856 KB",
    uploadDate: "2025-10-18",
    tags: ["Database", "Schema"],
    status: "processing"
  },
  {
    id: "4",
    name: "Meeting Notes Q4.txt",
    type: "TXT",
    size: "45 KB",
    uploadDate: "2025-10-17",
    tags: ["Meeting", "Notes"],
    status: "processed"
  }
];

export const DocumentsPanel = () => {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const handleUpload = () => {
    toast.info("Upload Document", {
      description: "Drag and drop files or click to browse"
    });
  };

  const handleView = (doc: Document) => {
    setSelectedDoc(doc.id);
    toast.success(`Viewing: ${doc.name}`);
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading: ${doc.name}`);
  };

  const handleDelete = (doc: Document) => {
    toast.warning(`Delete: ${doc.name}`, {
      description: "This action cannot be undone"
    });
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "processed": return "bg-[hsl(158,100%,50%,0.15)] border-[hsl(158,100%,50%)] text-[hsl(158,100%,50%)]";
      case "processing": return "bg-[hsl(207,100%,50%,0.15)] border-[hsl(207,100%,50%)] text-[hsl(207,100%,50%)]";
      case "error": return "bg-[hsl(348,100%,60%,0.15)] border-[hsl(348,100%,60%)] text-[hsl(348,100%,60%)]";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="w-5 h-5 text-red-400" />;
      case "DOCX": return <FileText className="w-5 h-5 text-blue-400" />;
      case "XLSX": return <FileText className="w-5 h-5 text-green-400" />;
      case "TXT": return <File className="w-5 h-5 text-muted-foreground" />;
      default: return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3 mb-4">
          <FolderOpen className="w-6 h-6 text-primary" />
          <h2 className="font-rajdhani font-semibold text-xl text-foreground metal-glow">
            Documents
          </h2>
          <Badge variant="secondary" className="ml-auto">
            {documents.length} files
          </Badge>
        </div>

        {/* Search & Actions */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/70 border-muted-foreground/30 focus:border-primary"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/70 border-muted-foreground/30 hover:bg-muted"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-primary/20 border border-primary/30 hover:bg-primary/40 text-primary hover:text-foreground"
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No documents found</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "bg-card/70 border border-primary/30 rounded-lg p-4",
                  "transition-all duration-300 hover:translate-y-[-2px]",
                  "hover:shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:border-primary",
                  selectedDoc === doc.id && "border-primary shadow-[0_0_20px_rgba(0,154,228,0.4)]"
                )}
              >
                {/* Document Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-background/90 border border-primary/40">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-rajdhani font-semibold text-base text-foreground truncate">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-2 py-0.5", getStatusColor(doc.status))}
                  >
                    {doc.status}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {doc.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-[10px] bg-muted/50 border border-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-primary/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleView(doc)}
                    className="flex-1 text-xs hover:bg-primary/20 hover:text-primary"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(doc)}
                    className="flex-1 text-xs hover:bg-primary/20 hover:text-primary"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(doc)}
                    className="text-xs hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Stats Footer */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total: {documents.length} documents</span>
          <span>Storage: 5.1 MB / 100 MB</span>
        </div>
      </div>
    </div>
  );
};