import MobileFlyingCountry from "./filters/mobileFilters/MobileFlyingCountry";
import MobileFlyingDate from "./filters/mobileFilters/MobileFlyingDate";
import MobileNightsFrom from "./filters/mobileFilters/MobileNightsFrom";
import MobileTourist from "./filters/mobileFilters/MobileTourist";

export default function FiltersMobile() {
  return (
    <div className="flex flex-col items-center w-full pb-4">
      <div className="rounded-xl w-full gap-[1px] flex flex-col items-center justify-center px-4">
        <MobileFlyingCountry />
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
            <MobileFlyingDate />
          </div>
        </div>
      </div>
    </div>
  );
}
