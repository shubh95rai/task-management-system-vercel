import { IoClose } from "react-icons/io5";

export default function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 right-0 w-full z-50 flex justify-center items-center h-[calc(100vh)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20">
      <div className="relative w-full max-w-2xl max-h-full p-4">
        {/* model content */}

        <div className="relative bg-white shadow-sm rounded-lg">
          {/* modal header */}

          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>

            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm size-8 inline-flex items-center justify-center cursor-pointer"
              onClick={onClose}
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* modal body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
