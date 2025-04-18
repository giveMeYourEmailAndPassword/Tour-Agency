interface Review {
  name: string;
  content: string;
  traveltime: string;
  rate: string;
  reviewdate: string;
}

interface ReviewsModalProps {
  hotelName: string;
  hotelRating: number;
  hotelStars: number;
  reviews: Review[];
}

export default function ReviewsModal({ reviews }: ReviewsModalProps) {
  return (
    <div className="w-full max-h-[80vh] pl-1 py-1 bg-white rounded-lg">
      <div className="max-h-[49vh] overflow-y-auto w-full whitespace-pre-wrap break-words scrollbar-custom pr-2">
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
          <div className="flex flex-col items-center justify-center h-[48vh] text-center text-xl text-gray-700">
            На данный момент отзывы об этом отеле отсутствуют
          </div>
        )}
      </div>
    </div>
  );
}
