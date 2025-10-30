import { cn } from "../../lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export function Card({ className, animate = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300",
        animate && "animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
