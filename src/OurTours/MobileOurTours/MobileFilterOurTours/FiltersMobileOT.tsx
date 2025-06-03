import MobileNewDepartureCityOT from "./Filters/MobileNDCOT";
import MobileNewFlyingCountryOT from "./Filters/MobileNFCOT";
import MobileNewFlyingDateOT from "./Filters/MobileNFDOT";

export default function FiltersMobileOT() {
  return (
    <div className="flex flex-col items-center w-full pb-4">
      <div className="w-full flex items-center justify-between px-4">
        <MobileNewDepartureCityOT />
      </div>
      <div className="w-full flex flex-col items-center justify-center px-4">
        <div className="w-full">
          <MobileNewFlyingCountryOT />
        </div>
        <div className="flex w-full gap-[2px]">
          <div className="w-1/2">
            <MobileNewFlyingDateOT />
          </div>
          <div className="w-1/2"></div>
        </div>
        <div className="flex w-full gap-[2px]">
          <div className="w-1/2"></div>
          <div className="w-1/2"></div>
        </div>
        <div className="w-full"></div>
      </div>
    </div>
  );
}
