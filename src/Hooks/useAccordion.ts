import { useState } from "react";

export const useAccordion = () => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const formatText = (text: string) => {
    if (!text) return "";
    return text
      .split(";")
      .map((item) => `· ${item.trim()}`)
      .join("\n");
  };

  return {
    openSections,
    toggleSection,
    formatText,
  };
};
