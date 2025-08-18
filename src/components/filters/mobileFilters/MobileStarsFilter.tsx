import { useState, useContext, useEffect } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { DataContext } from "../../DataProvider";
import star from "../../../assets/star.svg";

const STARS = [
  { id: 0, name: "1-5 звезд", value: [1, 2, 3, 4, 5] },
  { id: 1, name: "1 звезда", value: [1] },
  { id: 2, name: "2 звезды", value: [2] },
  { id: 3, name: "3 звезды", value: [3] },
  { id: 4, name: "4 звезды", value: [4] },
  { id: 5, name: "5 звезд", value: [5] },
];

export default function MobileStarsFilter() {
  const { setData, params } = useContext(DataContext); // Добавляем params
  const [isOpen, setIsOpen] = useState(false);

  // Инициализируем звезды с учетом параметров URL
  const [selectedStars, setSelectedStars] = useState<number[]>(() => {
    if (params.param9) {
      return Array.isArray(params.param9) ? params.param9 : [params.param9];
    }
    return [1, 2, 3, 4, 5]; // значения по умолчанию
  });

  // Добавляем эффект для отслеживания изменений из URL
  useEffect(() => {
    if (params.param9) {
      const newStars = Array.isArray(params.param9)
        ? params.param9
        : [params.param9];
      if (JSON.stringify(newStars) !== JSON.stringify(selectedStars)) {
        setSelectedStars(newStars);
      }
    }
  }, [params.param9]);

  const handleStarSelect = (stars: number[]) => {
    setSelectedStars(stars);
    setData("param9", stars);
  };

  const getDisplayText = () => {
    if (selectedStars.length === 5) return "1-5 звезд";
    if (selectedStars.length === 1)
      return `${selectedStars[0]} звезд${selectedStars[0] === 1 ? "а" : "ы"}`;
    return `${selectedStars.join(", ")} звезды`;
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]"
      >
        <img src={star} alt="stars" className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-xs font-light text-[#7E8389]">Звезд</span>
          <span className="text-base font-medium text-[#2E2E32]">
            {getDisplayText()}
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
          <div className="absolute bottom-0 w-full">
            <div className="bg-white w-full rounded-t-[10px]">
              {/* Header */}
              <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
                <h2 className="text-[20px] font-medium text-[#2E2E32]">
                  Звезд
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5"
                >
                  <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                </button>
              </div>

              {/* Content */}
              <div className="flex items-center justify-center w-full py-3 pb-5">
                <span className="text-[#2E2E32] text-xl font-medium">
                  {getDisplayText()}
                </span>
              </div>

              <div className="px-3 pt-0">
                {/* Чекбоксы */}
                <div className="flex flex-col gap-2">
                  {STARS.map((starOption) => (
                    <button
                      key={starOption.id}
                      onClick={() => handleStarSelect(starOption.value)}
                      className="flex items-center px-2 py-3 gap-2"
                    >
                      <div
                        className={`w-6 h-6 rounded border flex items-center justify-center
                          ${
                            JSON.stringify(selectedStars) ===
                            JSON.stringify(starOption.value)
                              ? "border-[#FF621F] bg-[#FF621F]"
                              : "border-[#DBE0E5]"
                          }`}
                      >
                        {JSON.stringify(selectedStars) ===
                          JSON.stringify(starOption.value) && (
                          <svg
                            className="w-4 h-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-[#2E2E32] text-lg">
                        {starOption.name}
                      </span>
                    </button>
                  ))}
                </div>
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
