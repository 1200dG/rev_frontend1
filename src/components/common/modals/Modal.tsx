import { ModalProps } from "@/lib/types/common/types";
import Image from "next/image";

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  title,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto">
      <div className="relative w-full max-w-md px-3 py-2 rounded-lg shadow-lg drop-shadow-lg bg-[#935d2f]">
        <div className="flex justify-between">
          {title && <h2 className="text-xl text-white font-medium">{title}</h2>}
          <Image
            src="faqs/xmark.svg"
            alt="Close Icon"
            onClick={onClose}
            className="cursor-pointer"
            height={24}
            width={24}
          />
        </div>
        <div className="flex flex-col items-center gap-4 mt-2 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
