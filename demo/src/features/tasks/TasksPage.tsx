import { useState } from "react";
import { CheckSquare, Plus, Check } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useCRMStore } from "../../store/crmStore";
import { formatDistanceToNow } from "date-fns";
import { TaskFormModal } from "./TaskFormModal";
import { useTranslation } from "react-i18next";

export default function TasksPage() {
  const { tasks, completeTask } = useCRMStore();
  const [filter, setFilter] = useState<"all" | "todo" | "completed">("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { t } = useTranslation();

  const filteredTasks = tasks.filter((t) => filter === "all" || t.status === filter);

  return (
    <div className="p-container-padding flex flex-col h-full gap-stack-md max-w-[800px] mx-auto">
      <div className="flex justify-between items-center mb-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex gap-4">
          {(["all", "todo", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-label-bold text-label-bold pb-2 px-1 border-b-2 transition-colors ${
                filter === f ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              {t(`tasks.${f}`)}
            </button>
          ))}
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsTaskModalOpen(true)}>
          <Plus className="w-4 h-4" /> {t('tasks.newTask')}
        </Button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-natural overflow-hidden">
        <div className="divide-y divide-[#E2E8F0]">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-surface-bright transition-colors group">
              <button 
                onClick={() => completeTask(task.id)}
                disabled={task.status === "completed"}
                className={`mt-1 w-5 h-5 rounded flex justify-center items-center shrink-0 border transition-colors ${
                  task.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-outline-variant hover:border-primary"
                }`}
              >
                {task.status === "completed" && <Check className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1">
                <h4 className={`font-body-main font-semibold ${task.status === "completed" ? "text-outline-variant line-through" : "text-primary"}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="font-body-sm text-on-surface-variant mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="font-body-sm text-outline-variant">
                    {t('tasks.due')}: {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                  </span>
                  <Badge variant={task.priority === "urgent" || task.priority === "high" ? "error" : "secondary"} className="uppercase text-[10px]">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
             <div className="p-8 text-center text-on-surface-variant font-body-main">
               {t('tasks.noTasks')}
             </div>
          )}
        </div>
      </div>
      
      <TaskFormModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
    </div>
  );
}
