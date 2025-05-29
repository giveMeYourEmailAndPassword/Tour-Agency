import ScrollToTopButton from "./ScrollToTopButton";
import Favorite from "./Favorite/Favorite";

export default function FloatingControls() {
  return (
    <div className="hidden md:flex fixed bottom-8 right-0 flex-col items-end gap-2 z-50">
      <ScrollToTopButton />

      <div className="hidden md:block">
        <Favorite />
      </div>
    </div>
  );
}
