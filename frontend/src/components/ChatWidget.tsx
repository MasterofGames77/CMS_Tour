"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Memoize tour details
  const getTourDetails = useCallback((destination: TourDestination): string => {
    const tourDetails: Partial<Record<TourDestination, string>> = {
      [TourDestination.Japan]: `🗾 Let me tell you more about our Japanese Cultural Journey:

• Duration: 12 days of immersive experiences
• Highlights:
  - Explore the vibrant Shibuya district and traditional Asakusa area in Tokyo
  - Visit the iconic Mount Fuji and relax in Hakone's traditional onsen
  - Experience authentic Japanese culture with tea ceremonies and local cuisine
  - Stay in both modern hotels and traditional ryokans

Would you like to know more about specific aspects of the tour or discuss customizing it to your preferences?`,

      [TourDestination.Italy]: `🇮🇹 Here's what makes our Italian Treasures tour special:

• Duration: 10 days of cultural exploration
• Highlights:
  - Welcome dinner and evening walk through historic Rome
  - Guided tour of Vatican Museums and Colosseum
  - Experience the Roman Forum and Trevi Fountain
  - Immerse yourself in Italian cuisine and culture

Would you like to know more about specific aspects of the tour or discuss customizing it to your preferences?`,
    };

    return (
      tourDetails[destination] ||
      "I'd be happy to tell you more about this destination. Which aspects interest you most: the itinerary, accommodations, or activities?"
    );
  }, []);

  // Memoize message handling functions
  const handleCustomization = useCallback(
    (destination: string, message: string): string => {
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("day") ||
        lowerMessage.includes("longer") ||
        lowerMessage.includes("shorter")
      ) {
        return `✨ I understand you'd like to adjust the duration of the ${destination} tour! While our standard tour has a set length, we can definitely work with you to create a custom itinerary that fits your schedule. Would you like me to connect you with our booking team to discuss the possibilities?`;
      }

      if (
        lowerMessage.includes("add") ||
        lowerMessage.includes("include") ||
        lowerMessage.includes("change") ||
        lowerMessage.includes("modify") ||
        lowerMessage.includes("different")
      ) {
        return `🎨 Absolutely! The ${destination} tour can be customized to include activities or destinations that interest you. Our booking team specializes in creating personalized experiences. Would you like me to connect you with them to discuss your specific interests?`;
      }

      if (
        lowerMessage.includes("custom") ||
        lowerMessage.includes("personalize") ||
        lowerMessage.includes("flexible")
      ) {
        return `✨ Yes! We love making our tours special for each traveler. The ${destination} tour can be tailored to your preferences. Would you like to tell me what aspects you'd like to customize?`;
      }

      return "";
    },
    []
  );

  // Memoize response generation
  const generateResponse = useCallback(
    async (userMessage: string) => {
      const lowerMessage = userMessage.toLowerCase();
      setIsTyping(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      let response = "";

      // Check for specific country queries first
      if (lowerMessage.includes("italy")) {
        response = `🇮🇹 Our Italian Treasures tour (10 days) offers:
• Rome: Vatican, Colosseum, and Roman Forum
• Florence: Renaissance art and architecture
• Venice: Canals and historic landmarks
• Authentic Italian cuisine and wine tasting

Would you like to customize this tour or learn more about specific activities?`;
      } else if (lowerMessage.includes("france")) {
        response = `🇫🇷 Our French Riviera & Provence tour (8 days) includes:
• Paris: Eiffel Tower and Louvre
• French Riviera: Nice and Cannes
• Provence: Lavender fields and historic villages
• French cuisine and wine experiences

Would you like to customize this tour or learn more about specific activities?`;
      } else if (lowerMessage.includes("japan")) {
        response = `🗾 Our Japanese Cultural Journey (12 days) features:
• Tokyo: Modern and traditional districts
• Kyoto: Temples and gardens
• Mount Fuji and Hakone hot springs
• Traditional tea ceremonies and cuisine

Would you like to customize this tour or learn more about specific activities?`;
      } else if (lowerMessage.includes("peru")) {
        response = `🏔️ Our Machu Picchu Adventure (8 days) includes:
• Machu Picchu and the Sacred Valley
• Cusco: Historic capital of the Inca Empire
• Andean culture and traditions
• Scenic train journey through the mountains

Would you like to customize this tour or learn more about specific activities?`;
      } else if (lowerMessage.includes("tanzania")) {
        response = `🦁 Our Serengeti Safari (10 days) offers:
• Great Migration viewing
• Ngorongoro Crater wildlife
• Maasai cultural experiences
• Luxury safari lodges

Would you like to customize this tour or learn more about specific activities?`;
      } else if (lowerMessage.includes("australia")) {
        response = `🦘 Our Australian Coastal Paradise (14 days) includes:
• Sydney and the Great Barrier Reef
• Outback and Uluru
• Aboriginal cultural experiences
• Great Ocean Road

Would you like to customize this tour or learn more about specific activities?`;
      }
      // Check for region queries if no specific country match
      else if (
        lowerMessage.includes("europe") ||
        lowerMessage.includes("european")
      ) {
        response = `✈️ Our European destinations:
• Italy 🇮🇹
• France 🇫🇷
• United Kingdom 🇬🇧
• Norway 🇳🇴
• Spain 🇪🇸

Which destination interests you most?`;
      } else if (lowerMessage.includes("asia")) {
        response = `🗾 Our Asian destinations:
• Japan 🇯🇵
• China 🇨🇳

Which destination interests you most?`;
      } else if (
        lowerMessage.includes("america") ||
        lowerMessage.includes("americas")
      ) {
        response = `🌎 Our American destinations:
• Peru 🇵🇪
• Canada 🇨🇦
• USA 🇺🇸

Which destination interests you most?`;
      } else if (lowerMessage.includes("africa")) {
        response = `🦁 Our African destinations:
• Tanzania 🇹🇿
• South Africa 🇿🇦

Which destination interests you most?`;
      } else if (
        lowerMessage.includes("australia") ||
        lowerMessage.includes("oceania")
      ) {
        response = `🦘 Our Oceania destinations:
• Australia 🇦🇺
• New Zealand 🇳🇿

Which destination interests you most?`;
      } else if (
        lowerMessage.includes("destination") ||
        lowerMessage.includes("where")
      ) {
        response = `🌍 We offer tours in these regions:
• Europe 🇪🇺
• Asia 🌏
• Americas 🌎
• Africa 🌍
• Oceania 🦘

Which region would you like to explore?`;
      } else if (
        lowerMessage.includes("duration") ||
        lowerMessage.includes("long")
      ) {
        response = `⏱️ Our tours range from 7 to 14 days. Most popular durations:
• Short trips: 7-8 days
• Standard tours: 9-10 days
• Extended journeys: 12-14 days

Which duration works best for you?`;
      } else if (
        lowerMessage.includes("price") ||
        lowerMessage.includes("cost")
      ) {
        response = `💰 Our tours range from $2,899 to $5,299, depending on:
• Destination
• Duration
• Season
• Accommodation level

Would you like to know the price for a specific tour?`;
      } else if (customization.destination) {
        response = handleCustomization(customization.destination, userMessage);
      }

      setIsTyping(false);
      return (
        response ||
        "I'm here to help you plan your perfect adventure! Would you like to explore a specific region or destination?"
      );
    },
    [customization.destination, handleCustomization]
  );

  // Memoize message submission handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;

      const userMessage: Message = {
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");

      const response = await generateResponse(inputText);
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    },
    [inputText, generateResponse]
  );

  // Memoize chat toggle handler
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Memoize message list
  const messageList = useMemo(
    () =>
      messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
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
      )),
    [messages]
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
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

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">
              Nova - Travel Assistant 🌟
            </h3>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messageList}
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

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex space-x-2">
              <input
                ref={inputRef}
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
