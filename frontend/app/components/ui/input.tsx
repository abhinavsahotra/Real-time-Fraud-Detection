import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function Input({
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      )}

      <input
        data-slot="input"
        className={`h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${
          icon ? "pl-10" : ""
        } ${className}`}
        {...props}
      />
    </div>
  );
}

export { Input };