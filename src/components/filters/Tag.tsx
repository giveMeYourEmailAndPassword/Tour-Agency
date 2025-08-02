interface TagProps {
  label: string;
  onRemove?: () => void;
}

export default function Tag({ label, onRemove }: TagProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-[#FDDEC2] rounded-lg">
      <span className="text-base text-[#2E2E32]">{label}</span>
      {onRemove && (
        <button onClick={onRemove} className="flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="#2E2E32"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
