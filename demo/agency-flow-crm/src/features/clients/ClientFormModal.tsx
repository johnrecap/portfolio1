import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useCRMStore } from "../../store/crmStore";

const clientSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  industry: z.string().min(1, "Industry is required"),
  monthlyRetainer: z.number().min(0, "Value must be positive"),
  health: z.enum(["healthy", "needs_attention", "at_risk"]),
  ownerId: z.string().min(1, "Owner is required"),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClientFormModal({ isOpen, onClose }: ClientFormModalProps) {
  const { addClient, users } = useCRMStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      industry: "",
      monthlyRetainer: 0,
      health: "healthy",
      ownerId: "",
    },
  });

  const onSubmit = (data: ClientFormValues) => {
    addClient(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="john@acme.com"
          />
          <Input
            label="Industry"
            {...register("industry")}
            error={errors.industry?.message}
            placeholder="Technology, Real Estate..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Monthly Retainer"
            type="number"
            {...register("monthlyRetainer", { valueAsNumber: true })}
            error={errors.monthlyRetainer?.message}
          />
          <Select
            label="Health Status"
            {...register("health")}
            error={errors.health?.message}
            options={[
              { label: "Healthy", value: "healthy" },
              { label: "Needs Attention", value: "needs_attention" },
              { label: "At Risk", value: "at_risk" },
            ]}
          />
        </div>

        <Select
          label="Account Manager"
          placeholder="Select manager"
          {...register("ownerId")}
          error={errors.ownerId?.message}
          options={users.map((u) => ({ label: u.name, value: u.id }))}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Client</Button>
        </div>
      </form>
    </Modal>
  );
}
