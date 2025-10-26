import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { SessionList } from "@/components/chat/SessionList";
import { MCPToolsPanel } from "@/components/MCPToolsPanel";
import { DocumentsPanel } from "@/components/DocumentsPanel";
import { BookmarksPanel } from "@/components/BookmarksPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { DiagnosticPanel } from "@/components/DiagnosticPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type TabId = "chats" | "tools" | "documents" | "bookmarks" | "history" | "diagnostic";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("chats");
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({
    diagnosticMode: true
  });

  // Load feature flags from DiagnosticStore
  useEffect(() => {
    const loadFeatureFlags = async () => {
      if (!window.playragnaDiagnostics) return;
      
      try {
        const settings = await window.playragnaDiagnostics.getSettings();
        setFeatureFlags({
          diagnosticMode: settings.diagnosticMode
        });
      } catch (error) {
        console.error('[Index] Failed to load feature flags:', error);
      }
    };
    
    loadFeatureFlags();
    const interval = setInterval(loadFeatureFlags, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "chats") {
              setIsSessionListOpen(true);
            }
          }}
          featureFlags={featureFlags}
        />
        
        <main className="flex-1 flex flex-col">
          {activeTab === "chats" ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Desktop: Sidebar */}
              <div className="hidden lg:block w-80 border-r border-border">
                <SessionList />
              </div>

              {/* Mobile: Sheet */}
              <Sheet open={isSessionListOpen} onOpenChange={setIsSessionListOpen}>
                <SheetContent side="left" className="w-80 p-0 lg:hidden">
                  <SessionList />
                </SheetContent>
              </Sheet>

              {/* Chat Container */}
              <div className="flex-1">
                <ChatContainer />
              </div>
            </div>
          ) : activeTab === "tools" ? (
            <MCPToolsPanel />
          ) : activeTab === "documents" ? (
            <DocumentsPanel />
          ) : activeTab === "bookmarks" ? (
            <BookmarksPanel />
          ) : activeTab === "history" ? (
            <HistoryPanel />
          ) : activeTab === "diagnostic" ? (
            <DiagnosticPanel />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Index;
