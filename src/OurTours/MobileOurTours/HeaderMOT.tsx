import { IoIosArrowBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useContext } from "react";
import { DataContext } from "../../components/DataProvider";
import { parse, format } from "date-fns";
import { ru } from "date-fns/locale";
import MobileFavorite from "../../components/filters/OtherMobile/MobileFavorite";

export default function HeaderMOT() {
  const { params, cities, countries } = useContext(DataContext);

  const selectedCity = cities.find((city) => city.id === params.param1)?.label;
  const selectedCountry = countries.find(
    (country) => country.id === params.param2
  )?.label;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    try {
      // Парсим строку в объект Date
      const date = parse(dateString, "dd.MM.yyyy", new Date());
      // Форматируем дату в нужный формат
      return format(date, "dd.MM", { locale: ru }); // "24.10"
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString;
    }
  };

  //   const navigate = useNavigate();

  //   const handleGoBack = () => {
  //     navigate(-1, { replace: true });
  //   };

  return (
    <div className="w-full bg-blue-500 shadow-sm">
      <div className="flex justify-between items-center px-2 py-2 gap-2">
        <a
          className="text-white bg-blue-700 rounded-full p-2 
                     transition-all duration-200 
                     active:scale-90 
                     hover:bg-blue-900"
          href="/"
        >
          <IoIosArrowBack size={24} />
        </a>

        {selectedCountry && (
          <div className="flex flex-col items-center text-white bg-blue-700 rounded-full w-[95%] px-4">
            <span className="text-base font-medium mb-[-4px]">
              {selectedCountry}
            </span>
            {params.param4?.startDate && params.param4?.endDate && (
              <div className="flex items-center text-sm opacity-80">
                <span>
                  {formatDate(params.param4.startDate)} -{" "}
                  {formatDate(params.param4.endDate)}, {params.param3?.startDay}{" "}
                  - {params.param3?.endDay} нч,{" "}
                  {params.param5?.childrenList?.length > 0
                    ? `${
                        params.param5.adults + params.param5.childrenList.length
                      } чел`
                    : `${params.param5?.adults} взр`}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <MobileFavorite />
          <button className="text-white transition-transform active:scale-90 bg-blue-700 rounded-full p-2">
            <BsThreeDotsVertical size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
