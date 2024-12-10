import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the toaster's state
interface ToasterState {
  message: string;
  isVisible: boolean;
  variant: "success" | "error" | "info"; // or other variants if needed
}

// Define the context structure
interface ToasterContextProps {
  toaster: ToasterState;
  showToaster: (
    message: string,
    variant?: "success" | "error" | "info"
  ) => void;
  hideToaster: () => void;
}

// Create the context
const ToasterContext = createContext<ToasterContextProps | undefined>(
  undefined
);

// Custom hook to use the ToasterContext
export const useToaster = (): ToasterContextProps => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};

// Provider component
export const ToasterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toaster, setToaster] = useState<ToasterState>({
    message: "",
    isVisible: false,
    variant: "info",
  });

  const showToaster = (
    message: string,
    variant: "success" | "error" | "info" = "info"
  ) => {
    setToaster({ message, isVisible: true, variant });
    setTimeout(() => hideToaster(), 3000);
  };

  const hideToaster = () => {
    setToaster({ message: "", isVisible: false, variant: "info" });
  };

  return (
    <ToasterContext.Provider value={{ toaster, showToaster, hideToaster }}>
      {children}
    </ToasterContext.Provider>
  );
};
