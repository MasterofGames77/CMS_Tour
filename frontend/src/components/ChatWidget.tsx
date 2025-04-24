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

      // Canadian cities and regions
      if (lowerMessage.includes("vancouver")) {
        response = `While Vancouver isn't directly on our Canadian Rockies tour, we can help you extend your trip to include this beautiful city! Vancouver highlights could include:
• Stanley Park and Seawall
• Granville Island Market
• Capilano Suspension Bridge
• Gastown Historic District

Would you like to learn more about combining Vancouver with our Canadian Rockies Explorer tour?`;
      } else if (
        lowerMessage.includes("banff") ||
        lowerMessage.includes("lake louise")
      ) {
        response = `These destinations are highlights of our Canadian Rockies Explorer tour (8 days):
• Banff National Park exploration
• Lake Louise canoeing and hiking
• Sulphur Mountain Gondola
• Hot springs experience

Would you like to know more about our activities in Banff and Lake Louise?`;
      } else if (lowerMessage.includes("jasper")) {
        response = `Jasper is a key destination in our Canadian Rockies Explorer tour (8 days):
• Maligne Canyon walks
• Spirit Island boat tour
• Jasper SkyTram experience
• Wildlife viewing opportunities

Would you like more details about our time in Jasper National Park?`;
      }
      // Japanese cities and regions
      else if (lowerMessage.includes("tokyo")) {
        response = `🗾 Tokyo is a major highlight of our Japanese Cultural Journey (12 days):
• Modern Shibuya and Harajuku districts
• Traditional Asakusa area and Senso-ji Temple
• TeamLab Borderless Digital Art Museum
• Local food experiences

Would you like to know more about our Tokyo activities?`;
      } else if (lowerMessage.includes("kyoto")) {
        response = `🗾 Kyoto is a cultural centerpiece of our Japanese Cultural Journey:
• Famous temples and gardens
• Traditional tea ceremony
• Fushimi Inari Shrine
• Arashiyama Bamboo Grove

Would you like more details about our Kyoto experiences?`;
      }
      // Italian cities and regions
      else if (lowerMessage.includes("rome")) {
        response = `Rome is the starting point of our Italian Treasures tour (10 days):
• Vatican Museums and Sistine Chapel
• Colosseum and Roman Forum
• Pantheon and Trevi Fountain
• Local cuisine experiences

Would you like more details about our Rome itinerary?`;
      } else if (lowerMessage.includes("venice")) {
        response = `Venice is a highlight of our Italian Treasures tour:
• Grand Canal boat tour
• St. Mark's Square and Basilica
• Murano glass-blowing demonstration
• Venetian mask workshop

Would you like to know more about our Venice activities?`;
      } else if (lowerMessage.includes("florence")) {
        response = `🇮🇹 Florence features prominently in our Italian Treasures tour:
• Uffizi Gallery
• Michelangelo's David
• Duomo Cathedral
• Tuscan wine tasting

Would you like more details about our Florence experiences?`;
      }
      // Main country responses
      else if (lowerMessage.includes("canada")) {
        response = `Our Canadian Rockies Explorer (8 days) features:
• Banff National Park and Lake Louise
• Jasper National Park
• Columbia Icefield
• Mountain wildlife viewing

Which area interests you most: Banff, Jasper, or the Icefields Parkway?`;
      } else if (lowerMessage.includes("japan")) {
        response = `🗾 Our Japanese Cultural Journey (12 days) features:
• Tokyo: Modern and traditional districts
• Kyoto: Temples and gardens
• Mount Fuji and Hakone hot springs
• Traditional tea ceremonies and cuisine

Which city interests you most: Tokyo, Kyoto, or Hakone?`;
      } else if (lowerMessage.includes("italy")) {
        response = `Our Italian Treasures tour (10 days) offers:
• Rome: Vatican, Colosseum, and Roman Forum
• Florence: Renaissance art and architecture
• Venice: Canals and historic landmarks
• Milan: Cathedral and fashion district

Which city interests you most: Rome, Florence, Venice, or Milan?`;
      }
      // Check for region queries if no specific country match
      else if (
        lowerMessage.includes("europe") ||
        lowerMessage.includes("european")
      ) {
        response = `✈️ Our European destinations:
• Italy (Rome, Florence, Venice, Milan)
• France (Nice, Provence, Monaco, Marseille)
• United Kingdom (London, Edinburgh, Glasgow)
• Norway (Oslo, Bergen, Trondheim)
• Spain 🇪🇸 (Barcelona, Madrid, Valencia)

Which country or city interests you most?`;
      } else if (lowerMessage.includes("asia")) {
        response = `🗾 Our Asian destinations:
• Japan (Tokyo, Kyoto, Hakone, Osaka)
• China (Beijing, Shanghai, Xi'an)

Which country or city interests you most?`;
      } else if (
        lowerMessage.includes("america") ||
        lowerMessage.includes("americas")
      ) {
        response = `🌎 Our American destinations:
• Peru (Cusco, Sacred Valley, Machu Picchu)
• Canada (Banff, Jasper, Lake Louise, Montreal)
• United States (San Diego, New York City, Chicago)

Which country or city interests you most?`;
      } else if (lowerMessage.includes("africa")) {
        response = `🦁 Our African destinations:
• Tanzania
• South Africa

Which destination interests you most?`;
      } else if (
        lowerMessage.includes("australia") ||
        lowerMessage.includes("oceania")
      ) {
        response = `🦘 Our Oceania destinations:
• Australia
• New Zealand

Which destination interests you most?`;
      } else if (
        lowerMessage.includes("destination") ||
        lowerMessage.includes("where")
      ) {
        response = `🌍 We offer tours in these regions:
• Europe
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
      // French cities and regions
      else if (lowerMessage.includes("paris")) {
        response = `🇫🇷 While Paris isn't directly on our French Riviera tour, we can help you extend your trip to include the City of Light! Paris highlights could include:
• Eiffel Tower and Louvre Museum
• Notre-Dame Cathedral
• Seine River Cruise
• French Cuisine Experience

Would you like to learn more about combining Paris with our French Riviera tour?`;
      } else if (lowerMessage.includes("nice")) {
        response = `🇫🇷 Nice is a key destination in our French Riviera & Provence tour (8 days):
• Old Town exploration
• Promenade des Anglais
• Cours Saleya Market
• Mediterranean beaches

Would you like more details about our activities in Nice?`;
      } else if (lowerMessage.includes("provence")) {
        response = `🇫🇷 Provence is a highlight of our French Riviera tour:
• Lavender fields of Valensole
• Historic villages
• Wine tasting experiences
• Local markets and cuisine

Would you like to know more about our Provence activities?`;
      }
      // Peru cities and regions
      else if (lowerMessage.includes("cusco")) {
        response = `🇵🇪 Cusco is the historic starting point of our Machu Picchu Adventure (8 days):
• San Blas artisan district
• Cusco Cathedral
• Local market visits
• Altitude acclimatization activities

Would you like more details about our time in Cusco?`;
      } else if (lowerMessage.includes("machu picchu")) {
        response = `🇵🇪 Machu Picchu is the crown jewel of our Peruvian tour:
• Sunrise at the Sun Gate
• Guided archaeological tour
• Optional Huayna Picchu climb
• Traditional Andean lunch

Would you like to know more about our Machu Picchu experience?`;
      }
      // Australian cities and regions
      else if (lowerMessage.includes("sydney")) {
        response = `🦘 Sydney is a major highlight of our Australian Coastal Paradise tour:
• Opera House tour
• Harbor Bridge experience
• Bondi Beach
• The Rocks historic district

Would you like more details about our Sydney activities?`;
      } else if (
        lowerMessage.includes("barrier reef") ||
        lowerMessage.includes("cairns")
      ) {
        response = `🦘 The Great Barrier Reef portion of our tour includes:
• Snorkeling or diving options
• Marine life viewing
• Semi-submersible tour
• Tropical Port Douglas visit

Would you like to know more about our reef experiences?`;
      } else if (
        lowerMessage.includes("uluru") ||
        lowerMessage.includes("ayers rock")
      ) {
        response = `🦘 Our Uluru experience includes:
• Sunrise and sunset viewing
• Aboriginal cultural tours
• Field of Light installation
• Bush tucker experience

Would you like more details about our time at Uluru?`;
      }
      // African destinations
      else if (lowerMessage.includes("serengeti")) {
        response = `🦁 The Serengeti is the highlight of our Tanzania Safari (9 days):
• Great Migration viewing
• Big Five wildlife spotting
• Luxury lodge stays
• Sunrise game drives

Would you like more details about our Serengeti experience?`;
      } else if (lowerMessage.includes("ngorongoro")) {
        response = `🦁 The Ngorongoro Crater is a key part of our Tanzania Safari:
• Full-day crater game drive
• Black rhino tracking
• Crater floor picnic
• Maasai village visit

Would you like to know more about our Ngorongoro activities?`;
      }
      // Main country responses (continue with existing ones)
      else if (lowerMessage.includes("france")) {
        response = `🇫🇷 Our French Riviera & Provence tour (8 days) includes:
• Nice: Coastal beauty and markets
• Provence: Lavender fields and villages
• Monaco: Palace and Casino
• Marseille: Historic port and cuisine

Which area interests you most: Nice, Provence, Monaco, or Marseille?`;
      } else if (lowerMessage.includes("peru")) {
        response = `🏔️ Our Machu Picchu Adventure (8 days) includes:
• Cusco: Inca capital exploration
• Sacred Valley: Ancient ruins and culture
• Machu Picchu: Wonder of the World
• Pisac: Markets and ruins

Which area interests you most: Cusco, Sacred Valley, Machu Picchu, or Pisac?`;
      } else if (lowerMessage.includes("australia")) {
        response = `🦘 Our Australian Coastal Paradise (11 days) includes:
• Sydney: Harbor city highlights
• Great Barrier Reef: Marine wonders
• Uluru: Sacred outback site
• Melbourne: Culture and coast

Which area interests you most: Sydney, Great Barrier Reef, or Uluru?`;
      } else if (lowerMessage.includes("tanzania")) {
        response = `🦁 Our Serengeti Safari (9 days) offers:
• Serengeti: Great Migration
• Ngorongoro: Crater wildlife
• Tarangire: Elephant herds
• Lake Manyara: Tree-climbing lions

Which area interests you most: Serengeti, Ngorongoro, or Tarangire?`;
      }
      // US cities
      else if (lowerMessage.includes("san diego")) {
        response = `Our San Diego Coastal Escape (6 days) features:
• Balboa Park and world-famous Zoo
• La Jolla Cove and coastal trails
• USS Midway Museum
• Coronado Island and beaches

Would you like to know more about specific activities in San Diego?`;
      } else if (
        lowerMessage.includes("new york") ||
        lowerMessage.includes("nyc")
      ) {
        response = `While New York City isn't currently part of our standard tours, we can help arrange a custom city experience including:
• Central Park and Times Square
• Statue of Liberty and Ellis Island
• Broadway shows and Theater District
• World-class museums (MET, MoMA)

Would you like to learn more about creating a custom New York City experience?`;
      } else if (lowerMessage.includes("la jolla")) {
        response = `La Jolla is a highlight of our San Diego tour:
• La Jolla Cove and sea lions
• Torrey Pines State Natural Reserve
• Scenic coastal walks
• Local art galleries and dining

Would you like more details about our La Jolla activities?`;
      }
      // Continue with existing country responses...
      else if (
        lowerMessage.includes("united states") ||
        lowerMessage.includes("usa")
      ) {
        response = `Our United States destinations include:
• San Diego: Coastal beauty and culture (6-day tour)
• New York City: Urban exploration
• Chicago: Architecture and culture (custom experience)

Which city interests you most: San Diego, New York City, or Chicago?`;
      }
      // Additional European cities
      else if (lowerMessage.includes("milan")) {
        response = `Milan is a fashionable addition to our Italian Treasures tour:
• Milan Cathedral (Duomo)
• Leonardo da Vinci's Last Supper
• Fashion District shopping
• Galleria Vittorio Emanuele II

Would you like to learn more about including Milan in your Italian journey?`;
      } else if (lowerMessage.includes("marseille")) {
        response = `Marseille can be included in our French Riviera tour:
• Vieux-Port (Old Port)
• Notre-Dame de la Garde basilica
• Calanques National Park
• Bouillabaisse tasting experience

Would you like to know more about adding Marseille to your itinerary?`;
      } else if (lowerMessage.includes("glasgow")) {
        response = `Glasgow adds urban culture to our British Heritage tour:
• Kelvingrove Art Gallery and Museum
• Glasgow Cathedral
• West End food scene
• Charles Rennie Mackintosh architecture

Would you like more details about including Glasgow in your journey?`;
      } else if (lowerMessage.includes("trondheim")) {
        response = `Trondheim enriches our Norwegian Fjords tour:
• Nidaros Cathedral
• Old Town Bridge (Gamle Bybro)
• NTNU Science Museum
• Local food hall exploration

Would you like to learn more about adding Trondheim to your Norwegian adventure?`;
      } else if (lowerMessage.includes("valencia")) {
        response = `Valencia brings Mediterranean flair to our Spanish tour:
• City of Arts and Sciences
• Historic Central Market
• Paella cooking experience
• Turia Gardens

Would you like to know more about including Valencia in your Spanish journey?`;
      }
      // Additional Asian cities
      else if (lowerMessage.includes("osaka")) {
        response = `Osaka adds culinary delights to our Japanese journey:
• Dotonbori food district
• Osaka Castle
• Kuromon Ichiba Market
• Street food experience

Would you like to learn more about including Osaka in your Japanese adventure?`;
      } else if (lowerMessage.includes("xian")) {
        response = `Xi'an brings ancient history to our China experience:
• Terracotta Warriors
• Ancient City Wall cycling
• Muslim Quarter food tour
• Tang Dynasty show

Would you like to know more about adding Xi'an to your itinerary?`;
      }
      // Additional Americas destinations
      else if (lowerMessage.includes("montreal")) {
        response = `Montreal can complement our Canadian Rockies tour:
• Old Montreal historic district
• Mount Royal Park
• Notre-Dame Basilica
• Food tour of local specialties

Would you like to learn more about combining Montreal with your Rockies adventure?`;
      } else if (lowerMessage.includes("sacred valley")) {
        response = `The Sacred Valley enriches our Peruvian experience:
• Pisac archaeological site
• Ollantaytambo fortress
• Local textile workshops
• Traditional market visits

Would you like more details about our Sacred Valley activities?`;
      } else if (lowerMessage.includes("chicago")) {
        response = `While not on our standard tour, we can arrange a Chicago experience:
• Millennium Park and Cloud Gate
• Architecture river cruise
• Art Institute of Chicago
• Deep-dish pizza experience

Would you like to learn about creating a custom Chicago itinerary?`;
      }

      setIsTyping(false);
      return (
        response ||
        "I'm here to help you discover your perfect destination! Would you like to know more about a specific country, city, or region?"
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
