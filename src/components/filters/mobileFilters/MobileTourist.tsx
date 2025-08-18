import { useContext, useState, useEffect } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";
import person_luggage from "../../../assets/person_luggage.svg";
import Vector from "../../../assets/Vector.svg";

const AGES = Array.from({ length: 14 }, (_, i) => i + 1); // [1, 2, ..., 14]

export default function MobileTourist() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectingAge, setIsSelectingAge] = useState(false);

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
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]"
      >
        <img src={person_luggage} alt="tourists" className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-xs font-light text-[#7E8389]">Туристы</span>
          <span className="text-base font-medium text-[#2E2E32]">
            {displayText}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="!p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
            exit: {
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          <div className="w-full">
            <div className="bg-white w-full rounded-t-[10px]">
              {/* Header */}
              <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
                <h2 className="text-[20px] font-medium text-[#2E2E32]">
                  Туристы
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5"
                >
                  <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                </button>
              </div>

              {/* Content */}
              <div className="flex items-center justify-center w-full py-4">
                <span className="text-[#2E2E32] text-xl font-medium">
                  {adults} взрослых{childrenList.length > 0 && ", "}
                  {childrenList.length > 0 && `${childrenList.length} детей`}
                </span>
              </div>
              <div className="px-3 pb-5 pt-0 gap-4 flex flex-col">
                {/* Взрослые */}
                <div className="flex items-center justify-between">
                  <span className="text-[#2E2E32] text-lg">Взрослые</span>
                  <div className="flex items-center gap-4">
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
                      <span className="text-[#6B7280] text-xl mt-[-3px]">
                        -
                      </span>
                    </button>
                    <span className="text-lg min-w-[20px] text-center">
                      {adults}
                    </span>
                    <button
                      onClick={() => handleAdultsChange(true)}
                      disabled={adults >= 6}
                      className={`w-8 h-8 rounded-full border border-[#DBE0E5] flex items-center justify-center
                        ${
                          adults < 6
                            ? "hover:bg-gray-50"
                            : "opacity-50 cursor-not-allowed"
                        }
                      `}
                    >
                      <span className="text-[#6B7280] text-xl mt-[-3px]">
                        +
                      </span>
                    </button>
                  </div>
                </div>

                {/* Список детей */}
                {childrenList.map((age, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[#2E2E32] text-lg">
                      Ребенок {getChildrenText(age)}
                    </span>
                    <button
                      onClick={() => handleRemoveChild(index)}
                      className="w-8 h-8 rounded-full border border-[#DBE0E5] flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="text-[#6B7280] text-xl mt-[-3px]">
                        -
                      </span>
                    </button>
                  </div>
                ))}

                {/* Добавить ребенка или выбор возраста */}
                {!isSelectingAge && childrenList.length < 3 && (
                  <button
                    onClick={() => setIsSelectingAge(true)}
                    className="w-full text-left flex items-center gap-4 py-2"
                  >
                    <img src={Vector} alt="Vector" className="w-5 h-5" />
                    <span className="text-[#2E2E32] text-lg">
                      Добавить ребенка
                    </span>
                  </button>
                )}

                {isSelectingAge && (
                  <div>
                    <div className="text-[#2E2E32] text-lg mb-4">
                      Возраст ребенка
                    </div>
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

              {/* Button */}
              <div className="px-3 py-5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 px-6 border border-[#FF621F] bg-[#FF621F] rounded-[10px] text-lg text-white"
                >
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
