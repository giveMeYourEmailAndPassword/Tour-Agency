import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface Review {
  name: string;
  content: string;
  traveltime: string;
  rate: string;
  reviewdate: string;
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  reviewsCount: number;
  hotelRating: number;
  hotelStars: number;
  reviews: Review[];
}

export default function ReviewsModal({
  isOpen,
  onClose,
  hotelName,
  reviewsCount,
  hotelRating,
  hotelStars,
  reviews,
}: ReviewsModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl max-h-[80vh] px-4">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2>Отзывы об отеле {hotelName}</h2>
              <div className="flex gap-3 text-sm">
                <span>Рейтинг: {hotelRating}</span>
                <span>Звёзд: {hotelStars}</span>
                <span>Всего отзывов: {reviewsCount}</span>
              </div>
            </ModalHeader>
            <ModalBody className="max-h-[60vh] overflow-y-auto w-full scrollbar-custom">
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{review.name}</span>
                      <span className="text-gray-500">{review.reviewdate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span>{review.rate}/5</span>
                      <span className="text-gray-500">
                        • {review.traveltime}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
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
