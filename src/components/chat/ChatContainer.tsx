import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useChatStore } from "@/hooks/useChatStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatContainer = () => {
  const { sessions, currentSessionId, addMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentSession = currentSessionId ? sessions[currentSessionId] : null;
  const messages = currentSession?.messages || [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSendMessage = (content: string) => {
    if (!currentSessionId) return;

    // Add user message
    addMessage(currentSessionId, {
      role: "user",
      content,
    });

    // Simulate AI response
    setTimeout(() => {
      addMessage(currentSessionId, {
        role: "assistant",
        content: "Понял ваш запрос. В данный момент это демо-версия интерфейса, но в будущем здесь будет полноценная интеграция с AI и MCP инструментами.",
      });
    }, 1000);
  };

  if (!currentSession) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-rajdhani font-bold metal-glow">
            PlayRAGNA Extension v2.0
          </h2>
          <p className="text-muted-foreground">
            Выберите чат или создайте новый
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-rajdhani font-bold metal-glow">
                {currentSession.title}
              </h2>
              <p className="text-muted-foreground">
                Начните новую беседу
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
