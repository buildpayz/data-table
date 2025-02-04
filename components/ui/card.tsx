/*eslint-disable*/
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("border rounded-lg shadow-md p-4 bg-white", className)} {...props} />
  );
});

Card.displayName = "Card";
