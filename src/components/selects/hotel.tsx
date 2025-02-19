import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSelect } from "downshift";

type InfoItem = {
  id: string;
  rate: string;
};

export default function Hotel() {
  const info: InfoItem[] = [
    { id: "info-1", rate: "3,0 и более" },
    { id: "info-2", rate: "3,5 и более" },
    { id: "info-3", rate: "4,0 и более" },
    { id: "info-4", rate: "4,5 и более" },
  ];

  const [selectedItem, setSelectedItem] = React.useState<InfoItem | null>(null);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect<InfoItem>({
    items: info,
    itemToString: (item) => (item ? item.rate : ""),
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) =>
      setSelectedItem(newSelectedItem),
  });

  return (
    <div className="relative">
      <div className="w-52 flex flex-col gap-1">
        <div
          className="p-2 bg-white flex justify-between items-center cursor-pointer border border-gray-300 rounded-md"
          {...getToggleButtonProps()}
        >
          <span>{selectedItem ? selectedItem.rate : "Выберите значение"}</span>
          <IoIosArrowDown
            className={`text-xl transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <ul
        className={`absolute w-52 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 border border-gray-300 rounded-md ${
          !isOpen ? "hidden" : ""
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          info.map((item, index) => (
            <li
              className={`py-2 px-3 shadow-sm cursor-pointer ${
                highlightedIndex === index ? "bg-blue-300" : ""
              } ${selectedItem === item ? "font-bold" : ""}`}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              {item.rate}
            </li>
          ))}
      </ul>
    </div>
  );
}
