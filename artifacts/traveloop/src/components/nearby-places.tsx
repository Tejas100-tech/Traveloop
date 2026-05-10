import { MapPin, Navigation, ExternalLink, Landmark, Mountain, UtensilsCrossed, ShoppingBag } from "lucide-react";

interface NearbyPlace {
  name: string;
  type: "sightseeing" | "culture" | "adventure" | "food" | "shopping";
  distance: string;
  desc: string;
  cost: string;
  highlights?: string;
}

const NEARBY: Record<string, NearbyPlace[]> = {
  "Agra": [
    { name: "Fatehpur Sikri", type: "culture", distance: "35 km", desc: "Perfectly preserved abandoned Mughal capital city", cost: "₹610", highlights: "Buland Darwaza · Panch Mahal · Jama Masjid" },
    { name: "Mathura & Vrindavan", type: "culture", distance: "55 km", desc: "Birthplace of Lord Krishna — sacred temple towns", cost: "Free", highlights: "Krishna Janmabhoomi · Banke Bihari Temple" },
    { name: "Sikandra (Akbar's Tomb)", type: "sightseeing", distance: "10 km", desc: "Magnificent tomb of Emperor Akbar in beautiful gardens", cost: "₹310", highlights: "Mughal gardens · Main gateway · White marble" },
    { name: "Bateshwar Temple Complex", type: "culture", distance: "70 km", desc: "108 ancient Shiva temples on the banks of Yamuna", cost: "Free" },
  ],
  "Jaipur": [
    { name: "Ajmer & Pushkar", type: "culture", distance: "135 km", desc: "Sufi Dargah Sharif and the sacred Pushkar Lake", cost: "Free", highlights: "Dargah Sharif · Pushkar Camel Fair · Brahma Temple" },
    { name: "Ranthambore Tiger Reserve", type: "adventure", distance: "165 km", desc: "Famous tiger reserve in a dramatic ruined fort landscape", cost: "₹1500", highlights: "Tiger safari · Ranthambore Fort · Padam Lake" },
    { name: "Abhaneri Stepwell (Chand Baori)", type: "sightseeing", distance: "95 km", desc: "Ancient 3500-step geometric stepwell — one of India's largest", cost: "₹25" },
    { name: "Samode Palace", type: "culture", distance: "42 km", desc: "Opulent heritage palace with frescoed durbar hall", cost: "₹500" },
  ],
  "Varanasi": [
    { name: "Sarnath", type: "culture", distance: "12 km", desc: "Where the Buddha gave his first sermon — Dhamek Stupa", cost: "₹40", highlights: "Dhamek Stupa · Ashoka Pillar · Sarnath Museum" },
    { name: "Allahabad (Prayagraj)", type: "culture", distance: "125 km", desc: "Triveni Sangam — confluence of 3 sacred rivers", cost: "Free", highlights: "Sangam Ghat · Anand Bhavan · Allahabad Fort" },
    { name: "Chunar Fort", type: "sightseeing", distance: "42 km", desc: "Ancient fortress above the Ganges — used by Mughal emperors", cost: "₹25" },
    { name: "Vindhyachal Temple", type: "culture", distance: "70 km", desc: "Sacred Shakti Peetha temple town — important pilgrimage site", cost: "Free" },
  ],
  "Delhi": [
    { name: "Agra (Taj Mahal)", type: "sightseeing", distance: "230 km", desc: "The Taj Mahal — by Yamuna Express highway in 2 hours", cost: "₹1100", highlights: "Taj Mahal · Agra Fort · Fatehpur Sikri" },
    { name: "Neemrana Fort Palace", type: "culture", distance: "122 km", desc: "15th-century heritage fort hotel on a rocky hillside", cost: "₹500" },
    { name: "Vrindavan Temples", type: "culture", distance: "145 km", desc: "Krishna's sacred town — hundreds of ancient temples", cost: "Free", highlights: "ISKCON Temple · Prem Mandir · Banke Bihari" },
    { name: "Sariska Tiger Reserve", type: "adventure", distance: "200 km", desc: "Tiger, leopard, and jackal safaris in Alwar", cost: "₹2000" },
    { name: "Sultanpur Bird Sanctuary", type: "adventure", distance: "45 km", desc: "Wetland sanctuary with 250+ migratory and resident birds", cost: "₹25" },
  ],
  "Mumbai": [
    { name: "Alibaug Beach Town", type: "adventure", distance: "95 km", desc: "Konkan beach town with Kolaba Fort, water sports, fresh seafood", cost: "₹500", highlights: "Alibaug Beach · Kolaba Fort · Kuda Caves" },
    { name: "Lonavala & Khandala", type: "adventure", distance: "83 km", desc: "Hill stations with waterfalls, forts, and chikki sweets", cost: "Free", highlights: "Bhushi Dam · Rajmachi Fort · Lohagad Fort" },
    { name: "Elephanta Caves", type: "culture", distance: "11 km (ferry)", desc: "UNESCO World Heritage cave temple sculptures on an island", cost: "₹600", highlights: "Trimurti Shiva · Cave 1 main panel · ferry ride" },
    { name: "Nashik Wine Country", type: "food", distance: "165 km", desc: "India's Napa Valley — Sula Vineyards tours and tasting", cost: "₹500", highlights: "Sula Vineyards · York Winery · Kumbh Mela ghats" },
    { name: "Murud-Janjira Fort", type: "sightseeing", distance: "165 km", desc: "Unconquered island fort visible from Murud beach", cost: "₹50" },
  ],
  "Goa": [
    { name: "Dudhsagar Waterfalls", type: "adventure", distance: "60 km", desc: "Spectacular 310m 4-tiered waterfall in the Western Ghats", cost: "₹500", highlights: "Jeep safari · Swimming pool · Rail bridge" },
    { name: "Hampi Ruins", type: "sightseeing", distance: "350 km", desc: "UNESCO Vijayanagara Empire ruins — a full-day trip or overnight", cost: "₹600", highlights: "Vittala Temple · Virupaksha · Boulder landscape" },
    { name: "Gokarna Beach", type: "adventure", distance: "145 km", desc: "Quieter alternative to Goa — Om Beach, Half Moon Beach", cost: "Free" },
    { name: "Cotigao Wildlife Sanctuary", type: "adventure", distance: "60 km", desc: "South Goa forest with monkeys, deer, gaur, and bird watching", cost: "₹100" },
  ],
  "Kerala": [
    { name: "Athirapilly Waterfalls", type: "adventure", distance: "55 km from Kochi", desc: "The 'Niagara of India' — largest waterfall in Kerala", cost: "₹30", highlights: "80m wide waterfall · Vazhachal Falls nearby · Forest trail" },
    { name: "Wayanad Hills", type: "adventure", distance: "115 km from Calicut", desc: "Tribal culture, Edakkal Caves, and misty coffee estates", cost: "₹50", highlights: "Edakkal Caves · Chembra Peak · Pookode Lake" },
    { name: "Kovalam Beach", type: "sightseeing", distance: "14 km from Trivandrum", desc: "Famous crescent beach with a working lighthouse", cost: "Free" },
    { name: "Padmanabhaswamy Temple", type: "culture", distance: "Trivandrum city", desc: "Ancient Vishnu temple with world's richest treasure vault", cost: "Free" },
  ],
  "Udaipur": [
    { name: "Chittorgarh Fort", type: "sightseeing", distance: "115 km", desc: "Rajputana's largest fort — site of three historic jauhar (mass self-immolation)", cost: "₹500", highlights: "Vijay Stambha · Padmini Palace · Kumbha Shyam Temple" },
    { name: "Kumbhalgarh Fort", type: "sightseeing", distance: "84 km", desc: "Fort with world's 2nd longest wall (36km) — birthplace of Maharana Pratap", cost: "₹600" },
    { name: "Ranakpur Jain Temple", type: "culture", distance: "95 km", desc: "15th century marble Jain temple with 1444 uniquely carved pillars", cost: "₹200" },
    { name: "Nathdwara", type: "culture", distance: "48 km", desc: "Sacred Vaishnav pilgrimage site — Shrinathji Temple", cost: "Free" },
  ],
  "Amritsar": [
    { name: "Anandpur Sahib", type: "culture", distance: "95 km", desc: "Holiest Sikh site after Amritsar — birthplace of Khalsa", cost: "Free" },
    { name: "Dharamshala & McLeod Ganj", type: "adventure", distance: "220 km", desc: "Dalai Lama's home, Tibetan culture, and Himalayan trekking", cost: "Free", highlights: "Namgyal Monastery · Bhagsu Falls · Tibetan market" },
    { name: "Dalhousie Hill Station", type: "adventure", distance: "190 km", desc: "Colonial hill station with Himalayan views and pine forests", cost: "Free" },
    { name: "Kartarpur Sahib Corridor", type: "culture", distance: "50 km", desc: "Gurdwara where Guru Nanak spent his final 18 years — cross-border corridor", cost: "₹0" },
  ],
  "Darjeeling": [
    { name: "Gangtok, Sikkim", type: "adventure", distance: "95 km", desc: "Sikkim's colorful capital — Rumtek Monastery, Tsomgo Lake permit trips", cost: "₹500", highlights: "MG Marg · Rumtek Monastery · Tsomgo Lake" },
    { name: "Kalimpong Hill Town", type: "culture", distance: "51 km", desc: "Buddhist monasteries, flower nurseries, and panoramic Himalaya views", cost: "Free" },
    { name: "Mirik Lake", type: "sightseeing", distance: "50 km", desc: "Serene lake with pedal boats amid tea gardens and pine forests", cost: "₹100" },
    { name: "Kurseong", type: "sightseeing", distance: "30 km", desc: "'Land of White Orchids' — tea estates, colonial bungalows, toy train halts", cost: "Free" },
  ],
  "Rishikesh": [
    { name: "Haridwar", type: "culture", distance: "24 km", desc: "One of India's 7 holiest cities — Har Ki Pauri Ganga Aarti at sunset", cost: "Free", highlights: "Har Ki Pauri · Mansa Devi Temple · Ganga Aarti" },
    { name: "Mussoorie", type: "adventure", distance: "77 km", desc: "Queen of Hills — Mall Road, Kempty Falls, and cloud-touching viewpoints", cost: "Free" },
    { name: "Neer Garh Waterfall", type: "adventure", distance: "5 km", desc: "Easy forest trek to a beautiful multi-tiered waterfall", cost: "₹50" },
    { name: "Neelkanth Mahadev Temple", type: "culture", distance: "32 km", desc: "Ancient Shiva temple in dense forest at 1330m — popular pilgrimage trek", cost: "Free" },
  ],
  "Jaisalmer": [
    { name: "Khuri Village & Dunes", type: "adventure", distance: "45 km", desc: "Authentic Thar Desert village with quieter dunes than Sam — camel safaris", cost: "₹800" },
    { name: "Kuldhara Abandoned Village", type: "sightseeing", distance: "23 km", desc: "Haunted 200-year-old abandoned Paliwal Brahmin village in the desert", cost: "₹50" },
    { name: "Barmer Desert District", type: "culture", distance: "145 km", desc: "Handicraft hub — traditional Rabari embroidery, block printing, and pottery", cost: "₹500" },
    { name: "Lodhurva Ancient Temples", type: "culture", distance: "16 km", desc: "Ancient Jain temples — capital of the Bhati Rajputs before Jaisalmer Fort", cost: "₹100" },
  ],
  "Jodhpur": [
    { name: "Osian Temple Cluster", type: "culture", distance: "65 km", desc: "Ancient Hindu and Jain temple complex in the Thar Desert — 8th century", cost: "₹50" },
    { name: "Bishnoi Villages", type: "culture", distance: "25 km", desc: "Eco-friendly tribe who protect nature — blackbucks graze among homes", cost: "₹1200" },
    { name: "Mandore Gardens", type: "culture", distance: "9 km", desc: "Ancient cenotaphs of Jodhpur's maharajas amid beautiful gardens", cost: "Free" },
    { name: "Balsamand Lake Palace", type: "sightseeing", distance: "5 km", desc: "11th century lake and heritage palace amid mango, plum, and papaya orchards", cost: "₹0" },
  ],
  "Hyderabad": [
    { name: "Nagarjunakonda", type: "culture", distance: "165 km", desc: "Buddhist island site with 2000-year-old monastery ruins and a museum", cost: "₹250" },
    { name: "Warangal Fort & Temples", type: "culture", distance: "145 km", desc: "12th century Kakatiya capital — thousand-pillar temple and decorated gateway", cost: "₹300" },
    { name: "Bhongir Fort", type: "adventure", distance: "55 km", desc: "Monolithic rock fort with panoramic Deccan views — popular rock climbing spot", cost: "₹25" },
    { name: "Nagarjuna Sagar Dam", type: "sightseeing", distance: "150 km", desc: "One of India's largest dams with a stunning reservoir — boat safaris available", cost: "₹50" },
  ],
  "Kolkata": [
    { name: "Bishnupur Terracotta Temples", type: "culture", distance: "200 km", desc: "17th century terracotta temple cluster — unique red-clay Bankura style", cost: "₹25" },
    { name: "Sundarbans Tiger Reserve", type: "adventure", distance: "100 km", desc: "World's largest mangrove delta — Royal Bengal tigers, river safaris", cost: "₹1500" },
    { name: "Murshidabad Heritage", type: "culture", distance: "190 km", desc: "Last independent Nawab of Bengal's capital — Hazarduari Palace and tombs", cost: "₹200" },
    { name: "Shantiniketan", type: "culture", distance: "145 km", desc: "Rabindranath Tagore's open-air university — arts, music, Baul culture", cost: "₹0" },
  ],
  "Hampi": [
    { name: "Tungabhadra Dam", type: "sightseeing", distance: "15 km", desc: "Scenic dam and reservoir — boat rides and a musical fountain show at night", cost: "₹50" },
    { name: "Badami Cave Temples", type: "culture", distance: "135 km", desc: "6th century rock-cut Chalukya temples in dramatic red sandstone gorge", cost: "₹300" },
    { name: "Aihole & Pattadakal", type: "culture", distance: "110 km", desc: "UNESCO 'cradle of Indian architecture' — Chalukya, Rashtrakuta temple complex", cost: "₹600" },
    { name: "Anjanadri Hill (Hanuman Birthplace)", type: "culture", distance: "15 km", desc: "Claimed birthplace of Lord Hanuman — 575 steps with panoramic boulder views", cost: "₹50" },
  ],
  "Leh-Ladakh": [
    { name: "Nubra Valley", type: "adventure", distance: "120 km via Khardung La", desc: "Bactrian camel dunes, Diskit Monastery, and apricot orchards", cost: "₹500", highlights: "Hunder Dunes · Diskit Monastery · Double-hump camels" },
    { name: "Pangong Lake", type: "sightseeing", distance: "140 km", desc: "Stunning high-altitude lake spanning India and China borders", cost: "₹1000" },
    { name: "Tso Moriri Lake", type: "sightseeing", distance: "220 km", desc: "Remote high-altitude lake with wild Kiangs (Tibetan wild asses)", cost: "₹500" },
    { name: "Alchi Monastery", type: "culture", distance: "68 km", desc: "Ancient 11th century monastery with remarkable paintings — oldest in Ladakh", cost: "₹100" },
  ],
};

const typeConfig = {
  sightseeing: { icon: Landmark, color: "text-orange-500 bg-orange-100" },
  culture: { icon: Landmark, color: "text-purple-600 bg-purple-100" },
  adventure: { icon: Mountain, color: "text-green-600 bg-green-100" },
  food: { icon: UtensilsCrossed, color: "text-amber-500 bg-amber-100" },
  shopping: { icon: ShoppingBag, color: "text-pink-500 bg-pink-100" },
};

interface NearbyPlacesPanelProps {
  fromCity: string;
  toCity?: string;
}

export function NearbyPlacesPanel({ fromCity, toCity }: NearbyPlacesPanelProps) {
  const places = NEARBY[fromCity] || [];
  if (places.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-orange-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-orange-900">
            Places near {fromCity}
            {toCity ? ` → en route to ${toCity}` : ""}
          </p>
          <p className="text-xs text-orange-600/80">Attractions worth a detour</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {places.map((place) => {
          const cfg = typeConfig[place.type] || typeConfig.sightseeing;
          const Icon = cfg.icon;
          return (
            <div key={place.name} className="bg-white/80 rounded-xl p-3 border border-orange-100 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-foreground leading-tight">{place.name}</p>
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full shrink-0">{place.cost}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{place.desc}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <MapPin className="w-3 h-3" />{place.distance}
                    </span>
                    {place.highlights && (
                      <span className="text-xs text-muted-foreground truncate">{place.highlights.split(" · ")[0]}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function hasNearbyPlaces(cityName: string): boolean {
  return !!(NEARBY[cityName] && NEARBY[cityName].length > 0);
}
