"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TourFiltersProps } from "@/types";

export default function TourFilters({
  tours,
  onFilterChange,
}: TourFiltersProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [destination, setDestination] = useState("");
  const [showAllTours, setShowAllTours] = useState(false);

  // Memoize unique destinations
  const destinations = useMemo(
    () => [...new Set(tours.map((tour) => tour.destination))],
    [tours]
  );

  // Memoize price change handler
  const handlePriceChange = useCallback(
    (value: string, setter: (value: string) => void) => {
      const numValue = Number(value);
      if (value === "" || (numValue >= 0 && !isNaN(numValue))) {
        setter(value);
      }
    },
    []
  );

  // Memoize filter logic
  const applyFilters = useCallback(() => {
    if (
      !showAllTours &&
      !searchQuery &&
      !minPrice &&
      !maxPrice &&
      !duration &&
      !destination
    ) {
      onFilterChange([]);
      return;
    }

    const filtered = tours.filter((tour) => {
      const searchMatch =
        searchQuery === "" ||
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase());

      const priceMatch =
        (minPrice === "" || tour.price >= Number(minPrice)) &&
        (maxPrice === "" || tour.price <= Number(maxPrice));

      const durationMatch =
        duration === "" || tour.duration === Number(duration);

      const destinationMatch =
        destination === "" || tour.destination === destination;

      return searchMatch && priceMatch && durationMatch && destinationMatch;
    });

    onFilterChange(filtered);
  }, [
    searchQuery,
    minPrice,
    maxPrice,
    duration,
    destination,
    tours,
    onFilterChange,
    showAllTours,
  ]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Memoize destination options
  const destinationOptions = useMemo(
    () =>
      destinations.map((dest) => (
        <option key={dest} value={dest}>
          {dest}
        </option>
      )),
    [destinations]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours..."
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Price range inputs */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
              placeholder="Min"
              min="0"
              className="w-1/2 border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
              placeholder="Max"
              min="0"
              className="w-1/2 border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Duration input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (days)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Select duration"
            min="1"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Destination dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All destinations</option>
            {destinationOptions}
          </select>
        </div>

        {/* Show All Tours toggle */}
        <div className="col-span-full">
          <button
            onClick={() => setShowAllTours(!showAllTours)}
            className={`${
              showAllTours
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-500 hover:text-white`}
          >
            {showAllTours ? "Hide All Tours" : "Show All Tours"}
          </button>
        </div>
      </div>
    </div>
  );
}
