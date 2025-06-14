import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

export default function ProfilePicSelector({ image, setImage }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (file) {
      // update the image url
      setImage(file);

      // generate preview url from file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  }

  function hadnelRemoveImage() {
    setImage(null);
    setPreviewUrl(null);

    // Reset the file input value so the same file can be reselected
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function onChooseFile() {
    inputRef.current.click();
  }

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="size-20 flex justify-center items-center bg-blue-100/50 rounded-full relative">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            className="size-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative ">
          <div className="size-20 rounded-full overflow-hidden">
            <img
              src={previewUrl}
              alt="profile pic"
              className="size-full object-cover"
            />
          </div>
          <button
            type="button"
            className="size-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={hadnelRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
}
