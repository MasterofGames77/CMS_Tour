"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { Tour, TourFormProps } from "@/types";
import { toursApi } from "@/lib/api/tours";
import MarkdownEditor from "./MarkdownEditor";

export default function TourForm({ initialData, onSuccess }: TourFormProps) {
  // Use refs for form fields that don't need to trigger re-renders
  const formRef = useRef<HTMLFormElement>(null);

  // State management for form fields and UI feedback
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 1,
    price: initialData?.price || 0,
    destination: initialData?.destination || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize form field handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "duration" || name === "price" ? Number(value) : value,
      }));
    },
    []
  );

  // Memoize description change handler
  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, []);

  // Memoize form submission handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formRef.current?.checkValidity()) return;

      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...formData,
          itinerary: initialData?.itinerary || [],
        };

        const result = initialData
          ? await toursApi.updateTour(initialData.id, payload)
          : await toursApi.createTour(
              payload as Omit<Tour, "id" | "created_at" | "updated_at">
            );

        onSuccess(result);
      } catch (err: unknown) {
        console.error("Submission failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save tour. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [formData, initialData, onSuccess]
  );

  // Memoize form title
  const formTitle = useMemo(
    () => (initialData ? "Edit Tour" : "Create New Tour"),
    [initialData]
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {formTitle}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <MarkdownEditor
        label="Description"
        value={formData.description}
        onChange={handleDescriptionChange}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Duration (days)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
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
            name="price"
            value={formData.price}
            onChange={handleInputChange}
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
          name="destination"
          value={formData.destination}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
      >
        {loading ? "Saving..." : formTitle}
      </button>
    </form>
  );
}
