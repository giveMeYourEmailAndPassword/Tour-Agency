import useHotelDetails from "../Hooks/UseHotelDetails";
import { CircularProgress } from "@heroui/progress";

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  const reviews = hotelDetails?.data?.hotel?.reviews?.review;

  return (
    <div className="border-t pt-4">
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: Review, index: number) => (
            <>
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
            </>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-700">Нет отзывов</div>
      )}
    </div>
  );
};
