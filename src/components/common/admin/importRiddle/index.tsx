"use client";

import { handleApiError } from "@/lib/errorHandler";
import { importRiddles } from "@/lib/services/common/adminActions";
import { ImportRiddlesProps } from "@/lib/types/common/types";
import { X } from "lucide-react";
import { getSession } from "next-auth/react";
import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";

const ImportRiddles: React.FC<ImportRiddlesProps> = React.memo(({ onClose, onDataChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleFile = useCallback((selectedFile: File) => {
    setError("");

    if (selectedFile.type !== "application/zip") {
      setError("Only Zip files are allowed");
      return;
    }

    setFile(selectedFile);
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!file) return;

  setLoading(true);
  setError("");

  try {
    const session = await getSession();
    const accessToken = session?.user?.access_token;

    if (!accessToken) throw new Error("Unauthorized");

    await importRiddles({
      zip_file: file,
      accessToken,
    });

    toast.success("Riddles uploaded successfully!");
    await onDataChange?.();
    setFile(null);
    onClose();
  } catch (err) {
    handleApiError(err || "Something went wrong!");
  } finally {
    setLoading(false);
  }
};
   

  return (
    <div className="w-full fixed inset-0 z-9999 h-screen p-3 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="w-full max-w-lg bg-[#F3F3F3] rounded-2xl p-8 shadow-xl border border-black/30 flex flex-col items-center justify-center z-10">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-black mb-2">Import Riddles</h2>
            <p className="text-sm text-black mb-6 text-center"> Upload a Zip Folder containing your riddles </p>
          </div>
          <button onClick={onClose} className="top-4 right-4 text-black/60 hover:text-black cursor-pointer transition" >
            <X size={22} />
          </button>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative w-full h-52 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
            ${isDragging ? "bg-black/5" : "border-black/40 hover:border-black/60"}`}
        >
          <input
            type="file"
            accept=".zip"
            onChange={onFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center text-3xl">
            📄
          </div>

          <div className="text-center">
            <p className="text-black font-medium text-lg"> Drag & drop your Zip Folder </p>
            <p className="text-sm text-black/60"> or click to browse </p>
          </div>
        </div>

        {error && (<p className="mt-3 text-sm text-red-400">{error}</p>)}

        {file && (
          <div className="mt-5 w-full flex items-center justify-between rounded-lg bg-black/10 p-4">
            <div>
              <p className="text-black font-medium">{file.name}</p>
              <p className="text-xs text-black/60"> {(file.size / 1024).toFixed(2)} KB </p>
            </div>

            <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 transition cursor-pointer" >
              Remove
            </button>
          </div>
        )}

        <button
          disabled={!file || loading}
          onClick={handleUpload}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition
            ${file && !loading ? "bg-black text-white hover:opacity-90" : "bg-black/30 text-[#1E120B]/50 cursor-not-allowed"}`}
        >
          {loading ? "Uploading..." : "Import Zip Folder"}
        </button>
      </div>
    </div>
  );
});

ImportRiddles.displayName = "ImportRiddles";

export default ImportRiddles;
