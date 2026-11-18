"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  BotIcon,
  Loader2Icon,
  RotateCcwIcon,
  SendHorizontalIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api, getErrorMessage } from "@/lib/api-client";
import { cityOf, formatTaka } from "@/lib/format";
import { cn } from "@/lib/utils";
import { type ChatDoctor, type ChatMessage, useChatStore } from "../store";
import { RichText } from "./RichText";

const SUGGESTIONS = [
  "I have a migraine that won't go away",
  "Child specialist available today",
  "Skin doctor in Gulshan, Dhaka",
  "Which cardiologist has the lowest fee?",
];

type ChatReply = { sessionId: string; answer: string; doctors: ChatDoctor[] };

const newId = () => Math.random().toString(36).slice(2);

export function ChatWindow() {
  const { sessionId, messages, addMessage, setSessionId, reset } =
    useChatStore();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialQuestionSent = useRef(false);

  const send = useMutation({
    mutationFn: (message: string) =>
      api<ChatReply>("/chat", {
        method: "POST",
        body: { message, ...(sessionId ? { sessionId } : {}) },
      }),
    onSuccess: ({ data }) => {
      setSessionId(data.sessionId);
      addMessage({
        id: newId(),
        role: "assistant",
        content: data.answer,
        doctors: data.doctors,
      });
    },
    onError: (error) =>
      addMessage({
        id: newId(),
        role: "assistant",
        content: getErrorMessage(error),
        isError: true,
      }),
  });

  const ask = (text: string) => {
    const message = text.trim();
    if (!message || send.isPending) return;
    addMessage({ id: newId(), role: "user", content: message });
    setInput("");
    send.mutate(message);
  };

  // Question handed over from the home page hero (?q=...), sent once.
  // biome-ignore lint/correctness/useExhaustiveDependencies: must run only when the URL query changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQuestionSent.current) {
      initialQuestionSent.current = true;
      ask(q);
      window.history.replaceState(null, "", "/ai-assistant");
    }
  }, [searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when a message is added or the reply starts loading
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, send.isPending]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div className="flex h-[70vh] min-h-130 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-highlight text-highlight-foreground">
            <BotIcon className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Pixel-Care Assistant</p>
            <p className="text-xs text-muted-foreground">
              Finds doctors from our verified network
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcwIcon /> New chat
          </Button>
        )}
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
        aria-live="polite"
        aria-busy={send.isPending}
      >
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
            <p className="text-lg font-semibold">How can I help you today?</p>
            <p className="text-sm text-muted-foreground">
              Describe your symptoms or the kind of doctor you need. I'll
              suggest specialists with today's availability.
            </p>
            <div className="grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-xl border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:border-highlight/50 hover:bg-highlight-soft"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {send.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" /> Finding the right
            doctors…
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t p-3 sm:p-4">
        <label htmlFor="chat-input" className="sr-only">
          Message the assistant
        </label>
        <div className="flex gap-2">
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            placeholder="Type your question…"
            className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          <Button
            type="submit"
            variant="highlight"
            className="h-11"
            disabled={!input.trim() || send.isPending}
          >
            <SendHorizontalIcon />{" "}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-highlight-soft text-highlight",
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <UserIcon className="size-4" />
        ) : (
          <BotIcon className="size-4" />
        )}
      </span>
      <div className={cn("max-w-[85%] space-y-3", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm",
            isUser && "bg-primary text-primary-foreground",
            !isUser && !message.isError && "bg-muted text-foreground",
            message.isError &&
              "border border-destructive/30 bg-destructive/5 text-destructive",
          )}
        >
          <span className="sr-only">{isUser ? "You said:" : "Assistant:"}</span>
          {isUser ? message.content : <RichText text={message.content} />}
        </div>
        {message.doctors && message.doctors.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {message.doctors.map((doctor) => (
              <li key={doctor.id}>
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="group flex items-center justify-between gap-2 rounded-xl border bg-background p-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {doctor.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {doctor.specialization} ·{" "}
                      {formatTaka(doctor.consultationFee)}
                      {cityOf(doctor.address)
                        ? ` · ${cityOf(doctor.address)}`
                        : ""}
                    </span>
                  </span>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
