import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { MCPToolsPanel } from "@/components/MCPToolsPanel";
import { DocumentsPanel } from "@/components/DocumentsPanel";
import { BookmarksPanel } from "@/components/BookmarksPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { toast } from "sonner";

type TabId = "chats" | "tools" | "documents" | "bookmarks" | "history";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("chats");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Привет! Я PlayRAGNA - ваш AI-ассистент в стиле Battle.net. Готов помочь с любыми задачами. Что вас интересует?",
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Понял ваш запрос. В данный момент это демо-версия интерфейса, но в будущем здесь будет полноценная интеграция с AI и MCP инструментами.",
        timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    toast.success("Новый чат создан");
  };

  const handleSettings = () => {
    toast.info("Настройки скоро будут доступны");
  };

  const handleHelp = () => {
    toast.info("Документация в разработке");
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <ChatHeader 
        onNewChat={handleNewChat}
        onSettings={handleSettings}
        onHelp={handleHelp}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 flex flex-col">
          {activeTab === "chats" ? (
            <>
              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <h2 className="text-2xl font-rajdhani font-bold metal-glow">
                        PlayRAGNA Extension v2.0
                      </h2>
                      <p className="text-muted-foreground">
                        Battle.net inspired AI interface
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                    />
                  ))
                )}
              </div>

              {/* Chat Input */}
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : activeTab === "tools" ? (
            <MCPToolsPanel />
          ) : activeTab === "documents" ? (
            <DocumentsPanel />
          ) : activeTab === "bookmarks" ? (
            <BookmarksPanel />
          ) : activeTab === "history" ? (
            <HistoryPanel />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Index;
