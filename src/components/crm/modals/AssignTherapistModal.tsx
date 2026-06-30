"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { Field, SelectInput, Button } from "../Form";
import { toast } from "sonner";
import {
  useTherapists,
  useUpdateAppointment,
} from "@/hooks/use-supabase-query";
import { useAppStore } from "@/lib/store";
import { Save } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string | null;
}

export function AssignTherapistModal({ open, onOpenChange, appointmentId }: Props) {
  const { currentBranchId } = useAppStore();
  const { data: therapists = [] } = useTherapists(currentBranchId);
  const updateAppointment = useUpdateAppointment();

  const [therapistId, setTherapistId] = useState<string>("");
  const [error, setError] = useState<string>("");

  function submit() {
    if (!therapistId) {
      setError("Therapist is required");
      toast.error("Please select a therapist");
      return;
    }
    if (!appointmentId) return;

    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) return;

    updateAppointment.mutate(
      { 
        id: appointmentId, 
        updates: { 
          therapist_id: therapist.id, 
          therapist_name: therapist.name 
        } 
      },
      {
        onSuccess: () => {
          toast.success("Therapist assigned successfully!");
          onOpenChange(false);
          setTherapistId(""); // Reset
        },
        onError: (err: any) => {
          toast.error("Failed to assign therapist", { description: err.message });
        }
      }
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title="Assign Therapist"
      description="Assign a physiotherapist to this pending appointment."
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={submit} disabled={updateAppointment.isPending}>
            <Save className="h-4 w-4" /> 
            {updateAppointment.isPending ? "Assigning..." : "Assign"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Therapist" required error={error}>
          <SelectInput
            value={therapistId}
            onValueChange={(v) => {
              setTherapistId(v);
              if (error) setError("");
            }}
            options={therapists.map(t => ({ value: t.id, label: t.name }))}
            invalid={!!error}
            placeholder="Select a therapist..."
            className="w-full"
          />
        </Field>
      </div>
    </Modal>
  );
}
