import { db, citiesTable, activityTemplatesTable } from "@workspace/db";

const indiaCities = [
  {
    name: "Agra",
    country: "India",
    region: "Uttar Pradesh",
    description: "Home to the iconic Taj Mahal, one of the Seven Wonders of the World. A city of timeless Mughal architecture.",
    costIndex: "2.5",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
    popularity: 100,
  },
  {
    name: "Jaipur",
    country: "India",
    region: "Rajasthan",
    description: "The Pink City, famous for its stunning palaces, forts, and vibrant bazaars. Gateway to the Golden Triangle.",
    costIndex: "2.0",
    imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    popularity: 95,
  },
  {
    name: "Varanasi",
    country: "India",
    region: "Uttar Pradesh",
    description: "One of the world's oldest living cities and the spiritual capital of India. Famous for its sacred ghats along the Ganges.",
    costIndex: "1.5",
    imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
    popularity: 90,
  },
  {
    name: "Goa",
    country: "India",
    region: "Goa",
    description: "India's beach paradise. Portuguese-influenced architecture, vibrant nightlife, and pristine sandy beaches.",
    costIndex: "2.5",
    imageUrl: "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=600&q=80",
    popularity: 92,
  },
  {
    name: "Mumbai",
    country: "India",
    region: "Maharashtra",
    description: "The City of Dreams. India's financial capital with a vibrant mix of colonial heritage, Bollywood glamour, and street food.",
    costIndex: "3.5",
    imageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
    popularity: 97,
  },
  {
    name: "Kerala",
    country: "India",
    region: "Kerala",
    description: "God's Own Country. Famed for serene backwaters, lush hill stations, Ayurvedic spas, and Kerala cuisine.",
    costIndex: "2.0",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    popularity: 88,
  },
  {
    name: "Delhi",
    country: "India",
    region: "Delhi",
    description: "India's capital city blending ancient monuments, Mughal grandeur, and modern urban energy. Home to Red Fort and Qutub Minar.",
    costIndex: "2.5",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    popularity: 98,
  },
  {
    name: "Udaipur",
    country: "India",
    region: "Rajasthan",
    description: "The City of Lakes. Romantic palaces rising above shimmering lakes, one of India's most picturesque destinations.",
    costIndex: "2.5",
    imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
    popularity: 85,
  },
  {
    name: "Mysuru",
    country: "India",
    region: "Karnataka",
    description: "The City of Palaces. Famous for the stunning Mysore Palace, sandalwood products, and the grand Dasara festival.",
    costIndex: "1.5",
    imageUrl: "https://images.unsplash.com/photo-1600100481402-84e1d6bfee4c?w=600&q=80",
    popularity: 80,
  },
  {
    name: "Amritsar",
    country: "India",
    region: "Punjab",
    description: "Home to the sacred Golden Temple, the holiest shrine in Sikhism. Known for vibrant Punjabi culture and food.",
    costIndex: "1.5",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80",
    popularity: 82,
  },
  {
    name: "Darjeeling",
    country: "India",
    region: "West Bengal",
    description: "The Queen of Hills. Breathtaking views of the Himalayas, world-famous tea gardens, and the toy train ride.",
    costIndex: "2.0",
    imageUrl: "https://images.unsplash.com/photo-1544949189-b5fb62e89d89?w=600&q=80",
    popularity: 75,
  },
  {
    name: "Rishikesh",
    country: "India",
    region: "Uttarakhand",
    description: "The Yoga Capital of the World. Nestled in the Himalayas along the Ganges, famous for adventure sports and spirituality.",
    costIndex: "1.5",
    imageUrl: "https://images.unsplash.com/photo-1609947017136-9daf32a5b431?w=600&q=80",
    popularity: 78,
  },
];

const activityTemplates: Record<string, Array<{ name: string; type: string; description: string; cost: string; duration: number }>> = {
  "Agra": [
    { name: "Taj Mahal Sunrise Visit", type: "sightseeing", description: "Witness the magical sunrise over the Taj Mahal, a UNESCO World Heritage Site.", cost: "15", duration: 180 },
    { name: "Agra Fort Tour", type: "culture", description: "Explore the massive Agra Fort, a UNESCO site built by Emperor Akbar.", cost: "8", duration: 120 },
    { name: "Mughal Cuisine Dinner", type: "food", description: "Savour authentic Mughlai cuisine at a heritage restaurant.", cost: "20", duration: 90 },
    { name: "Mehtab Bagh Sunset", type: "sightseeing", description: "View the Taj Mahal from across the Yamuna at sunset.", cost: "3", duration: 60 },
  ],
  "Jaipur": [
    { name: "Amber Fort Elephant Ride", type: "adventure", description: "Ride an elephant up to the magnificent Amber Fort.", cost: "30", duration: 90 },
    { name: "Hawa Mahal Visit", type: "sightseeing", description: "Marvel at the Palace of Winds, Jaipur's most photographed landmark.", cost: "5", duration: 60 },
    { name: "Rajasthani Thali Experience", type: "food", description: "Feast on a traditional Rajasthani thali with dal baati churma.", cost: "10", duration: 75 },
    { name: "Bazaar Shopping", type: "shopping", description: "Shop for gems, textiles, and handicrafts in the famous bazaars.", cost: "50", duration: 180 },
    { name: "City Palace Tour", type: "culture", description: "Explore the royal City Palace museum complex.", cost: "8", duration: 120 },
  ],
  "Varanasi": [
    { name: "Ganga Aarti Ceremony", type: "culture", description: "Witness the mesmerizing evening prayer ritual on the ghats of the Ganges.", cost: "0", duration: 90 },
    { name: "Dawn Boat Ride on Ganges", type: "sightseeing", description: "Row through the sacred ghats as Varanasi wakes up at sunrise.", cost: "12", duration: 90 },
    { name: "Street Food Walk", type: "food", description: "Try chaat, kachori sabzi, and malaiyo at the famous food stalls.", cost: "5", duration: 120 },
    { name: "Sarnath Day Trip", type: "culture", description: "Visit the deer park where Buddha gave his first sermon.", cost: "10", duration: 120 },
  ],
  "Goa": [
    { name: "Baga Beach Day", type: "adventure", description: "Enjoy water sports, parasailing, and beach shacks at Baga.", cost: "40", duration: 300 },
    { name: "Old Goa Churches Tour", type: "culture", description: "Visit the UNESCO Basilica of Bom Jesus and Se Cathedral.", cost: "5", duration: 120 },
    { name: "Sunset Cruise", type: "sightseeing", description: "A relaxing cruise along the Mandovi River with live music.", cost: "15", duration: 90 },
    { name: "Seafood Feast", type: "food", description: "Enjoy fresh catch of the day at a beachside shack.", cost: "20", duration: 90 },
  ],
  "Mumbai": [
    { name: "Gateway of India Visit", type: "sightseeing", description: "Iconic 20th-century archway overlooking the Arabian Sea.", cost: "0", duration: 60 },
    { name: "Dharavi Slum Tour", type: "culture", description: "Guided tour through Asia's largest urban township.", cost: "18", duration: 120 },
    { name: "Bollywood Studio Tour", type: "culture", description: "Behind-the-scenes tour of Mumbai's legendary film industry.", cost: "25", duration: 150 },
    { name: "Mumbai Street Food Walk", type: "food", description: "Vada pav, pav bhaji, and bhel puri across South Mumbai.", cost: "8", duration: 120 },
    { name: "Marine Drive Evening Walk", type: "sightseeing", description: "Stroll along the Queen's Necklace at dusk.", cost: "0", duration: 60 },
  ],
  "Delhi": [
    { name: "Red Fort Exploration", type: "culture", description: "Explore the historic Mughal fortress at the heart of Old Delhi.", cost: "7", duration: 120 },
    { name: "Qutub Minar Complex", type: "sightseeing", description: "UNESCO World Heritage Site with the world's tallest brick minaret.", cost: "7", duration: 90 },
    { name: "Old Delhi Food Crawl", type: "food", description: "Taste nihari, parathas, and jalebis in Chandni Chowk.", cost: "10", duration: 150 },
    { name: "Humayun's Tomb", type: "sightseeing", description: "Magnificent Mughal garden tomb that inspired the Taj Mahal.", cost: "6", duration: 90 },
    { name: "India Gate & Rajpath", type: "sightseeing", description: "Visit the iconic war memorial and surrounding ceremonial boulevard.", cost: "0", duration: 60 },
  ],
  "Kerala": [
    { name: "Houseboat Stay on Backwaters", type: "sightseeing", description: "Overnight stay in a traditional kettuvallam houseboat in Alleppey.", cost: "80", duration: 1440 },
    { name: "Munnar Tea Plantation Tour", type: "adventure", description: "Trek through lush green tea estates in the Western Ghats.", cost: "15", duration: 180 },
    { name: "Ayurvedic Spa Treatment", type: "other", description: "Rejuvenating traditional Kerala Ayurveda massage and treatment.", cost: "40", duration: 120 },
    { name: "Kathakali Dance Show", type: "culture", description: "Witness the classical dance-drama form of Kerala.", cost: "10", duration: 90 },
    { name: "Kerala Sadya Meal", type: "food", description: "Traditional feast on a banana leaf with over 20 vegetarian dishes.", cost: "8", duration: 60 },
  ],
  "Udaipur": [
    { name: "Lake Pichola Boat Ride", type: "sightseeing", description: "Cruise on the scenic lake with views of the City Palace.", cost: "10", duration: 60 },
    { name: "City Palace Museum", type: "culture", description: "Explore the royal palace complex with panoramic lake views.", cost: "12", duration: 150 },
    { name: "Monsoon Palace Sunset", type: "sightseeing", description: "Watch the sunset from Sajjangarh Palace overlooking Udaipur.", cost: "5", duration: 90 },
    { name: "Traditional Rajasthani Cooking Class", type: "food", description: "Learn to cook dal bati and ghevar in a heritage home.", cost: "25", duration: 180 },
  ],
  "Amritsar": [
    { name: "Golden Temple Visit", type: "culture", description: "Sikh's holiest shrine, the stunning Harmandir Sahib complex.", cost: "0", duration: 120 },
    { name: "Wagah Border Ceremony", type: "culture", description: "Watch the electrifying flag lowering ceremony at the India-Pakistan border.", cost: "5", duration: 120 },
    { name: "Amritsari Kulcha Breakfast", type: "food", description: "Indulge in the famous stuffed kulcha with chole at local dhabas.", cost: "4", duration: 60 },
    { name: "Jallianwala Bagh", type: "culture", description: "Memorial garden marking the tragic 1919 massacre.", cost: "0", duration: 60 },
  ],
};

async function seed() {
  console.log("🌱 Seeding Indian cities...");

  for (const city of indiaCities) {
    const [inserted] = await db
      .insert(citiesTable)
      .values(city)
      .onConflictDoNothing()
      .returning();

    if (inserted && activityTemplates[city.name]) {
      const templates = activityTemplates[city.name].map((t) => ({
        ...t,
        cityId: inserted.id,
      }));
      await db.insert(activityTemplatesTable).values(templates).onConflictDoNothing();
      console.log(`  ✓ ${city.name} — ${templates.length} activities`);
    } else if (inserted) {
      console.log(`  ✓ ${city.name}`);
    } else {
      console.log(`  ⟳ ${city.name} (already exists)`);
    }
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
