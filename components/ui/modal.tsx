// components/ui/modal.tsx
import { ReactNode, useEffect } from "react";

type ModalSize =
  | "sm-center"
  | "lg-center"
  | "half-right"
  | "half-left"
  | "third-right"
  | "fullscreen";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
  title?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  "sm-center":
    "w-full max-w-sm mx-auto my-auto rounded-lg",
  "lg-center":
    "w-full max-w-2xl mx-auto my-auto rounded-lg",
  "half-right":
    "w-1/2 h-full ml-auto rounded-l-lg",
  "half-left":
    "w-1/2 h-full mr-auto rounded-r-lg",
  "third-right":
    "w-1/3 h-full ml-auto rounded-l-lg",
  fullscreen:
    "w-full h-full m-0 rounded-none",
};

export const Modal = ({
  open,
  onClose,
  size = "sm-center",
  children,
  className = "",
  title,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const labelId = title ? "modal-title" : undefined;

  return (
    <div
      className="!mt-0 fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      {...(labelId ? { "aria-labelledby": labelId } : { "aria-label": "Modal" })}
    >
      <div
        className={`bg-white p-8 shadow-xl ${sizeClasses[size]} ${className} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {title && (
          <h2 id={labelId} className="text-lg font-semibold mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
