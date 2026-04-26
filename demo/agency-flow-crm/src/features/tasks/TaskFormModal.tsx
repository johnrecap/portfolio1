import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../utils/cn";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useCRMStore } from "../../store/crmStore";
import { Task } from "../../types/crm";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedToId: z.string().min(1, "Assignee is required"),
  relatedClientId: z.string().optional(),
  relatedDealId: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskFormModal({ isOpen, onClose }: TaskFormModalProps) {
  const { addTask, users, clients, deals } = useCRMStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignedToId: "",
      relatedClientId: "",
      relatedDealId: "",
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    addTask({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate).toISOString(),
      priority: data.priority,
      status: "todo",
      assignedToId: data.assignedToId,
      relatedClientId: data.relatedClientId || undefined,
      relatedDealId: data.relatedDealId || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          {...register("title")}
          error={errors.title?.message}
          placeholder="Enter task title"
        />

        <div className="flex flex-col gap-1 w-full">
          <label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            className={cn(
              "flex min-h-[80px] w-full rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-body-main placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-shadow",
              errors.description && "border-error focus-visible:ring-error/20"
            )}
            placeholder="Add additional details..."
          />
          {errors.description && <span className="text-[12px] font-medium text-error mt-0.5">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            {...register("priority")}
            error={errors.priority?.message}
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Urgent", value: "urgent" },
            ]}
          />
          <Input
            label="Due Date"
            type="datetime-local"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />
        </div>

        <Select
          label="Assign To"
          placeholder="Select assignee"
          {...register("assignedToId")}
          error={errors.assignedToId?.message}
          options={users.map((u) => ({ label: u.name, value: u.id }))}
        />

        <div className="border-t border-[#E2E8F0] pt-4 mt-2">
          <h4 className="font-label-bold text-on-surface-variant uppercase tracking-wider mb-3">Relations (Optional)</h4>
          <div className="space-y-4">
            <Select
              label="Related Client"
              {...register("relatedClientId")}
              error={errors.relatedClientId?.message}
              options={[
                { label: "-- None --", value: "" },
                ...clients.map((c) => ({ label: c.companyName, value: c.id })),
              ]}
            />
            <Select
              label="Related Deal"
              {...register("relatedDealId")}
              error={errors.relatedDealId?.message}
              options={[
                { label: "-- None --", value: "" },
                ...deals.map((d) => ({ label: d.title, value: d.id })),
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
