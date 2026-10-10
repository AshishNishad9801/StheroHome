import { useEffect, useRef, useState, useId } from 'react';
import { Search, Check, X } from 'lucide-react';

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  cities: string[];
  error?: string;
  label: string;
  required?: boolean;
}

export default function CitySelector({
  value,
  onChange,
  cities,
  error,
  label,
  required,
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const errorId = `${id}-error`;
  const listboxId = `${id}-listbox`;

  const filteredCities = query.trim()
    ? cities.filter((c) => c.toLowerCase().includes(query.toLowerCase().trim()))
    : cities;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    onChange(city);
    setQuery('');
    setOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) => Math.min(prev + 1, filteredCities.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && open && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredCities[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showQueryInput = open || !value;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-charcoal"
        >
          {label}
          {required && <span className="ml-0.5 text-sage">*</span>}
        </label>
      </div>

      <div ref={containerRef} className="relative">
        {showQueryInput ? (
          <div
            className={`relative flex items-center rounded-xl border bg-ivory transition-all duration-200 ${
              error
                ? 'border-red-400 focus-within:border-red-500'
                : 'border-warm-border focus-within:border-sage'
            } focus-within:ring-2 focus-within:ring-sage/15`}
          >
            <Search className="ml-3.5 h-4 w-4 text-secondary-text/60 shrink-0" />
            <input
              ref={inputRef}
              id={id}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setHighlightIndex(-1);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search or type your city..."
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              aria-expanded={open}
              aria-controls={listboxId}
              role="combobox"
              autoComplete="off"
              className="w-full bg-transparent px-2.5 py-3 text-sm text-charcoal placeholder:text-secondary-text/50 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="pr-3 text-secondary-text/50 hover:text-secondary-text"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setQuery('');
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className={`w-full flex items-center justify-between rounded-xl border bg-ivory px-3.5 py-3 text-sm text-charcoal transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/30 ${
              error ? 'border-red-400' : 'border-warm-border hover:border-sage/40'
            }`}
          >
            <span>{value}</span>
            <Search className="h-4 w-4 text-secondary-text/50" />
          </button>
        )}

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-30 mt-2 w-full max-h-56 overflow-y-auto rounded-xl border border-warm-border bg-ivory shadow-lg py-1.5"
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city, i) => (
                <li key={city} role="option" aria-selected={value === city}>
                  <button
                    type="button"
                    onClick={() => handleSelect(city)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left transition-colors ${
                      i === highlightIndex
                        ? 'bg-beige text-charcoal'
                        : 'text-secondary-text hover:bg-beige/50'
                    }`}
                  >
                    {city}
                    {value === city && <Check className="h-4 w-4 text-sage" />}
                  </button>
                </li>
              ))
            ) : (
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect(query.trim())}
                  className="w-full px-3.5 py-2.5 text-sm text-left text-charcoal hover:bg-beige/50"
                >
                  Use "{query.trim()}"
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
