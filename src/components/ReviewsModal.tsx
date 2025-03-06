import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  reviewsCount: number;
}

export default function ReviewsModal({
  isOpen,
  onClose,
  hotelName,
  reviewsCount,
}: ReviewsModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Отзывы об отеле {hotelName}
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-600">Всего отзывов: {reviewsCount}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
