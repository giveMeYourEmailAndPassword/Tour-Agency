interface HotelMapButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export const HotelMapButton = ({ onClick, isActive }: HotelMapButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-slate-200 text-black/50 font-semibold text-xs rounded-full transition flex items-center gap-1
        ${isActive ? "bg-slate-500 text-white" : "hover:bg-slate-300"}`}
    >
      <span>НА КАРТЕ</span>
    </button>
  );
};
