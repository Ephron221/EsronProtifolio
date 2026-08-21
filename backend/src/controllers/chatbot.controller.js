const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Document = require('../models/Document');
const Home = require('../models/Home');

/**
 * Helper to call Google Gemini API if GEMINI_API_KEY is configured
 */
async function callGemini(prompt, systemContext) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are Esron's official AI Portfolio Assistant. Answer professionally, concisely, and warmly based ONLY on the following portfolio context:\n\n${systemContext}\n\nUser Question: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[Gemini API error]: Status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (err) {
    console.warn('[Gemini Call Failed]:', err.message);
    return null;
  }
}

/**
 * Intelligent contextual fallback engine
 */
function contextualFallback(query, context) {
  const { about, projects, skills, services, documents, home } = context;

  // Greetings
  if (/^(hi|hello|hey|greetings|morning|evening|afternoon)\b/i.test(query)) {
    return `Hello! 👋 I'm Esron's AI assistant. I can tell you about his projects, tech stack (${skills.slice(0, 4).map(s => s.name).join(', ')}...), work experience, or how to contact him. What would you like to know?`;
  }

  // Who is Esron / Bio
  if (query.includes('who') || query.includes('about') || query.includes('bio') || query.includes('background')) {
    if (about?.biography) {
      return `Esron is a passionate ${about.subtitle || 'Full-Stack Developer'}. ${about.biography.slice(0, 220)}... You can read his full story on the About page!`;
    }
    return `Esron is a Full-Stack Developer specializing in building modern web applications, scalable APIs, and intuitive user interfaces.`;
  }

  // Skills / Technologies / Stack
  if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('framework') || query.includes('language')) {
    if (skills.length > 0) {
      const topSkills = skills.map(s => s.name).join(', ');
      return `Esron's core tech stack includes: ${topSkills}. He works across Frontend, Backend, and Database engineering.`;
    }
    return `Esron's tech stack encompasses React, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, and Cloud Architecture.`;
  }

  // Projects / Portfolio Work
  if (query.includes('project') || query.includes('build') || query.includes('work') || query.includes('app') || query.includes('portfolio')) {
    if (projects.length > 0) {
      const titles = projects.map(p => `• ${p.title} (${p.technologies?.slice(0, 3).join(', ') || 'Full Stack'})`).slice(0, 4).join('\n');
      return `Here are some of Esron's standout projects:\n${titles}\n\nCheck out the Projects page for live demos and source code!`;
    }
    return `Esron has built full-stack applications, interactive web platforms, and responsive dashboards. Explore the Projects page to see them in action!`;
  }

  // Experience / Job History
  if (query.includes('experience') || query.includes('job') || query.includes('career') || query.includes('company')) {
    if (about?.experience && about.experience.length > 0) {
      const exp = about.experience[0];
      return `Esron has worked as a ${exp.position} at ${exp.company} (${exp.duration}). ${exp.description ? exp.description.slice(0, 120) + '...' : ''}`;
    }
    return `Esron has extensive experience delivering modern software products from design to production deployment.`;
  }

  // Education / Degrees
  if (query.includes('education') || query.includes('degree') || query.includes('university') || query.includes('study') || query.includes('college')) {
    if (about?.education && about.education.length > 0) {
      const edu = about.education[0];
      return `Esron holds a ${edu.degree} from ${edu.institution} (${edu.year}).`;
    }
    return `Details regarding Esron's academic background and technical degrees can be found in the About and Credentials sections.`;
  }

  // Certifications / Documents
  if (query.includes('certificate') || query.includes('cert') || query.includes('document') || query.includes('award') || query.includes('credential')) {
    if (documents.length > 0) {
      const docList = documents.map(d => `• ${d.title} (${d.type})`).slice(0, 3).join('\n');
      return `Esron holds verified achievements and certificates, including:\n${docList}\n\nYou can view the protected certificates in the Credentials section!`;
    }
    return `You can view all verified certificates and academic transcripts in the Credentials tab.`;
  }

  // CV / Resume
  if (query.includes('cv') || query.includes('resume')) {
    return `You can view Esron's protected Curriculum Vitae (CV) directly on the /cv page or reach out via the Contact page for a formal PDF copy.`;
  }

  // Services / Freelance
  if (query.includes('service') || query.includes('offer') || query.includes('hire') || query.includes('freelance')) {
    if (services.length > 0) {
      const servList = services.map(s => s.title).join(', ');
      return `Esron offers high-impact services including: ${servList}. Head over to the Services page for details!`;
    }
    return `Esron provides Full-Stack Web Development, API Architecture, UI/UX Design, and Cloud Solutions.`;
  }

  // Contact / Email / Socials
  if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('message') || query.includes('location') || query.includes('whatsapp')) {
    return `You can reach Esron directly via:\n\n🚀 **WhatsApp:** [+250787846344](https://wa.me/250787846344)\n📧 **Email:** esront21@gmail.com\n📍 **Location:** Kigali, Rwanda\n\nOr just drop a message on the Contact page! He usually responds within a few hours.`;
  }

  // Default Fallback
  return `I'm not quite sure about that, but I'd love to chat more! 🚀\n\nYou can ask me about my projects, technical skills, or professional experience. Alternatively, feel free to reach out to me directly on WhatsApp for a quicker response!`;
}

const getChatbotResponse = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ response: "Please send a valid question." });
  }

  const query = message.toLowerCase().trim();

  try {
    const [about, projects, skills, services, documents, home] = await Promise.all([
      About.findOne().lean().catch(() => null),
      Project.find().lean().catch(() => []),
      Skill.find().lean().catch(() => []),
      Service.find().lean().catch(() => []),
      Document.find().lean().catch(() => []),
      Home.findOne().lean().catch(() => null),
    ]);

    const context = { about, projects, skills, services, documents, home };

    // If Gemini or OpenAI is configured, try calling LLM
    if (process.env.GEMINI_API_KEY) {
      const systemContext = `
Role: You are Esron's Digital Twin (AI Assistant). Your goal is to represent Esron (a Full-Stack Developer) professionally but with a modern, energetic, and helpful personality.
Tone: Professional, Innovative, Concise, and Friendly. Use occasional relevant emojis (e.g., 🚀, 💻, ✨).

Portfolio Data for Context:
- About: ${about ? about.subtitle + ". " + about.biography : 'A highly skilled Full-Stack Developer based in Kigali, Rwanda.'}
- Experience: ${about?.experience?.map(e => `${e.position} at ${e.company} (${e.duration})`).join('; ')}
- Skills: ${skills.map(s => s.name).join(', ')}
- Projects: ${projects.map(p => `${p.title}: ${p.description}`).join('; ')}
- Contact: Email (esront21@gmail.com), Phone/WhatsApp (+250787846344), Location (Kigali, Rwanda).

Instructions:
1. If the user asks for something not in the data, politely say you don't know and suggest they contact Esron directly via WhatsApp or Email.
2. If they ask about pricing or hiring, be welcoming and direct them to the Contact page or suggest a WhatsApp chat for a custom quote.
3. Keep answers under 150 words.
4. Format lists with bullets for readability.
      `;

      const aiResponse = await callGemini(message, systemContext);
      if (aiResponse) {
        return res.json({ response: aiResponse });
      }
    }

    // Fallback to intelligent local contextual engine
    const response = contextualFallback(query, context);
    return res.json({ response });
  } catch (error) {
    console.error('[Chatbot Error]:', error.message);
    return res.status(500).json({ 
      response: "I'm having trouble retrieving information right now. Please feel free to reach out directly via the Contact page!" 
    });
  }
};

module.exports = { getChatbotResponse };
