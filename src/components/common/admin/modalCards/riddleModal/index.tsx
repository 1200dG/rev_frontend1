"use client";

import React, { useEffect, useState } from "react";
import { useForm, FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { X, FileText } from "lucide-react";
import Image from "next/image";
import { FileUpload, RiddleModalProps } from "@/lib/types/admin";
import ModalLayout from "../../../Modal";
import { FormFields, InputProps, TextAreaProps, CreateRiddleRequest } from "@/lib/types/common/types";
import { createRiddle, updateRiddle, deleteRiddle } from "@/lib/services/common/adminActions";
import { handleApiError } from "@/lib/errorHandler";

const TextInput: React.FC<InputProps> = ({ label, placeholder, register, name }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-black">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      {...register(name, { required: `${label} is required` })}
      placeholder={placeholder}
      className="w-full h-8 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const TextArea: React.FC<TextAreaProps> = ({ placeholder, register, name }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-black">
      {placeholder} <span className="text-red-500">*</span>
    </label>
    <div className="border border-[#1C1C1C66] rounded-lg bg-white h-[122px]">
      <textarea
        {...register(name, { required: `${placeholder} is required` })}
        placeholder={placeholder}
        className="w-full h-full px-3 py-2 resize-none border-0 rounded-lg bg-transparent text-sm font-semibold text-[#1C1C1C] focus:outline-none"
      />
    </div>
  </div>
);

interface DropdownInputProps<T extends FieldValues> {
  label: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  options: string[];
  errors?: FieldErrors<T>;
}

const DropdownInput = <T extends FieldValues>({
  label,
  register,
  name,
  options,
  errors,
}: DropdownInputProps<T>) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-black">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      {...register(name, { required: `${label} is required` })}
      className="w-full h-8 px-3 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', lineHeight: '1.5' }}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

const FileItem = ({
  file,
  onDelete,
  isLast,
}: {
  file: FileUpload;
  onDelete: (id: string) => void;
  isLast: boolean;
}) => (
  <div className={`flex items-center justify-between py-2 px-3 ${!isLast ? "border-b border-[#DFDFDF]" : ""}`}>
    <div className="flex items-center gap-3">
      <FileText className="w-6 h-6 text-[#E36464]" />
      <span className="text-sm font-medium text-black">{file.name}</span>
    </div>
    <button
      type="button"
      onClick={() => onDelete(file.id)}
      className="text-[#E36464] hover:text-red-700 cursor-pointer"
    >
      <X size={18} />
    </button>
  </div>
);

const UploadArea = ({ onFileUpload, isUploading }: { onFileUpload: (files: FileList) => void; isUploading: boolean }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,text/html,image/svg+xml,text/css,text/javascript,application/javascript,video/mp4,video/webm,video/ogg';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileUpload(files);
      }
    };
    input.click();
  };

  return (
    <div
      className={`bg-[#F7F8FA] border border-dashed border-[#CABFFE] rounded-2xl p-10 h-[209px] flex flex-col items-center justify-center transition-colors ${isUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-[#F0F1F5]'}`}
      onDrop={!isUploading ? handleDrop : undefined}
      onDragOver={!isUploading ? handleDragOver : undefined}
      onClick={!isUploading ? handleClick : undefined}
    >
      <div className="pt-4 flex flex-col items-center space-y-2">
        <div className="bg-transparent flex items-center justify-center">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CABFFE]"></div>
          ) : (
            <Image
              src="/admin/modal-card/upload.svg"
              alt="Upload Icon"
              width={48}
              height={48}
              className="cursor-pointer"
            />
          )}
        </div>
        <div className="text-center mx-13 space-y-3">
          <p className="text-sm font-medium text-black">
            {isUploading ? 'Processing files...' : 'Click or Drop your files here, or Browse'}
          </p>
          {!isUploading && (
            <p className="text-[12px] text-[#33394A] leading-[18px]">
              Recommended image size: 1080 x 780 pixels
              <br />
              Accepted file formats: PNG, HTML, SVG, CSS, JS, MP4, WebM, OGG.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateRiddleModal: React.FC<RiddleModalProps> = ({
  isOpen,
  onClose,
  editData = null,
  mode = 'create',
  onSave,
  onDelete,
  riddles = []
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState({
    form: false,
    files: false,
  });


  // Validation function for level_id uniqueness
  const validateLevelId = (value: string) => {
    if (!value) return "Level ID is required";

    // Must be a positive integer
    if (!/^\d+$/.test(value)) {
      return "Level ID must be a positive integer";
    }

    // Check if level_id already exists (excluding current riddle in edit mode)
    const existingRiddle = riddles.find(riddle =>
      riddle.level_id === value && riddle.level_id !== editData?.level_id
    );

    if (existingRiddle) {
      return "Level ID already exists. Please choose a unique Level ID.";
    }

    return true;
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
    defaultValues: {
      level_id: editData?.level_id || "",
      title: editData?.title || "",
      solution: { answer: editData?.solution.answer || "" },
      hint1: editData?.hint1 || "",
      hint2: editData?.hint2 || "",
      hint3: editData?.hint3 || "",
      type: editData?.type || "",
    },
  });

  React.useEffect(() => {
    if (editData) {
      reset({
        level_id: editData.level_id,
        title: editData.title,
        solution: { answer: editData?.solution.answer },
        hint1: editData.hint1,
        hint2: editData.hint2,
        hint3: editData.hint3,
        type: editData.type || "",
      });

      if (editData.files && editData.files.length > 0) {
        const existingFiles = editData.files.map((fileName, index) => ({
          id: `existing-${index}`,
          name: fileName,
        }));
        setUploadedFiles(existingFiles);
      } else {
        setUploadedFiles([]);
      }
      setActualFiles([]);
    } else {
      reset({
        title: "",
        solution: { answer: "" },
        hint1: "",
        hint2: "",
        hint3: "",
        type: "",
      });
      setUploadedFiles([]);
      setActualFiles([]);
    }
  }, [editData, reset]);
  React.useEffect(() => {
    if (isOpen && mode === 'create') {
      reset({
        title: "",
        solution: { answer: "" },
        hint1: "",
        hint2: "",
        hint3: "",
        type: "",
      });
      setUploadedFiles([]);
      setActualFiles([]);
    }
  }, [isOpen, mode, reset]);

  const validateFiles = (): boolean => {
    const invalidFiles = actualFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      return false;
    }

    const invalidFormatFiles = actualFiles.filter(file =>
      !(file.type === 'image/png' || file.type === 'text/html' || file.type === 'image/svg+xml' || file.type === 'text/css' || file.type === 'text/javascript' || file.type === 'application/javascript' || file.type === 'video/mp4' || file.type === 'video/webm' || file.type === 'video/ogg')
    );
    if (invalidFormatFiles.length > 0) {
      return false;
    }

    return true;
  };

  const onSubmit = async (data: FormFields) => {
    if (!validateFiles()) {
      return;
    }

    setIsLoading(prev => ({ ...prev, form: true }));

    try {
      const riddleData: CreateRiddleRequest = {
        level_id: Number(data.level_id),
        title: data.title,
        solution: JSON.stringify({ answer: data.solution.answer }),
        general_hint: data.hint1,
        intermediate_hint: data.hint2,
        final_hint: data.hint3,
        type: data.type,
      };

      const filesToSend: File[] = uploadedFiles.map((f) => new File([""], f.name, { type: "text/plain" }));
      if (mode === 'edit' && editData && editData.id) {
        await updateRiddle(editData.id, riddleData, filesToSend);
      } else {
        await createRiddle(riddleData, actualFiles);
      }

      setIsLoading(prev => ({ ...prev, form: false }));
      onClose();
      if (onSave) {
        onSave();
      }
    } catch (err: unknown) {
      setIsLoading(prev => ({ ...prev, form: false }));
      onClose();
      if (onSave) {
        onSave();
      }
      handleApiError(err, "Failed to save riddle. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!editData?.level_id || !editData?.id) return;

    const confirmed = window.confirm("Are you sure you want to delete this riddle?");
    if (!confirmed) return;

    setIsLoading(prev => ({ ...prev, form: true }));

    try {
      await deleteRiddle(editData.id);
    } catch (err: unknown) {
      handleApiError(err)
    }

    setIsLoading(prev => ({ ...prev, form: false }));
    onClose();
    if (onDelete) {
      onDelete(editData.level_id);
    }
  };

  const handleFileDelete = (id: string) => {
    const fileIndex = uploadedFiles.findIndex((file) => file.id === id);
    if (fileIndex !== -1) {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
      setActualFiles((prev) => prev.filter((_, index) => index !== fileIndex));
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsLoading(prev => ({ ...prev, files: true }));

    try {
      const validFiles: File[] = [];
      const fileDisplays: FileUpload[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          continue;
        }

        if (file.type === 'image/png' || file.type === 'text/html' || file.type === 'image/svg+xml' || file.type === 'text/css' || file.type === 'text/javascript' || file.type === 'application/javascript' || file.type === 'video/mp4' || file.type === 'video/webm' || file.type === 'video/ogg') {
          const newFile: FileUpload = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
            name: file.name,
          };
          fileDisplays.push(newFile);
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...fileDisplays]);
        setActualFiles((prev) => [...prev, ...validFiles]);
      }
    } catch (error) {
    } finally {
      setIsLoading(prev => ({ ...prev, files: false }));
    }
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      header={
        <h2 className="text-[18px] font-circular font-bold text-[#16182A]">
          {mode === 'edit' ? 'Edit Riddle' : 'Create Riddle'}
        </h2>
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading.form}
            className="px-6 py-3 border border-black text-[#16182A] font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading.form ? 'Please Wait...' : 'Cancel'}
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading.form}
            className="px-6 py-3 bg-[#22222C] text-white font-medium text-sm hover:bg-[#454F5B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading.form ? (mode === 'edit' ? 'Updating...' : 'Creating...') : 'Save'}
          </button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-[#FAFAFA] space-y-4"
      >

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">
              Level ID <span className="text-red-500">*</span>
            </label>
            <input
              {...register("level_id", {
                required: "Level ID is required",
                validate: validateLevelId
              })}
              placeholder="Level ID"
              className="w-full h-8 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.level_id && (
              <p className="text-red-500 text-xs mt-1">{errors.level_id.message}</p>
            )}
          </div>
          <TextInput label="Title" placeholder="Title" register={register} name="title" />
          <TextInput label="Solution" placeholder="Solution" register={register} name="solution.answer" />
          <DropdownInput
            label="Riddle Type"
            register={register}
            name="type"
            options={["TEXT_MATCH", "DYNAMIC_MATCH", "CLICK_ACTION", "URL_ACTION"]}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <TextArea placeholder="Hint 1" register={register} name="hint1" />
          <TextArea placeholder="Hint 2" register={register} name="hint2" />
          <TextArea placeholder="Hint 3" register={register} name="hint3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F7F8FA] border border-dashed border-[#CABFFE] rounded-2xl h-[209px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-1">
              {uploadedFiles.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-[#33394A] opacity-60">No files uploaded yet</p>
                </div>
              ) : (
                uploadedFiles.map((file, index) => {
                  if (!file || typeof file !== 'object' || !file.id || !file.name) {
                    return null;
                  }
                  return (
                    <FileItem
                      key={file.id}
                      file={file}
                      onDelete={handleFileDelete}
                      isLast={index === uploadedFiles.length - 1}
                    />
                  );
                })
              )}
            </div>
          </div>
          <UploadArea onFileUpload={handleFileUpload} isUploading={isLoading.files} />
        </div>
      </form>
    </ModalLayout>
  );
};

export default CreateRiddleModal;
