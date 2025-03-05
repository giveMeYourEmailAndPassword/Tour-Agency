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

              <Route path="/hotel/:hotelcode" element={<HotelDetails />} />
            </Routes>
          </QueryClientProvider>
        </BrowserRouter>
      </DataProvider>
    </HeroUIProvider>
  </StrictMode>
);
