import { useId } from 'react';

interface OptionGroupOption<T extends string> {
  value: T;
  label: string;
}

interface OptionGroupProps<T extends string> {
  label: string;
  options: OptionGroupOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
  optional?: boolean;
  columns?: 2 | 3;
}

export default function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  optional,
  columns = 2,
}: OptionGroupProps<T>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="text-sm font-medium text-charcoal">
          {label}
          {optional && (
            <span className="ml-1.5 text-xs font-normal text-secondary-text/70">
              Optional
            </span>
          )}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label={label}
        aria-describedby={error ? errorId : undefined}
        className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/30 ${
                isSelected
                  ? 'border-sage bg-sage/8 text-charcoal'
                  : 'border-warm-border bg-ivory text-secondary-text hover:border-sage/40 hover:bg-beige/40'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
