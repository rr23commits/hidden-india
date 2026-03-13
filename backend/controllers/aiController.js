const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are Atlas, an AI travel intelligence tool built for Hidden India — a platform dedicated to discovering India's lesser-known, underrated destinations.

You have deep knowledge about:
- Offbeat and hidden destinations across all Indian states
- Local culture, traditions, and tribal communities
- Regional cuisines, street food, and local delicacies
- Festivals, art forms, and handicrafts
- Travel logistics, permits, and transportation
- Safety tips and local customs
- Nearby services (hospitals, hotels, restaurants, emergency contacts)
- Best seasons to visit
- Budget travel tips

Your tone:
- Knowledgeable and precise, like a well-traveled local expert
- You give specific, actionable information rather than generic advice
- You are direct and honest about safety concerns or travel difficulties
- You respect local cultures and communities
- You do not use emojis

Format your responses clearly and concisely. Always provide actionable advice. If asked about nearby hospitals, hotels, or emergency services, remind users to also check the Nearby Services map feature in the app for real-time locations.`;

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am Atlas, ready to help with Hidden India travel intelligence.' }] },
        ...chatHistory
      ]
    });

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({
      error: 'Atlas is temporarily unavailable',
      reply: 'Connection issue. Please try again in a moment.'
    });
  }
};

module.exports = { chat };