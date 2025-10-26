// 📊 Система типов для многосессионного чата

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sessionId: string;
  metadata?: {
    tokens?: number;
    model?: string;
    duration?: number;
    attachments?: string[];
  };
}

export interface SessionMetadata {
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  folder?: string;
  color?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  metadata: SessionMetadata;
  preview?: string; // Last message preview
}

export interface ConversationHistory {
  sessions: Record<string, ChatSession>;
  sessionOrder: string[]; // для сохранения порядка
  currentSessionId: string | null;
}

export interface ChatState extends ConversationHistory {
  // Actions
  createNewSession: () => string;
  switchSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  deleteSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, "id" | "sessionId" | "timestamp">) => void;
  updateSessionMetadata: (sessionId: string, metadata: Partial<SessionMetadata>) => void;
  togglePinSession: (sessionId: string) => void;
  toggleFavoriteSession: (sessionId: string) => void;
  archiveSession: (sessionId: string) => void;
  clearSession: (sessionId: string) => void;
  exportSession: (sessionId: string) => string;
  importSession: (data: string) => void;
  searchSessions: (query: string) => ChatSession[];
  filterSessions: (filters: SessionFilters) => ChatSession[];
}

export interface SessionFilters {
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  folder?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchIndex {
  sessionTitles: Map<string, string[]>;
  messageContents: Map<string, string[]>;
}

export type SessionAction = 
  | { type: "rename"; sessionId: string }
  | { type: "delete"; sessionId: string }
  | { type: "pin"; sessionId: string }
  | { type: "archive"; sessionId: string }
  | { type: "export"; sessionId: string }
  | { type: "duplicate"; sessionId: string };

export interface StorageQuota {
  used: number;
  total: number;
  percentage: number;
}
