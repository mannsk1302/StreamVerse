import * as React from "react";
import { cn } from "@/lib/utils";

export const Sheet = ({ open, onClose, side = "right", children, width = "w-full sm:w-96" }: {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  children: React.ReactNode;
  width?: string;
}) => {
  if (!open) return null;
  const pos = side === "left" ? "left-0" : "right-0";
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn("absolute top-0 bottom-0 bg-white shadow-lg p-4 overflow-auto", pos, width)}>
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
