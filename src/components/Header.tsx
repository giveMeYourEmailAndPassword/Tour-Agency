export default function Header() {
  return (
    <>
      {/* Добавляем пустой div для компенсации высоты фиксированного header */}
      <div className="h-[64px]"></div>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="flex justify-between px-4 md:px-8 lg:px-12 xl:px-36 py-4 max-w-[1560px] mx-auto">
          <div>
            <a
              className="text-blue-500 font-semibold text-xl md:text-2xl"
              href="/"
            >
              BE TRAVEL
            </a>
          </div>

          <div className="flex gap-4 md:gap-6">
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
          </div>
        </div>
      </div>
    </>
  );
}
