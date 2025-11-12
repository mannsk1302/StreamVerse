import { Toaster, toast as sonnerToast } from "sonner";
import * as React from "react";

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // place <ToastProvider /> at top-level if you want, or just use Toaster in RootLayout
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
};

// re-export simple helpers
export const toast = {
  success: (msg: string) => sonnerToast.success(msg),
  error: (msg: string) => sonnerToast.error(msg),
  info: (msg: string) => sonnerToast(msg),
  promise: sonnerToast.promise,
};
