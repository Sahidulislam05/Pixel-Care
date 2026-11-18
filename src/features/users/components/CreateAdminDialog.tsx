"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-client";
import { usersApi } from "../api";

const CreateAdminSchema = z
  .object({
    name: z.string().trim().min(3, "At least 3 characters").max(50),
    email: z.email("Enter a valid organization email"),
    personalEmail: z.email("Enter a valid personal email"),
    role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  })
  .refine((v) => v.email.toLowerCase() !== v.personalEmail.toLowerCase(), {
    path: ["personalEmail"],
    message: "Use a different address from the login email",
  });
type CreateAdminInput = z.infer<typeof CreateAdminSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canCreateSuperAdmin: boolean;
};

export function CreateAdminDialog({
  open,
  onOpenChange,
  canCreateSuperAdmin,
}: Props) {
  const queryClient = useQueryClient();
  const form = useForm<CreateAdminInput>({
    resolver: zodResolver(CreateAdminSchema),
    defaultValues: { name: "", email: "", personalEmail: "", role: "ADMIN" },
  });
  const { errors } = form.formState;

  const create = useMutation({
    mutationFn: usersApi.createAdmin,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create admin account</DialogTitle>
          <DialogDescription>
            A password is generated and sent to their personal email with the
            login details.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((values) => create.mutate(values))}
          noValidate
          className="grid gap-4"
        >
          <FormField
            id="admin-name"
            label="Full name"
            required
            error={errors.name?.message}
          >
            <Input
              {...fieldA11y("admin-name", errors.name?.message)}
              {...form.register("name")}
            />
          </FormField>
          <FormField
            id="admin-email"
            label="Organization email (login)"
            required
            error={errors.email?.message}
          >
            <Input
              {...fieldA11y("admin-email", errors.email?.message)}
              type="email"
              {...form.register("email")}
            />
          </FormField>
          <FormField
            id="admin-personal"
            label="Personal email"
            required
            error={errors.personalEmail?.message}
            hint="Receives the welcome email and temporary password."
          >
            <Input
              {...fieldA11y("admin-personal", errors.personalEmail?.message)}
              type="email"
              {...form.register("personalEmail")}
            />
          </FormField>
          {canCreateSuperAdmin && (
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <FilterSelect
                  id="admin-role"
                  label="Role"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "SUPER_ADMIN", label: "Super Admin" },
                  ]}
                />
              )}
            />
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton isLoading={create.isPending} loadingText="Creating…">
              Create account
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
