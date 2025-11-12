import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export const Tabs: React.FC<{ tabs: Tab[]; defaultTab?: string; className?: string }> = ({ tabs, defaultTab, className }) => {
  const [active, setActive] = React.useState<string>(defaultTab || tabs[0].id);
  const activeTab = tabs.find(t => t.id === active) || tabs[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "px-3 py-2 -mb-px rounded-t",
              active === t.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-800"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{activeTab.content}</div>
    </div>
  );
};
