export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface CustomizationRequest {
  destination: string;
  type: "itinerary" | "duration" | null;
  inProgress: boolean;
}

export interface TourContext {
  destination: string;
  stage: TourStage;
  contactPreference?: "email" | "phone";
  userEmail?: string;
  userPhone?: string;
  customizationNotes?: string;
}

// Tour stages as a const enum for type safety
export const enum TourStage {
  Initial = "initial",
  Details = "details",
  Customization = "customization",
  ContactInfo = "contact_info",
  Booking = "booking",
  BookingConfirmed = "booking_confirmed",
  AwaitingTeam = "awaiting_team"
}

// Destination types for better type checking
export const enum TourDestination {
  Italy = "Italy",
  Japan = "Japan",
  Peru = "Peru",
  Iceland = "Iceland",
  Tanzania = "Tanzania",
  France = "France",
  UnitedKingdom = "United Kingdom",
  Norway = "Norway",
  Spain = "Spain",
  Australia = "Australia",
  UnitedStates = "United States of America"
} 