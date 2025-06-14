import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export default function SelectDropdown({
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
      {/* dropdown button */}
      <button
        className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="ml-2">
          {isOpen ? <LuChevronUp /> : <LuChevronDown />}
        </span>
      </button>

      {/* dropdown menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
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
