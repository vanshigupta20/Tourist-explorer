// src/services/api.js
// Nominatim geocoding + Overpass API for places + Wikipedia for images

// Predefined famous places per city as instant fallback
const CITY_HIGHLIGHTS = {
  delhi: [
    { name: "Red Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Qutub Minar", category: "Monument", kinds: "historic" },
    { name: "India Gate", category: "Monument", kinds: "historic" },
    { name: "Humayun's Tomb", category: "Historic Site", kinds: "historic" },
    { name: "Lotus Temple", category: "Religious Site", kinds: "religion" },
    { name: "Akshardham Temple", category: "Religious Site", kinds: "religion" },
    { name: "Chandni Chowk", category: "Tourist Attraction", kinds: "other" },
    { name: "National Museum Delhi", category: "Museum", kinds: "museum" },
    { name: "Jama Masjid", category: "Religious Site", kinds: "religion" },
    { name: "Hauz Khas Village", category: "Historic Site", kinds: "historic" },
    { name: "Lodi Garden", category: "Park", kinds: "park" },
    { name: "Rashtrapati Bhavan", category: "Monument", kinds: "historic" },
  ],
  goa: [
    { name: "Baga Beach", category: "Beach", kinds: "beach" },
    { name: "Calangute Beach", category: "Beach", kinds: "beach" },
    { name: "Basilica of Bom Jesus", category: "Religious Site", kinds: "religion" },
    { name: "Fort Aguada", category: "Fort / Castle", kinds: "historic" },
    { name: "Dudhsagar Falls", category: "Waterfall", kinds: "natural" },
    { name: "Anjuna Beach", category: "Beach", kinds: "beach" },
    { name: "Chapora Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Palolem Beach", category: "Beach", kinds: "beach" },
    { name: "Old Goa Churches", category: "Religious Site", kinds: "religion" },
    { name: "Vagator Beach", category: "Beach", kinds: "beach" },
    { name: "Goa State Museum", category: "Museum", kinds: "museum" },
    { name: "Mangeshi Temple", category: "Religious Site", kinds: "religion" },
  ],
  jaipur: [
    { name: "Amber Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Hawa Mahal", category: "Monument", kinds: "historic" },
    { name: "City Palace Jaipur", category: "Historic Site", kinds: "historic" },
    { name: "Jantar Mantar", category: "Historic Site", kinds: "historic" },
    { name: "Nahargarh Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Jaigarh Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Albert Hall Museum", category: "Museum", kinds: "museum" },
    { name: "Birla Mandir Jaipur", category: "Religious Site", kinds: "religion" },
    { name: "Jal Mahal", category: "Monument", kinds: "historic" },
    { name: "Govind Dev Ji Temple", category: "Religious Site", kinds: "religion" },
  ],
  agra: [
    { name: "Taj Mahal", category: "Monument", kinds: "historic" },
    { name: "Agra Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Fatehpur Sikri", category: "Historic Site", kinds: "historic" },
    { name: "Mehtab Bagh", category: "Garden", kinds: "natural" },
    { name: "Itmad-ud-Daulah", category: "Historic Site", kinds: "historic" },
    { name: "Akbar's Tomb", category: "Historic Site", kinds: "historic" },
    { name: "Jama Masjid Agra", category: "Religious Site", kinds: "religion" },
    { name: "Kinari Bazaar", category: "Tourist Attraction", kinds: "other" },
  ],
  mumbai: [
    { name: "Gateway of India", category: "Monument", kinds: "historic" },
    { name: "Marine Drive", category: "Tourist Attraction", kinds: "other" },
    { name: "Elephanta Caves", category: "Historic Site", kinds: "historic" },
    { name: "Chhatrapati Shivaji Museum", category: "Museum", kinds: "museum" },
    { name: "Juhu Beach", category: "Beach", kinds: "beach" },
    { name: "Siddhivinayak Temple", category: "Religious Site", kinds: "religion" },
    { name: "Haji Ali Dargah", category: "Religious Site", kinds: "religion" },
    { name: "Colaba Causeway", category: "Tourist Attraction", kinds: "other" },
    { name: "Bandra-Worli Sea Link", category: "Tourist Attraction", kinds: "other" },
    { name: "Dharavi", category: "Tourist Attraction", kinds: "other" },
    { name: "Sanjay Gandhi National Park", category: "Nature Reserve", kinds: "natural" },
    { name: "Film City Mumbai", category: "Tourist Attraction", kinds: "other" },
  ],
  varanasi: [
    { name: "Kashi Vishwanath Temple", category: "Religious Site", kinds: "religion" },
    { name: "Dashashwamedh Ghat", category: "Religious Site", kinds: "religion" },
    { name: "Assi Ghat", category: "Religious Site", kinds: "religion" },
    { name: "Sarnath", category: "Historic Site", kinds: "historic" },
    { name: "Manikarnika Ghat", category: "Religious Site", kinds: "religion" },
    { name: "Ramnagar Fort", category: "Fort / Castle", kinds: "historic" },
    { name: "Tulsi Manas Temple", category: "Religious Site", kinds: "religion" },
    { name: "Bharat Mata Temple", category: "Religious Site", kinds: "religion" },
    { name: "Sarnath Museum", category: "Museum", kinds: "museum" },
    { name: "Banaras Hindu University", category: "Tourist Attraction", kinds: "other" },
  ],
  kerala: [
    { name: "Alleppey Backwaters", category: "Nature Reserve", kinds: "natural" },
    { name: "Munnar Tea Gardens", category: "Tourist Attraction", kinds: "natural" },
    { name: "Periyar National Park", category: "Nature Reserve", kinds: "natural" },
    { name: "Kovalam Beach", category: "Beach", kinds: "beach" },
    { name: "Fort Kochi", category: "Historic Site", kinds: "historic" },
    { name: "Varkala Beach", category: "Beach", kinds: "beach" },
    { name: "Padmanabhaswamy Temple", category: "Religious Site", kinds: "religion" },
    { name: "Wayanad Wildlife Sanctuary", category: "Nature Reserve", kinds: "natural" },
  ],
  shimla: [
    { name: "The Ridge Shimla", category: "Tourist Attraction", kinds: "other" },
    { name: "Jakhu Temple", category: "Religious Site", kinds: "religion" },
    { name: "Kufri", category: "Mountain Peak", kinds: "mountain" },
    { name: "Christ Church Shimla", category: "Religious Site", kinds: "religion" },
    { name: "Mall Road Shimla", category: "Tourist Attraction", kinds: "other" },
    { name: "Indian Institute of Advanced Study", category: "Historic Site", kinds: "historic" },
    { name: "Chadwick Falls", category: "Waterfall", kinds: "natural" },
    { name: "Annandale Ground", category: "Park", kinds: "park" },
  ],
  manali: [
    { name: "Rohtang Pass", category: "Mountain Peak", kinds: "mountain" },
    { name: "Solang Valley", category: "Tourist Attraction", kinds: "mountain" },
    { name: "Hadimba Temple", category: "Religious Site", kinds: "religion" },
    { name: "Kullu Valley", category: "Tourist Attraction", kinds: "mountain" },
    { name: "Beas River", category: "Tourist Attraction", kinds: "natural" },
    { name: "Old Manali", category: "Tourist Attraction", kinds: "other" },
    { name: "Jogini Falls", category: "Waterfall", kinds: "natural" },
    { name: "Naggar Castle", category: "Fort / Castle", kinds: "historic" },
  ],
  mysore: [
    { name: "Mysore Palace", category: "Historic Site", kinds: "historic" },
    { name: "Chamundeshwari Temple", category: "Religious Site", kinds: "religion" },
    { name: "Brindavan Gardens", category: "Garden", kinds: "natural" },
    { name: "Mysore Zoo", category: "Zoo", kinds: "other" },
    { name: "St. Philomena's Church", category: "Religious Site", kinds: "religion" },
    { name: "Srirangapatna", category: "Historic Site", kinds: "historic" },
    { name: "Jaganmohan Palace", category: "Museum", kinds: "museum" },
    { name: "Karanji Lake", category: "Nature Reserve", kinds: "natural" },
  ],
};

// Wikipedia image cache to avoid repeated fetches
const imageCache = {};

async function getWikipediaImage(placeName) {
  if (imageCache[placeName]) return imageCache[placeName];

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    const img = data?.thumbnail?.source || data?.originalimage?.source || null;
    imageCache[placeName] = img;
    return img;
  } catch {
    imageCache[placeName] = null;
    return null;
  }
}

// Fetch images for all places in parallel
async function enrichWithImages(places, location) {
  const results = await Promise.allSettled(
    places.map((p) => getWikipediaImage(p.name))
  );

  return places.map((place, i) => {
    const wikiImg = results[i].status === "fulfilled" ? results[i].value : null;
    return {
      ...place,
      image: wikiImg || getFallbackImage(place.name, location, place.kinds),
    };
  });
}

function getFallbackImage(name, location, kinds) {
  // Use picsum with a deterministic seed based on name
  const seed = Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000;
  return `https://picsum.photos/seed/${seed}/400/300`;
}

export async function fetchPlaces(location) {
  try {
    const key = location.trim().toLowerCase();

    // Check for known city highlights first (instant, no API needed)
    const knownCity = Object.keys(CITY_HIGHLIGHTS).find(
      (city) => key.includes(city) || city.includes(key)
    );

    let places;

    if (knownCity) {
      // Use curated list for known cities — fast!
      places = CITY_HIGHLIGHTS[knownCity];
    } else {
      // Geocode + Overpass for unknown cities
      places = await fetchFromOverpass(location);
      if (!places || places.length === 0) return [];
    }

    // Enrich all places with Wikipedia images in parallel
    const enriched = await enrichWithImages(places, location);
    return enriched;
  } catch (err) {
    console.error("fetchPlaces error:", err);
    return [];
  }
}

async function fetchFromOverpass(location) {
  // Geocode
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
    { headers: { "Accept-Language": "en" } }
  );
  const geoData = await geoRes.json();
  if (!geoData?.length) return [];

  const { lat, lon } = geoData[0];

  // Compact Overpass query for speed
  const query = `[out:json][timeout:20];(node["tourism"~"attraction|museum|viewpoint|zoo|theme_park"](around:12000,${lat},${lon});node["historic"~"monument|castle|fort|ruins|temple|memorial"](around:12000,${lat},${lon});node["natural"~"beach|peak|waterfall"](around:12000,${lat},${lon}););out 25;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  const data = await res.json();

  return (data?.elements || [])
    .filter((el) => el.tags?.name)
    .slice(0, 20)
    .map((el) => ({
      name: el.tags.name,
      category: getCategory(el.tags),
      kinds: getCategoryKey(el.tags),
    }));
}

function getCategory(tags) {
  if (tags.tourism === "museum") return "Museum";
  if (tags.tourism === "attraction") return "Tourist Attraction";
  if (tags.tourism === "viewpoint") return "Viewpoint";
  if (tags.tourism === "gallery") return "Art Gallery";
  if (tags.tourism === "zoo") return "Zoo";
  if (tags.tourism === "theme_park") return "Theme Park";
  if (tags.historic === "monument" || tags.tourism === "monument") return "Monument";
  if (tags.historic === "castle" || tags.historic === "fort") return "Fort / Castle";
  if (tags.historic === "ruins") return "Ancient Ruins";
  if (tags.historic === "temple" || tags.amenity === "place_of_worship") return "Religious Site";
  if (tags.historic === "memorial") return "Memorial";
  if (tags.leisure === "park") return "Park";
  if (tags.leisure === "garden") return "Garden";
  if (tags.natural === "peak") return "Mountain Peak";
  if (tags.natural === "beach") return "Beach";
  if (tags.natural === "waterfall") return "Waterfall";
  if (tags.historic) return "Historic Site";
  return "Tourist Spot";
}

function getCategoryKey(tags) {
  if (tags.natural === "beach") return "beach";
  if (tags.natural === "peak" || tags.natural === "valley") return "mountain";
  if (tags.historic === "temple" || tags.amenity === "place_of_worship") return "religion";
  if (tags.historic) return "historic";
  if (tags.tourism === "museum") return "museum";
  if (tags.leisure === "park" || tags.leisure === "garden" || tags.natural) return "natural";
  return "other";
}