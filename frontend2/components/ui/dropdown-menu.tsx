import * as React from "react";

interface DropdownProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownProps) => <div className="relative inline-block">{children}</div>;

export const DropdownMenuTrigger = ({ children }: DropdownProps) => (
  <div className="cursor-pointer">{children}</div>
);

export const DropdownMenuContent = ({ children, align = "end" }: { children: React.ReactNode; align?: "start" | "end" }) => (
  <div
    className={`absolute mt-2 bg-white border border-gray-200 rounded-md shadow-md z-50 ${
      align === "end" ? "right-0" : "left-0"
    }`}
  >
    {children}
  </div>
);

export const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
  >
    {children}
  </div>
);
