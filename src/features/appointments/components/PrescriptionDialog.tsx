"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreatePrescription } from "../hooks";

const PrescriptionSchema = z.object({
  findings: z
    .string()
    .trim()
    .min(5, "Describe the key findings (at least 5 characters)"),
  medicines: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Required"),
        dosage: z.string().trim().min(1, "Required"),
        duration: z.string().trim().min(1, "Required"),
        instructions: z.string().trim().optional(),
      }),
    )
    .min(1, "Add at least one medicine"),
});
type PrescriptionInput = z.infer<typeof PrescriptionSchema>;

const emptyMedicine = { name: "", dosage: "", duration: "", instructions: "" };

type PrescriptionDialogProps = {
  appointmentId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PrescriptionDialog({
  appointmentId,
  patientName,
  open,
  onOpenChange,
}: PrescriptionDialogProps) {
  const create = useCreatePrescription();
  const form = useForm<PrescriptionInput>({
    resolver: zodResolver(PrescriptionSchema),
    defaultValues: { findings: "", medicines: [emptyMedicine] },
  });
  const medicines = useFieldArray({ control: form.control, name: "medicines" });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    create.mutate(
      {
        appointmentId,
        ...values,
        medicines: values.medicines.map((m) => ({
          ...m,
          instructions: m.instructions || undefined,
        })),
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    ),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Write prescription</DialogTitle>
          <DialogDescription>
            For {patientName}. A PDF is generated and emailed to the patient on
            submit.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="grid gap-5">
          <FormField
            id="rx-findings"
            label="Key findings"
            required
            error={errors.findings?.message}
          >
            <Textarea
              {...fieldA11y("rx-findings", errors.findings?.message)}
              rows={3}
              {...form.register("findings")}
            />
          </FormField>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium">Medicines</legend>
            {medicines.fields.map((field, index) => {
              const err = errors.medicines?.[index];
              return (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]"
                >
                  <FormField
                    id={`rx-name-${index}`}
                    label="Name"
                    error={err?.name?.message}
                  >
                    <Input
                      {...fieldA11y(`rx-name-${index}`, err?.name?.message)}
                      placeholder="Paracetamol"
                      {...form.register(`medicines.${index}.name`)}
                    />
                  </FormField>
                  <FormField
                    id={`rx-dosage-${index}`}
                    label="Dosage"
                    error={err?.dosage?.message}
                  >
                    <Input
                      {...fieldA11y(`rx-dosage-${index}`, err?.dosage?.message)}
                      placeholder="500mg, 1+0+1"
                      {...form.register(`medicines.${index}.dosage`)}
                    />
                  </FormField>
                  <FormField
                    id={`rx-duration-${index}`}
                    label="Duration"
                    error={err?.duration?.message}
                  >
                    <Input
                      {...fieldA11y(
                        `rx-duration-${index}`,
                        err?.duration?.message,
                      )}
                      placeholder="5 days"
                      {...form.register(`medicines.${index}.duration`)}
                    />
                  </FormField>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="self-end text-destructive"
                    onClick={() => medicines.remove(index)}
                    disabled={medicines.fields.length === 1}
                    aria-label={`Remove medicine ${index + 1}`}
                  >
                    <Trash2Icon />
                  </Button>
                  <FormField
                    id={`rx-instr-${index}`}
                    label="Instructions (optional)"
                    className="sm:col-span-4"
                  >
                    <Input
                      id={`rx-instr-${index}`}
                      placeholder="After meals"
                      {...form.register(`medicines.${index}.instructions`)}
                    />
                  </FormField>
                </div>
              );
            })}
            {errors.medicines?.root?.message && (
              <p className="text-sm text-destructive">
                {errors.medicines.root.message}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => medicines.append(emptyMedicine)}
            >
              <PlusIcon /> Add medicine
            </Button>
          </fieldset>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton isLoading={create.isPending} loadingText="Sending…">
              Send prescription
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
