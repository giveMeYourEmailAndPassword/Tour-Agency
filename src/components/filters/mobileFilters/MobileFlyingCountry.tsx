import React, { useContext, useState, useEffect } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";
import { destinations } from "../../data/destinations";
import marker from "../../../assets/marker.svg";

export default function MobileFlyingCountry() {
  const { setData, params } = useContext(DataContext); // Добавляем params из контекста
  const TURKEY_ID = 4;

  const [selectedCountry, setSelectedCountry] = useState(
    Number(params.param2) || 4
  ); // Используем значение из URL или Турцию по умолчанию
  const [selectedRegions, setSelectedRegions] = useState<number[]>(() => {
    // Находим выбранную страну и получаем все её регионы
    const country = destinations.find(
      (country) => country.id === (Number(params.param2) || 4)
    );

    // Если есть регионы в URL, используем их, иначе все регионы страны
    if (params.param2Regions?.length) {
      return params.param2Regions;
    }

    return country ? country.regions.map((region) => region.id) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCharterOnly, setIsCharterOnly] = useState<boolean>(() => {
    if (params.param11 !== undefined) {
      return params.param11 === true;
    }
    return (Number(params.param2) || TURKEY_ID) === TURKEY_ID;
  });

  // Добавляем эффект для отслеживания изменений params.param2
  useEffect(() => {
    if (params.param2) {
      const countryExists = destinations.some(
        (country) => country.id === Number(params.param2)
      );
      if (countryExists) {
        const newCountryId = Number(params.param2);
        if (newCountryId !== selectedCountry) {
          // Проверяем, изменилась ли страна
          setSelectedCountry(newCountryId);
          // Обновляем регионы для новой страны
          const country = destinations.find((c) => c.id === newCountryId);
          if (country) {
            setSelectedRegions(country.regions.map((region) => region.id));
          }
        }
        // Синхронизируем чекбокс с URL и страной:
        // для Турции используем значение из URL, иначе выключаем
        const urlCharterOnly = params.param11 === true;
        const desiredCharter =
          newCountryId === TURKEY_ID ? urlCharterOnly : false;
        if (desiredCharter !== isCharterOnly) {
          setIsCharterOnly(desiredCharter);
        }
      }
    }
  }, [params.param2, params.param11, selectedCountry]); // Добавляем selectedCountry в зависимости

  // Добавляем эффект для обновления параметров при изменении регионов/страны/чартера
  useEffect(() => {
    if (selectedCountry) {
      setData("param2", selectedCountry);
      setData("param2Regions", selectedRegions);
      setData("param11", isCharterOnly);
    }
  }, [selectedCountry, selectedRegions, isCharterOnly, setData]);

  // Добавляем эффект для отслеживания изменений params.param2Regions
  useEffect(() => {
    if (params.param2Regions) {
      setSelectedRegions(params.param2Regions);
    }
  }, [params.param2Regions]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.id);
    // Сначала обновляем регионы для новой страны
    const newCountry = destinations.find((c) => c.id === country.id);
    if (newCountry) {
      const allRegions = newCountry.regions.map((region) => region.id);
      setSelectedRegions(allRegions);
      setData("param2Regions", allRegions);
    } else {
      setSelectedRegions([]);
      setData("param2Regions", []);
    }
    // Затем обновляем параметр в контексте
    setData("param2", country.id);

    // Автовыбор чартера: только для Турции — вкл, иначе выкл
    const autoCharter = country.id === TURKEY_ID;
    setIsCharterOnly(autoCharter);
    setData("param11", autoCharter);

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

  const handleCharterToggle = () => {
    const next = !isCharterOnly;
    setIsCharterOnly(next);
    setData("param11", next);
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
                  Страна, город
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5"
                >
                  <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                </button>
              </div>

              {/* Чекбокс "Только чартерные рейсы" */}
              <div className="px-7 py-3 border-b border-[#DBE0E5]">
                <button
                  onClick={handleCharterToggle}
                  className="w-full text-left flex items-center gap-2 rounded py-1"
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center
                      ${
                        isCharterOnly
                          ? "bg-[#FF621F] border-[#FF621F]"
                          : "border-[#7E8389]"
                      }
                    `}
                  >
                    {isCharterOnly && (
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
                  <span className="text-[#2E2E32] text-base">
                    Только чартерные рейсы
                  </span>
                </button>
              </div>

              <div className="flex px-3">
                {/* Левая колонка - страны */}
                <div className="w-1/2 relative">
                  <div className="absolute right-0 h-full w-[1px] bg-[#DBE0E5]" />
                  <div className="pb-3 pr-2">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.id}
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full text-left px-4 py-2 duration-300 flex items-center justify-between rounded-lg
                          ${
                            selectedCountry === country.id
                              ? "bg-[#FDDEC2] hover:!bg-[#FDDEC2]"
                              : "hover:bg-gray-50"
                          }
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
                  <div className="pb-3 pl-2">
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
                      <span className="text-[#2E2E32] text-sm">
                        Все курорты
                      </span>
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
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
