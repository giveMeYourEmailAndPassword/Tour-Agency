import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../DataProvider";
import plane_departure from "../../../assets/plane_departure.svg";
import { departures, Departure } from "../../data/destinations";
import { Modal, ModalContent } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";

export default function MobileDepartureCity() {
  const { setData } = useContext(DataContext);
  const [selectedCity, setSelectedCity] = useState("80"); // Бишкек по умолчанию
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setData("param1", selectedCity);
  }, [selectedCity, setData]);

  const handleCitySelect = (city: Departure) => {
    setSelectedCity(String(city.id));
    // Убираем setIsOpen(false) чтобы окно не закрывалось при выборе города
  };

  const selectedCityData = departures.find(
    (city) => String(city.id) === selectedCity
  );

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]"
      >
        <img src={plane_departure} alt="plane" className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-xs font-light text-[#7E8389]">
            Город вылета
          </span>
          <span className="text-base font-medium text-[#2E2E32]">
            {selectedCityData?.name}
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
        className="h-[216px] !p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <div className="absolute bottom-0 w-full">
            <div className="bg-white w-full rounded-t-[10px]">
              {/* Header */}
              <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
                <h2 className="text-[20px] font-medium text-[#2E2E32]">
                  Город вылета
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5"
                >
                  <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                </button>
              </div>

              {/* Cities */}
              <div className="flex flex-col">
                {departures.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="flex items-center gap-4 px-4 py-[14px]"
                  >
                    <div
                      className={`w-6 h-6 rounded-[20px] border border-[#DBE0E5] relative
                        ${
                          selectedCity === String(city.id)
                            ? "border-[#FF621F]"
                            : ""
                        }
                      `}
                    >
                      {selectedCity === String(city.id) && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-[20px] bg-[#FF621F]" />
                      )}
                    </div>
                    <span className="text-base text-[#2E2E32]">
                      {city.name}
                    </span>
                  </button>
                ))}
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
