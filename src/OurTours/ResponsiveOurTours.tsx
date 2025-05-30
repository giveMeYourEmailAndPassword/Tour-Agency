import OurTours from "./OurTours/OurTours";
import MobileOurTours from "./MobileOurTours/MobileOurTours";

const ResponsiveOurTours = () => {
  return (
    <>
      <div className="hidden md:block">
        <OurTours />
      </div>
      <div className="block md:hidden">
        <MobileOurTours />
      </div>
    </>
  );
};

export default ResponsiveOurTours;
