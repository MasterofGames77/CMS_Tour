"use client";

import { Tour, toursApi } from "@/lib/api/tours";
import { useState } from "react";
import TourForm from "./TourForm";

// Props interface defining the expected properties for the TourList component
interface TourListProps {
  tours: Tour[]; // Array of tour objects to display
  onTourUpdated: () => void; // Callback function to refresh the tour list
}

export default function TourList({ tours, onTourUpdated }: TourListProps) {
  // State for managing the tour being edited and form visibility
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Handler for editing a tour - sets the tour to edit and shows the form
  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setShowForm(true);
  };

  // Handler for deleting a tour - confirms with user and calls the API
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await toursApi.deleteTour(id);
        onTourUpdated(); // Refresh the tour list after deletion
      } catch (error) {
        console.error("Failed to delete tour:", error);
        alert("Failed to delete tour. Please try again.");
      }
    }
  };

  // Handler for successful form submission - hides form and refreshes list
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTour(null);
    onTourUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Header section with title and create tour button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Tours
        </h2>
        <button
          onClick={() => {
            setEditingTour(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Tour
        </button>
      </div>

      {/* Tour form component - shown when creating or editing a tour */}
      {showForm && (
        <TourForm
          initialData={editingTour || undefined}
          onSuccess={handleFormSuccess}
        />
      )}

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
            {/* Map through tours array to create table rows */}
            {tours.map((tour) => (
              <tr
                key={tour.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
