import { useContext, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";

export default function MobileTourist() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState<number>(2);
  const [btnStatus, setBtnStatus] = useState<boolean>(true);
  const [childrenList, setChildrenList] = useState<
    { id: string; age: number; text: string; key: number }[]
  >([]);

  const children = [
    { id: "до 2", age: 1, text: "лет" },
    { id: "2", age: 2, text: "года" },
    { id: "3", age: 3, text: "года" },
    { id: "4", age: 4, text: "года" },
    { id: "5", age: 5, text: "лет" },
    { id: "6", age: 6, text: "лет" },
    { id: "7", age: 7, text: "лет" },
    { id: "8", age: 8, text: "лет" },
    { id: "9", age: 9, text: "лет" },
    { id: "10", age: 10, text: "лет" },
    { id: "11", age: 11, text: "лет" },
    { id: "12", age: 12, text: "лет" },
    { id: "13", age: 13, text: "лет" },
    { id: "14", age: 14, text: "лет" },
    { id: "15", age: 15, text: "лет" },
  ];

  const counterPlus = () => {
    if (adults < 6) {
      setAdults((count) => count + 1);
    }
  };

  const counterMinus = () => {
    if (adults > 1) {
      setAdults((count) => count - 1);
    }
  };

  const checkBtn = (
    childrenList: { id: string; age: number; text: string; key: number }[]
  ) => {
    return childrenList.length < 3;
  };

  const handleAddChild = (child: { id: string; age: number; text: string }) => {
    setChildrenList((prev) => [...prev, { ...child, key: Date.now() }]);
    setBtnStatus(true);
  };

  const minusChild = (key: number) => {
    setChildrenList((prev) => prev.filter((child) => child.key !== key));
  };

  const handleConfirm = () => {
    setIsOpen(false);
    setData("param5", { childrenList, adults });
  };

  useEffect(() => {
    setData("param5", { childrenList, adults });
  }, []);

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="px-2 w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 rounded-md md:rounded-xl !z-0 !scale-100 !opacity-100 py-1"
      >
        <div className="flex flex-col items-start justify-between w-full">
          <span className="text-slate-600 mb-[1px] text-xs md:text-sm">
            Туристы
          </span>
          <p className="text-black text-base md:text-lg font-medium">
            {childrenList.length === 0
              ? `${adults} взрослых`
              : `${adults} взр ${childrenList.length} реб`}
          </p>
        </div>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="h-[85vh] !p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Выберите туристов</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3">
            <div className="flex flex-col items-center gap-4">
              {/* Управление взрослыми */}
              <div className="flex flex-col gap-4 items-center w-full">
                <div className="flex items-center justify-between w-full bg-slate-100 rounded-full">
                  <Button
                    className="rounded-full min-w-16"
                    onPress={counterMinus}
                  >
                    -
                  </Button>
                  <p className="text-black text-base">
                    <span className="font-medium">{adults}</span> взрослых
                  </p>
                  <Button
                    className="rounded-full min-w-16"
                    onPress={counterPlus}
                  >
                    +
                  </Button>
                </div>

                {/* Список детей */}
                <div className="flex flex-col items-start gap-4 w-full">
                  {childrenList.map((child, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between w-full bg-slate-100 rounded-full"
                    >
                      <Button
                        className="rounded-full min-w-16"
                        onPress={() => minusChild(child.key)}
                      >
                        -
                      </Button>
                      <div className="flex gap-2">
                        <span className="text-base">Ребёнок:</span>
                        <div>
                          <p className="text-black text-base">
                            <span className="font-medium text-black">
                              {child.id}
                            </span>
                            {` ${child.text}`}
                          </p>
                        </div>
                      </div>
                      <div className="min-w-16"></div>
                    </div>
                  ))}
                </div>

                {/* Добавление детей */}
                <div className="w-full">
                  {btnStatus ? (
                    <Button
                      className="w-full rounded-full text-base"
                      onPress={() => setBtnStatus(false)}
                      isDisabled={!checkBtn(childrenList)}
                    >
                      Добавить ребёнка
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center">
                      <p className="text-black text-base mb-4">
                        Выберите возраст ребенка
                      </p>
                      <div className="grid grid-rows-5 grid-cols-3 gap-2">
                        {children.map((child) => (
                          <Button
                            key={child.id}
                            className="rounded-full"
                            onPress={() => handleAddChild(child)}
                          >
                            <p className="text-black">
                              <span className="font-medium text-black">
                                {child.id}
                              </span>
                              {` ${child.text}`}
                            </p>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопка подтверждения */}
              <div className="w-full mt-4">
                <Button
                  className="w-full text-base rounded-full bg-blue-500 text-white hover:bg-blue-700"
                  onPress={handleConfirm}
                >
                  Выбрать
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
