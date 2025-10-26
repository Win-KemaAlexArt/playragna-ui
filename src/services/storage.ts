// 💾 Сервис хранения данных для чата

import { ChatSession, ConversationHistory, StorageQuota } from "@/types/chat";

const STORAGE_KEY = "playragna_chat_history";
const STORAGE_VERSION = "1.0.0";

export class StorageService {
  private static instance: StorageService;
  private autoSaveTimeout: NodeJS.Timeout | null = null;
  private readonly AUTOSAVE_DELAY = 1000; // 1 second debounce

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // 💾 Сохранение истории
  save(history: ConversationHistory): void {
    try {
      const data = {
        version: STORAGE_VERSION,
        timestamp: new Date().toISOString(),
        history,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("[StorageService] Failed to save:", error);
      this.handleStorageQuotaExceeded();
    }
  }

  // 📥 Загрузка истории
  load(): ConversationHistory | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Миграция данных если необходимо
      if (parsed.version !== STORAGE_VERSION) {
        return this.migrateData(parsed);
      }

      return parsed.history;
    } catch (error) {
      console.error("[StorageService] Failed to load:", error);
      return null;
    }
  }

  // 🔄 Автосохранение с debounce
  autoSave(history: ConversationHistory): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(() => {
      this.save(history);
    }, this.AUTOSAVE_DELAY);
  }

  // 📤 Экспорт сессии
  exportSession(session: ChatSession): string {
    return JSON.stringify({
      version: STORAGE_VERSION,
      type: "session",
      data: session,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  // 📥 Импорт сессии
  importSession(data: string): ChatSession | null {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "session" && parsed.data) {
        return parsed.data as ChatSession;
      }
      return null;
    } catch (error) {
      console.error("[StorageService] Failed to import session:", error);
      return null;
    }
  }

  // 📊 Проверка квоты хранилища
  getQuota(): StorageQuota {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || "";
      const used = new Blob([data]).size;
      const total = 5 * 1024 * 1024; // 5MB estimate for localStorage
      
      return {
        used,
        total,
        percentage: (used / total) * 100,
      };
    } catch {
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  // 🗑️ Очистка всех данных
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // 🔄 Миграция данных
  private migrateData(oldData: any): ConversationHistory | null {
    console.log("[StorageService] Migrating data from version:", oldData.version);
    // Implement migration logic here when versions change
    return oldData.history;
  }

  // 💥 Обработка превышения квоты
  private handleStorageQuotaExceeded(): void {
    console.warn("[StorageService] Storage quota exceeded, cleaning old data...");
    // Implement cleanup strategy: remove old archived sessions, etc.
  }

  // 🔍 Синхронизация между вкладками
  onStorageChange(callback: (history: ConversationHistory | null) => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback(this.load());
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }
}

export const storageService = StorageService.getInstance();
