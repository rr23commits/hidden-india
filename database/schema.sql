-- Hidden India Database Schema
-- Run this file to initialize the database

CREATE DATABASE IF NOT EXISTS hidden_india;
USE hidden_india;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  state VARCHAR(100) NOT NULL,
  description TEXT,
  culture TEXT,
  food TEXT,
  festivals TEXT,
  lifestyle TEXT,
  safety TEXT,
  rating DECIMAL(3,1) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  image_url VARCHAR(500),
  tags VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  location_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Messages table for community chat
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  location_id INT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Seed data: Hidden destinations across India
INSERT INTO locations (name, state, description, culture, food, festivals, lifestyle, safety, rating, review_count, latitude, longitude, image_url, tags) VALUES

('Etikoppaka', 'Andhra Pradesh', 
'A tiny village on the banks of the Varaha River, Etikoppaka is famous for its 400-year-old tradition of lacquer wooden toy-making. The vibrant handcrafted toys made from Ankudu plant wood are known worldwide for their natural dyes and intricate craftsmanship.',
'The village is home to artisan families who have passed down the craft of lacquerware through generations. Watching craftsmen at work is a meditative experience. The community is warm, traditional, and proud of their heritage.',
'Simple Andhra meals served in banana leaves. Must-try: spicy Gongura pickle, Pesarattu (green gram dosa), and fresh coconut chutneys. Local sweet shops serve traditional Ariselu during festivals.',
'Kuchipudi Dance Festival, Ugadi (Telugu New Year) celebrated with grand village gatherings. Artisan Mela in December showcases the finest lacquerware.',
'Slow, rhythmic village life. Mornings start with cattle grazing and women drawing kolam patterns. Evenings gather around the river banks. Internet access is sparse, making it a perfect digital detox.',
'Very safe. Crime is negligible. Travel tip: Visit during morning hours for the best workshop experience. Carry cash as ATMs are limited.',
4.6, 127, 17.4819, 82.7066, 
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'craft,village,artisan,toy'),

('Ziro Valley', 'Arunachal Pradesh',
'Nestled in the lower Himalayan ranges, Ziro Valley is one of India''s best-kept secrets. Home to the Apatani tribe, this UNESCO World Heritage tentative site offers lush green paddy fields, pine forests, and a culture untouched by time.',
'The Apatani tribe is known for their distinctive tattoos and nose plugs (a tradition now fading). They practice eco-friendly farming methods and have a deep spiritual connection with nature. Bamboo crafts and handwoven shawls are cultural treasures.',
'Rice beer (Apong) is central to Apatani culture. Try smoked pork with bamboo shoots, roasted fish wrapped in banana leaves, and fermented soybean dishes. The food is earthy and deeply satisfying.',
'Myoko Festival (March-April) — a grand harvest festival with singing, dancing, and ritual prayers. Dree Festival (July) prays for abundant harvests.',
'Life here moves with the seasons. The Apatani are early risers, tending to their paddy terraces. Evenings are spent around fires sharing stories. Community bonds are unbreakable.',
'Safe for solo travelers. Carry an Inner Line Permit (ILP) required for non-Arunachal residents. Roads can be challenging during monsoon. Nearest medical facility in Hapoli town.',
4.8, 89, 27.6383, 93.8288,
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'tribal,himalaya,nature,festival'),

('Majuli Island', 'Assam',
'The world''s largest river island, Majuli sits in the heart of the Brahmaputra. It is the cultural capital of Assamese civilization and home to centuries-old Satras (Vaishnava monasteries) that preserve ancient dance, music, and mask-making traditions.',
'Majuli is the cradle of Vaishnavism in India. The Satra culture emphasizes devotion, classical arts, and philosophical inquiry. Mask-making (Mukha Shilpa) is a dying art being preserved here. Bodo and Mising tribes add to the cultural tapestry.',
'Fresh river fish curry with mustard paste, Khar (alkaline dish unique to Assam), Pitha (rice cakes) made during Bihu. Organic vegetables grown on the island flood markets with freshness.',
'Raas Mahotsav (November) — a spectacular festival of dance and devotion. Ali Ai Ligang (Mising tribe Spring festival). Bihu celebrations in April are legendary.',
'The island lives by the rhythm of the Brahmaputra. Ferry rides are the only way to reach it. Life is unhurried, deeply spiritual, and community-oriented. Witness sunset boat rides and evening prayers.',
'Generally safe. The island faces erosion — visit soon before it disappears. Carry medicines as healthcare is basic. Ferries run until 4 PM — don''t miss the last boat.',
4.7, 203, 26.9500, 94.1667,
'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', 'island,culture,monastery,river'),

('Spiti Valley', 'Himachal Pradesh',
'A cold desert mountain valley in the Himalayas, Spiti is often called "Little Tibet." With ancient monasteries perched on clifftops, snow leopard territories, and a landscape that feels otherworldly, Spiti is India''s most dramatic hidden destination.',
'Tibetan Buddhist culture permeates every aspect of life. Prayer flags flutter everywhere. Monks perform ancient rituals in 1000-year-old monasteries. The local language is Spitian (Tibetan dialect). Community revolves around the gompa (monastery).',
'Thukpa (noodle soup), Tsampa (roasted barley flour), Butter Tea (Po Cha) — an acquired taste! Local apricots and peas are cultivated at extreme altitudes. Food is simple, warming, and calorie-dense.',
'Losar (Tibetan New Year) with masked dance performances. Ladarcha Fair in August — a centuries-old trade fair. Key Monastery Festival features Cham dance.',
'Life at 12,500 feet demands resilience. Villages are small and self-sufficient. Community spirit is extraordinary — neighbors help each other survive harsh winters. Tourism is changing the valley slowly.',
'Safe but demanding. Acclimatize properly to avoid altitude sickness. Roads open June-October. Carry all medications. Satellite phones are recommended. Inner Line Permit needed for some areas.',
4.9, 312, 32.2432, 78.0183,
'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', 'himalaya,monastery,desert,adventure'),

('Gokarna', 'Karnataka',
'Beyond the tourist radar of Goa, Gokarna is a sacred coastal town that offers pristine beaches, ancient temples, and a laid-back hippie vibe. The beaches here — Om Beach, Half Moon Beach — can only be reached by boat or trek.',
'Gokarna is a pilgrimage site for Shaivites — the Mahabaleshwar Temple houses one of India''s most sacred Shiva lingas. The town seamlessly blends spiritual pilgrims with beach-loving backpackers.',
'Fresh seafood dominates — try the local Kundapura prawn curry, Neer dosa with coconut milk curry, and Sol Kadhi (coconut-kokum drink). Small beach shacks serve surprisingly good food.',
'Shivaratri celebrations are spectacular — thousands of pilgrims gather. Car Festival (Rathothsava) in February. Ganesh Chaturthi by the beach is magical.',
'A perfect blend of sacred and secular. Mornings at the beach, evenings at the temple. The town moves slowly. Yoga retreats and meditation centers attract long-stay travelers.',
'Safe and well-connected. Some beaches have strong currents — swim carefully. The town is small enough to navigate on foot. Very budget-friendly.',
4.5, 445, 14.5479, 74.3188,
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'beach,temple,spiritual,coastal'),

('Chopta', 'Uttarakhand',
'Known as the "Mini Switzerland of India," Chopta is a pristine meadow in the Kedarnath Wildlife Sanctuary. The drive through dense forests of oak and rhododendron, and the 3.5 km trek to Tungnath — the world''s highest Shiva temple — make this an unforgettable experience.',
'The region is sacred to Hindus as part of the Panch Kedar. Garhwali culture is deeply rooted in nature worship. Local shepherds (Gujjars) bring their flocks here during summer.',
'Simple Garhwali food: Kafuli (spinach curry), Chainsoo (black lentil curry), and Jhangora Ki Kheer (barnyard millet pudding). Small dhabas around Chopta serve piping hot meals.',
'Magh Mela in January. Hariyali Devi Fair in August. The rhododendron bloom in April transforms the entire valley into crimson and pink.',
'Remote and peaceful. Electricity is limited. Nights are extremely cold even in summer. Birdwatchers paradise with Himalayan monal sightings guaranteed.',
'Safe for trekkers. Hire a local guide for high altitude treks. Carry warm clothing. Medical facilities are 30km away in Ukhimath. Best visited May-June and October-November.',
4.7, 178, 30.4908, 79.1265,
'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800', 'trek,himalaya,meadow,temple'),

('Mawlynnong', 'Meghalaya',
'Voted Asia''s Cleanest Village, Mawlynnong is a testament to what community-driven conservation looks like. Located near the Bangladesh border, this Khasi village has bamboo dustbins, living root bridges, and an extraordinary sense of civic pride.',
'The Khasi matrilineal society is unique in India — property and lineage pass through the mother. Women lead households and businesses. The community''s dedication to cleanliness is cultural, not enforced.',
'Jadoh (rice cooked in meat broth), Dohneiiong (pork with black sesame), Tungrymbai (fermented soybean) — bold, unique flavors unlike anything else in India.',
'Nongkrem Dance Festival (November) — the biggest Khasi festival with traditional dances and rituals. Christmas is celebrated with great fervor as most Khasi are Christian.',
'Life here is organized and purposeful. Every household maintains their surroundings. Children learn environmental responsibility from birth. The village has 100% literacy.',
'Very safe. The living root bridges are a 30-minute trek. Monsoon makes paths slippery but the waterfalls are spectacular. Carry cash — no ATMs nearby.',
4.6, 267, 25.2027, 91.5985,
'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'village,nature,tribal,clean'),

('Hampi', 'Karnataka',
'A UNESCO World Heritage Site that most travelers rush through in a day, Hampi deserves weeks. The ruins of the Vijayanagara Empire stretch across a surreal boulder landscape — ancient temples, elephant stables, and market streets frozen in the 16th century.',
'The empire of Vijayanagara was the last great Hindu kingdom before the Mughal era. Its ruins speak of extraordinary wealth, philosophical depth, and architectural ambition. Local Kannada culture has maintained traditions for centuries.',
'Bisi Bele Bath (spiced rice-lentil dish), Jolada Rotti (jowar flatbread), local sugarcane juice, and banana varieties unique to this region. Simple, hearty Deccan Plateau cuisine.',
'Hampi Utsav (November) — a spectacular music and dance festival amidst the ruins. Vijayadasami celebrations. Local temple festivals throughout the year.',
'Life in Hampi village is built around tourists and temples. Evenings on the boulders watching sunset over the ruins are transcendental. Coracle boat rides on the Tungabhadra.',
'Safe but watch for overly persistent vendors. The area is vast — rent a bicycle or scooter. Carry water at all times. Avoid walking alone on boulder fields after sunset.',
4.8, 534, 15.3350, 76.4600,
'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800', 'heritage,ruins,history,boulder'),

('Tawang', 'Arunachal Pradesh',
'At 10,000 feet near the Bhutan and China border, Tawang is home to the largest monastery in India and second largest in Asia. The landscape is dramatic — snowy peaks, glacial lakes, and prayer flags as far as the eye can see.',
'Monpa tribe''s culture blends Tibetan Buddhism with indigenous traditions. The Tawang Monastery (founded 1680) is a living center of Buddhist learning. Thanka painting and mask-making are traditional arts.',
'Yak meat dishes, Khura (buckwheat pancake), Zan (maize porridge with butter tea), and Butter Tea. Food is warming and high-calorie for cold weather survival.',
'Torgya Festival (January) — the biggest monastic festival with 3 days of masked dances. Losar (February) celebrated grandly. Druk Choyed in September.',
'Remote, spiritual, and breathtakingly beautiful. The journey is half the experience — the road from Tezpur to Tawang passes Sela Pass (13,700 ft). Connectivity is poor, fostering genuine disconnection.',
'Inner Line Permit mandatory. Roads can close due to snowfall. Acclimatize in Dirang before proceeding. Carry sufficient cash. Medical facilities are limited.',
4.8, 156, 27.5860, 91.8594,
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'monastery,himalaya,tribal,border'),

('Pondicherry Countryside', 'Puducherry',
'Beyond the French Quarter lies a Pondicherry that few tourists discover — Tamil villages, ashram communes, and the experimental township of Auroville where 3,000 people from 50 nations live and work together in a vision of human unity.',
'A unique blend of Tamil Shaivism and French colonial heritage. Auroville is a social experiment of extraordinary ambition — no currency within the city, governed by universal values. The Sri Aurobindo Ashram continues its spiritual mission.',
'Pondicherry cuisine is a revelation: French-Tamil fusion. Baguettes with coconut curry, seafood bouillabaisse with tamarind, Crepes with banana and jaggery. Cafe des Arts serves legendary breakfast.',
'Pongal (January) celebrated beautifully in Tamil villages. Bastille Day (July 14) remembered in the French Quarter. Auroville''s anniversary (February 28) is a gathering of world citizens.',
'Relaxed and introspective. Cycling through paddy fields and fishing villages at dawn. Evening meditation at Auroville''s Matrimandir. The pace demands you slow down.',
'Very safe. Best explored by bicycle. Keep respectful dress codes at the ashram. Auroville requires registration for visitors. Extremely hot in summer — visit October to February.',
4.4, 189, 11.9416, 79.8083,
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'spiritual,french,commune,cycling');
