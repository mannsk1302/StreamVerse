import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg";
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size = "md", src, alt, fallback, className, ...props }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  return (
    <div className={cn("rounded-full overflow-hidden bg-gray-100 flex items-center justify-center", sizes[size], className)}>
      {src ? (
        <img src={src} alt={alt} {...props} className="object-cover w-full h-full" />
      ) : (
        <span className="text-sm text-gray-600">{fallback || (alt ? alt.charAt(0).toUpperCase() : "?")}</span>
      )}
    </div>
  );
};

export default Avatar;
