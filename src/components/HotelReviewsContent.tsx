import useHotelDetails from "../Hooks/UseHotelDetails";
import { CircularProgress } from "@heroui/progress";
import { useState } from "react";

interface Review {
  name: string;
  content: string;
  traveltime: string;
  rate: string;
  reviewdate: string;
}

interface HotelReviewsContentProps {
  hotelcode: string;
}

export const HotelReviewsContent = ({
  hotelcode,
}: HotelReviewsContentProps) => {
  const { data: hotelDetails, isLoading } = useHotelDetails(hotelcode, true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  const reviews = hotelDetails?.data?.hotel?.reviews?.review;
  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  return (
    <div className="border-t pt-4">
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {displayedReviews.map((review: Review, index: number) => (
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
          {reviews.length > 3 && !showAllReviews && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAllReviews(true)}
                className="bg-slate-200 rounded-full px-4 py-2 text-black/50 hover:bg-slate-300"
              >
                Показать больше отзывов
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-700">Нет отзывов</div>
      )}
    </div>
  );
};
