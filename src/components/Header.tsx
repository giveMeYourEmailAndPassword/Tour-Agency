export default function Header() {
  return (
    <>
      {/* <div className=" bg-white shadow-md"> */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex justify-between px-36 py-4 max-w-[1560px] mx-auto">
          <div>
            <a className="text-blue-500 font-medium text-2xl" href="/">
              BE TRAVEL
            </a>
          </div>

          <div className="flex gap-6">
            <a className="text-blue-500 font-medium text-xl" href="/">
              Главная
            </a>
            <a className="text-blue-500 font-medium text-xl" href="/tours">
              Туры
            </a>
            <a className="text-blue-500 font-medium text-xl" href="/about">
              О нас
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
