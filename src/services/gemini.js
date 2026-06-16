import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const isConfigured = !!(apiKey && apiKey !== "mock-api-key");

let genAI = null;
if (isConfigured) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error);
  }
}

// Low-level text generator
export const generateText = async (prompt) => {
  if (isConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API generation error:", error);
      throw error;
    }
  } else {
    throw new Error("Gemini API is not configured.");
  }
};

// 1. Social Media Post Generator
export const generateSocialPost = async (title, platform, tone, achievements) => {
  const prompt = `You are a social media copywriter for NayePankh NGO.
  Generate an engaging social media post for ${platform} about the campaign/event "${title}".
  The tone of the post should be ${tone}.
  Key achievements to highlight: ${achievements}.
  Include relevant hashtags and emojis. Make it look professional, inspiring, and high-converting.`;

  if (isConfigured) {
    return await generateText(prompt);
  }

  // Realistic Fallback Template
  return `✨ NayePankh Foundation Updates ✨\n\nWe are absolutely thrilled to share the milestones from our recent campaign: "${title}"!\n\n💡 Key Accomplishments:\n• ${achievements}\n\nThis would not have been possible without our incredible donors and active volunteers. Thank you for giving wings to these dreams! 🧡\n\n#NayePankh #SocialImpact #NGO #CommunityEmpowerment #ChangeMakers`;
};

// 2. Donation Appeal Generator
export const generateDonationAppeal = async (cause, targetAmount, targetAudience) => {
  const prompt = `You are a professional fundraising copywriter for NayePankh NGO.
  Generate a persuasive, emotional, and inspiring donation appeal letter for the cause: "${cause}".
  Target Fundraising Amount: INR ₹${targetAmount}.
  Target Audience: ${targetAudience}.
  Keep it clear, call out specific impacts, and include a strong call to action directing readers to donate.`;

  if (isConfigured) {
    return await generateText(prompt);
  }

  // Realistic Fallback Template
  return `Dear NayePankh Supporters,\n\nWe are reaching out to request your support for our latest initiative: "${cause}".\n\nOur target is to raise ₹${targetAmount} to support this cause. Every contribution, big or small, helps us provide essential school supplies, nutrition, and training support.\n\n👉 How You Can Help:\n• ₹500 - Sponsors 1 basic school kit\n• ₹1,500 - Covers clinical screening + medicine\n• ₹3,000 - Funds 1 sewing training kit\n\nJoin us in transforming lives. Donate today and share this appeal with your network!\n\nWith gratitude,\nTeam NayePankh`;
};

// 3. Event Report Generator
export const generateEventReport = async (eventName, reachCount, hoursContributed, summaries) => {
  const prompt = `You are an operations head at NayePankh NGO.
  Generate a professional, structured post-event report for: "${eventName}".
  Total families/people reached: ${reachCount}.
  Volunteer hours contributed: ${hoursContributed}.
  Event summary details: ${summaries}.
  Make it look structured, with key metrics, highlights, and future objectives.`;

  if (isConfigured) {
    return await generateText(prompt);
  }

  // Realistic Fallback Template
  return `📋 POST-EVENT SUMMARY REPORT\n\nEvent: ${eventName}\nStatus: Completed Successfully\n\n📊 Key Impact Indicators:\n• Total Reach: ${reachCount} beneficiaries\n• Volunteer Hours: ${hoursContributed} hours\n• Summary Notes: ${summaries}\n\n🌟 Highlights:\nLocal coordinates managed crowd control, registrations, and supply handouts. Beneficiaries reported high satisfaction levels.\n\nTarget reached, scales to adjacent sectors next month.`;
};

// 4. Volunteer Appreciation Generator
export const generateVolunteerThankYou = async (volunteerName, contributions, program) => {
  const prompt = `You are the volunteer coordinator at NayePankh NGO.
  Write a warm, personalized, and inspiring appreciation letter to the volunteer: "${volunteerName}".
  Specific program they participated in: "${program}".
  Key contributions/efforts: "${contributions}".
  Express deep gratitude, recognize their impact, and encourage them to remain involved.`;

  if (isConfigured) {
    return await generateText(prompt);
  }

  // Realistic Fallback Template
  return `Subject: Thank You for Your Incredible Support, ${volunteerName}! 🧡\n\nDear ${volunteerName},\n\nOn behalf of the NayePankh Foundation, we want to express our deepest gratitude for your dedication to our "${program}" initiative.\n\nYour efforts: "${contributions}" made a direct impact on the ground.\n\nVolunteers like you are the heartbeat of NayePankh. Thank you for giving wings to these dreams!\n\nBest regards,\nVolunteer Coordination Team\nNayePankh Foundation`;
};

// 5. Certificate Citation Generator
export const generateCertificateCitation = async (volunteerName, eventTitle, contributions) => {
  const prompt = `You are a professional coordinator at NayePankh NGO.
  Write a beautiful, formal, and inspiring 1-2 sentence certificate citation for the volunteer: "${volunteerName}".
  They participated in the campaign: "${eventTitle}".
  Their key contributions: "${contributions}".
  Ensure the citation is elegant, fits perfectly on a certificate, and highlights their impact.`;

  if (isConfigured) {
    return await generateText(prompt);
  }

  return `For their outstanding and selfless dedication to the "${eventTitle}" campaign, where they made a significant impact by ${contributions}. Your commitment to serving the community embodies the true spirit of NayePankh NGO.`;
};

// --- NPbot CHATBOT SERVICES ---

/**
 * Fallback semantic responder for local testing when API key is missing.
 */
export const getMockChatResponse = (userInput) => {
  const query = userInput.toLowerCase();
  
  if (query.includes("donate") || query.includes("money") || query.includes("fund") || query.includes("contribution") || query.includes("give") || query.includes("payment")) {
    return `Thank you for your interest in supporting the NayePankh Foundation! 🧡

Your donations directly fund our education kits, women empowerment programs, and nutrition drives.

**Key Donation Benefits:**
* **80G & 12A Tax Exemption:** All donations to NayePankh Foundation are 50% tax-exempt under Section 80G of the Income Tax Act.
* **100% Transparency:** We provide impact reports and donation receipts directly to your email.

**How to Donate:**
1. Click on the **Donate** tab in our navigation bar.
2. Fill in your details and choose your contribution amount.
3. You can also transfer directly to our Bank Account or use UPI.

Would you like to support education, nutrition, or women's livelihood programs today?`;
  }
  
  if (query.includes("volunteer") || query.includes("join") || query.includes("work") || query.includes("help") || query.includes("intern")) {
    return `We would love to have you as a volunteer with NayePankh Foundation! 🤝

Volunteering with us is a great way to make a real-world impact and build valuable skills.

**What you will get:**
* A Certificate of Volunteering from a government-registered NGO.
* Flexible working hours (both online/remote and offline field work options).
* Hands-on experience in community mobilization, event management, or teaching.

**How to Apply:**
* Go to our **Get Involved** page via the navigation bar.
* Fill out the Registration Form and select your area of interest (Teaching, Social Media, Content, or Field Operations).
* Our volunteer coordinator will reach out to you within 24-48 hours!`;
  }

  if (query.includes("program") || query.includes("initiative") || query.includes("project") || query.includes("what do you do") || query.includes("work")) {
    return `NayePankh Foundation is dedicated to bringing positive change through several core initiatives:

📚 **1. Education for All:** We provide school bags, notebooks, stationery, and non-formal educational support to underprivileged children.
👩‍💼 **2. Women Empowerment:** We run sewing and vocational training centers to help women from marginalized communities become self-reliant and earn a sustainable livelihood.
🍲 **3. Hunger & Nutrition Drives:** Regular food distribution drives to ensure no child or family goes to sleep hungry.
🏥 **4. Health & Sanitation:** Clinical camps and distribution of hygiene products (like sanitary pads) to girls and women in slums.

Which program would you like to know more about?`;
  }

  if (query.includes("event") || query.includes("camp") || query.includes("drive")) {
    return `We conduct regular community events, distribution drives, and awareness campaigns! 📅

* **Recent Event:** We recently conducted an education kit distribution drive for over 200 children in UP, providing books, school bags, and stationery.
* **Registration:** You can view and register for upcoming events under our **Events** tab. When you register, your details are securely stored, and our team coordinates with you for participation.

Would you like to register for our next community drive?`;
  }

  if (query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("address") || query.includes("where are you") || query.includes("location")) {
    return `You can reach the NayePankh Foundation through the following channels:

📧 **Email:** office@nayepankh.org / support@nayepankh.org
📞 **Phone:** +91-8318508183
📍 **Registered Office:** Noida, Uttar Pradesh, India
💬 **Social Media:** You can also DM us on Instagram, LinkedIn, or Facebook!

You can also send us a message directly from the **Contact** page on this website, and our support team will get back to you as soon as possible.`;
  }

  if (query.includes("register")) {
    return `To register for our activities:
1. **Event Registration:** Go to the **Events** page, select an active event, and fill in the registration details to participate.
2. **Volunteer Registration:** Go to the **Get Involved** page and fill out the membership application form.
3. **User Registration:** You can create an account using our registration page to track your interactions, donations, and volunteer status.`;
  }

  if (query.includes("who are you") || query.includes("what is npbot") || query.includes("npbot") || query.includes("name")) {
    return `I am **NPbot**, the official virtual assistant of the NayePankh Foundation! 🕊️

I'm designed to help you navigate our website, learn about our initiatives, find out how you can volunteer or donate, and answer any general questions about our organization.`;
  }

  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("hola") || query.includes("greetings")) {
    return `Hello there! I am **NPbot**, the virtual assistant for NayePankh Foundation. 😊

How can I help you today? You can ask me about:
* **Donations** (80G tax exemption details)
* **Volunteering** (how to apply & certificates)
* **Our Projects** (Education, Women Empowerment, etc.)
* **Contact Information** & locations`;
  }

  return `Thank you for asking! I am **NPbot**, the NayePankh Foundation assistant.

I can help you with:
1. **Donations & tax benefits** (Section 80G tax exemption)
2. **Volunteering opportunities** and certificates
3. **Core initiatives** (Education, Women Livelihoods, Food Drives)
4. **Contact details** and offices

Could you please specify your query or tell me how you would like to support us?`;
};

/**
 * Generates an AI chatbot response for NPbot.
 * Automatically falls back to mock responses if the API key is not configured or fails.
 */
export const generateChatResponse = async (userInput, chatHistory = []) => {
  if (isConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are NPbot, the official virtual assistant of the NayePankh Foundation (a registered NGO in India dedicated to underprivileged education, women empowerment, food distribution, and clinical camps).
Your goal is to guide visitors, answer their queries about donations, volunteering, programs, events, and contact details in a polite, warm, and highly helpful manner.
Key details about NayePankh Foundation:
- It is UP government, 80G & 12A registered (donations are 50% tax exempt).
- Founded by Prashant Shukla.
- Major projects: Educating children, sewing training centers for women empowerment, regular nutrition/food distribution drives.
Keep your responses relatively concise, formatting with markdown where appropriate (lists, bold text), and maintain an encouraging tone. Always refer to yourself as NPbot.

CRITICAL RULE: If you do not know the answer to a question, or if the user asks about something completely unrelated to NayePankh Foundation, volunteerism, or donations (e.g., coding, general trivia, weather, news, unrelated companies), politely decline to answer. Explain that your expertise is focused on NayePankh Foundation's operations and how they can support the cause.`
      });

      // Format history to Gemini role/parts structure
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Chat API error, falling back to mock responder:", error);
      return getMockChatResponse(userInput);
    }
  } else {
    // Simulate a small delay for a realistic bot response feel when running locally
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockChatResponse(userInput);
  }
};

