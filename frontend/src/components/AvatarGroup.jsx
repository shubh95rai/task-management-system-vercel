import blankProfileImage from "../assets/images/blank-profile-image1.png";

export default function AvatarGroup({ avatars, maxVisible = 3 }) {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div
          key={index}
          className="size-9 rounded-full overflow-hidden flex items-center justify-center border-2 border-white -ml-3 first:ml-0 "
        >
          <img
            src={avatar || blankProfileImage}
            alt={`Avatar ${index}`}
            className="size-full object-cover"
          />
        </div>
      ))}
      {avatars.length > maxVisible && (
        <div className="size-9 flex items-center justify-center bg-blue-50 gap-2 text-sm font-medium text-gray-500 rounded-full border-2 border-white -ml-3 pr-1">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
}
