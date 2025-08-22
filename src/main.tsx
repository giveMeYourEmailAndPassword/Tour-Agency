import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../css/index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HotelDetails from "./Hotel/HotelDetails.tsx";
import { HeroUIProvider } from "@heroui/react";
import { DataProvider } from "./components/DataProvider.tsx";
import Booking from "./components/Booking.tsx";
import ResponsiveOurTours from "./OurTours/ResponsiveOurTours.tsx";
import AppForManager from "./ForManager/AppForManager.tsx";
import OurToursForManager from "./ForManager/OurToursForManager.tsx";
import ResponsiveHotelInfo from "./components/ResponsiveHotelInfo.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <DataProvider>
            <Routes>
              {/* Главная страница */}
              <Route path="/" element={<App />} />

              <Route path="/ForManager" element={<AppForManager />} />

              <Route
                path="/OurToursForManager"
                element={<OurToursForManager />}
              />

              {/* Наши туры (место где показываются наши туры) */}
              <Route path="/OurTours" element={<ResponsiveOurTours />} />

              <Route
                path="/OurTours/hotel/:hotelcode/:tourId"
                element={<HotelDetails />}
              />

              <Route
                path="/hotel/:hotelcode/:tourId"
                element={<HotelDetails />}
              />

              <Route
                path="/hotel/:hotelcode"
                element={<ResponsiveHotelInfo />}
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
          </DataProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
