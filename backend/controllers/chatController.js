const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Dynamic import for fetch if using older Node, but Node 18+ has native fetch.

const handleChat = async (req, res) => {
  try {
    const { message, history = [], imageBase64, mimeType } = req.body;

    const apiKeys = process.env.GEMINI_API_KEYS 
      ? process.env.GEMINI_API_KEYS.split(',').map(key => key.trim()).filter(Boolean)
      : [];
      
    if (process.env.GEMINI_API_KEY) {
      apiKeys.unshift(process.env.GEMINI_API_KEY);
    }

    if (apiKeys.length === 0) {
      return res.status(500).json({ success: false, message: "Gemini API keys are missing." });
    }

    // Keep only the last 12 messages
    const recentHistory = history.slice(-12);

    const systemPrompt = `You are the official AI assistant for Salim Khan, a professional full stack developer who has worked on many real world projects. 
He is a Frontend Developer, Backend Developer, UI/UX Designer, and Software Tester. 
Your goal is to provide smart pitching: ask about the visitor's problem or what they are looking to build, and offer Salim's assistance and expertise.
Encourage the user to upload screenshots if they have a visual problem or a design they want to discuss, and you will analyze them.
Keep your answers relevant, concise, and professional. You are responding to the latest message while keeping the past 12 messages in context.
CRITICAL INSTRUCTION: Do NOT use em dashes or long hyphens (—) in your responses. Use standard punctuation only.`;

    const contents = [];

    // Format history
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    // Format current message
    const currentParts = [];
    if (message) {
      currentParts.push({ text: message });
    }
    
    if (imageBase64 && mimeType) {
      // Remove data:image/...;base64, prefix if present
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      currentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    // Only add if there are parts
    if (currentParts.length > 0) {
      contents.push({
        role: 'user',
        parts: currentParts
      });
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents
    };

    // apiKeys are already initialized at the start of the function

    if (apiKeys.length === 0) {
      return res.status(500).json({ success: false, message: "Gemini API keys are missing." });
    }

    let lastErrorData = null;
    let lastStatus = 500;

    for (const key of apiKeys) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`;
// .
      try {
        const response = await global.fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
          return res.json({ success: true, reply });
        } else {
          console.error("Gemini API Error with key (redacted):", data);
          lastErrorData = data;
          lastStatus = response.status;
          // Continue to the next key if response is not ok
        }
      } catch (fetchError) {
        console.error("Fetch error with key:", fetchError);
        // Continue to the next key on network error
      }
    }

    // If we've exhausted all keys
    return res.status(lastStatus).json({ 
      success: false, 
      message: lastErrorData?.error?.message || "Failed to fetch from Gemini API after trying all keys." 
    });
  } catch (error) {
    console.error("Error in chatController:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  handleChat
};
