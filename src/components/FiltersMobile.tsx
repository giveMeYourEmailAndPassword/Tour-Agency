export default function FiltersMobile() {
  return (
    <div className="flex flex-col items-center w-full px-4 pb-4">
      <div className="bg-blue-600 rounded-xl w-full gap-3 flex flex-col items-center justify-center px-4">
        <div className="bg-white w-full h-10 rounded-xl"></div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2">
            <div className="bg-white w-32 h-10 rounded-xl"></div>
            <div className="bg-white w-full h-10 rounded-xl"></div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-white w-32 h-10 rounded-xl"></div>
            <div className="bg-white w-full h-10 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
