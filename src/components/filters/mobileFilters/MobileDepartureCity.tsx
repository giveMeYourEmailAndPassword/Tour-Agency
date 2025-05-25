import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

const cityDeclensions = {
  Бишкек: "Бишкека",
  Алматы: "Алматы",
  Ташкент: "Ташкента",
};

export default function MobileDepartureCity() {
  const { setData, cities } = useContext(DataContext);
  const [selectedCity, setSelectedCity] = useState(80);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (cities.length > 0 && !cities.find((city) => city.id === selectedCity)) {
      setSelectedCity(cities[1].id);
    }
  }, [cities]);

  useEffect(() => {
    setData("param1", selectedCity);
  }, [selectedCity, setData]);

  const handleCitySelect = (city) => {
    setSelectedCity(city.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const selectedCityData = cities.find((city) => city.id === selectedCity);

  const filteredCities = cities
    .filter((city, index) => index !== 2)
    .filter((city) =>
      city.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getDeclension = (cityName) => {
    return cityDeclensions[cityName] || cityName;
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="px-2 h-8 md:h-full cursor-pointer flex items-center justify-between"
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
        onClose={() => {
          setIsOpen(false);
          setSearchQuery("");
        }}
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
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
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
