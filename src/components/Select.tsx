import { useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutSide";

export interface SearchSelectOption {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function filterOptions(
  options: SearchSelectOption[],
  search: string
): SearchSelectOption[] {
  const searchLower = search.toLowerCase();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower)
  );
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = filterOptions(options, search);
  const selectedOption = options.find((opt) => opt.value === value);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          className="w-full px-4 py-2 text-left bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700 text-white border-b border-gray-600 rounded-t-lg focus:outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-gray-400">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
