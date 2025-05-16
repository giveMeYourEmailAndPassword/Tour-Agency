import NewFlyingCountry from "./selects/NewFlyingCountry";
export default function FiltersMobile() {
  return (
    <div className="flex flex-col items-center w-full pb-4">
      <div className="rounded-xl w-full gap-1 flex flex-col items-center justify-center px-4">
        <NewFlyingCountry />
        <div className="flex gap-1">
          <div className="flex flex-col gap-1">
            <div className="bg-white w-32 h-10 rounded-xl"></div>
            <div className="bg-white w-full h-10 rounded-xl"></div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="bg-white w-32 h-10 rounded-xl"></div>
            <div className="bg-white w-full h-10 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
