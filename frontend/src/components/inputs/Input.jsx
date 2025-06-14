import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function Input({ type, label, placeholder, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }
  return (
    <div>
      <label className="text-sm text-slate-800">{label}</label>
      <div className="input-box">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="w-full bg-transparent outline-none"
        />

        {type == "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={20}
                onClick={toggleShowPassword}
                className="text-primary cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                size={20}
                onClick={toggleShowPassword}
                className="text-slate-400 cursor-pointer"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
