import ModalLayout from "@/components/common/Modal";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { DailyRiddleFormData } from "@/lib/types/admin";

interface DailyRiddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: DailyRiddleFormData) => void | Promise<void>;
  initialData?: DailyRiddleFormData | null;
}

const DailyRiddleModal: React.FC<DailyRiddleModalProps> = ({ isOpen, onClose, onSave, initialData, }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DailyRiddleFormData>({ defaultValues: { date: "", riddle: null } });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ date: "", riddle: null });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset({ date: "", riddle: null });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: DailyRiddleFormData) => {
    if (onSave) await onSave(data);
    reset();
    onClose();
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      header={
        <h2 className="text-[18px] font-circular font-bold text-[#16182A]">
          {initialData ? "Edit Daily Riddle" : "Add Daily Riddle"}
        </h2>
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-black text-[#16182A] font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-3 bg-[#22222C] text-white font-medium text-sm hover:bg-[#454F5B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? "Update" : "Save"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">Choose Date</label>
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-red-500 text-xs">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">Level ID</label>
            <input
              {...register("riddle", { required: "Level ID is required", valueAsNumber: true })}
              type="number"
              placeholder="Level ID"
              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.riddle && (
              <p className="text-red-500 text-xs">{errors.riddle.message}</p>
            )}
          </div>
        </div>
      </form>
    </ModalLayout>
  );
};

export default DailyRiddleModal;
