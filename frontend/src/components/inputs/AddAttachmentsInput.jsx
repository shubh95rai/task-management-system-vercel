import { useState } from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

export default function AddAttachmentsInput({ attachments, setAttachments }) {
  const [option, setOption] = useState("");

  // handle adding an option
  function handleAddOption() {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  }

  // handle deleting an option
  function handleDeleteOption(index) {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
  }
  return (
    <div>
      {/* showing attachments */}
      {attachments.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex items-center flex-1 gap-3">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black">{item}</p>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* adding attachment */}
      <div className="flex gap-5 mt-4">
        <div className="flex flex-1 items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />

          <input
            type="text"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            placeholder="Add File Link"
            className="w-full text-sm text-black outline-none bg-white py-2"
          />
        </div>

        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
}
