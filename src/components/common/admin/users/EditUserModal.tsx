import { EditUserData, EditUserModalProps, UserApiData } from "@/lib/types/common/types"
import React, { useEffect, useState, useRef } from "react"
import ModalLayout from "../../Modal";
import { useForm } from "react-hook-form";
import { updateUser } from "@/lib/services/common/adminActions";

const EditUserModal: React.FC<EditUserModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedUserData,
  fetchUsers,
}) => {

  const [isLoading, setIsLoading] = useState({ form: false });
  const { register, handleSubmit, reset, setValue, watch, formState:{errors} } = useForm<EditUserData>({
    defaultValues: {
      role: "USER",
      lives: 0,
      credits: 0,
    },
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const role = watch("role");

  const roleOptions: Array<"USER" | "CREATOR"> = ["USER", "CREATOR"];

  useEffect(() => {
    if (selectedUserData) {
      reset({
        role: selectedUserData.role as "USER" | "CREATOR",
        lives: selectedUserData.lives,
        credits: selectedUserData.credits,
      });
    }
  }, [selectedUserData, reset]);

  const onSubmit = async (data: EditUserData) => {
    setIsLoading((prev) => ({ ...prev, form: true }));

    try {
      if (!selectedUserData?.id) return;

      const payload: Partial<UserApiData> = {
        role: data.role,
        lives: Number(data.lives),
        credits: Number(data.credits),
      };

      await updateUser(selectedUserData.id, payload);
      setIsLoading((prev) => ({ ...prev, form: false }));
      onClose();
      fetchUsers();
    } catch (error) {
      setIsLoading((prev) => ({ ...prev, form: false }));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <ModalLayout
          isOpen={isOpen}
          onClose={onClose}
          header={<h2 className="text-[18px] font-circular font-bold text-[#16182A]"> Edit User </h2>}
          footer={
              <>
                  <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading.form}
                      className="px-6 py-3 border border-black text-[#16182A] font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Cancel
                  </button>
                  <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading.form}
                      className="px-6 py-3 bg-[#22222C] text-white  font-medium text-medium hover:bg-[#454F5B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isLoading.form ? "Updating..." : "Save"}
                  </button>
              </>
          }
      >
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-[#FAFAFA] space-y-3">
              <div className="flex flex-col gap-3 sm:gap-3 w-full">
                  {/* Username & Email */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="space-y-1">
                          <label className="block text-sm font-medium text-black"> User Name </label>
                          <input
                              {...register("username")}
                              value={selectedUserData?.username}
                              placeholder="------"
                              disabled
                              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-gray-100 text-[#33394A] shadow cursor-not-allowed"
                          />
                      </div>
                      <div className="space-y-1 flex-1">
                          <label className="block text-base font-medium text-black"> Email </label>
                          <input
                              {...register("email")}
                              value={selectedUserData?.email}
                              disabled
                              placeholder="Enter email"
                              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-gray-100 text-[#33394A] shadow cursor-not-allowed"
                          />
                      </div>
                  </div>

                  {/* Custom Role Dropdown & Lives */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="space-y-1">
                          <label className="block text-sm font-medium text-black"> Role </label>
                          <div className="relative w-full" ref={dropdownRef}>
                              <div
                                  onClick={() => setDropdownOpen(!dropdownOpen)}
                                  className="w-full border border-[#919EAB52] border-opacity-30 cursor-pointer rounded-lg bg-transparent flex items-center justify-between px-3 py-2"
                              >
                                  <span className="text-base font-medium text-[#212B36]">{role}</span>
                                  <svg
                                      className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                              </div>

                              {dropdownOpen && (
                                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#919EAB52] border-opacity-30 rounded-lg shadow-lg z-50">
                                      {roleOptions.map((option) => (
                                          <div
                                              key={option}
                                              className="px-3 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center"
                                              onClick={() => {
                                                  setValue("role", option);
                                                  setDropdownOpen(false);
                                              }}
                                          >
                                              {option}
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="space-y-1 flex-1">
                          <label className="block text-base font-medium text-black"> Lives </label>
                          <input
                              {...register("lives", {
                                  min: {
                                      value: 0,
                                      message: "Only positive numbers allowed",
                                  },
                                  valueAsNumber: true,
                              })}
                              placeholder="Enter Lives"
                              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.lives && <p className="text-red-500 text-xs">{errors.lives.message}</p>}
                      </div>
                  </div>

                  {/* Credits & Total XP */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="space-y-1">
                          <label className="block text-sm font-medium text-black"> Credits </label>
                          <input
                              {...register("credits", {
                                  min: {
                                      value: 0,
                                      message: "Only positive numbers allowed",
                                  },
                                  valueAsNumber: true,
                              })}
                              placeholder="Enter Credits"
                              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.credits && <p className="text-red-500 text-xs">{errors.credits.message}</p>}
                      </div>
                      <div className="space-y-1 flex-1">
                          <label className="block text-base font-medium text-black"> Total XP Earned </label>
                          <input
                              {...register("totalXPEarned")}
                              placeholder={selectedUserData?.total_xp_earned?.toString()}
                              disabled
                              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-gray-100 text-[#33394A] shadow cursor-not-allowed"
                          />
                      </div>
                  </div>

                  {/* Account Id */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="space-y-1">
                          <label className="block text-sm font-medium text-black"> Account Id </label>
                          <input
                              {...register("Account_id")}
                              placeholder={selectedUserData?.account_id?.toString()}
                              disabled
                              className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-gray-100 text-[#33394A] shadow cursor-not-allowed"
                          />
                      </div>
                  </div>
              </div>
          </form>
      </ModalLayout>
  );
});

EditUserModal.displayName = 'EditUserModal';
export default EditUserModal;
