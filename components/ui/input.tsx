/*eslint-disable*/
"use client";
import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 transition-all ${
        className || ""
      }`}
      {...props}
    />
  );
});

Input.displayName = "Input";

