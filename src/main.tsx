import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../css/index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.tsx";
import OurTours from "./OurTours/OurTours.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HotelDetails from "./Hotel/HotelDetails.tsx";
import { HeroUIProvider } from "@heroui/react";
import { DataProvider } from "./components/DataProvider.tsx";
import Booking from "./components/Booking.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <DataProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Routes>
              {/* Главная страница */}
              <Route path="/" element={<App />} />

              {/* Наши туры (место где показываются наши туры) */}
              <Route path="/OurTours" element={<OurTours />} />

              <Route
                path="/OurTours/hotel/:hotelcode/:tourId"
                element={<HotelDetails />}
              />

              <Route
                path="/hotel/:hotelcode/:tourId"
                element={<HotelDetails />}
              />

              <Route
                path="/OurTours/hotel/:hotelcode/:tourId/booking"
                element={<Booking />}
              />

              <Route
                path="/hotel/:hotelcode/:tourId/booking"
                element={<Booking />}
              />
            </Routes>
          </QueryClientProvider>
        </BrowserRouter>
      </DataProvider>
    </HeroUIProvider>
  </StrictMode>
);
