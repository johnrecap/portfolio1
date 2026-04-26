import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useCRMStore } from "../../store/crmStore";

const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  stage: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]),
  value: z.number().min(0, "Value must be positive"),
  probability: z.number().min(0).max(100, "Probability must be between 0 and 100"),
  expectedCloseDate: z.string().min(1, "Expected close date is required"),
  ownerId: z.string().min(1, "Owner is required"),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealFormModal({ isOpen, onClose }: DealFormModalProps) {
  const { addDeal, users } = useCRMStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      companyName: "",
      contactName: "",
      stage: "new",
      value: 0,
      probability: 50,
      expectedCloseDate: "",
      ownerId: "",
    },
  });

  const onSubmit = (data: DealFormValues) => {
    addDeal({
      ...data,
      expectedCloseDate: new Date(data.expectedCloseDate).toISOString(),
    });
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Deal">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Deal Title"
          {...register("title")}
          error={errors.title?.message}
          placeholder="e.g. Website Redesign"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Company Name"
            {...register("companyName")}
            error={errors.companyName?.message}
            placeholder="Acme Corp"
          />
          <Input
            label="Contact Name"
            {...register("contactName")}
            error={errors.contactName?.message}
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Deal Value ($)"
            type="number"
            {...register("value", { valueAsNumber: true })}
            error={errors.value?.message}
          />
          <Input
            label="Probability (%)"
            type="number"
            {...register("probability", { valueAsNumber: true })}
            error={errors.probability?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Stage"
            {...register("stage")}
            error={errors.stage?.message}
            options={[
              { label: "New", value: "new" },
              { label: "Qualified", value: "qualified" },
              { label: "Proposal", value: "proposal" },
              { label: "Negotiation", value: "negotiation" },
              { label: "Won", value: "won" },
              { label: "Lost", value: "lost" },
            ]}
          />
          <Input
            label="Expected Close Date"
            type="date"
            {...register("expectedCloseDate")}
            error={errors.expectedCloseDate?.message}
          />
        </div>

        <Select
          label="Assign To"
          placeholder="Select owner"
          {...register("ownerId")}
          error={errors.ownerId?.message}
          options={users.map((u) => ({ label: u.name, value: u.id }))}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Deal</Button>
        </div>
      </form>
    </Modal>
  );
}
