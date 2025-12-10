import { useState, useEffect, useRef } from "react";
import { useWeather } from "@hooks/useWeather";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import type { CitySearchResult } from "@features/weather/types";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { search, searchResults, selectCity, clearSearch, fetchWeather } =
    useWeather();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
        setIsOpen(true);
      } else {
        clearSearch();
        setIsOpen(false);
      }
    }, 150);

    return () => clearTimeout(debounce);
  }, [query, search, clearSearch]);

  const handleSelect = (city: CitySearchResult) => {
    selectCity(city);
    setQuery("");
    setIsOpen(false);
    toast.success(`Weather updated for ${city.name}, ${city.country}`);
  };

  const handleUseLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
          toast.success("Using your current location");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
          toast.error(
            "Unable to get your location. Please enable location access."
          );
        }
      );
    } else {
      setIsLocating(false);
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleClear = () => {
    setQuery("");
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities..."
            className="flex w-full border border-primary/50 px-3 py-2 text-base ring-offset-background 
            placeholder:text-muted-foreground 
            focus-visible:outline-2 outline-primary
            md:text-sm pl-10 pr-10 h-12 rounded-2xl bg-card/80 backdrop-blur-sm"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={handleUseLocation}
          disabled={isLocating}
          className="inline-flex btn overflow-hidden items-center justify-center h-12 w-12 rounded-2xl border border-primary/50 bg-card/80 
          backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-12 mt-2 glass-card p-2 z-50"
          >
            {searchResults.map((city, index) => (
              <motion.button
                key={`${city.lat}-${city.lon}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(city)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{city.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {city.state ? `${city.state}, ` : ""}
                    {city.country}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
