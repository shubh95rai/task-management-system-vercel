export default function InfoCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 md:w-2 h-3 md:h-5 rounded-full ${color}`} />

      <p className="text-xs md:text-sm text-gray-500">
        <span className="text-sm md:text-base text-black font-semibold">
          {value}
        </span>{" "}
        {label}
      </p>
    </div>
  );
}
