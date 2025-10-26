// 🔄 Глобальное состояние чата с Zustand

import { create } from "zustand";
import { ChatState, ChatSession, ChatMessage, SessionMetadata, SessionFilters } from "@/types/chat";
import { storageService } from "@/services/storage";

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createDefaultSession = (title: string = "Новый чат"): ChatSession => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    messages: [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      tags: [],
      isPinned: false,
      isArchived: false,
      isFavorite: false,
    },
  };
};

export const useChatStore = create<ChatState>((set, get) => {
  // Загрузка истории при инициализации
  const savedHistory = storageService.load();
  
  const initialState = savedHistory || {
    sessions: {},
    sessionOrder: [],
    currentSessionId: null,
  };

  // Если нет сессий, создаем первую
  if (Object.keys(initialState.sessions).length === 0) {
    const firstSession = createDefaultSession("PlayRAGNA - Чат 1");
    firstSession.messages.push({
      id: generateId(),
      role: "assistant",
      content: "Привет! Я PlayRAGNA - ваш AI-ассистент в стиле Battle.net. Готов помочь с любыми задачами. Что вас интересует?",
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      sessionId: firstSession.id,
    });
    initialState.sessions[firstSession.id] = firstSession;
    initialState.sessionOrder = [firstSession.id];
    initialState.currentSessionId = firstSession.id;
  }

  // Синхронизация между вкладками
  storageService.onStorageChange((history) => {
    if (history) {
      set(history);
    }
  });

  return {
    ...initialState,

    // 🆕 Создать новую сессию
    createNewSession: () => {
      const newSession = createDefaultSession();
      const state = get();
      
      set({
        sessions: {
          ...state.sessions,
          [newSession.id]: newSession,
        },
        sessionOrder: [newSession.id, ...state.sessionOrder],
        currentSessionId: newSession.id,
      });

      storageService.autoSave(get());
      return newSession.id;
    },

    // 🔀 Переключиться на сессию
    switchSession: (sessionId: string) => {
      const state = get();
      if (state.sessions[sessionId]) {
        set({ currentSessionId: sessionId });
      }
    },

    // ✏️ Переименовать сессию
    renameSession: (sessionId: string, newTitle: string) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        set({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              title: newTitle,
              metadata: {
                ...session.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
          },
        });
        storageService.autoSave(get());
      }
    },

    // 🗑️ Удалить сессию
    deleteSession: (sessionId: string) => {
      const state = get();
      const { [sessionId]: removed, ...remainingSessions } = state.sessions;
      const newOrder = state.sessionOrder.filter(id => id !== sessionId);
      
      // Если удаляем текущую сессию, переключаемся на другую
      let newCurrentId = state.currentSessionId;
      if (state.currentSessionId === sessionId) {
        newCurrentId = newOrder[0] || null;
      }

      set({
        sessions: remainingSessions,
        sessionOrder: newOrder,
        currentSessionId: newCurrentId,
      });

      storageService.autoSave(get());
    },

    // 💬 Добавить сообщение
    addMessage: (sessionId: string, message) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        const newMessage: ChatMessage = {
          id: generateId(),
          sessionId,
          timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          ...message,
        };

        const updatedSession = {
          ...session,
          messages: [...session.messages, newMessage],
          preview: message.content.slice(0, 100),
          metadata: {
            ...session.metadata,
            updatedAt: new Date().toISOString(),
            messageCount: session.messages.length + 1,
          },
        };

        set({
          sessions: {
            ...state.sessions,
            [sessionId]: updatedSession,
          },
        });

        storageService.autoSave(get());
      }
    },

    // 📝 Обновить метаданные сессии
    updateSessionMetadata: (sessionId: string, metadata: Partial<SessionMetadata>) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        set({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              metadata: {
                ...session.metadata,
                ...metadata,
                updatedAt: new Date().toISOString(),
              },
            },
          },
        });
        storageService.autoSave(get());
      }
    },

    // 📌 Закрепить/открепить сессию
    togglePinSession: (sessionId: string) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        get().updateSessionMetadata(sessionId, {
          isPinned: !session.metadata.isPinned,
        });
      }
    },

    // ⭐ Добавить/убрать из избранного
    toggleFavoriteSession: (sessionId: string) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        get().updateSessionMetadata(sessionId, {
          isFavorite: !session.metadata.isFavorite,
        });
      }
    },

    // 📦 Архивировать сессию
    archiveSession: (sessionId: string) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        get().updateSessionMetadata(sessionId, {
          isArchived: !session.metadata.isArchived,
        });
      }
    },

    // 🧹 Очистить сообщения в сессии
    clearSession: (sessionId: string) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        set({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              messages: [],
              preview: undefined,
              metadata: {
                ...session.metadata,
                messageCount: 0,
                updatedAt: new Date().toISOString(),
              },
            },
          },
        });
        storageService.autoSave(get());
      }
    },

    // 📤 Экспортировать сессию
    exportSession: (sessionId: string) => {
      const state = get();
      const session = state.sessions[sessionId];
      
      if (session) {
        return storageService.exportSession(session);
      }
      return "";
    },

    // 📥 Импортировать сессию
    importSession: (data: string) => {
      const session = storageService.importSession(data);
      
      if (session) {
        const state = get();
        const newId = generateId(); // Generate new ID to avoid conflicts
        const importedSession = { ...session, id: newId };
        
        set({
          sessions: {
            ...state.sessions,
            [newId]: importedSession,
          },
          sessionOrder: [newId, ...state.sessionOrder],
        });

        storageService.autoSave(get());
      }
    },

    // 🔍 Поиск сессий
    searchSessions: (query: string) => {
      const state = get();
      const lowerQuery = query.toLowerCase();
      
      return Object.values(state.sessions).filter(session => 
        session.title.toLowerCase().includes(lowerQuery) ||
        session.messages.some(msg => msg.content.toLowerCase().includes(lowerQuery)) ||
        session.metadata.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    },

    // 🔎 Фильтровать сессии
    filterSessions: (filters: SessionFilters) => {
      const state = get();
      
      return Object.values(state.sessions).filter(session => {
        if (filters.isPinned !== undefined && session.metadata.isPinned !== filters.isPinned) {
          return false;
        }
        if (filters.isArchived !== undefined && session.metadata.isArchived !== filters.isArchived) {
          return false;
        }
        if (filters.isFavorite !== undefined && session.metadata.isFavorite !== filters.isFavorite) {
          return false;
        }
        if (filters.folder && session.metadata.folder !== filters.folder) {
          return false;
        }
        if (filters.tags && filters.tags.length > 0) {
          const hasTags = filters.tags.some(tag => session.metadata.tags?.includes(tag));
          if (!hasTags) return false;
        }
        if (filters.dateFrom && session.metadata.createdAt < filters.dateFrom) {
          return false;
        }
        if (filters.dateTo && session.metadata.createdAt > filters.dateTo) {
          return false;
        }
        return true;
      });
    },
  };
});
