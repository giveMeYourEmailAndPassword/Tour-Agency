import { FaStar, FaSearch } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router";
import { useState } from "react";
// import Hotel from "./selects/hotel";
// import NightsSelector from "./selects/NightsSelector";
import FlyingDate from "./selects/FlyingDate";
import DepartureCity from "./selects/DepartureCity";
import FlyingCountry from "./selects/FlyingCountry";
import NightsFrom from "./selects/NightsFrom";
import Tourists from "./selects/Tourists";

export default function Filters() {
  const navigate = useNavigate();

  const [departure, setDeparture] = useState("80"); //{Бишкек} //{Алматы, код 60}
  const [country, setCountry] = useState("1"); //{Турция}
  const [nightsFrom, setNightsFrom] = useState(6);
  const [nightsTo, setNightsTo] = useState(12);
  const [dateFrom, setDateFrom] = useState("26.11.2024");
  const [dateTo, setDateTo] = useState("10.12.2024");
  const [adults, setAdults] = useState(2);
  const [stars, setStars] = useState<number | null>(null);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Месяц начинается с 0, поэтому добавляем 1
    const day = d.getDate().toString().padStart(2, "0");
    return `${day}.${month}.${year}`;
  };

  const fetchTourData = () => {
    const params = new URLSearchParams();
    params.append("authlogin", "Ikram.kv@gmail.com");
    params.append("authpass", "YkCfsYMj4322");
    params.append("departure", departure);
    params.append("country", country);
    params.append("datefrom", formatDate(dateFrom));
    params.append("dateto", formatDate(dateTo));
    params.append("nightsfrom", nightsFrom.toString());
    params.append("nightsto", nightsTo.toString());
    params.append("adults", adults.toString());
    // params.append("currency", "currency=1");
    if (stars !== null && stars !== undefined) {
      params.append("stars", stars.toString());
    }
    params.append("format", "json");

    fetch(`http://tourvisor.ru/xml/search.php?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.requestid) {
          "Данные:", data;
          // Перенаправляем на страницу с результатами и передаем requestid через state
          navigate("/OurTours", {
            state: { requestid: data.result.requestid },
          });
        } else {
          console.error("Не удалось получить requestid", data);
        }
      })
      .catch((err) => console.error("Ошибка:", err));
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="bg-blue-600 rounded-xl w-[173vh] h-32">
          <div className="flex flex-col">
            <div className="flex p-4 bg-white rounded-lg border-r gap-3 m-5">
              {/* Город вылета */}
              {/* <div className="flex flex-col py-1 px-2 rounded-lg w-44 hover:bg-slate-100 group">
                <p className="text-slate-500 text-sm px-1">Город вылета</p>
                <select
                  className="text-black text-lg font-medium bg-transparent group-hover:bg-slate-100 focus:outline-none"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                >
                  <option value="80">Бишкек</option>
                  <option value="1">Москва</option>
                </select>
              </div> */}
              <DepartureCity />
              <div className="border"></div>
              {/* Страна */}
              {/* <div className="flex flex-col py-1 px-2 rounded-lg w-44 hover:bg-slate-100 group">
                <p className="text-slate-500 text-sm">Страна</p>
                <select
                  className="text-black text-lg font-medium bg-transparent group-hover:bg-slate-100 focus:outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="1">Турция</option>
                  <option value="2">Египет</option>
                </select>
              </div>
              <div className="border"></div> */}
              <FlyingCountry />
              <div className="border"></div>
              {/* На сколько ночей */}
              {/* <div className="flex flex-col py-1 px-2 rounded-lg w-40">
                <p className="text-slate-500 text-sm">Ночей</p>
                <p className="text-black text-lg font-medium">3-12</p>
              </div>
              <div className="border"></div> */}
              <div className="flex items-center">
                <NightsFrom />
              </div>
              <div className="border"></div>
              {/* <div className="flex flex-col py-1 px-2 rounded-lg w-40">
                <p className="text-slate-500 text-sm">Ночей</p>
                <input
                  type="number"
                  className="text-black text-lg font-medium"
                  value={nightsFrom}
                  onChange={(e) => setNightsFrom(Number(e.target.value))}
                  min={1}
                />
                <span>до</span>
                <input
                  type="number"
                  className="text-black text-lg font-medium"
                  value={nightsTo}
                  onChange={(e) => setNightsTo(Number(e.target.value))}
                  min={nightsFrom}
                />
              </div>
              <div className="border"></div> */}
              {/* Дата вылета */}
              {/* <div className="flex flex-col py-1 px-2 rounded-lg w-44">
                <p className="text-slate-500 text-sm">Дата вылета</p>
                <input
                  type="date"
                  className="text-black text-lg font-medium"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span>до</span>
                <input
                  type="date"
                  className="text-black text-lg font-medium"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>*/}
              <FlyingDate />
              <div className="border"></div>
              {/* Туристы */}
              <div className="flex flex-col py-1 px-2 rounded-lg w-40">
                <p className="text-slate-500 text-sm">Туристы</p>
                <input
                  type="number"
                  className="text-black text-lg font-medium"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="border"></div>
              {/* Кнопка поиска */}
              <div
                className="rounded-lg border flex items-center w-44 justify-center ml-2 bg-blue-400 hover:bg-orange-500 duration-500"
                onClick={fetchTourData}
              >
                <FaSearch className="text-white mr-2 text-lg" />
                <p className="text-white font-medium text-lg">Найти</p>
              </div>
            </div>
          </div>

          {/* <div className="flex gap-5 mx-12">
            <div className="flex items-center gap-14 border px-3 py-2 rounded-lg border-blue-400">
              <p className="font-medium">Класс отеля</p>
              <div className="flex items-center gap-[1px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setStars(star)} // Устанавливаем рейтинг
                    className={`text-xl ${
                      stars && stars >= star
                        ? "text-orange-500"
                        : "text-blue-400"
                    }`} // Изменяем цвет в зависимости от рейтинга
                  />
                ))}
              </div>
            </div>

            <Hotel />

            <div className="flex items-center gap-14 border px-3 py-2 rounded-lg border-blue-400 h-10">
              <p className="font-medium">Питание</p>
              <IoIosArrowDown className="text-white text-2xl" />
            </div>

            <div className="flex items-center gap-14 border px-3 py-2 rounded-lg border-blue-400 h-10">
              <p className="font-medium">Рейтинг</p>
              <IoIosArrowDown className="text-white text-2xl" />
            </div>

            <div className="flex items-center gap-14 border px-3 py-2 rounded-lg border-blue-400 h-10">
              <p className="font-medium">Услуги Отеля</p>
              <IoIosArrowDown className="text-white text-2xl" />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
