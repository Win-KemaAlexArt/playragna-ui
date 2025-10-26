// ⌨️ Хук для управления горячими клавишами

import { useEffect } from "react";

interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  preventDefault?: boolean;
}

export const useHotkeys = (configs: HotkeyConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const config of configs) {
        const {
          key,
          ctrl = false,
          shift = false,
          alt = false,
          meta = false,
          callback,
          preventDefault = true,
        } = config;

        const keyMatch = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatch = ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
        const altMatch = alt ? event.altKey : !event.altKey;
        const metaMatch = meta ? event.metaKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [configs]);
};

// 🎯 Предустановленные горячие клавиши
export const HOTKEYS = {
  SEARCH: { key: "k", ctrl: true },
  NEW_CHAT: { key: "n", ctrl: true },
  CLOSE_MODAL: { key: "Escape" },
  SAVE: { key: "s", ctrl: true },
  EXPORT: { key: "e", ctrl: true },
  NEXT_SESSION: { key: "ArrowDown", ctrl: true },
  PREV_SESSION: { key: "ArrowUp", ctrl: true },
} as const;
