"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ChatDoctor = {
  id: string;
  name: string;
  specialization: string;
  consultationFee: string | null;
  address: string | null;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  doctors?: ChatDoctor[];
  isError?: boolean;
};

type ChatState = {
  sessionId: string | null;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setSessionId: (sessionId: string) => void;
  reset: () => void;
};

// Conversation survives page navigation within the tab (the API keeps 1h of history).
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: null,
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setSessionId: (sessionId) => set({ sessionId }),
      reset: () => set({ sessionId: null, messages: [] }),
    }),
    {
      name: "pixel-care-chat",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
