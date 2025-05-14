import { useState } from "react";
import { HiMiniBars4, HiOutlineBars3 } from "react-icons/hi2";
import { LiaTimesSolid } from "react-icons/lia";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Добавляем пустой div для компенсации высоты фиксированного header */}
      <div className="h-[56px] md:h-[64px]"></div>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="flex justify-between items-center px-4 md:px-8 lg:px-12 xl:px-36 py-4 max-w-[1560px] mx-auto">
          <div>
            <a
              className="text-blue-500 font-semibold text-xl md:text-2xl"
              href="/"
            >
              BE TRAVEL
            </a>
          </div>

          {/* Кнопка гамбургер для мобильных */}
          <button
            className="md:hidden text-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <LiaTimesSolid size={26} />
            ) : (
              <HiOutlineBars3 size={26} />
            )}
          </button>

          {/* Навигация */}
          <nav
            className={`
            ${isMenuOpen ? "flex" : "hidden"} 
            md:flex
            flex-col md:flex-row
            absolute md:relative
            top-full md:top-auto
            left-0 md:left-auto
            right-0 md:right-auto
            bg-white md:bg-transparent
            shadow-md md:shadow-none
            p-4 md:p-0
            gap-4 md:gap-6
          `}
          >
            <a
              className="text-blue-500 font-medium text-lg md:text-xl"
              href="/"
            >
              Главная
            </a>
            <a
              className="text-blue-500 font-medium text-lg md:text-xl"
              href="/tours"
            >
              Туры
            </a>
            <a
              className="text-blue-500 font-medium text-lg md:text-xl"
              href="/about"
            >
              О нас
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
