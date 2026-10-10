import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'prefix'> {
  label: string;
  error?: string;
  optional?: boolean;
  prefix?: ReactNode;
  hint?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, optional, prefix, hint, className = '', ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className={className}>
        <div className="flex items-baseline justify-between mb-2">
          <label
            htmlFor={id}
            className="text-sm font-medium text-charcoal"
          >
            {label}
            {optional && (
              <span className="ml-1.5 text-xs font-normal text-secondary-text/70">
                Optional
              </span>
            )}
          </label>
        </div>

        <div
          className={`relative flex items-center rounded-xl border bg-ivory transition-all duration-200 ${
            error
              ? 'border-red-400 focus-within:border-red-500'
              : 'border-warm-border focus-within:border-sage'
          } focus-within:ring-2 focus-within:ring-sage/15`}
        >
          {prefix && (
            <span className="pl-3.5 text-sm font-medium text-secondary-text select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full bg-transparent px-3.5 py-3 text-sm text-charcoal placeholder:text-secondary-text/50 focus:outline-none ${
              prefix ? 'pl-2' : ''
            }`}
            {...props}
          />
        </div>

        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 text-xs text-secondary-text/70">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
