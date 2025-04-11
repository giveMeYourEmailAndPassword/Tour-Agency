interface DetailsOfTourProps {
  tour: Tour;
  hotelcode: string;
}

export const DetailsOfTour = ({ tour, hotelcode }: DetailsOfTourProps) => {
  const handleClick = () => {
    window.location.href = `/OurTours/hotel/${hotelcode}/${tour.tourid}`;
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex px-8 py-1 bg-slate-200 rounded-full font-medium text-black hover:bg-green-600/80 transition-colors"
      >
        {tour.price}
        {tour.currency === "EUR"
          ? "€"
          : tour.currency === "USD"
          ? "$"
          : tour.currency}
      </button>
    </>
  );
};
