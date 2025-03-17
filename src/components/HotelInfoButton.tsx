interface HotelInfoButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export const HotelInfoButton = ({
  onClick,
  isActive,
}: HotelInfoButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-0.5 bg-slate-200 text-black/50 font-semibold text-xs rounded-full transition flex items-center gap-1
        ${isActive ? "bg-blue-500 text-white" : "hover:bg-slate-300"}`}
    >
      <span>ОБ ОТЕЛЕ</span>
    </button>
  );
};
