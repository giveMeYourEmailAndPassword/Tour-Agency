import HotelToursInfo from "./HotelToursInfo";
import MobileHotelToursInfo from "./MobileHotelToursInfo";

export default function ResponsiveHotelInfo() {
  return (
    <>
      <div className="hidden md:block">
        <HotelToursInfo />
      </div>
      <div className="block md:hidden">
        <MobileHotelToursInfo />
      </div>
    </>
  );
}
