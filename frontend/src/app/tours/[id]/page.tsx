"use client";

import { useEffect, useState } from "react";
import { Tour } from "@/types";
import { toursApi } from "@/lib/api/tours";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ItineraryDay } from "@/types";

export default function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await toursApi.getTourById(id as string);
        setTour(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tour details");
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg dark:text-gray-200">
          Loading tour details...
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 dark:text-red-400">
          {error || "Tour not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {tour.title}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none mb-4">
            <ReactMarkdown>{tour.description}</ReactMarkdown>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Duration:</span> {tour.duration}{" "}
              days
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Price:</span> ${tour.price}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Destination:</span>{" "}
              {tour.destination}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Itinerary
            </h2>
            <div className="space-y-6">
              {tour.itinerary.map((day: ItineraryDay) => (
                <div
                  key={day.day}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Day {day.day}: {day.title}
                  </h3>
                  <div className="prose dark:prose-invert max-w-none mb-3">
                    <ReactMarkdown>{day.description}</ReactMarkdown>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Highlights:
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {day.highlights.map(
                        (highlight: string, index: number) => (
                          <li key={index}>{highlight}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
