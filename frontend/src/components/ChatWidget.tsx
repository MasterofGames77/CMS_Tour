"use client";

import { useState, useRef, useEffect } from "react";
import {
  Message,
  CustomizationRequest,
  TourContext,
  TourStage,
  TourDestination,
} from "../types/chat";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm Nova, your personal travel companion! 🌟 I'm here to help you discover your next amazing adventure. Where would you like to explore?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [customization, setCustomization] = useState<CustomizationRequest>({
    destination: "",
    type: null,
    inProgress: false,
  });
  const [tourContext, setTourContext] = useState<TourContext>({
    destination: "",
    stage: TourStage.Initial,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get detailed tour information
  const getTourDetails = (destination: TourDestination): string => {
    switch (destination) {
      case TourDestination.Japan:
        return `🗾 Let me tell you more about our Japanese Cultural Journey:

• Duration: 12 days of immersive experiences
• Highlights:
  - Explore the vibrant Shibuya district and traditional Asakusa area in Tokyo
  - Visit the iconic Mount Fuji and relax in Hakone's traditional onsen
  - Experience authentic Japanese culture with tea ceremonies and local cuisine
  - Stay in both modern hotels and traditional ryokans

Would you like to know more about specific aspects of the tour or discuss customizing it to your preferences?`;

      case TourDestination.Italy:
        return `🇮🇹 Here's what makes our Italian Treasures tour special:

• Duration: 10 days of cultural exploration
• Highlights:
  - Welcome dinner and evening walk through historic Rome
  - Guided tour of Vatican Museums and Colosseum
  - Experience the Roman Forum and Trevi Fountain
  - Immerse yourself in Italian cuisine and culture

Would you like to know more about specific aspects of the tour or discuss customizing it to your preferences?`;

      // Add cases for other destinations...

      default:
        return "I'd be happy to tell you more about this destination. Which aspects interest you most: the itinerary, accommodations, or activities?";
    }
  };

  // Handle customization requests
  const handleCustomization = (
    destination: string,
    message: string
  ): string => {
    const lowerMessage = message.toLowerCase();

    // Check for duration modification requests
    if (
      lowerMessage.includes("day") ||
      lowerMessage.includes("longer") ||
      lowerMessage.includes("shorter")
    ) {
      return `✨ I understand you'd like to adjust the duration of the ${destination} tour! While our standard tour has a set length, we can definitely work with you to create a custom itinerary that fits your schedule. Would you like me to connect you with our booking team to discuss the possibilities? They can help arrange additional days or create a condensed version of the tour.`;
    }

    // Check for itinerary modification requests
    if (
      lowerMessage.includes("add") ||
      lowerMessage.includes("include") ||
      lowerMessage.includes("change") ||
      lowerMessage.includes("modify") ||
      lowerMessage.includes("different")
    ) {
      return `🎨 Absolutely! The ${destination} tour can be customized to include activities or destinations that interest you. Our booking team specializes in creating personalized experiences. Would you like me to connect you with them to discuss your specific interests? They can help modify the itinerary while keeping the essence of the tour intact.`;
    }

    // Check for general customization inquiries
    if (
      lowerMessage.includes("custom") ||
      lowerMessage.includes("personalize") ||
      lowerMessage.includes("flexible")
    ) {
      return `✨ Yes! We love making our tours special for each traveler. The ${destination} tour can be tailored to your preferences. Would you like to tell me what aspects you'd like to customize? We can adjust things like:
      
• Duration of the tour
• Specific activities or attractions
• Accommodation preferences
• Special interests or themes

Just let me know what you're thinking, and I'll guide you through the options!`;
    }

    return "";
  };

  // Handle contact information collection
  const handleContactInfo = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("email")) {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const match = message.match(emailRegex);

      if (match) {
        setTourContext((prev) => ({
          ...prev,
          contactPreference: "email",
          userEmail: match[0],
          stage: TourStage.BookingConfirmed,
        }));
        return `✨ Perfect! I've noted your email: ${match[0]}. Our booking team will contact you within 24 hours to discuss your customization requests for the ${tourContext.destination} tour. In the meantime, feel free to ask me any other questions about our destinations!`;
      } else {
        return "📧 Could you please provide your email address so our booking team can contact you?";
      }
    }

    if (lowerMessage.includes("phone")) {
      const phoneRegex = /[\d()-.\s]{10,}/;
      const match = message.match(phoneRegex);

      if (match) {
        setTourContext((prev) => ({
          ...prev,
          contactPreference: "phone",
          userPhone: match[0],
          stage: TourStage.BookingConfirmed,
        }));
        return `✨ Great! I've noted your phone number: ${match[0]}. Our booking team will call you within 24 hours to discuss your customization requests for the ${tourContext.destination} tour. In the meantime, feel free to ask me any other questions about our destinations!`;
      } else {
        return "📱 Could you please provide your phone number so our booking team can contact you?";
      }
    }

    return "Would you prefer to be contacted by email or phone? Just provide your preferred contact method and details.";
  };

  // Handle booking team connection
  const handleBookingTeam = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (
      tourContext.stage === TourStage.Customization &&
      (lowerMessage.includes("yes") ||
        lowerMessage.includes("connect") ||
        lowerMessage.includes("book"))
    ) {
      setTourContext((prev) => ({
        ...prev,
        stage: TourStage.ContactInfo,
      }));
      return "Great! To connect you with our booking team, would you prefer to be contacted by email or phone?";
    }

    if (tourContext.stage === TourStage.ContactInfo) {
      return handleContactInfo(message);
    }

    if (tourContext.stage === TourStage.BookingConfirmed) {
      if (lowerMessage.includes("thank")) {
        return "You're welcome! The booking team will be in touch soon. Is there anything else you'd like to know about our tours?";
      }
      return `While you wait to hear from our booking team about the ${tourContext.destination} tour customization, I'd be happy to tell you about other destinations or answer any questions you might have!`;
    }

    return "";
  };

  // Simple response generation based on keywords
  const generateResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    // Simulate AI thinking
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check for booking team related responses first
    const bookingResponse = handleBookingTeam(userMessage);
    if (bookingResponse) {
      setIsTyping(false);
      return bookingResponse;
    }

    // Handle requests for more details about current tour
    if (
      (lowerMessage.includes("tell me more") ||
        lowerMessage.includes("more about") ||
        lowerMessage.includes("what") ||
        lowerMessage.includes("details")) &&
      tourContext.destination
    ) {
      setTourContext({ ...tourContext, stage: TourStage.Details });
      setIsTyping(false);
      return getTourDetails(tourContext.destination as TourDestination);
    }

    // Check for customization requests if a destination is in context
    if (customization.destination) {
      const customResponse = handleCustomization(
        customization.destination,
        userMessage
      );
      if (customResponse) {
        setIsTyping(false);
        return customResponse;
      }
    }

    let response = "";

    // Check for region-specific queries first
    if (lowerMessage.includes("japan")) {
      setCustomization({
        destination: TourDestination.Japan,
        type: null,
        inProgress: false,
      });
      setTourContext({
        destination: TourDestination.Japan,
        stage: TourStage.Initial,
      });
      response =
        "🗾 Our Japanese Cultural Journey is truly special! You'll experience everything from Tokyo's energy to peaceful onsen baths. Would you like to hear more about this unique adventure?";
    } else if (lowerMessage.includes("italy")) {
      setCustomization({
        destination: TourDestination.Italy,
        type: null,
        inProgress: false,
      });
      setTourContext({
        destination: TourDestination.Italy,
        stage: TourStage.Initial,
      });
      response =
        "🇮🇹 Bellissimo! Our Italian Treasures tour is a journey through culture, cuisine, and history. From the Vatican to the Colosseum, you'll experience Italy's most iconic sites. Would you like to hear more about the itinerary, or shall we discuss customizing it to your preferences?";
    } else if (lowerMessage.includes("europe")) {
      setCustomization({
        destination: "Europe",
        type: null,
        inProgress: false,
      });
      response =
        "✈️ Ah, Europe! I love helping travelers discover its magic. We have amazing tours in Italy, France, United Kingdom, Norway, and Spain. Each destination has its own special charm! Would you like me to tell you more about any of these countries?";
    } else if (lowerMessage.includes("asia")) {
      response =
        "🗾 Exciting choice! In Asia, we currently offer an incredible journey through Japan. Would you like me to share more details about our Japanese Cultural Journey?";
    } else if (lowerMessage.includes("africa")) {
      response =
        "🦁 Adventure awaits in Africa! We offer an unforgettable safari experience in Tanzania. Should I tell you more about our Serengeti tour?";
    } else if (
      lowerMessage.includes("america") ||
      lowerMessage.includes("americas")
    ) {
      response =
        "🌎 The Americas are full of wonders! We have amazing tours in Peru, Canada, and the United States of America. Which destination sparks your interest?";
    } else if (
      lowerMessage.includes("australia") ||
      lowerMessage.includes("oceania")
    ) {
      response =
        "🦘 G'day! Our Australian Coastal Paradise tour is a real gem. Would you like me to tell you more about this amazing adventure?";
    } else if (lowerMessage.includes("france")) {
      response =
        "🇫🇷 Magnifique! Our French Riviera & Provence tour is pure magic. Picture yourself wandering through lavender fields and charming coastal towns. Would you like to hear more?";
    } else if (
      lowerMessage.includes("united kingdom") ||
      lowerMessage.includes("uk") ||
      lowerMessage.includes("britain")
    ) {
      response =
        "🇬🇧 Brilliant choice! Our British Heritage Journey takes you from London's historic landmarks to Scotland's majestic Highlands. Fancy hearing more details?";
    } else if (lowerMessage.includes("norway")) {
      response =
        "🇳🇴 The Norwegian Fjords Adventure is breathtaking! From Oslo's vibrant culture to nature's grandest views - it's truly spectacular. Would you like to know more?";
    } else if (lowerMessage.includes("spain")) {
      response =
        "🇪🇸 ¡Fantástico! Our Spanish Passion & Culture tour is full of energy and charm. From Barcelona's stunning architecture to Andalusian flamenco - it's pure magic! Shall I tell you more?";
    } else if (lowerMessage.includes("tanzania")) {
      response =
        "🦁 Our Serengeti Safari is the adventure of a lifetime! Imagine witnessing the great migration and meeting Africa's most magnificent wildlife. Should I share more details?";
    } else if (lowerMessage.includes("peru")) {
      response =
        "🏔️ The Machu Picchu Adventure is absolutely incredible! Journey through the Andes and uncover Incan mysteries. Would you like to know more about this expedition?";
    } else if (lowerMessage.includes("canada")) {
      response =
        "🇨🇦 The Canadian Rockies Explorer is pure natural wonder! You'll discover some of the most stunning national parks in the world. Shall I tell you more about this adventure?";
    } else if (
      lowerMessage.includes("san diego") ||
      (lowerMessage.includes("united states") &&
        !lowerMessage.includes("united kingdom"))
    ) {
      response =
        "🌴 Our San Diego Coastal Escape is pure California dreaming! Perfect blend of sunshine, culture, and coastal beauty. Would you like to hear more about this perfect getaway?";
    } else if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost")
    ) {
      response =
        "💫 I can help you find a tour that fits your budget! Our adventures range from $2,899 to $5,299, varying by destination and duration. You can use the price filter above to narrow down your options.";
    } else if (
      lowerMessage.includes("duration") ||
      lowerMessage.includes("long")
    ) {
      response =
        "⏱️ Perfect timing! Our tours range from 6 to 12 days - just right for an amazing adventure. You can use the duration filter above to find your ideal trip length.";
    } else if (
      lowerMessage.includes("destination") ||
      lowerMessage.includes("where")
    ) {
      response =
        "🌍 Let me show you our amazing destinations:\n\n" +
        "• Europe: Italy, France, UK, Norway, Spain\n" +
        "• Asia: Japan\n" +
        "• Africa: Tanzania\n" +
        "• Americas: Peru, Canada, USA\n" +
        "• Oceania: Australia\n\n" +
        "Which part of the world interests you most? I'd love to tell you more!";
    } else if (
      lowerMessage.includes("customize") ||
      lowerMessage.includes("modify") ||
      lowerMessage.includes("change")
    ) {
      if (!customization.destination) {
        response =
          "🎨 I'd be happy to help you customize a tour! First, could you tell me which destination you're interested in? Once I know that, we can discuss specific modifications you'd like to make.";
      } else {
        setTourContext({ ...tourContext, stage: TourStage.Customization });
        setCustomization((prev) => ({ ...prev, inProgress: true }));
        response = `✨ Of course! I'd love to help you customize your ${customization.destination} experience. What aspects would you like to modify? We can adjust:

• Duration of the tour
• Specific activities or attractions
• Accommodation preferences
• Special interests or themes

Just let me know what you're thinking, and I'll connect you with our booking team to make it happen!`;
      }
    } else if (
      lowerMessage.includes("book") ||
      lowerMessage.includes("reserve")
    ) {
      setTourContext({ ...tourContext, stage: TourStage.Booking });
      response =
        "🎉 Excellent choice! I'll connect you with our booking team who can help finalize your tour details and handle any customizations you'd like. Would you prefer them to contact you via email or phone?";
    } else if (lowerMessage.includes("thank")) {
      response =
        "✨ You're welcome! I'm always here to help you discover your next amazing destination. Don't hesitate to ask if you'd like to explore more destinations or customize any of our tours!";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      setTourContext({ destination: "", stage: TourStage.Initial });
      response =
        "👋 Hello there! I'm Nova, and I'm excited to help you plan your next adventure! We have amazing destinations across Europe, Asia, Africa, the Americas, and Australia. All our tours can be customized to your preferences. Where would you like to explore?";
    } else {
      if (!tourContext.destination) {
        response =
          "🌟 I'm here to help you find your perfect adventure! We have amazing destinations across the globe, and we can customize any tour to match your dreams. Would you like to explore a specific region? Just ask, and I'll be your guide!";
      } else {
        response = `I see we were discussing the ${tourContext.destination} tour. Would you like to know more about the itinerary, discuss customization options, or explore a different destination?`;
      }
    }

    setIsTyping(false);
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Generate and add AI response
    const response = await generateResponse(inputText);
    const aiMessage: Message = {
      text: response,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">
              Nova - Travel Assistant 🌟
            </h3>
          </div>

          {/* Messages container */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
