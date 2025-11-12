import * as React from "react";

export const Separator: React.FC<{ vertical?: boolean; className?: string }> = ({ vertical, className }) => {
  if (vertical) return <div className={["w-px bg-gray-200", className].filter(Boolean).join(" ")} />;
  return <div className={["h-px bg-gray-200 w-full", className].filter(Boolean).join(" ")} />;
};

export default Separator;
