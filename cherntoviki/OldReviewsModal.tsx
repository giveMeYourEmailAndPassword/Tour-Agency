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
  hotelRating,
  hotelStars,
  reviewsCount,
  reviews,
}: ReviewsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        closeButton: "text-xl",
      }}
    >
      <ModalContent className="max-w-4xl max-h-[80vh] px-4 py-2">
        <>
          <ModalHeader className="flex gap-1">
            <div className="flex items-center gap-2">
              <span>Отзывы об отеле:</span>
              <span className="text-xl font-bold">
                {hotelName.length > 37
                  ? `${hotelName.slice(0, 37)}...`
                  : hotelName}
              </span>
              <div className="flex-shrink-0 flex gap-2">
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="font-semibold text-base">{hotelRating}</span>
                </div>
                <div className="bg-blue-100 px-2 py-0.5 rounded-full shadow-sm flex items-center whitespace-nowrap">
                  <span className="text-blue-600 font-semibold text-base">
                    {hotelStars} / 5
                  </span>
                </div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="max-h-[60vh] overflow-y-auto w-full scrollbar-custom">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{review.name}</span>
                      <span className="text-gray-500">{review.reviewdate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span>{review.rate}/5</span>
                      <span>• {review.traveltime}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xl text-gray-700">
                Нет отзывов
              </div>
            )}
          </ModalBody>
          <ModalFooter />
        </>
      </ModalContent>
    </Modal>
  );
}
