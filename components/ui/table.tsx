"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
  return <table className={cn("w-full border-collapse rounded-lg overflow-hidden", className)} {...props} />;
};

export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className={cn("bg-gray-100", className)} {...props} />;
};

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return <tr ref={ref} className={cn("border-b last:border-b-0", className)} {...props} />;
  }
);

TableRow.displayName = "TableRow";

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return <th className={cn("p-3 text-left text-gray-700 font-medium", className)} {...props} />;
};

export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody className={cn("bg-white", className)} {...props} />;
};

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return <td className={cn("p-3", className)} {...props} />;
};
