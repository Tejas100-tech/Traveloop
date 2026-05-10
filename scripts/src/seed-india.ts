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
  {
    name: "Jaisalmer",
    country: "India",
    region: "Rajasthan",
    description: "The Golden City rising from the Thar Desert. A living fort city with ornate havelis and camel safaris into the dunes.",
    costIndex: "2.0",
    imageUrl: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80",
    popularity: 83,
  },
  {
    name: "Jodhpur",
    country: "India",
    region: "Rajasthan",
    description: "The Blue City. Dominated by the magnificent Mehrangarh Fort with sweeping views over the blue-painted old city.",
    costIndex: "2.0",
    imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&q=80",
    popularity: 84,
  },
  {
    name: "Hyderabad",
    country: "India",
    region: "Telangana",
    description: "The City of Pearls. Where Nizami grandeur meets tech innovation — famous for Charminar, biryani, and Golconda Fort.",
    costIndex: "2.5",
    imageUrl: "https://images.unsplash.com/photo-1598638566012-4e3706a69d4a?w=600&q=80",
    popularity: 86,
  },
  {
    name: "Kolkata",
    country: "India",
    region: "West Bengal",
    description: "The City of Joy. The cultural capital of India — home to Victoria Memorial, Durga Puja, Bengali cuisine, and literary heritage.",
    costIndex: "2.0",
    imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80",
    popularity: 79,
  },
  {
    name: "Hampi",
    country: "India",
    region: "Karnataka",
    description: "Ancient capital of the Vijayanagara Empire. A UNESCO World Heritage Site with extraordinary temple ruins amid a lunar boulder landscape.",
    costIndex: "1.5",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    popularity: 72,
  },
  {
    name: "Leh-Ladakh",
    country: "India",
    region: "Ladakh",
    description: "The Land of High Passes. Surreal high-altitude desert landscapes, ancient Buddhist monasteries, and star-studded skies.",
    costIndex: "3.0",
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80",
    popularity: 87,
  },
];

const activityTemplates: Record<string, Array<{ name: string; type: string; description: string; cost: string; duration: number }>> = {
  "Agra": [
    { name: "Taj Mahal Sunrise Visit", type: "sightseeing", description: "Witness the magical sunrise over the Taj Mahal — UNESCO World Heritage Site. The soft pink light on white marble is breathtaking.", cost: "1100", duration: 180 },
    { name: "Agra Fort Exploration", type: "culture", description: "Walk through the massive Agra Fort built by Emperor Akbar — a UNESCO site with royal palaces and Diwan-i-Khas.", cost: "650", duration: 120 },
    { name: "Mughlai Cuisine Dinner", type: "food", description: "Savour authentic Mughlai dal, seekh kebabs, and biryani at a heritage restaurant near the Taj.", cost: "1200", duration: 90 },
    { name: "Mehtab Bagh Sunset View", type: "sightseeing", description: "Watch the Taj Mahal glow gold at sunset from the lush gardens across the Yamuna river.", cost: "300", duration: 60 },
    { name: "Fatehpur Sikri Day Trip", type: "culture", description: "Visit the abandoned Mughal capital 35km away — a perfectly preserved red sandstone city.", cost: "610", duration: 180 },
    { name: "Kinari Bazaar Walk", type: "shopping", description: "Browse marble inlay work, leather goods, and Petha sweets in Agra's famous market lanes.", cost: "500", duration: 90 },
    { name: "Itimad-ud-Daulah Tomb", type: "sightseeing", description: "The 'Baby Taj' — a delicate white marble tomb often called the jewel box of Mughal architecture.", cost: "310", duration: 60 },
    { name: "Petha Tasting & Sweet Shop", type: "food", description: "Sample the famous Agra Petha (crystallized gourd sweet) at Panchhi Petha's original shop.", cost: "200", duration: 45 },
  ],
  "Jaipur": [
    { name: "Amber Fort Visit", type: "culture", description: "Explore the magnificent Amber Fort on a hilltop above Maota Lake — stunning Rajput architecture.", cost: "1200", duration: 150 },
    { name: "Hawa Mahal (Palace of Winds)", type: "sightseeing", description: "Marvel at Jaipur's iconic 5-storey sandstone palace with 953 jharokha windows.", cost: "200", duration: 60 },
    { name: "Rajasthani Thali Feast", type: "food", description: "Unlimited Rajasthani thali with dal baati churma, gatte ki sabzi, and ghewar dessert.", cost: "550", duration: 90 },
    { name: "Johari Bazaar Shopping", type: "shopping", description: "Shop for gems, Jaipuri quilts, block-print textiles, and silver jewellery in the famous bazaar.", cost: "2000", duration: 180 },
    { name: "City Palace & Museum", type: "culture", description: "Explore the royal City Palace complex with its textile museum, weapons gallery, and Chandra Mahal.", cost: "700", duration: 120 },
    { name: "Jantar Mantar Observatory", type: "sightseeing", description: "Walk through 19 giant astronomical instruments — a UNESCO World Heritage Site.", cost: "200", duration: 60 },
    { name: "Nahargarh Fort Sunset", type: "sightseeing", description: "Hike or drive to Nahargarh Fort for panoramic sunset views over the Pink City.", cost: "200", duration: 90 },
    { name: "Elephant Village Visit", type: "culture", description: "Visit Elefantastic village — interact with elephants and learn about their care.", cost: "1500", duration: 120 },
    { name: "Traditional Pottery Class", type: "culture", description: "Try your hand at Jaipur's famous blue pottery with a master craftsman.", cost: "800", duration: 120 },
  ],
  "Varanasi": [
    { name: "Ganga Aarti Ceremony", type: "culture", description: "Witness the mesmerizing Dashashwamedh Ghat Aarti — fire, chants, and incense at dusk.", cost: "0", duration: 90 },
    { name: "Dawn Boat Ride on Ganges", type: "sightseeing", description: "Row past the 80+ sacred ghats as Varanasi wakes up — cremations, morning bathers, sadhus.", cost: "500", duration: 90 },
    { name: "Chaat & Street Food Walk", type: "food", description: "Try kachori sabzi, tamatar chaat, malaiyo, and thandai along the gali lanes.", cost: "300", duration: 120 },
    { name: "Sarnath Buddhist Site", type: "culture", description: "Visit the deer park where Buddha gave his first sermon — Dhamek Stupa and Ashoka Pillar.", cost: "500", duration: 150 },
    { name: "Silk Weaving Workshop", type: "culture", description: "See master weavers create Banarasi silk sarees on handlooms in old city workshops.", cost: "200", duration: 90 },
    { name: "Manikarnika Ghat Visit", type: "culture", description: "The holiest of burning ghats — a deeply moving, 24-hour sacred cremation site.", cost: "0", duration: 60 },
    { name: "Classical Music Evening", type: "culture", description: "Attend a raga performance at one of Varanasi's music ashrams with accomplished musicians.", cost: "400", duration: 120 },
    { name: "Yoga & Meditation Class", type: "other", description: "Early morning yoga session overlooking the Ganges with a certified yoga teacher.", cost: "500", duration: 90 },
  ],
  "Goa": [
    { name: "Baga Beach Water Sports", type: "adventure", description: "Parasailing, jet skiing, banana boat rides, and windsurfing at lively Baga beach.", cost: "1500", duration: 180 },
    { name: "Old Goa UNESCO Churches", type: "culture", description: "Visit Basilica of Bom Jesus (St. Francis Xavier's relics) and Se Cathedral.", cost: "0", duration: 120 },
    { name: "Mandovi River Sunset Cruise", type: "sightseeing", description: "Relaxing cruise with live Konkani folk music, Goan snacks, and sunset views.", cost: "400", duration: 90 },
    { name: "Goan Seafood Thali", type: "food", description: "Fresh prawn balchão, fish curry rice, and bebinca dessert at a family-run beach shack.", cost: "800", duration: 90 },
    { name: "Palolem Beach Day", type: "adventure", description: "South Goa's crescent beach — kayaking, silent disco night, and cliff jumping nearby.", cost: "500", duration: 300 },
    { name: "Dudhsagar Falls Trek", type: "adventure", description: "4-tiered 310m waterfall trek deep in the Western Ghats — spectacular monsoon views.", cost: "500", duration: 240 },
    { name: "Flea Market at Anjuna", type: "shopping", description: "Browse handicrafts, antiques, clothes, and spices at the famous Wednesday flea market.", cost: "800", duration: 150 },
    { name: "Goa Spice Plantation Tour", type: "culture", description: "Guided tour of a working spice farm — cardamom, vanilla, pepper — with traditional lunch.", cost: "600", duration: 180 },
    { name: "Fort Aguada Sunset", type: "sightseeing", description: "17th century Portuguese fort with a lighthouse — stunning views over the Arabian Sea.", cost: "0", duration: 60 },
  ],
  "Mumbai": [
    { name: "Gateway of India & Elephanta Caves", type: "culture", description: "Ferry from the iconic archway to UNESCO Elephanta Island cave sculptures.", cost: "200", duration: 240 },
    { name: "Dharavi Walking Tour", type: "culture", description: "Guided tour of Asia's most enterprising township — recycling, leather, pottery industries.", cost: "1500", duration: 150 },
    { name: "Bollywood Studio Tour", type: "culture", description: "Behind-the-scenes at Film City — sets, costumes, and live shooting of TV serials.", cost: "2000", duration: 180 },
    { name: "Vada Pav & Street Food Trail", type: "food", description: "Mumbai's famous vada pav, bhel puri, pav bhaji, and sev puri across Dadar and CST.", cost: "300", duration: 120 },
    { name: "Marine Drive Evening Walk", type: "sightseeing", description: "Stroll the Queen's Necklace as city lights illuminate the 3.6km seafront promenade.", cost: "0", duration: 60 },
    { name: "Colaba Causeway Shopping", type: "shopping", description: "Hunt for antiques, silver jewellery, curios, and fashion on Mumbai's famous causeway.", cost: "1500", duration: 120 },
    { name: "Crawford Market & Spices", type: "shopping", description: "British-era market for fresh produce, dry fruits, spices, and pet shops.", cost: "500", duration: 90 },
    { name: "Dabbawala Lunchtime Visit", type: "culture", description: "Witness the legendary Mumbai dabbawala tiffin delivery system in action.", cost: "0", duration: 60 },
    { name: "Worli Sea Face Sunset", type: "sightseeing", description: "Watch the sunset from Worli Seaface with views of the Bandra-Worli Sea Link.", cost: "0", duration: 60 },
    { name: "Fine Dining at Trishna", type: "food", description: "Legendary seafood restaurant — try the butter garlic crab, a Mumbai institution since 1981.", cost: "2500", duration: 120 },
  ],
  "Delhi": [
    { name: "Red Fort Sound & Light Show", type: "culture", description: "Explore the Mughal fortress by day and attend the dramatic evening sound and light show.", cost: "600", duration: 150 },
    { name: "Qutub Minar Complex", type: "sightseeing", description: "UNESCO World Heritage Site — world's tallest brick minaret amid ancient ruins.", cost: "600", duration: 90 },
    { name: "Chandni Chowk Food Crawl", type: "food", description: "Nihari at Karim's, parathas at Paranthe Wali Gali, and jalebis at Old Famous Jalebi Wala.", cost: "500", duration: 150 },
    { name: "Humayun's Tomb Gardens", type: "sightseeing", description: "Magnificent Mughal garden tomb — the architectural inspiration for the Taj Mahal.", cost: "600", duration: 90 },
    { name: "India Gate & Rajpath Walk", type: "sightseeing", description: "Walk the ceremonial boulevard, visit the war memorial, and enjoy kulfi from street carts.", cost: "0", duration: 60 },
    { name: "Lodhi Garden Morning Walk", type: "sightseeing", description: "Explore 15th century tombs amid lush gardens — Delhi's most beautiful park.", cost: "0", duration: 75 },
    { name: "National Museum Visit", type: "culture", description: "5000 years of Indian civilisation — Indus Valley seals, Mughal miniatures, Buddhist art.", cost: "650", duration: 150 },
    { name: "Akshardham Temple", type: "culture", description: "Stunning pink stone temple complex with boat ride, film, and musical fountain show.", cost: "500", duration: 180 },
    { name: "Hauz Khas Village Dinner", type: "food", description: "Trendy dining in a 14th century reservoir complex — rooftop restaurants and cafés.", cost: "1800", duration: 120 },
    { name: "Dilli Haat Craft Market", type: "shopping", description: "Government craft emporium with artisans from every Indian state — excellent souvenirs.", cost: "120", duration: 150 },
  ],
  "Kerala": [
    { name: "Alleppey Houseboat Stay", type: "sightseeing", description: "Overnight on a traditional kettuvallam houseboat through Alleppey backwaters — includes meals.", cost: "8000", duration: 1440 },
    { name: "Munnar Tea Plantation Trek", type: "adventure", description: "Walk through Eravikulam National Park's rolling green tea estates in the Western Ghats.", cost: "500", duration: 180 },
    { name: "Ayurvedic Panchakarma Spa", type: "other", description: "Full-body rejuvenating traditional Kerala Ayurveda treatment at a certified wellness centre.", cost: "2500", duration: 120 },
    { name: "Kathakali Performance", type: "culture", description: "Classical Kerala dance-drama with elaborate costumes — emotions expressed through hand gestures.", cost: "400", duration: 90 },
    { name: "Kerala Sadya on Banana Leaf", type: "food", description: "Traditional Onam feast — 26+ vegetarian dishes served on banana leaf including payasam.", cost: "350", duration: 60 },
    { name: "Periyar Tiger Reserve Safari", type: "adventure", description: "Boat safari on Periyar Lake — spot elephants, bison, and deer in their natural habitat.", cost: "900", duration: 180 },
    { name: "Varkala Cliff Beach", type: "adventure", description: "Dramatic red laterite cliffs above the Arabian Sea — swimming, yoga retreats, fresh seafood.", cost: "0", duration: 240 },
    { name: "Theyyam Ritual Performance", type: "culture", description: "Rare North Kerala ritual art form — elaborate costumes, fire, and trance-like performances.", cost: "200", duration: 120 },
    { name: "Kochi Fort Area Walk", type: "sightseeing", description: "Explore Fort Kochi's Chinese fishing nets, Dutch Palace, Jewish synagogue, and art galleries.", cost: "0", duration: 180 },
  ],
  "Udaipur": [
    { name: "Lake Pichola Boat Ride", type: "sightseeing", description: "Sunset cruise past the Lake Palace Hotel, Jag Mandir Island, and City Palace ghats.", cost: "400", duration: 60 },
    { name: "City Palace Museum", type: "culture", description: "Explore 11 interconnected palaces — the largest in Rajasthan — with panoramic lake views.", cost: "800", duration: 150 },
    { name: "Sajjangarh Monsoon Palace Sunset", type: "sightseeing", description: "Hilltop palace with sweeping 360° views over Udaipur's lakes at golden hour.", cost: "300", duration: 90 },
    { name: "Traditional Rajasthani Cooking Class", type: "food", description: "Cook dal baati, ghevar, and ker sangri in a heritage haveli home with a local family.", cost: "2500", duration: 180 },
    { name: "Jagdish Temple Visit", type: "culture", description: "Magnificent Indo-Aryan style temple dedicated to Lord Vishnu, built in 1651.", cost: "0", duration: 45 },
    { name: "Saheliyon ki Bari Gardens", type: "sightseeing", description: "18th century royal garden of fountains, marble elephants, and lotus pools.", cost: "60", duration: 60 },
    { name: "Bagore Ki Haveli Dance Show", type: "culture", description: "Evening Rajasthani folk music and dance performance in a 250-year-old haveli.", cost: "100", duration: 90 },
    { name: "Shilpgram Craft Village", type: "shopping", description: "Rustic arts and crafts village with live demonstrations by artisans from 5 states.", cost: "50", duration: 120 },
  ],
  "Amritsar": [
    { name: "Golden Temple Complex", type: "culture", description: "The Harmandir Sahib — the holiest Sikh shrine gleaming in gold, open 24/7 to all faiths.", cost: "0", duration: 120 },
    { name: "Wagah-Attari Border Ceremony", type: "culture", description: "Electrifying flag-lowering ceremony at India-Pakistan border — patriotic, high-energy spectacle.", cost: "0", duration: 120 },
    { name: "Amritsari Kulcha Breakfast", type: "food", description: "Famous stuffed kulcha with chole and lassi at Kulcha Land or Bhai Kulwant Singh's.", cost: "150", duration: 60 },
    { name: "Jallianwala Bagh Memorial", type: "culture", description: "Memorial garden marking the tragic 1919 massacre — bullet holes still visible in walls.", cost: "0", duration: 60 },
    { name: "Langar at Golden Temple", type: "food", description: "Eat free community meal (langar) served to thousands daily at the Golden Temple — deeply moving.", cost: "0", duration: 60 },
    { name: "Gobindgarh Fort", type: "culture", description: "18th century fort with Punjabi cultural experiences, folk shows, and weapons museum.", cost: "400", duration: 120 },
    { name: "Partition Museum", type: "culture", description: "India's first museum dedicated to the 1947 Partition — powerful stories, artefacts, oral histories.", cost: "200", duration: 90 },
    { name: "Amritsari Fish & Tikka Evening", type: "food", description: "Legendary fried fish and chicken tikka at Lawrence Road dhabas — Amritsar's food street.", cost: "600", duration: 90 },
  ],
  "Darjeeling": [
    { name: "Darjeeling Himalayan Toy Train", type: "sightseeing", description: "UNESCO-listed narrow gauge steam toy train through tea gardens and mountain passes.", cost: "1500", duration: 120 },
    { name: "Tiger Hill Sunrise over Kanchenjunga", type: "sightseeing", description: "Pre-dawn drive to see the world's 3rd highest peak glow gold at sunrise — spectacular.", cost: "200", duration: 180 },
    { name: "Tea Garden Tour & Tasting", type: "food", description: "Walk a working estate like Happy Valley, see plucking, rolling, fermenting, and taste 5 flushes.", cost: "300", duration: 150 },
    { name: "Batasia Loop Viewpoint", type: "sightseeing", description: "Scenic spiral railway loop with a war memorial and panoramic Himalayan views.", cost: "100", duration: 45 },
    { name: "Rock Garden & Ganga Maya Park", type: "adventure", description: "Waterfalls, hanging bridges, and terraced rockeries in a beautiful forested canyon.", cost: "50", duration: 120 },
    { name: "Padmaja Naidu Zoo", type: "adventure", description: "High-altitude zoo home to red pandas, snow leopards, and Himalayan black bears.", cost: "100", duration: 90 },
    { name: "Ghum Monastery", type: "culture", description: "Oldest Tibetan Buddhist monastery in Darjeeling with a giant Maitreya Buddha statue.", cost: "0", duration: 45 },
    { name: "Japanese Peace Pagoda", type: "sightseeing", description: "Gleaming white Shanti Stupa with sunrise views across the tea-covered hillsides.", cost: "0", duration: 45 },
  ],
  "Rishikesh": [
    { name: "White Water Rafting on Ganges", type: "adventure", description: "Grade III-IV rapids across 16–36km stretches — exhilarating foam and swift currents.", cost: "800", duration: 240 },
    { name: "Ganga Aarti at Triveni Ghat", type: "culture", description: "Spectacular evening fire ceremony at the holy confluence — devotional, unforgettable.", cost: "0", duration: 60 },
    { name: "Bungee Jumping (India's Highest)", type: "adventure", description: "83m free-fall jump at Jumpin Heights — the highest fixed bungee jump in India.", cost: "3550", duration: 120 },
    { name: "200-Hour Yoga Intensive", type: "other", description: "Morning yoga and pranayama class at a certified ashram overlooking the Ganges.", cost: "500", duration: 120 },
    { name: "Laxman Jhula & Ram Jhula Walk", type: "sightseeing", description: "Cross the iconic iron suspension bridges above the Ganges — temples, monkeys, and views.", cost: "0", duration: 90 },
    { name: "Rajaji National Park Safari", type: "adventure", description: "Jeep safari for tigers, elephants, leopards, and 315 bird species in Rajaji Tiger Reserve.", cost: "1500", duration: 180 },
    { name: "Cafe Hopping in Tapovan", type: "food", description: "Explore the traveller cafes of Tapovan — organic food, chai, smoothie bowls, Israeli cuisine.", cost: "400", duration: 120 },
    { name: "Evening Meditation by the Ganges", type: "other", description: "Guided 1-hour meditation session on the riverbank as the sun sets behind the mountains.", cost: "300", duration: 60 },
  ],
  "Jaisalmer": [
    { name: "Jaisalmer Fort Exploration", type: "culture", description: "Walk through the living golden sandstone fort — still home to 3000 residents, temples, and havelis.", cost: "200", duration: 180 },
    { name: "Sam Sand Dunes Camel Safari", type: "adventure", description: "Sunset camel ride over the Great Thar Desert dunes — campfire and folk music at night.", cost: "1200", duration: 240 },
    { name: "Patwon Ki Haveli Visit", type: "culture", description: "5 interconnected merchant havelis with intricate sandstone jali carvings — 19th century.", cost: "100", duration: 90 },
    { name: "Gadisar Lake Boat Ride", type: "sightseeing", description: "Rowboat on the medieval reservoir surrounded by temples and shrines at golden hour.", cost: "100", duration: 60 },
    { name: "Desert Cultural Evening", type: "culture", description: "Traditional Rajasthani folk music, Kalbelia dance, puppets, and dinner under the stars.", cost: "800", duration: 180 },
    { name: "Salim Singh Ki Haveli", type: "sightseeing", description: "Distinctive 300-year-old haveli with a peacock-shaped upper story — remarkable architecture.", cost: "80", duration: 45 },
    { name: "Night Sky Camping in Thar", type: "adventure", description: "Overnight desert camping — stargazing in one of India's clearest skies, bonfire, and breakfast.", cost: "3500", duration: 720 },
    { name: "Jaisalmer Bakery & Street Food", type: "food", description: "Try mirchi bada, pyaaz kachori, and saffron lassi along the fort's cobbled lanes.", cost: "200", duration: 60 },
  ],
  "Jodhpur": [
    { name: "Mehrangarh Fort Tour", type: "culture", description: "India's mightiest fort perched 125m above the Blue City — museum of Rajput art and weapons.", cost: "800", duration: 180 },
    { name: "Blue City Walking Tour", type: "sightseeing", description: "Walk the indigo-washed lanes of Brahmin Quarter — every shade of blue stacked up the hillside.", cost: "0", duration: 120 },
    { name: "Jaswant Thada Cenotaph", type: "sightseeing", description: "Serene white marble memorial with intricate lattice screens and peaceful gardens.", cost: "50", duration: 45 },
    { name: "Umaid Bhawan Palace Tour", type: "culture", description: "World's one of the largest private residences — palace-hotel museum with Art Deco style.", cost: "100", duration: 90 },
    { name: "Sardar Market Food Trail", type: "food", description: "Makhaniya lassi, mirchi bada, mawa kachori, and shahi samosa in the clock tower market.", cost: "300", duration: 90 },
    { name: "Bishnoi Village Safari", type: "culture", description: "Jeep tour to villages of the nature-loving Bishnoi tribe — blackbucks and peacocks roam freely.", cost: "1200", duration: 240 },
    { name: "Rao Jodha Desert Rock Park", type: "adventure", description: "Ecological park at the base of Mehrangarh with sculpted trails through volcanic rock formations.", cost: "100", duration: 90 },
    { name: "Rajasthani Cuisine Cooking Class", type: "food", description: "Hands-on class making laal maas, bajre ki roti, and daal baati in a Jodhpur home.", cost: "2000", duration: 180 },
  ],
  "Hyderabad": [
    { name: "Charminar & Laad Bazaar", type: "sightseeing", description: "Climb the iconic 16th century minaret and browse bangles, pearls, and perfumes below.", cost: "50", duration: 120 },
    { name: "Golconda Fort & Sound Show", type: "culture", description: "Explore the diamond-age fort with acoustic clapping corridors and an evening light show.", cost: "500", duration: 180 },
    { name: "Hyderabadi Biryani Lunch", type: "food", description: "Authentic Dum Biryani at Paradise or Bawarchi — slow-cooked, saffron-layered perfection.", cost: "500", duration: 90 },
    { name: "Ramoji Film City Tour", type: "culture", description: "World's largest integrated film studio — sets, rides, and Bollywood magic across 1600 acres.", cost: "1550", duration: 300 },
    { name: "Hussain Sagar Lake Cruise", type: "sightseeing", description: "Boat to the giant Buddha statue island in the heart of the twin cities.", cost: "300", duration: 60 },
    { name: "Salar Jung Museum", type: "culture", description: "Vast private art collection of one man — 43,000 artefacts from world civilisations.", cost: "50", duration: 150 },
    { name: "Pearl Shopping at Manakji Sethji", type: "shopping", description: "Buy certified Hyderabadi pearls and polki jewellery in the heritage pearl market.", cost: "3000", duration: 120 },
    { name: "Irani Chai & Osmania Biscuits", type: "food", description: "Experience the quintessential Hyderabadi café culture — strong Irani chai with buttery biscuits.", cost: "50", duration: 45 },
  ],
  "Kolkata": [
    { name: "Victoria Memorial Visit", type: "culture", description: "White marble British colonial monument with museum of India's independence history.", cost: "100", duration: 120 },
    { name: "Howrah Bridge & Flower Market", type: "sightseeing", description: "Walk the iconic cantilever bridge and explore Asia's largest flower market at Mullick Ghat.", cost: "0", duration: 90 },
    { name: "Bengali Street Food Trail", type: "food", description: "Phuchka, kathi rolls, mishti doi, and jhal muri along Park Street and New Market lanes.", cost: "300", duration: 150 },
    { name: "Kumartuli Potter's Quarter", type: "culture", description: "Watch artisans craft enormous clay goddesses for Durga Puja in their workshops.", cost: "0", duration: 90 },
    { name: "Dakshineswar Kali Temple", type: "culture", description: "Sacred temple on the Hooghly River associated with Sri Ramakrishna — powerful atmosphere.", cost: "0", duration: 90 },
    { name: "Science City Visit", type: "culture", description: "Interactive museum with space theatre, evolution park, and science exhibitions.", cost: "150", duration: 180 },
    { name: "Park Street Fine Dining", type: "food", description: "Dinner at Mocambo or Peter Cat — Kolkata's legendary colonial-era restaurants.", cost: "1500", duration: 120 },
    { name: "Indian Museum", type: "culture", description: "Asia's oldest museum — Egyptian mummies, Mughal coins, and an extraordinary fossil gallery.", cost: "50", duration: 150 },
  ],
  "Mysuru": [
    { name: "Mysore Palace Illumination", type: "sightseeing", description: "The magnificent Indo-Saracenic royal palace lit by 97,000 bulbs every Sunday and on festival evenings — one of India's most spectacular sights.", cost: "100", duration: 120 },
    { name: "Chamundeshwari Temple Visit", type: "culture", description: "Sacred hilltop temple atop Chamundi Hill with a massive Nandi bull statue and panoramic city views.", cost: "0", duration: 90 },
    { name: "Mysore Silk Factory Tour", type: "culture", description: "Government silk weaving factory tour — watch artisans weave world-famous Mysore silk sarees on traditional looms.", cost: "0", duration: 60 },
    { name: "Devaraja Market Walk", type: "shopping", description: "Colourful century-old market brimming with jasmine garlands, sandalwood, spices, and fresh produce.", cost: "0", duration: 75 },
    { name: "Sandalwood Oil Factory Visit", type: "culture", description: "Government-run factory producing authentic Mysore sandalwood soaps, oils, and incense — free tour with shop.", cost: "0", duration: 60 },
    { name: "Sri Chamarajendra Zoological Gardens", type: "sightseeing", description: "One of India's best zoos — white tigers, Asiatic lions, and gorillas in spacious natural habitats.", cost: "100", duration: 150 },
    { name: "Mysore Pak & Breakfast Trail", type: "food", description: "Sample the original Mysore Pak (gram flour fudge invented here), filter coffee, and Mysore dosa at heritage Guru Sweet Mart.", cost: "200", duration: 90 },
    { name: "Brindavan Gardens Boat Ride", type: "sightseeing", description: "Terraced Mughal-style gardens below the Krishnaraja Sagar Dam — illuminated fountain show at night.", cost: "150", duration: 120 },
    { name: "Ashtanga Yoga Class", type: "adventure", description: "Join an authentic Ashtanga yoga session in the city that gave it to the world — classes near the palace.", cost: "500", duration: 90 },
    { name: "Palace Heritage Walk", type: "culture", description: "Guided walk through the old palace quarter, Jaganmohan Palace art gallery, and the royal elephant stables.", cost: "300", duration: 150 },
  ],
  "Hampi": [
    { name: "Virupaksha Temple Visit", type: "culture", description: "Living 7th century Shaiva temple complex — the spiritual heart of the Vijayanagara Empire.", cost: "0", duration: 90 },
    { name: "Vittala Temple & Stone Chariot", type: "culture", description: "UNESCO site with the iconic stone chariot and musical pillars that ring when struck.", cost: "600", duration: 120 },
    { name: "Boulder Hopping at Hampi", type: "adventure", description: "Scramble over ancient granite boulders with a guide — views of ruins, river, and rice fields.", cost: "500", duration: 180 },
    { name: "Tungabhadra River Coracle Ride", type: "adventure", description: "Circular basket boat ride across the boulder-strewn river at sunset.", cost: "200", duration: 45 },
    { name: "Sunset at Matanga Hill", type: "sightseeing", description: "Climb 600 steps to the hilltop for the most spectacular panorama of Hampi's ruins.", cost: "0", duration: 120 },
    { name: "Royal Enclosure Walk", type: "culture", description: "Explore the queens' bath, stepped tank, and elephant stables of the royal quarter.", cost: "600", duration: 120 },
    { name: "Hampi Bazaar Antiques", type: "shopping", description: "Browse ancient coins, temple artefacts, and stone carvings in the main bazaar.", cost: "500", duration: 60 },
  ],
  "Leh-Ladakh": [
    { name: "Pangong Tso Lake Day Trip", type: "sightseeing", description: "Stunningly blue high-altitude lake at 4350m — colours change from blue to green to red.", cost: "1000", duration: 480 },
    { name: "Magnetic Hill Drive", type: "adventure", description: "Experience the optical illusion where cars appear to roll uphill on their own.", cost: "0", duration: 60 },
    { name: "Thiksey Monastery Visit", type: "culture", description: "12-storey hilltop monastery resembling the Potala Palace with a giant Maitreya Buddha.", cost: "100", duration: 90 },
    { name: "Nubra Valley Camel Safari", type: "adventure", description: "Bactrian double-hump camel ride across the cold Hunder sand dunes in Nubra Valley.", cost: "300", duration: 60 },
    { name: "Khardung La Pass Drive", type: "adventure", description: "Drive to one of the world's highest motorable passes at 5359m — surreal landscape.", cost: "0", duration: 180 },
    { name: "Leh Palace Exploration", type: "culture", description: "9-storey ruined royal palace overlooking the old town — stunning views of the Indus Valley.", cost: "100", duration: 90 },
    { name: "Shanti Stupa Sunrise", type: "sightseeing", description: "Japanese-built white Buddhist stupa on a hilltop — best sunrise point in Leh.", cost: "0", duration: 60 },
    { name: "Tibetan Kitchen Momos", type: "food", description: "Steamed and fried momos, thukpa noodle soup, and butter tea at a local Tibetan restaurant.", cost: "400", duration: 75 },
  ],
};

async function seed() {
  console.log("🌱 Seeding Indian cities with accurate 2024 INR prices...");

  for (const city of indiaCities) {
    // Check if city already exists
    const existing = await citiesTable.findOne({ name: new RegExp(`^${city.name}$`, 'i') });

    let cityId: any;

    if (existing) {
      cityId = existing._id;
      // Update existing city details
      await citiesTable.updateOne(
        { _id: cityId },
        {
          $set: {
            description: city.description,
            costIndex: city.costIndex,
            imageUrl: city.imageUrl,
            popularity: city.popularity,
            region: city.region,
          }
        }
      );
      console.log(`  ⟳ ${city.name} (updated)`);
    } else {
      const inserted = await citiesTable.create(city);
      cityId = inserted._id;
      console.log(`  + ${city.name} (new)`);
    }

    if (activityTemplates[city.name]) {
      // Delete old templates and re-insert with INR prices
      await activityTemplatesTable.deleteMany({ cityId });
      const templates = activityTemplates[city.name].map((t) => ({ ...t, cityId }));
      await activityTemplatesTable.insertMany(templates);
      console.log(`    → ${templates.length} activities seeded (₹ INR pricing)`);
    }
  }

  console.log("✅ Seed complete with accurate 2024 INR pricing!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
