import MobileFindBtnOT from "./Filters/MobileFindBtnOT";
import MobileNewDepartureCityOT from "./Filters/MobileNDCOT";
import MobileNewFlyingCountryOT from "./Filters/MobileNFCOT";
import MobileNewFlyingDateOT from "./Filters/MobileNFDOT";
import MobileNightsFromOT from "./Filters/MobileNFOT";
import MobileTouristOT from "./Filters/MobileTOT";
import MobileOtherFiltersOT from "./Filters/OtherFiltersOT/MobileOFOT";

interface FiltersMobileOTProps {
  onClose: () => void;
}

export default function FiltersMobileOT({ onClose }: FiltersMobileOTProps) {
  return (
    <div className="flex flex-col items-center w-full pb-4">
      <div className="w-full flex items-center justify-between">
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
          <div className="w-1/2">
            <MobileNightsFromOT />
          </div>
        </div>
        <div className="flex w-full gap-[2px]">
          <div className="w-1/2">
            <MobileTouristOT />
          </div>
          <div className="w-1/2">
            <MobileOtherFiltersOT />
          </div>
        </div>
        <div className="w-full">
          <MobileFindBtnOT onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
