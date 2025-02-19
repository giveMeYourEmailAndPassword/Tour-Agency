export default function Header() {
  return (
    <>
      <div className="bg-white flex flex-col">
        <div className="flex justify-between px-36 py-4">
          <div>
            <a className="text-blue-500 font-medium text-2xl" href="#">
              BE TRAVEL
            </a>
          </div>

          <div className="flex gap-6">
            <a className="text-blue-500 font-medium text-xl" href="">
              Главная
            </a>
            <a className="text-blue-500 font-medium text-xl" href="">
              Туры
            </a>
            <a className="text-blue-500 font-medium text-xl" href="">
              О нас
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
