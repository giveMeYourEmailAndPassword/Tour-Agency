import MobileDepartureCity from "./filters/mobileFilters/MobileDepartureCity";
import MobileFlyingCountry from "./filters/mobileFilters/MobileFlyingCountry";
import MobileFlyingDate from "./filters/mobileFilters/MobileFlyingDate";
import MobileNightsFrom from "./filters/mobileFilters/MobileNightsFrom";
import MobileTourist from "./filters/mobileFilters/MobileTourist";
import MobileOtherFilters from "./filters/mobileFilters/otherFilters/MobileOtherFilters";
import FindBtnMobile from "./filters/FindBtnMobile";

export default function FiltersMobile() {
  return (
    <div className="flex flex-col items-center w-full pb-4">
      <div className="w-full flex items-start px-4">
        <MobileDepartureCity />
      </div>
      <div className="w-full flex flex-col items-center justify-center px-4">
        <div className="w-full">
          <MobileFlyingCountry />
        </div>
        <div className="flex w-full gap-[2px]">
          <div className="w-1/2">
            <MobileFlyingDate />
          </div>
          <div className="w-1/2">
            <MobileNightsFrom />
          </div>
        </div>
        <div className="flex w-full gap-[2px]">
          <div className="w-1/2">
            <MobileTourist />
          </div>
          <div className="w-1/2">
            <MobileOtherFilters />
          </div>
        </div>
        <div className="w-full">
          <FindBtnMobile />
        </div>
      </div>
    </div>
  );
}
