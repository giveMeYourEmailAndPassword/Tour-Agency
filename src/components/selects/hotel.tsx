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
          className="p-3 bg-white flex justify-between items-center cursor-pointer border border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-300"
          {...getToggleButtonProps()}
        >
          <span className="text-gray-700">
            {selectedItem ? selectedItem.rate : "Рейтинг отеля"}
          </span>
          <IoIosArrowDown
            className={`text-xl text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <ul
        className={`absolute w-52 bg-white mt-2 shadow-lg max-h-80 overflow-auto p-0 z-10 border border-gray-100 rounded-xl ${
          !isOpen ? "hidden" : ""
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          info.map((item, index) => (
            <li
              className={`py-3 px-4 cursor-pointer transition-all duration-200
                ${
                  highlightedIndex === index
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }
                ${
                  selectedItem === item
                    ? "font-semibold text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }
                ${index === 0 ? "rounded-t-xl" : ""}
                ${index === info.length - 1 ? "rounded-b-xl" : ""}
              `}
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
