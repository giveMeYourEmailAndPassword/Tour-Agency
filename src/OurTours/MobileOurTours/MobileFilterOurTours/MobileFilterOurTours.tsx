import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { useContext } from "react";
import { DataContext } from "../../../components/DataProvider";
import { parse, format } from "date-fns";
import { ru } from "date-fns/locale";
import FiltersMobileOT from "./FiltersMobileOT";
import { FaSearch } from "react-icons/fa";

export default function MobileFilterOurTours() {
  const [isOpen, setIsOpen] = useState(false);
  const { params, countries, searchTours, loading } = useContext(DataContext);

  const selectedCountry = countries.find(
    (country) => country.id === params.param2
  )?.label;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    try {
      const date = parse(dateString, "dd.MM.yyyy", new Date());
      return format(date, "dd.MM", { locale: ru });
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString;
    }
  };

  const handleSearchClick = async () => {
    await searchTours();
    setIsOpen(false);
  };

  return (
    <>
      {selectedCountry && (
        <div
          className="flex flex-col items-center text-white bg-blue-700 rounded-full w-[95%] px-4 active:bg-blue-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-base font-medium">{selectedCountry}</span>
          {params.param4?.startDate && params.param4?.endDate && (
            <div className="flex items-center text-xs opacity-80">
              <span>
                {formatDate(params.param4.startDate)} -{" "}
                {formatDate(params.param4.endDate)}, {params.param3?.startDay} -{" "}
                {params.param3?.endDay} нч,{" "}
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

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="!p-0 !m-0 !max-w-full flex flex-col z-40 fixed inset-0 overflow-hidden"
        hideCloseButton={true}
        shadow="none"
        size="full"
        motionProps={{
          variants: {
            enter: { opacity: 1, y: 0, transition: { duration: 0 } },
            exit: { opacity: 0, y: 0, transition: { duration: 0 } },
          },
        }}
      >
        <ModalContent className="flex flex-col h-screen overflow-auto bg-blue-400">
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Изменить параметры поиска</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="px-3 py-2 flex-1">
            <div className="flex flex-col items-start h-full w-full">
              <FiltersMobileOT onClose={() => setIsOpen(false)} />
            </div>
          </ModalBody>

          <div className="p-4 mt-auto">
            <div
              className={`rounded-lg flex items-center h-12 w-full justify-center
                ${
                  loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
                } 
                duration-500 cursor-pointer`}
              onClick={handleSearchClick}
            >
              <FaSearch className="text-white mr-2 text-lg" />
              <p className="text-white font-medium text-lg">
                {loading ? "Поиск..." : "Найти тур"}
              </p>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
