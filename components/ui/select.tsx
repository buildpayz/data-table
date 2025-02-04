import * as React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  /**
   * Either provide an array of options...
   */
  options?: Option[];
  /**
   * ...or pass your own option elements as children.
   */
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  children,
}) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    </div>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export const SelectValue: React.FC = () => {
  return null; // Handled by <select>
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  return <option value={value}>{children}</option>;
};
