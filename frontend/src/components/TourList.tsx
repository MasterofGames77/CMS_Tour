"use client";

import { Tour, TourListProps } from "@/types";
import { toursApi } from "@/lib/api/tours";
import { useState, useCallback, useMemo } from "react";
import TourForm from "./TourForm";

export default function TourList({ tours, onTourUpdated }: TourListProps) {
  // State for managing the tour being edited and form visibility
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleEdit = useCallback((tour: Tour) => {
    setSelectedTour(tour);
    setIsEditing(true);
  }, []);

  const handleDelete = useCallback(
    async (tourId: string) => {
      if (window.confirm("Are you sure you want to delete this tour?")) {
        try {
          await toursApi.deleteTour(tourId);
          onTourUpdated();
        } catch (error) {
          console.error("Failed to delete tour:", error);
          alert("Failed to delete tour. Please try again.");
        }
      }
    },
    [onTourUpdated]
  );

  const handleEditSuccess = useCallback(() => {
    setSelectedTour(null);
    setIsEditing(false);
    onTourUpdated();
  }, [onTourUpdated]);

  // Memoize the create tour button click handler
  const handleCreateTour = useCallback(() => {
    setSelectedTour(null);
    setIsEditing(true);
  }, []);

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(
    () =>
      tours.map((tour) => (
        <tr key={tour.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            {tour.title}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {tour.destination}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {tour.duration} days
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            ${tour.price}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            {/* Action buttons for editing and deleting tours */}
            <button
              onClick={() => handleEdit(tour)}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(tour.id)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </button>
          </td>
        </tr>
      )),
    [tours, handleEdit, handleDelete]
  );

  if (isEditing && selectedTour) {
    return (
      <TourForm initialData={selectedTour} onSuccess={handleEditSuccess} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section with title and create tour button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Tours
        </h2>
        <button
          onClick={handleCreateTour}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Tour
        </button>
      </div>

      {/* Tours table displaying all tour information */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tableRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}
