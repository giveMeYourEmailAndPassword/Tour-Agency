import ScrollToTopButton from "./ScrollToTopButton";
import Favorite from "./Favorite/Favorite";

export default function FloatingControls() {
  return (
    <div className="fixed bottom-8 right-0 flex flex-col items-end gap-2 z-50">
      <ScrollToTopButton />
      <Favorite />
    </div>
  );
}
