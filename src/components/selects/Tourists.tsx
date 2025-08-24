import { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import person_luggage from "../../assets/person_luggage.svg";
import Vector from "../../assets/Vector.svg";

const AGES = Array.from({ length: 14 }, (_, i) => i + 1); // [1, 2, ..., 14]

export default function Tourists() {
  const { setData, params } = useContext(DataContext);

  // Инициализируем состояния с учетом параметров URL
  const [adults, setAdults] = useState(() => {
    if (params.param5?.adults) {
      return Number(params.param5.adults);
    }
    return 2; // значение по умолчанию
  });

  const [childrenList, setChildrenList] = useState<number[]>(() => {
    if (params.param5?.childrenList) {
      return params.param5.childrenList;
    }
    return []; // значение по умолчанию
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSelectingAge, setIsSelectingAge] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Эффект для отслеживания изменений из URL
  useEffect(() => {
    if (params.param5) {
      const newAdults = Number(params.param5.adults);
      const newChildrenList = params.param5.childrenList;

      if (newAdults !== adults) {
        setAdults(newAdults);
      }
      if (JSON.stringify(newChildrenList) !== JSON.stringify(childrenList)) {
        setChildrenList(newChildrenList);
      }
    }
  }, [params.param5]); // Убираем adults и childrenList из зависимостей

  // Эффект для обновления параметров при изменении состояния
  useEffect(() => {
    setData("param5", { adults, childrenList });
  }, [adults, childrenList, setData]); // Убираем params.param5 из зависимостей

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsSelectingAge(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdultsChange = (increment: boolean) => {
    setAdults((prev) => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newValue, 1), 6); // Минимум 1, максимум 6
    });
  };

  const handleAddChild = (age: number) => {
    if (childrenList.length < 3) {
      setChildrenList((prev) => [...prev, age]);
    }
    setIsSelectingAge(false);
  };

  const handleRemoveChild = (index: number) => {
    setChildrenList((prev) => prev.filter((_, i) => i !== index));
  };

  const getChildrenText = (age: number) => {
    if (age === 1) return "1 год";
    if (age >= 2 && age <= 4) return `${age} года`;
    return `${age} лет`;
  };

  const displayText =
    childrenList.length > 0
      ? `${adults} взр ${childrenList.length} реб`
      : `${adults} взрослых`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-7 py-1 border border-[#DBE0E5] rounded-lg bg-white hover:bg-gray-50 duration-300 w-[220px]"
      >
        <img
          src={person_luggage}
          alt="person_luggage"
          className="w-6 h-6 flex-shrink-0"
        />
        <div className="flex flex-col justify-between flex-1">
          <span className="text-sm font-normal text-[#7E8389]">Туристы</span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {displayText}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#DBE0E5] z-10 w-[247px]">
          {/* Взрослые */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#EFF2F6]">
            <span className="text-[#2E2E32] text-lg">Взрослые</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAdultsChange(false)}
                disabled={adults <= 1}
                className={`w-8 h-8 rounded-full border border-[#DBE0E5] flex items-center justify-center
                  ${
                    adults > 1
                      ? "hover:bg-gray-50"
                      : "opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span className="text-[#6B7280] text-xl mt-[-4px]">-</span>
              </button>
              <span className="w-8 text-center text-lg">{adults}</span>
              <button
                onClick={() => handleAdultsChange(true)}
                disabled={adults >= 6}
                className={`w-8 h-8 rounded-full border border-[#DBE0E5] flex items-center justify-center leading-[0]
                  ${
                    adults < 6
                      ? "hover:bg-gray-50"
                      : "opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span className="text-[#6B7280] text-xl mt-[-4px]">+</span>
              </button>
            </div>
          </div>

          {/* Список детей */}
          {childrenList.map((age, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-5 py-2.5 border-b border-[#EFF2F6]"
            >
              <span className="text-[#2E2E32] text-lg">
                {getChildrenText(age)}
              </span>
              <button
                onClick={() => handleRemoveChild(index)}
                className="w-8 h-8 rounded-full border border-[#DBE0E5] flex items-center justify-center hover:bg-gray-50"
              >
                <span className="text-[#6B7280] text-xl mt-[-4px]">-</span>
              </button>
            </div>
          ))}

          {/* Добавить ребенка или выбор возраста */}
          {!isSelectingAge && childrenList.length < 3 && (
            <button
              onClick={() => setIsSelectingAge(true)}
              className="w-full text-left px-5 py-2.5 hover:bg-gray-50 duration-300 flex items-center gap-4"
            >
              <img src={Vector} alt="Vector" className="w-5 h-5" />
              <span className="text-[#2E2E32] text-lg">Добавить ребенка</span>
            </button>
          )}

          {isSelectingAge && (
            <div className="p-5">
              <div className="text-[#2E2E32] text-lg mb-4">Возраст ребенка</div>
              <div className="grid grid-cols-3 gap-2">
                {AGES.map((age) => (
                  <button
                    key={age}
                    onClick={() => handleAddChild(age)}
                    className="h-8 rounded-full border border-[#DBE0E5] flex items-center justify-center hover:bg-gray-50"
                  >
                    <span className="text-[#2E2E32] text-base">
                      {getChildrenText(age)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
