import { useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { Modal, ModalContent } from "@heroui/react";
import FavoriteModal from "./FavoriteModal";
import { DataContext } from "../DataProvider";

interface MobileFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFavoriteModal({
  isOpen,
  onClose,
}: MobileFavoriteModalProps) {
  const { favoriteTours } = useContext(DataContext);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      backdrop="opaque"
      radius="sm"
      scrollBehavior="inside"
      isDismissable={true}
      shouldBlockScroll={true}
      className="!p-0 !m-0 !max-w-full md:hidden"
      hideCloseButton={true}
      shadow="none"
      classNames={{
        backdrop: "bg-black/30",
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <div className="w-full">
          <div className="bg-white w-full rounded-t-[10px]">
            {/* Header */}
            <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
              <h2 className="text-[20px] font-medium text-[#2E2E32]">
                Избранные туры
              </h2>
              <button onClick={onClose} className="absolute right-5">
                <RxCross2 className="w-6 h-6 text-[#FF621F]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-3">
              <FavoriteModal tours={favoriteTours} />
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
