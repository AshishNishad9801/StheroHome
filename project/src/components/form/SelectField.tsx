import { useId } from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  optional?: boolean;
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  optional,
  placeholder = 'Select an option',
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor={id} className="text-sm font-medium text-charcoal">
          {label}
          {optional && (
            <span className="ml-1.5 text-xs font-normal text-secondary-text/70">
              Optional
            </span>
          )}
        </label>
      </div>

      <div
        className={`relative rounded-xl border bg-ivory transition-all duration-200 ${
          error
            ? 'border-red-400 focus-within:border-red-500'
            : 'border-warm-border focus-within:border-sage'
        } focus-within:ring-2 focus-within:ring-sage/15`}
      >
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="w-full appearance-none bg-transparent px-3.5 py-3 text-sm text-charcoal focus:outline-none cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
