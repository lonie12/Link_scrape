import { useToaster } from "../context/toastContext";

const Toaster = () => {
  const { toaster } = useToaster();

  if (!toaster.isVisible) return null;
  return (
    <div
      className={`fixed top-3 right-3 z-10 shadow-sm flex items-center gap-2 mb-2 border rounded-sm px-3 py-2 ${
        toaster.variant == "success"
          ? "text-[#16a34a] border-[#16a34a] bg-[#dcfce7]"
          : "text-[#dc2626] border-[#dc2626] bg-[#fee2e2]"
      }`}
    >
      <span className="font-medium">{toaster.message}</span>
    </div>
  );
};

export default Toaster;
