import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import marker from "../../assets/marker.svg";
import { destinations } from "../data/destinations";

export default function NewFlyingCountry() {
  const { setData, params } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState(
    Number(params.param2) || 4
  );
  const [selectedRegions, setSelectedRegions] = useState<number[]>(() => {
    const country = destinations.find(
      (country) => country.id === (Number(params.param2) || 4)
    );

    if (params.param2Regions?.length) {
      return params.param2Regions;
    }

    return country ? country.regions.map((region) => region.id) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isCharterOnly, setIsCharterOnly] = useState(true); // Добавляем состояние для чартерных рейсов
  const dropdownRef = useRef(null);

  // Инициализация при загрузке компонента
  useEffect(() => {
    if (params.param2 && !selectedCountry) {
      const newCountryId = Number(params.param2);
      const country = destinations.find((c) => c.id === newCountryId);
      if (country) {
        setSelectedCountry(newCountryId);
        if (params.param2Regions?.length) {
          setSelectedRegions(params.param2Regions);
        } else {
          setSelectedRegions(country.regions.map((region) => region.id));
        }
      }
    }

    // Инициализируем параметр чартерных рейсов по умолчанию
    if (params.param11 === undefined) {
      setData("param11", true);
    }
  }, []); // Только при монтировании

  // Синхронизация с URL параметрами (только для внешних изменений)
  useEffect(() => {
    const urlCountryId = Number(params.param2);
    const urlRegions = params.param2Regions || [];
    const urlCharterOnly = params.param11 === true;

    // Проверяем, изменились ли параметры извне (не от нашего компонента)
    if (urlCountryId !== selectedCountry) {
      const country = destinations.find((c) => c.id === urlCountryId);
      if (country) {
        setSelectedCountry(urlCountryId);
        setSelectedRegions(
          urlRegions.length > 0
            ? urlRegions
            : country.regions.map((region) => region.id)
        );
      }
    } else if (
      JSON.stringify(urlRegions.sort()) !==
      JSON.stringify(selectedRegions.sort())
    ) {
      // Если страна та же, но регионы изменились извне
      setSelectedRegions(urlRegions);
    }

    // Синхронизируем состояние чекбокса с URL параметрами
    if (urlCharterOnly !== isCharterOnly) {
      setIsCharterOnly(urlCharterOnly);
    }
  }, [params.param2, params.param2Regions, params.param11]);

  // Обновление URL при изменении выбора (с задержкой)
  useEffect(() => {
    if (selectedCountry) {
      const timeoutId = setTimeout(() => {
        setData("param2", selectedCountry);
        setData("param2Regions", selectedRegions);
        setData("param11", isCharterOnly);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedCountry, selectedRegions, setData, isCharterOnly]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegionToggle = (regionId: number) => {
    setSelectedRegions((prev) => {
      if (prev.includes(regionId)) {
        // Если пытаемся снять выбор с региона, но он последний выбранный
        if (prev.length === 1) {
          return prev; // Не позволяем снять выбор с последнего региона
        }
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
        // Если все регионы выбраны, выбираем только первый
        setSelectedRegions([selectedCountryData.regions[0].id]);
      } else {
        // Иначе выбираем все регионы
        setSelectedRegions(
          selectedCountryData.regions.map((region) => region.id)
        );
      }
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country.id);
    const newCountry = destinations.find((c) => c.id === country.id);
    if (newCountry) {
      // При смене страны всегда выбираем первый регион по умолчанию
      setSelectedRegions([newCountry.regions[0].id]);
    } else {
      setSelectedRegions([]);
    }
  };

  const handleCharterToggle = () => {
    setIsCharterOnly(!isCharterOnly);
    // Обновляем параметр в контексте
    setData("param11", !isCharterOnly);
  };

  const selectedCountryData = destinations.find(
    (country) => country.id === selectedCountry
  );

  const displayName = (() => {
    if (
      selectedRegions.length === 0 ||
      selectedRegions.length === selectedCountryData?.regions.length
    ) {
      return selectedCountryData?.name;
    }

    if (selectedRegions.length === 1) {
      const selectedRegion = selectedCountryData?.regions.find(
        (region) => region.id === selectedRegions[0]
      );

      // Если название региона больше 8 символов, показываем (1)
      if (selectedRegion && selectedRegion.name.length > 6) {
        return `${selectedCountryData?.name} (1)`;
      }

      return `${selectedCountryData?.name}, ${selectedRegion?.name}`;
    }

    return `${selectedCountryData?.name} (${selectedRegions.length})`;
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-7 py-1 border border-[#DBE0E5] rounded-lg bg-white hover:bg-gray-50 duration-300 w-[220px]"
      >
        <img src={marker} alt="marker" className="w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col justify-between flex-1">
          <span className="text-sm font-normal text-[#7E8389]">
            Страна, город
          </span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {displayName}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#DBE0E5] z-10">
          {/* Чекбокс "только чартерные рейсы" - отдельно вверху */}
          <div className="px-5 py-3 border-b border-[#DBE0E5] hover:bg-gray-50 duration-300">
            <button
              onClick={handleCharterToggle}
              className="w-full text-left flex items-center gap-2 rounded py-1"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center
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
                      d="M1.33301 4L3.99967 6.66667L9.33301 1.33334"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-base text-[#2E2E32]">
                Только чартерные рейсы
              </span>
            </button>
          </div>

          {/* Основной контент с двумя колонками */}
          <div className="flex">
            <div className="w-[220px] border-r border-[#DBE0E5]">
              {destinations.map((country) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full text-left px-5 py-2 hover:bg-gray-50 duration-300 flex items-center justify-between
                    ${selectedCountry === country.id ? "bg-[#FDDEC2]" : ""}
                  `}
                >
                  <span className="text-[#2E2E32] text-base">
                    {country.name}
                  </span>
                  <img src={marker} alt="marker" className="w-4 h-4" />
                </button>
              ))}
            </div>
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
                  <span className="text-[#2E2E32] text-base">
                    {region.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
