"use client";

import { useState, FormEvent } from "react";
import { Tour, toursApi } from "@/lib/api/tours";
import MarkdownEditor from "./MarkdownEditor";

// Props interface defining the expected properties for the TourForm component
interface TourFormProps {
  initialData?: Tour; // Optional initial tour data for editing mode
  onSuccess: (tour: Tour) => void; // Callback function after successful form submission
}

export default function TourForm({ initialData, onSuccess }: TourFormProps) {
  // State management for form fields and UI feedback
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [duration, setDuration] = useState(initialData?.duration || 1);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [destination, setDestination] = useState(
    initialData?.destination || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form submission handler - creates or updates a tour
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare the tour data for submission
    const payload = {
      title,
      description,
      duration,
      price,
      destination,
      itinerary: initialData?.itinerary || [],
    };

    try {
      let result: Tour;
      // Determine whether to create a new tour or update an existing one
      if (initialData) {
        result = await toursApi.updateTour(initialData.id, payload);
      } else {
        result = await toursApi.createTour(
          payload as Omit<Tour, "id" | "created_at" | "updated_at">
        );
      }
      onSuccess(result); // Call success callback with the result
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save tour. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4"
    >
      {/* Form header showing current mode (Create/Edit) */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {initialData ? "Edit Tour" : "Create New Tour"}
      </h2>

      {/* Error message display */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Title input field */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Description field with markdown support */}
      <MarkdownEditor
        label="Description"
        value={description}
        onChange={setDescription}
        required
      />

      {/* Grid layout for duration and price fields */}
      <div className="grid grid-cols-2 gap-4">
        {/* Duration input field */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Duration (days)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            required
            min={1}
          />
        </div>

        {/* Price input field */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Price (USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            required
            min={0}
          />
        </div>
      </div>

      {/* Destination input field */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Submit button with loading state */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
      >
        {loading ? "Saving..." : initialData ? "Update Tour" : "Create Tour"}
      </button>
    </form>
  );
}
