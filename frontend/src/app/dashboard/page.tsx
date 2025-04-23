"use client";

import { useEffect, useState } from "react";
import { Tour } from "@/types";
import { toursApi } from "@/lib/api/tours";
import Link from "next/link";
import TourFilters from "@/components/TourFilters";
import ChatWidget from "@/components/ChatWidget";

export default function Dashboard() {
  // State management for tours, loading state, and error handling
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tours when the component mounts
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await toursApi.getAllTours();
        setTours(data);
        setFilteredTours(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tours");
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg dark:text-gray-200">Loading tours...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  // Main dashboard UI with tour grid
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Collette Tour Dashboard
      </h1>

      {/* Tour filters */}
      <TourFilters tours={tours} onFilterChange={setFilteredTours} />

      {/* Responsive grid layout for tour cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through filtered tours to create individual tour cards */}
        {filteredTours.map((tour) => (
          <Link
            key={tour.id}
            href={`/tours/${tour.id}`}
            className="block transition-transform duration-200 hover:scale-105"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
              <div className="p-6">
                {/* Tour title */}
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {tour.title}
                </h2>
                {/* Tour description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tour.description}
                </p>
                {/* Tour duration and price */}
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{tour.duration} days</span>
                  <span>${tour.price}</span>
                </div>
                {/* Tour destination */}
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Destination: {tour.destination}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
