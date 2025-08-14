import React, { useContext, useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";
import { destinations } from "../../data/destinations";
import marker from "../../../assets/marker.svg";

export default function MobileFlyingCountry() {
  const { setData } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState(4); // По умолчанию Турция
  const [selectedRegions, setSelectedRegions] = useState<number[]>(() => {
    // Находим Турцию и получаем все её регионы
    const turkey = destinations.find((country) => country.id === 4);
    return turkey ? turkey.regions.map((region) => region.id) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.id);
    setSelectedRegions([]); // Сбрасываем выбранные регионы при смене страны
    setData("param2", country.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleRegionToggle = (regionId: number) => {
    setSelectedRegions((prev) => {
      if (prev.includes(regionId)) {
        return prev.filter((id) => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  const handleAllRegionsToggle = () => {
    const selectedCountryData = destinations.find(
      (country) => country.id === selectedCountry
    );
    if (selectedCountryData) {
      if (selectedRegions.length === selectedCountryData.regions.length) {
        setSelectedRegions([]);
      } else {
        setSelectedRegions(
          selectedCountryData.regions.map((region) => region.id)
        );
      }
    }
  };

  const selectedCountryData = destinations.find(
    (country) => country.id === selectedCountry
  );

  const filteredCountries = destinations.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = (() => {
    // Если нет выбранных регионов или выбраны все регионы страны
    if (
      selectedRegions.length === 0 ||
      selectedRegions.length === selectedCountryData?.regions.length
    ) {
      return selectedCountryData?.name;
    }

    // Если выбран ровно один регион
    if (selectedRegions.length === 1) {
      const selectedRegion = selectedCountryData?.regions.find(
        (region) => region.id === selectedRegions[0]
      );
      return `${selectedCountryData?.name}, ${selectedRegion?.name}`;
    }

    // Если выбрано больше одного региона, но не все
    return `${selectedCountryData?.name} (${selectedRegions.length})`;
  })();

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5] w-full"
      >
        <img src={marker} alt="marker" className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-xs font-light text-[#7E8389]">
            Страна, город
          </span>
          <span className="text-base font-medium text-[#2E2E32]">
            {displayName}
          </span>
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
        className="!p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <div className="bg-white w-full rounded-t-[10px]">
            {/* Header */}
            <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
              <h2 className="text-[20px] font-medium text-[#2E2E32]">
                Страна, город
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-5"
              >
                <RxCross2 className="w-6 h-6 text-[#FF621F]" />
              </button>
            </div>

            <div className="flex px-3">
              {/* Левая колонка - страны */}
              <div className="w-1/2 relative">
                <div className="absolute right-0 h-full w-[1px] bg-[#DBE0E5]" />
                <div className="py-3 pr-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 duration-300 flex items-center justify-between rounded-lg
                        ${selectedCountry === country.id ? "bg-[#FDDEC2]" : ""}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          alt={country.name}
                          className="w-6 h-4"
                        />
                        <span className="text-[#2E2E32] text-base">
                          {country.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Правая колонка - регионы */}
              <div className="w-1/2">
                <div className="py-3 pl-2">
                  <button
                    onClick={handleAllRegionsToggle}
                    className="w-full text-left px-4 py-2 duration-300 flex items-center gap-2 border-b border-[#DBE0E5]"
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center
                        ${
                          selectedRegions.length ===
                          selectedCountryData?.regions.length
                            ? "bg-[#FF621F] border-[#FF621F]"
                            : "border-[#DBE0E5]"
                        }
                      `}
                    >
                      {selectedRegions.length ===
                        selectedCountryData?.regions.length && (
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 3.5L4 6.5L9.5 1"
                            stroke="white"
                            strokeWidth="1.6"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[#2E2E32] text-sm">Все курорты</span>
                  </button>

                  {selectedCountryData?.regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleRegionToggle(region.id)}
                      className="w-full text-left px-4 py-2 duration-300 flex items-center gap-2 rounded-lg"
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center
                          ${
                            selectedRegions.includes(region.id)
                              ? "bg-[#FF621F] border-[#FF621F]"
                              : "border-[#DBE0E5]"
                          }
                        `}
                      >
                        {selectedRegions.includes(region.id) && (
                          <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 3.5L4 6.5L9.5 1"
                              stroke="white"
                              strokeWidth="1.6"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-[#2E2E32] text-sm">
                        {region.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
