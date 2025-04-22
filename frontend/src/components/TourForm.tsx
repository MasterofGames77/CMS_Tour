"use client";

import { useState, useEffect, FormEvent } from "react";
import { Tour, toursApi } from "@/lib/api/tours";

interface TourFormProps {
  initialData?: Tour; // undefined for “New”
  onSuccess: (tour: Tour) => void; // callback after save
}

export default function TourForm({ initialData, onSuccess }: TourFormProps) {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      duration,
      price,
      destination,
      itinerary: [],
    };

    try {
      let result: Tour;
      if (initialData) {
        result = await toursApi.updateTour(initialData.id, payload);
      } else {
        result = await toursApi.createTour(
          payload as Omit<Tour, "id" | "created_at" | "updated_at">
        );
      }
      onSuccess(result);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError("Failed to save tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {initialData ? "Edit Tour" : "Create New Tour"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

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

      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
