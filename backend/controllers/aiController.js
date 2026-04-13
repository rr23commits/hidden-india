const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Atlas, an AI travel intelligence tool built for Hidden India — a platform dedicated to discovering India's lesser-known, underrated destinations. You have deep knowledge about offbeat destinations, local culture, tribal communities, regional cuisines, festivals, travel logistics, permits, safety tips, and nearby services. You are direct, knowledgeable and precise. You do not use emojis.`;

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 800,
    });

    const reply = completion.choices[0].message.content;
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