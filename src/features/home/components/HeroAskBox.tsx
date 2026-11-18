"use client";

import { SendHorizontalIcon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

/** Interactive: describe symptoms, jump straight into the AI assistant. */
export function HeroAskBox() {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    router.push(
      text ? `/ai-assistant?q=${encodeURIComponent(text)}` : "/ai-assistant",
    );
  };

  return (
    <form onSubmit={submit} className="max-w-xl">
      <label
        htmlFor="hero-ask"
        className="mb-2 flex items-center gap-1.5 text-sm font-medium"
      >
        <SparklesIcon className="size-4 text-highlight" /> Not sure who to see?
        Ask our AI assistant
      </label>
      <div className="flex gap-2 rounded-xl border bg-card p-1.5 shadow-sm focus-within:ring-3 focus-within:ring-ring/40">
        <input
          id="hero-ask"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={300}
          placeholder="e.g. My child has fever and a cough for 3 days"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          variant="highlight"
          size="sm"
          aria-label="Ask the AI assistant"
        >
          Ask <SendHorizontalIcon />
        </Button>
      </div>
    </form>
  );
}
