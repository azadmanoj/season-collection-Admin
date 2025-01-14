import { useRouter } from "next/navigation";
import React from "react";
import Loader from "../common/Loader";

const Modal = ({
  isOpen,
  closeModal,
  title,
  message,
  actionLabel,
  actionHandler,
  redirectTo,
}: any) => {
  // Ensure the router is available before using it
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-center text-xl font-semibold">{title}</h3>
        <p className="mb-4 text-center">{message}</p>

        <div className="flex justify-center gap-4">
          {/* Close Modal Button */}
          <button
            onClick={closeModal}
            className="rounded-lg bg-[#dc5f62] px-6 py-2 text-white"
          >
            Close
          </button>

          {/* Action Button */}
          <button
            onClick={() => {
              actionHandler(); // Trigger action handler (Add to Cart / Wishlist)
              closeModal();
              if (redirectTo) router.push(redirectTo); // Close the modal
            }}
            className="rounded-lg bg-[#ffcdd6] px-6 py-2 text-[#dc5f62]"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
