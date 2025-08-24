import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import marker from "../../assets/marker.svg";
import { destinations } from "../data/destinations";

export default function NewFlyingCountry() {
  const { setData, params } = useContext(DataContext);
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
  const dropdownRef = useRef(null);

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
      }
    }
  }, [params.param2, selectedCountry]); // Добавляем selectedCountry в зависимости

  // Добавляем эффект для отслеживания изменений params.param2Regions
  useEffect(() => {
    if (params.param2Regions) {
      setSelectedRegions(params.param2Regions);
    }
  }, [params.param2Regions]);

  // Добавляем эффект для обновления параметров при изменении регионов
  useEffect(() => {
    if (selectedCountry) {
      setData("param2", selectedCountry);
      // Добавляем параметр для регионов
      setData("param2Regions", selectedRegions);
    }
  }, [selectedCountry, selectedRegions, setData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country.id);
    // Сначала обновляем регионы для новой страны
    const newCountry = destinations.find((c) => c.id === country.id);
    if (newCountry) {
      const allRegions = newCountry.regions.map((region) => region.id);
      setSelectedRegions(allRegions);
    } else {
      setSelectedRegions([]);
    }
    // Затем обновляем параметр в контексте
    setData("param2", country.id);
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
        setSelectedRegions([]); // Если все регионы выбраны, снимаем выбор со всех
      } else {
        setSelectedRegions(
          selectedCountryData.regions.map((region) => region.id)
        ); // Выбираем все регионы
      }
    }
  };

  const selectedCountryData = destinations.find(
    (country) => country.id === selectedCountry
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg bg-white hover:bg-gray-50 duration-300 w-[220px]"
      >
        <img src={marker} alt="marker" className="w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal text-[#7E8389]">
            Страна, город
          </span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {displayName}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#DBE0E5] z-10 flex">
          {/* Левая колонка - страны */}
          <div className="w-[220px] border-r border-[#DBE0E5]">
            {destinations.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className={`w-full text-left px-5 py-2   hover:bg-gray-50 duration-300 flex items-center justify-between
                  ${selectedCountry === country.id ? "bg-[#FDDEC2]" : ""}
                `}
              >
                <span className="text-[#2E2E32] text-base">{country.name}</span>
                <img src={marker} alt="marker" className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Правая колонка - регионы */}
          <div className="w-[220px]">
            <button
              onClick={handleAllRegionsToggle}
              className={`w-full text-left px-5 py-2 hover:bg-gray-50 duration-300 flex items-center gap-4 border-b border-[#DBE0E5]`}
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
              <span className="text-[#2E2E32] text-base">Все курорты</span>
            </button>

            {selectedCountryData?.regions.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionToggle(region.id)}
                className="w-full text-left px-5 py-2 hover:bg-gray-50 duration-300 flex items-center gap-4"
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
                <span className="text-[#2E2E32] text-base">{region.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
