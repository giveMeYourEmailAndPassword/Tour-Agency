interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  checked = false,
  onChange,
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center ${
          checked ? "bg-[#FF621F] border-[#FF621F]" : "border-[#7E8389]"
        }`}
      >
        {checked && (
          <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.33301 4L3.99967 6.66667L9.33301 1.33334"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-base text-[#2E2E32]">{label}</span>
    </label>
  );
}
