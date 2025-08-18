import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../../DataProvider";
import { Modal, ModalContent } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import moon from "../../../assets/moon_stars.svg";

const NIGHTS = [5, 7, 9, 11, 14, 16];
const MIN_NIGHTS = 3;
const MAX_NIGHTS = 16;

export default function MobileNightsFrom() {
  const { setData, params } = useContext(DataContext); // Добавляем params
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNights, setSelectedNights] = useState(7);

  // Инициализируем слайдер с учетом параметров URL
  const [sliderValue, setSliderValue] = useState(() => {
    if (params.param3?.startDay && params.param3?.endDay) {
      return [Number(params.param3.startDay), Number(params.param3.endDay)];
    }
    return [5, 7]; // значения по умолчанию
  });

  // Добавляем эффект для отслеживания изменений из URL
  useEffect(() => {
    if (params.param3?.startDay && params.param3?.endDay) {
      const start = Number(params.param3.startDay);
      const end = Number(params.param3.endDay);
      if (start !== sliderValue[0] || end !== sliderValue[1]) {
        setSliderValue([start, end]);
        setSelectedNights(end);
      }
    }
  }, [params.param3]);

  const [isDragging, setIsDragging] = useState<null | "start" | "end">(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    setData("param3", { startDay: sliderValue[0], endDay: sliderValue[1] });
  }, [sliderValue, setData]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const width = rect.width;
      const left = rect.left;
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - left) / width) * 100)
      );
      const nightValue = Math.round(
        (percentage * (MAX_NIGHTS - MIN_NIGHTS)) / 100 + MIN_NIGHTS
      );

      setSliderValue((prev) => {
        if (isDragging === "start") {
          return [
            Math.max(MIN_NIGHTS, Math.min(nightValue, prev[1] - 1)),
            prev[1],
          ];
        } else {
          return [
            prev[0],
            Math.min(MAX_NIGHTS, Math.max(nightValue, prev[0] + 1)),
          ];
        }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleNightSelect = (night) => {
    setSelectedNights(night);
    let start, end;

    if (night === MIN_NIGHTS) {
      start = MIN_NIGHTS;
      end = 5;
    } else if (night === MAX_NIGHTS) {
      start = 14;
      end = MAX_NIGHTS;
    } else {
      start = Math.max(MIN_NIGHTS, night - 2);
      end = night;
    }

    setSliderValue([start, end]);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]"
      >
        <img src={moon} alt="nights" className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-xs font-light text-[#7E8389]">Ночей</span>
          <span className="text-base font-medium text-[#2E2E32]">
            {sliderValue[0] === sliderValue[1]
              ? `${sliderValue[0]} ночей`
              : `${sliderValue[0]}-${sliderValue[1]} ночей`}
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
                  Ночей
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
                  {sliderValue[0] === sliderValue[1]
                    ? `${sliderValue[0]} ночей`
                    : `${sliderValue[0]}-${sliderValue[1]} ночей`}
                </span>
              </div>

              <div className="px-3 pb-5 pt-0">
                {/* Слайдер */}
                <div className="relative h-6 mb-6" ref={sliderRef}>
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-[#DBE0E5] rounded-lg">
                    <div
                      className="absolute h-full bg-[#FF621F] rounded-lg"
                      style={{
                        left: `${
                          ((sliderValue[0] - MIN_NIGHTS) * 100) /
                          (MAX_NIGHTS - MIN_NIGHTS)
                        }%`,
                        width: `${
                          ((sliderValue[1] - sliderValue[0]) * 100) /
                          (MAX_NIGHTS - MIN_NIGHTS)
                        }%`,
                      }}
                    />
                  </div>
                  {/* Ползунки */}
                  <button
                    onMouseDown={() => setIsDragging("start")}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center border border-[#DBE0E5] hover:border-[#FF621F] transition-colors"
                    style={{
                      left: `${
                        ((sliderValue[0] - MIN_NIGHTS) * 100) /
                        (MAX_NIGHTS - MIN_NIGHTS)
                      }%`,
                    }}
                  >
                    <div className="flex flex-col gap-[2px]">
                      <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
                      <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
                    </div>
                  </button>
                  <button
                    onMouseDown={() => setIsDragging("end")}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center border border-[#DBE0E5] hover:border-[#FF621F] transition-colors"
                    style={{
                      left: `${
                        ((sliderValue[1] - MIN_NIGHTS) * 100) /
                        (MAX_NIGHTS - MIN_NIGHTS)
                      }%`,
                    }}
                  >
                    <div className="flex flex-col gap-[2px]">
                      <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
                      <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
                    </div>
                  </button>
                </div>

                {/* Кнопки выбора количества ночей */}
                <div className="grid grid-cols-3 gap-2">
                  {NIGHTS.map((night) => (
                    <button
                      key={night}
                      onClick={() => handleNightSelect(night)}
                      className={`h-10 rounded-full border transition-colors flex items-center justify-center
                        ${
                          night === selectedNights
                            ? "border-[#FF621F] text-[#2E2E32]"
                            : "border-[#DBE0E5] text-[#2E2E32] hover:border-[#FF621F]"
                        }`}
                    >
                      <span className="text-base">{night} ночей</span>
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
