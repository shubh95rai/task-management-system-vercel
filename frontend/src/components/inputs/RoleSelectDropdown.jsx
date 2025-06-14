import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export default function RoleSelectDropdown({
  options,
  value,
  onChange,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(option) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className="relative w-full">
      <label className="text-sm text-slate-800">{placeholder}</label>
      {/* dropdown button */}
      <div
        className="w-full flex justify-between items-center gap-3 text-sm  bg-slate-100/50 rounded px-4 py-3 mb-4 mt-3 border border-slate-200 outline-none text-gray-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="ml-2">
          {isOpen ? <LuChevronUp /> : <LuChevronDown />}
        </span>
      </div>

      {/* dropdown menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-slate-100 rounded-md -mt-2 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => {
                // setIsOpen(false);
                handleSelect(option.value);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
