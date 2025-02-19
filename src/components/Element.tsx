import { useContext } from "react";
import { DataContext } from "./DataProvider";

export default function ElementDisplay() {
  const { params } = useContext(DataContext);
  console.log(params);

  return (
    <div>
      <h2 className="text-white text-3xl font-bold">Выбранные данные:</h2>

      <ul>
        {/* {Object.entries(params).map(([key, value]) => (
          <li className="text-white text-xl" key={key}>
            <strong>{key}:</strong> {value || "Не выбрано"}
          </li>
        ))} */}

        <p>город вылета {params.param1}</p>
        <p>страна прилета {params.param2}</p>

        <p>Ночей от: {params.param3?.startDay}</p>
        <p>Ночей до: {params.param3?.endDay}</p>

        <p>Дата вылета {params.param4?.startDate}</p>
        <p>Дата вылета {params.param4?.endDate}</p>

        <p>Взрослых {params.param5?.adults}</p>
        <p>Детей {params.param5?.childrenList.length}</p>
      </ul>
    </div>
  );
}
