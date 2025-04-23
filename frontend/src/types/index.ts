// Tour related types
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  destination: string;
  itinerary: ItineraryDay[];
  created_at: string;
  updated_at: string;
}

// Component Props interfaces
export interface TourListProps {
  tours: Tour[]; // Array of tour objects to display
  onTourUpdated: () => void; // Callback function to refresh the tour list
}

export interface TourFormProps {
  initialData?: Tour;
  onSuccess: (tour: Tour) => void;
}

export interface TourFiltersProps {
  tours: Tour[];
  onFilterChange: (filteredTours: Tour[]) => void;
}

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}