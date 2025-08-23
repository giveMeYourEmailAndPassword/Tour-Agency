import HotelDetails from "../Hotel/HotelDetails";
import HotelDetailsMobile from "../Hotel/HotelDetailsMobile";

export default function ResponsiveHotelDetails() {
  return (
    <>
      <div className="hidden md:block">
        <HotelDetails />
      </div>
      <div className="block md:hidden">
        <HotelDetailsMobile />
      </div>
    </>
  );
}
