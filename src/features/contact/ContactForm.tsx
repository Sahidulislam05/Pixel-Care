"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, getErrorMessage } from "@/lib/api-client";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(50),
  email: z.email("Enter a valid email address"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});
type ContactInput = z.infer<typeof ContactSchema>;

export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });
  const { errors } = form.formState;

  const submit = useMutation({
    mutationFn: (body: ContactInput) =>
      api("/contact", { method: "POST", body }),
    onSuccess: ({ message }) => toast.success(message),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (submit.isSuccess) {
    return (
      <output className="flex flex-col items-center gap-3 rounded-xl border bg-secondary/60 p-10 text-center">
        <CheckCircle2Icon className="size-10 text-secondary-foreground" />
        <h2 className="text-xl font-semibold">Message received</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for reaching out. Our support team replies by email, usually
          within one working day.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            form.reset();
            submit.reset();
          }}
        >
          Send another message
        </Button>
      </output>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => submit.mutate(values))}
      noValidate
      className="grid gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="contact-name"
          label="Full name"
          required
          error={errors.name?.message}
        >
          <Input
            {...fieldA11y("contact-name", errors.name?.message)}
            autoComplete="name"
            {...form.register("name")}
          />
        </FormField>
        <FormField
          id="contact-email"
          label="Email"
          required
          error={errors.email?.message}
        >
          <Input
            {...fieldA11y("contact-email", errors.email?.message)}
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
        </FormField>
      </div>
      <FormField
        id="contact-subject"
        label="Subject"
        required
        error={errors.subject?.message}
      >
        <Input
          {...fieldA11y("contact-subject", errors.subject?.message)}
          {...form.register("subject")}
        />
      </FormField>
      <FormField
        id="contact-message"
        label="Message"
        required
        error={errors.message?.message}
        hint="Up to 2000 characters."
      >
        <Textarea
          {...fieldA11y("contact-message", errors.message?.message)}
          rows={6}
          {...form.register("message")}
        />
      </FormField>
      <SubmitButton
        isLoading={submit.isPending}
        loadingText="Sending…"
        size="lg"
        className="sm:w-fit"
      >
        Send message
      </SubmitButton>
    </form>
  );
}
