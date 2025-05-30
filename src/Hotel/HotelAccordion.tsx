import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

interface AccordionSectionProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
  formatText?: (text: string) => string;
}

export default function AccordionSection({
  title,
  content,
  isOpen,
  onToggle,
  formatText = (text) => text,
}: AccordionSectionProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg border-1 md:border-2 border-gray-300 rounded-md transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full py-2 px-3 flex justify-between items-center"
      >
        <h2 className="text-base md:text-lg text-gray-600">{title}</h2>
        <span className="text-gray-600">
          {isOpen ? (
            <CiSquareMinus className="w-6 h-6 md:w-7 md:h-7 text-gray-500" />
          ) : (
            <CiSquarePlus className="w-6 h-6 md:w-7 md:h-7 text-gray-500" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-3 md:px-8 pb-3 md:pb-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
            {formatText(content)}
          </p>
        </div>
      )}
    </div>
  );
}
