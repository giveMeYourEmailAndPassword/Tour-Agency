import React, { useContext, useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { DataContext } from "../../../../components/DataProvider";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

interface City {
  id: string;
  label: string;
}

const cityDeclensions: Record<string, string> = {
  Бишкек: "Бишкека",
  Алматы: "Алматы",
  Ташкент: "Ташкента",
};

export default function MobileNewDepartureCityOT() {
  const { setData, cities, params } = useContext(DataContext);
  const selectedCity = params?.param1 || "0";
  const [isOpen, setIsOpen] = useState(false);

  // Обновляем состояние при изменении параметров в контексте
  useEffect(() => {
    if (params?.param1 !== undefined) {
      setData("param1", params.param1);
    }
  }, [params?.param1]);

  useEffect(() => {
    if (cities.length > 0 && !cities.find((city) => city.id === selectedCity)) {
      setData("param1", cities[1].id);
    }
  }, [cities]);

  const handleCitySelect = (city: City) => {
    setData("param1", city.id);
    setIsOpen(false);
  };

  const selectedCityData = cities.find((city) => city.id === selectedCity);
  const filteredCities = cities.filter((city, index) => index !== 2);

  const getDeclension = (cityName: string): string => {
    return cityDeclensions[cityName] || cityName;
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="h-12 md:h-full cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-col items-start justify-between w-full">
          <div className="flex items-end gap-1">
            <span className="text-white text-lg">из</span>
            <span
              className={`text-lg ${
                selectedCityData ? "text-white" : "text-white"
              }`}
            >
              {selectedCityData ? getDeclension(selectedCityData.label) : ""}
            </span>
            <IoIosArrowDown className="text-white text-2xl" />
          </div>
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
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Выберите город вылета</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3">
            <div className="flex flex-col gap-2">
              {filteredCities && filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl text-start"
                  >
                    <span
                      className={selectedCity === city.id ? "font-medium" : ""}
                    >
                      {city.label}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-black text-lg text-start py-1 pl-4">
                  Загрузка...
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
