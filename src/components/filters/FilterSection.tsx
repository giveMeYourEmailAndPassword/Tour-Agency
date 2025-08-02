import { ReactNode } from "react";
import { FiChevronUp } from "react-icons/fi";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  isCollapsible?: boolean;
}

export default function FilterSection({
  title,
  children,
  isCollapsible = false,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[#2E2E32] text-base font-semibold">{title}</span>
        {isCollapsible && (
          <FiChevronUp className="w-[22px] h-[22px] text-[#2E2E32]" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
