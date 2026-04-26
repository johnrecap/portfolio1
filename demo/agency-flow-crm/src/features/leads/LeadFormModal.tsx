import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useCRMStore } from "../../store/crmStore";

const leadSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  source: z.enum(["website", "referral", "linkedin", "cold_outreach", "event"]),
  status: z.enum(["new", "contacted", "qualified", "proposal_sent", "lost"]),
  estimatedValue: z.number().min(0, "Value must be positive"),
  ownerId: z.string().min(1, "Owner is required"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const { addLead, users } = useCRMStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      source: "website",
      status: "new",
      estimatedValue: 0,
      ownerId: "",
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    addLead(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register("fullName")}
            error={errors.fullName?.message}
            placeholder="John Doe"
          />
          <Input
            label="Company Name"
            {...register("companyName")}
            error={errors.companyName?.message}
            placeholder="Acme Corp"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="john@acme.com"
          />
          <Input
            label="Phone Number"
            {...register("phone")}
            error={errors.phone?.message}
            placeholder="+1 555-0199"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Source"
            {...register("source")}
            error={errors.source?.message}
            options={[
              { label: "Website", value: "website" },
              { label: "Referral", value: "referral" },
              { label: "LinkedIn", value: "linkedin" },
              { label: "Cold Outreach", value: "cold_outreach" },
              { label: "Event", value: "event" },
            ]}
          />
          <Select
            label="Initial Status"
            {...register("status")}
            error={errors.status?.message}
            options={[
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Qualified", value: "qualified" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Estimated Value"
            type="number"
            {...register("estimatedValue", { valueAsNumber: true })}
            error={errors.estimatedValue?.message}
          />
          <Select
            label="Assign To"
            placeholder="Select owner"
            {...register("ownerId")}
            error={errors.ownerId?.message}
            options={users.map((u) => ({ label: u.name, value: u.id }))}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Lead</Button>
        </div>
      </form>
    </Modal>
  );
}
