import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Button } from "@heroui/react";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../DataProvider";

export default function Tourists() {
  const { setData } = useContext(DataContext);

  const [adults, setAdults] = useState<number>(2); // Количество взрослых
  const [btnStatus, setBtnStatus] = useState<boolean>(true); // Управление кнопкой "Добавить ребенка"
  const [childrenList, setChildrenList] = useState<
    { id: string; age: number; text: string; key: number }[] // Список детей
  >([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false); // Управление видимостью Popover

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
    // Добавляем выбранного ребенка в список
    setChildrenList((prev) => [...prev, { ...child, key: Date.now() }]);
    setBtnStatus(true); // Возвращаем кнопку "Добавить ребенка"
  };

  const minusChild = (key: number) => {
    setChildrenList((prev) => prev.filter((child) => child.key !== key));
  };

  // Закрытие Popover
  const handleConfirm = () => {
    setIsPopoverOpen(false); // Закрываем Popover
  };

  // Используем useEffect для передачи данных в контекст
  useEffect(() => {
    if (isPopoverOpen) {
      setData("param5", { childrenList, adults });
    }
  }, [adults, childrenList]);

  return (
    <Popover
      placement="bottom"
      isOpen={isPopoverOpen} // Управление видимостью Popover
      onOpenChange={(isOpen) => setIsPopoverOpen(isOpen)} // Обновление состояния при открытии/закрытии
    >
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100">
        <Button
          className="p-7 bg-white hover:bg-slate-100"
          size="lg"
          onPress={() => setIsPopoverOpen(true)} // Открываем Popover при нажатии
        >
          <div className="flex flex-col justify-between">
            <h1 className="text-sm text-slate-600">Туристы</h1>
            {childrenList.length === 0 ? (
              <p className="text-black text-lg font-medium">
                {adults} взрослых
              </p>
            ) : (
              <p className="text-black text-lg font-medium">
                {adults} взр {childrenList.length} реб
              </p>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-1 w-80">
          <div className="text-base font-medium mb-4">Туристы</div>
          <div className="flex flex-col items-center gap-4">
            {/* Управление взрослыми */}
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center justify-between w-72 bg-slate-100 rounded-full">
                <Button
                  className="rounded-full min-w-16"
                  onPress={counterMinus}
                >
                  -
                </Button>
                <p className="text-black text-base">
                  <span className="font-medium">{adults}</span> взрослых
                </p>
                <Button className="rounded-full min-w-16" onPress={counterPlus}>
                  +
                </Button>
              </div>

              {/* Рендеринг списка детей */}
              <div className="flex flex-col items-start gap-4">
                {childrenList.map((child, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between w-72 bg-slate-100 rounded-full"
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
            <div className="mb-2">
              <Button
                className="text-base min-w-40 rounded-full bg-blue-500 text-white hover:bg-blue-700"
                onPress={handleConfirm} // Закрываем Popover при нажатии
              >
                Выбрать
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
