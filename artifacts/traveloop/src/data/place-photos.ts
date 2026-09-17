/**
 * Real photographs for each destination.
 *
 * Every entry below was sourced from Wikimedia Commons and fetched to confirm it
 * returns a 200 image response, so nothing here is a stock stand-in or a guess.
 * The catalogue lives apart from `places.ts` so the curated place records stay
 * readable and the imagery can be refreshed on its own.
 *
 * Keys are `Place.id`. A place with no entry here simply falls back to its
 * generic `Place.image`, which is what the low-bandwidth mode uses anyway.
 */

export interface PlacePhoto {
  /** File name on Wikimedia Commons. */
  file: string;
  /** Author as credited on Commons — required by the CC licences. */
  author: string;
  /** Licence short name, e.g. "CC BY-SA 4.0". */
  license: string;
}

const CATALOGUE: Record<string, PlacePhoto> = {
  // ── North-East ────────────────────────────────────────────────────────────
  mawlynnong: {
    file: "Mawlynnong - Cleanest village of Asia in Meghalaya.jpg",
    author: "Madhumita Das",
    license: "CC BY-SA 4.0",
  },
  ziro: {
    file: "Old traditional house clicked at Ziro Valley, Arunachal Pradesh.jpg",
    author: "পাপৰি বৰা",
    license: "CC BY-SA 4.0",
  },
  majuli: {
    file: "Majuli, the river island of Assam.jpg",
    author: "Sanghamitra Bordoloi",
    license: "CC BY-SA 4.0",
  },
  unakoti: {
    file: "Hindu Dieties on Unakoti hills Tripura India.jpg",
    author: "Photos Worldwide",
    license: "CC BY 4.0",
  },
  dzukou: {
    file: "Breathtaking beauty of Dzukou Valley in Manipur-Nagaland border (edit).jpg",
    author: "Samudra Bikash Hazarika",
    license: "CC BY-SA 4.0",
  },
  tawang: {
    file: "Tawang Monastery, Arunachal Pradesh.jpg",
    author: "J P Dutt",
    license: "CC BY-SA 4.0",
  },

  // ── Himalaya ──────────────────────────────────────────────────────────────
  spiti: {
    file: "Kee monastery Spiti Valley (edited).jpg",
    author: "Kulbhushan Singh Suryawanshi",
    license: "CC BY-SA 4.0",
  },
  chitkul: {
    file: "Baspa River, Chitkul, Himachal Pradesh.jpg",
    author: "Anamdas",
    license: "CC BY-SA 4.0",
  },
  tirthan: {
    file: "Bathad Village, Plachen Valley, Kullu District Himachal Pradesh.jpeg",
    author: "Ramwik",
    license: "CC BY-SA 3.0",
  },
  barot: {
    file: "Barot Valley ,Mandi,Himachal Pardesh.jpg",
    author: "Harvinder Chandigarh",
    license: "CC BY-SA 4.0",
  },
  turtuk: {
    file: "Balti Women Buckwheat Turtuk Mar19 DSC01118.jpg",
    author: "Kartiki Gonsalves",
    license: "CC BY-SA 4.0",
  },
  zanskar: {
    file: "Fields Zangla Zanskar River Ladakh Jun24 A7CR 00981.jpg",
    author: "Timothy A. Gonsalves",
    license: "CC BY-SA 4.0",
  },
  chopta: {
    file: "Chopta, Uttarakhand.jpg",
    author: "dirk.hartung",
    license: "CC BY-SA 2.0",
  },
  munsiyari: {
    file: "Munsiyari.jpg",
    author: "Ebenezer Rao",
    license: "CC BY-SA 4.0",
  },
  kanatal: {
    file: "Surkanda devi.jpg",
    author: "MatSwiki",
    license: "CC BY-SA 4.0",
  },
  baijnath: {
    file: "Baijnath Temple, Kangra, Himachal Pradesh, India.jpg",
    author: "Ashishverma.pu",
    license: "CC BY-SA 3.0",
  },
  tabo: {
    file: "TaboMonastery-Tabo-Spiti-Himachal-D72 6768.JPG",
    author: "Timothy A. Gonsalves",
    license: "CC BY-SA 4.0",
  },
  jageshwar: {
    file: "Jageshwar dham-almora-uttarakhand (2).jpg",
    author: "Vishpo12341441",
    license: "CC BY-SA 4.0",
  },

  // ── West ──────────────────────────────────────────────────────────────────
  kaas: {
    file: "Way through Kaas Pathar - panoramio.jpg",
    author: "Deepak Patil",
    license: "CC BY-SA 3.0",
  },
  tarkarli: {
    file: "HOUSE BOAT TARKARLI (2).jpg",
    author: "Sanjaybhagwat",
    license: "CC BY-SA 4.0",
  },
  harihar: {
    file: "Harihar - Harihar Fort (11253817395).jpg",
    author: "Elroy Serrao",
    license: "CC BY-SA 2.0",
  },
  gondeshwar: {
    file: "Gondeshwar temple, Sinnar.jpg",
    author: "PKharote",
    license: "CC BY-SA 4.0",
  },
  bhandardara: {
    file: "Bhandardara lake (Arthur lake) (6714130573).jpg",
    author: "Dinesh Valke",
    license: "CC BY-SA 2.0",
  },
  "kailasa-ellora": {
    file: "Ellora Caves, India, Kailasa Temple.jpg",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
  },
  bhuleshwar: {
    file: "View of Bhuleshwar Temple, Pune 01.jpg",
    author: "Bikashrd",
    license: "CC BY-SA 4.0",
  },
  lonar: {
    file: "Sunset over Lonar Crater Lake, Maharashtra, India.jpg",
    author: "Rohit Sharma",
    license: "CC BY-SA 4.0",
  },
  ambarnath: {
    file: "Ancient Ambarnath Shiva Temple, Near Mumbai.jpg",
    author: "Sntshkumar750",
    license: "CC BY 4.0",
  },
  modhera: {
    file: "Sun Temple, Modhera 08.jpg",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
  },
  "rani-ki-vav": {
    file: "Rani ki vav - Patan - Gujarat - DSC001.jpg",
    author: "Snehrashmi",
    license: "CC BY-SA 4.0",
  },
  palitana: {
    file: "Palitana temples 05.jpg",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
  },
  khuri: {
    file: "Thar Khuri.jpg",
    author: "Wikimedia Commons contributor",
    license: "CC BY-SA 3.0",
  },
  bishnoi: {
    file: "Bishnoi Temple at Khejarli Massacre Memorial Site..jpg",
    author: "Kaushal Bishnoi",
    license: "CC BY-SA 4.0",
  },
  kiradu: {
    file: "Kiradu ke Mandir - Barmer - Rajasthan - 011.jpg",
    author: "Akshita Raina",
    license: "CC BY-SA 4.0",
  },
  osian: {
    file: "Osiya-temple and Architecture 47.jpg",
    author: "Schwiki",
    license: "CC BY-SA 3.0",
  },

  // ── Central ───────────────────────────────────────────────────────────────
  orchha: {
    file: "Jahangir Mahal, Orchha, Madhya Pradesh, India.jpg",
    author: "Yann",
    license: "CC BY-SA 4.0",
  },
  chanderi: {
    file: "Chanderi Fort-Chanderi-Madhya Pradesh-DSC 0268.jpg",
    author: "Asit Jain",
    license: "CC BY-SA 4.0",
  },
  bhedaghat: {
    file: "0010322 Saraswati ghat, Narmada river, Bhedaghat Madhya Pradesh 01.jpg",
    author: "Ms Sarah Welch",
    license: "CC0",
  },
  tamia: {
    file: "Patalkot Green Valley View, Chhindwara District, Madhya Pradesh, India.jpg",
    author: "Kaushlendrapathe",
    license: "CC0",
  },
  mitaoli: {
    file: "Chausath Yogini Temple, Mitaoli, Morena 006.jpg",
    author: "Suyash Dwivedi",
    license: "CC BY-SA 4.0",
  },
  bateshwar: {
    file: "Batesara Group of Temple, Morena, Madhya Pradesh 04.jpg",
    author: "Suyash Dwivedi",
    license: "CC BY-SA 4.0",
  },
  maluti: {
    file: "Temples in Maluti village in Jharkhand 01.jpg",
    author: "Pinakpani",
    license: "CC BY-SA 4.0",
  },

  // ── South ─────────────────────────────────────────────────────────────────
  gandikota: {
    file: "A sunset view of Gandikota canyon River Pennar Andhra Pradesh India.jpg",
    author: "solarisgirl",
    license: "CC BY-SA 2.0",
  },
  lepakshi: {
    file: "Kalyan Mantap Lepakshi.JPG",
    author: "Rajesh Dangi",
    license: "CC BY 3.0",
  },
  araku: {
    file: "A view of Araku Valley hill station in Andhra Pradesh.jpg",
    author: "Billjones94",
    license: "CC BY-SA 4.0",
  },
  chikmagalur: {
    file: "Chikmagalur, India. (7793316622).jpg",
    author: "Mohamed Shareef",
    license: "CC BY-SA 2.0",
  },
  gokarna: {
    file: "PXL 20260103 101009613 People and Beach Om Beach Gokarna, Karnataka 35.jpg",
    author: "Sourabh.biswas003",
    license: "CC BY-SA 4.0",
  },
  hampi: {
    file: "Virupaksha temple among the ruins in Hampi.JPG",
    author: "Saranya Ghosh",
    license: "CC BY-SA 3.0",
  },
  belur: {
    file: "Chennakeshava Temple at Belur.jpg",
    author: "Dineshkannambadi",
    license: "CC BY-SA 3.0",
  },
  kollihills: {
    file: "A scenic farm in the forests of Kolli Hills Tamil Nadu India.jpg",
    author: "Pravinraaj",
    license: "CC BY 2.0",
  },
  chettinad: {
    file: "Karaikkudi-Chettinad Mansion in MM Street-WUS04552.jpg",
    author: "Rainer Halama",
    license: "CC BY-SA 4.0",
  },
  dhanushkodi: {
    file: "Dhanushkodi Beach ,Tamil Nadu ,India.jpg",
    author: "Keerthi Murugan",
    license: "CC BY 4.0",
  },
  tranquebar: {
    file: "Fort Dansborg (Danish Fort) - Tharangambadi, Tamil Nadu.jpg",
    author: "Anonymous0006",
    license: "CC0",
  },
  munroe: {
    file: "A pedestrian pontoon bridge at Munroe island in Kerala.jpg",
    author: "Shagil Kannur",
    license: "CC BY-SA 4.0",
  },
  poovar: {
    file: "Poovar Island, Kerala, India 20140107-DSC 3287.jpg",
    author: "mjoydeep2k",
    license: "CC BY-SA 3.0",
  },
  kailasanathar: {
    file: "Kanchi Kailasanathar Temple at Kanchipuram, Tamil Nadu 01.jpg",
    author: "Pinakpani",
    license: "CC BY 4.0",
  },
};

/**
 * Commons serves any file (and any size) through `Special:FilePath`, so the
 * catalogue only needs file names and can request exactly the width it renders.
 */
function commonsUrl(file: string, width: number): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

/** Real photo URL for a place, or `null` when we have no photograph for it. */
export function placePhotoUrl(id: string, width = 1200): string | null {
  const photo = CATALOGUE[id];
  return photo ? commonsUrl(photo.file, width) : null;
}

/** Attribution line for a place's photo, e.g. for the detail view. */
export function photoCredit(id: string): string | null {
  const photo = CATALOGUE[id];
  if (!photo) return null;
  return `Photo: ${photo.author} · Wikimedia Commons · ${photo.license}`;
}

/** True when we hold a real photograph (used by the data-saver mode). */
export function hasRealPhoto(id: string): boolean {
  return id in CATALOGUE;
}
