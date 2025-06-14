import { useState } from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

export default function TodoListInput({ todoList, setTodoList }) {
  const [option, setOption] = useState("");

  // handle adding an option
  function handleAddOption() {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  }

  // handle deleting an option
  function handleDeleteOption(index) {
    const updatedTodoList = todoList.filter((_, i) => i !== index);
    setTodoList(updatedTodoList);
  }
  return (
    <div>
      {/* showing todo list */}
      {todoList.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* adding todo list */}
      <div className="flex gap-5 mt-4">
        <input
          type="text"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          placeholder="Enter Task"
          className="w-full text-sm text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
}
