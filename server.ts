/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Ad, AdStatus, Chat, Message, Notification, Offer, ProductCondition, Report, User, KycStatus } from "./src/types.js";
import { MOCK_ADS, MOCK_CHATS, MOCK_NOTIFICATIONS, MOCK_REPORTS, MOCK_OFFERS, MOCK_USERS } from "./src/data.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini API Client
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({ apiKey });
    console.log("Gemini AI Client successfully initialized.");
  } catch (err) {
    console.error("Error initializing Gemini AI Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found in environment. AI features will run in robust simulated fallback mode.");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory persistent state
  let ads: Ad[] = [...MOCK_ADS];
  let chats: Chat[] = [...MOCK_CHATS];
  let notifications: Notification[] = [...MOCK_NOTIFICATIONS];
  let reports: Report[] = [...MOCK_REPORTS];
  let offers: Offer[] = [...MOCK_OFFERS];
  let users: User[] = [...MOCK_USERS];
  let activeCurrentUser: User = { ...MOCK_USERS[0] }; // Default logged in as Aarav

  // Helper for safety checks
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      throw new Error("Gemini API key is missing or invalid. Please configure it in your Secrets panel.");
    }
    return aiClient;
  }

  // API Endpoints

  // Active User Endpoints
  app.get("/api/user/me", (req, res) => {
    res.json(activeCurrentUser);
  });

  app.put("/api/user/me", (req, res) => {
    const updates = req.body;
    activeCurrentUser = { ...activeCurrentUser, ...updates };
    // update in users list too
    const idx = users.findIndex(u => u.id === activeCurrentUser.id);
    if (idx !== -1) {
      users[idx] = activeCurrentUser;
    }
    res.json(activeCurrentUser);
  });

  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...req.body };
      if (activeCurrentUser.id === id) {
        activeCurrentUser = users[idx];
      }
      res.json(users[idx]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Ads Endpoints
  app.get("/api/ads", (req, res) => {
    res.json(ads);
  });

  app.post("/api/ads", (req, res) => {
    const newAdData = req.body;
    const newAd: Ad = {
      id: "ad_" + Date.now(),
      title: newAdData.title,
      description: newAdData.description,
      price: Number(newAdData.price),
      category: newAdData.category,
      location: newAdData.location || activeCurrentUser.location,
      imageUrls: newAdData.imageUrls && newAdData.imageUrls.length > 0 ? newAdData.imageUrls : [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
      ],
      condition: newAdData.condition || ProductCondition.NEW,
      datePosted: new Date().toISOString().split("T")[0],
      status: AdStatus.PENDING, // Goes to Admin approval queue first!
      isFeatured: false,
      isPremiumBoosted: false,
      sellerId: activeCurrentUser.id,
      sellerName: activeCurrentUser.name,
      sellerPhone: activeCurrentUser.phone,
      sellerRating: activeCurrentUser.rating,
      sellerVerified: activeCurrentUser.isVerified,
      sellerAvatar: activeCurrentUser.avatar,
      views: 1,
      clicks: 0,
      offersCount: 0,
      reported: false,
      reportCount: 0
    };

    ads.unshift(newAd);

    // Create a system notification
    notifications.unshift({
      id: "not_" + Date.now(),
      title: "Ad Submitted for Review",
      description: `Your ad '${newAd.title.substring(0, 30)}...' has been sent to our moderators. It will go live once verified.`,
      type: "ad_status",
      timestamp: "Just now",
      isRead: false,
      relatedId: newAd.id
    });

    res.status(201).json(newAd);
  });

  app.put("/api/ads/:id", (req, res) => {
    const { id } = req.params;
    const idx = ads.findIndex(a => a.id === id);
    if (idx !== -1) {
      ads[idx] = { ...ads[idx], ...req.body };
      res.json(ads[idx]);
    } else {
      res.status(404).json({ error: "Ad not found" });
    }
  });

  app.delete("/api/ads/:id", (req, res) => {
    const { id } = req.params;
    ads = ads.filter(a => a.id !== id);
    res.json({ success: true });
  });

  // Chats Endpoints
  app.get("/api/chats", (req, res) => {
    res.json(chats);
  });

  app.post("/api/chats", (req, res) => {
    const { adId, sellerId, messageText } = req.body;
    const targetAd = ads.find(a => a.id === adId);
    if (!targetAd) {
      return res.status(404).json({ error: "Ad not found" });
    }

    // Check if chat already exists
    let existingChat = chats.find(c => c.adId === adId && c.buyerId === activeCurrentUser.id);

    if (existingChat) {
      const newMessage: Message = {
        id: "msg_" + Date.now(),
        senderId: activeCurrentUser.id,
        text: messageText,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      existingChat.messages.push(newMessage);
      existingChat.lastMessage = messageText;
      return res.json(existingChat);
    }

    const newChat: Chat = {
      id: "chat_" + Date.now(),
      adId,
      adTitle: targetAd.title,
      adPrice: targetAd.price,
      adImage: targetAd.imageUrls[0],
      buyerId: activeCurrentUser.id,
      buyerName: activeCurrentUser.name,
      buyerAvatar: activeCurrentUser.avatar,
      sellerId: targetAd.sellerId,
      sellerName: targetAd.sellerName,
      sellerAvatar: targetAd.sellerAvatar,
      lastMessage: messageText,
      unreadCount: 0,
      onlineStatus: "online",
      messages: [
        {
          id: "msg_" + Date.now(),
          senderId: activeCurrentUser.id,
          text: messageText,
          timestamp: new Date().toISOString(),
          isRead: false
        }
      ]
    };

    chats.unshift(newChat);
    res.status(201).json(newChat);
  });

  app.post("/api/chats/:id/messages", (req, res) => {
    const { id } = req.params;
    const { text, imageUrl } = req.body;
    const chat = chats.find(c => c.id === id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const newMessage: Message = {
      id: "msg_" + Date.now(),
      senderId: activeCurrentUser.id,
      text,
      imageUrl,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = text || "Sent an image";
    chat.unreadCount = chat.unreadCount + 1;

    // Simulate auto-reply from seller after 2 seconds
    if (newMessage.senderId === activeCurrentUser.id) {
      setTimeout(() => {
        const autoReplyText = `Hi there! Thanks for your interest in "${chat.adTitle}". I'm currently at work, but I'll get back to you soon. Yes, the price is slightly negotiable!`;
        const autoReply: Message = {
          id: "msg_auto_" + Date.now(),
          senderId: chat.sellerId === activeCurrentUser.id ? chat.buyerId : chat.sellerId,
          text: autoReplyText,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        chat.messages.push(autoReply);
        chat.lastMessage = autoReplyText;
        chat.unreadCount = chat.unreadCount + 1;

        // Push real-time notification
        notifications.unshift({
          id: "not_" + Date.now(),
          title: "New Message Received",
          description: `Message from ${chat.sellerId === activeCurrentUser.id ? chat.buyerName : chat.sellerName}: "${autoReplyText.substring(0, 30)}..."`,
          type: "message",
          timestamp: "Just now",
          isRead: false,
          relatedId: chat.id
        });
      }, 2000);
    }

    res.status(201).json(newMessage);
  });

  // Offers Endpoints
  app.get("/api/offers", (req, res) => {
    res.json(offers);
  });

  app.post("/api/offers", (req, res) => {
    const { adId, offerPrice } = req.body;
    const targetAd = ads.find(a => a.id === adId);
    if (!targetAd) {
      return res.status(404).json({ error: "Ad not found" });
    }

    const newOffer: Offer = {
      id: "off_" + Date.now(),
      adId,
      adTitle: targetAd.title,
      adPrice: targetAd.price,
      buyerId: activeCurrentUser.id,
      buyerName: activeCurrentUser.name,
      offerPrice: Number(offerPrice),
      status: "PENDING",
      date: new Date().toISOString().split("T")[0]
    };

    offers.unshift(newOffer);
    targetAd.offersCount += 1;

    // Send a system notification to the seller
    notifications.unshift({
      id: "not_" + Date.now(),
      title: "New Offer Received!",
      description: `${activeCurrentUser.name} has offered ₹${Number(offerPrice).toLocaleString("en-IN")} for your listing '${targetAd.title.substring(0, 30)}...'.`,
      type: "offer",
      timestamp: "Just now",
      isRead: false,
      relatedId: targetAd.id
    });

    res.status(201).json(newOffer);
  });

  app.put("/api/offers/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const idx = offers.findIndex(o => o.id === id);
    if (idx !== -1) {
      offers[idx].status = status;
      res.json(offers[idx]);
    } else {
      res.status(404).json({ error: "Offer not found" });
    }
  });

  // Reports Endpoints
  app.get("/api/reports", (req, res) => {
    res.json(reports);
  });

  app.post("/api/reports", (req, res) => {
    const { adId, reason, details } = req.body;
    const targetAd = ads.find(a => a.id === adId);
    if (!targetAd) {
      return res.status(404).json({ error: "Ad not found" });
    }

    const newReport: Report = {
      id: "rep_" + Date.now(),
      adId,
      adTitle: targetAd.title,
      adImage: targetAd.imageUrls[0],
      sellerName: targetAd.sellerName,
      reporterName: activeCurrentUser.name,
      reason,
      details,
      status: "PENDING",
      date: new Date().toISOString().split("T")[0]
    };

    reports.unshift(newReport);
    targetAd.reported = true;
    targetAd.reportCount += 1;

    res.status(201).json(newReport);
  });

  app.put("/api/reports/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      res.json(reports[idx]);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  });

  // Notifications Endpoints
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  app.post("/api/notifications/mark-read", (req, res) => {
    notifications.forEach(n => n.isRead = true);
    res.json({ success: true });
  });

  // Google Gemini AI Smart API Endpoints
  app.post("/api/ai/describe", async (req, res) => {
    const { title, condition, category, keywords } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required for description generation." });
    }

    const prompt = `You are an expert copywriter for a premium Indian marketplace platform similar to OLX and eBay, called 'Bharat Marketplace'. 
Write an extremely compelling, highly professional, search-engine-optimized, and attractive product listing description.

Use these inputs:
- Product Title: ${title}
- Condition: ${condition}
- Category: ${category || "General"}
- Key highlights/keywords: ${keywords || "None"}

Requirements:
1. Write in a premium, trustworthy tone. Use clean bullet points for product features, specifications, and physical/working condition.
2. Address Indian buyers appropriately (e.g., mention warranty, box, bills, or negotiation if matching the context).
3. Do NOT include placeholders, HTML, or mock markdown like '*Your Name*'. Keep it output-ready and beautiful.
4. Keep the total length around 150-250 words. Make it punchy and conversion-focused.`;

    try {
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        const generatedText = response.text || "";
        res.json({ description: generatedText.trim() });
      } else {
        // High fidelity mock fallback
        const mockDesc = `**🔥 PREMIUM FIND: ${title}**

Looking to sell my ${title} which is in stellar ${condition.toLowerCase().replace(/_/g, " ")} condition. Carefully maintained and sparingly used.

**✨ Key Specifications & Features:**
- Handled with absolute care, zero dents or deep scratches.
- 100% fully functional, thoroughly checked.
- Comes with original box, authentic charging cable/accessories, and official purchasing invoice.
- Primary purchase location: ${activeCurrentUser.location}.
- Outstanding battery/operation performance, just like new!

**🤝 Deal Information:**
- Selling reason: Upgrading/Moving.
- Price is slightly negotiable for serious, quick buyers.
- Safe in-person handover at a public hotspot (e.g., mall or metro station) is highly preferred for your peace of mind.

*Feel free to drop a direct price offer or message me instantly for live inspection coordinates!*`;
        res.json({ description: mockDesc });
      }
    } catch (err: any) {
      console.error("Gemini description generation failed:", err);
      res.status(500).json({ error: "Failed to generate AI description: " + err.message });
    }
  });

  app.post("/api/ai/suggest-category", async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required to suggest category." });
    }

    const prompt = `Given this product title: "${title}" and description summary: "${description || ""}".
Which category of the following fits best?
- Cars
- Bikes
- Mobile Phones
- Electronics
- Furniture
- Fashion
- Books
- Real Estate
- Jobs

Reply with EXACTLY only one of the category names listed above. Absolutely nothing else.`;

    try {
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        const suggested = (response.text || "").trim();
        res.json({ category: suggested });
      } else {
        // Client side rule based fallback
        const lowerTitle = title.toLowerCase();
        let cat = "Electronics";
        if (lowerTitle.includes("honda") || lowerTitle.includes("car") || lowerTitle.includes("bmw") || lowerTitle.includes("maruti") || lowerTitle.includes("swift") || lowerTitle.includes("hyundai")) {
          cat = "Cars";
        } else if (lowerTitle.includes("enfield") || lowerTitle.includes("bike") || lowerTitle.includes("yamaha") || lowerTitle.includes("activa") || lowerTitle.includes("ktm")) {
          cat = "Bikes";
        } else if (lowerTitle.includes("iphone") || lowerTitle.includes("phone") || lowerTitle.includes("mobile") || lowerTitle.includes("oneplus") || lowerTitle.includes("samsung")) {
          cat = "Mobile Phones";
        } else if (lowerTitle.includes("sofa") || lowerTitle.includes("bed") || lowerTitle.includes("table") || lowerTitle.includes("chair") || lowerTitle.includes("furniture")) {
          cat = "Furniture";
        } else if (lowerTitle.includes("flat") || lowerTitle.includes("apartment") || lowerTitle.includes("house") || lowerTitle.includes("rent") || lowerTitle.includes("estate")) {
          cat = "Real Estate";
        } else if (lowerTitle.includes("shirt") || lowerTitle.includes("jeans") || lowerTitle.includes("saree") || lowerTitle.includes("dress") || lowerTitle.includes("fashion")) {
          cat = "Fashion";
        } else if (lowerTitle.includes("book") || lowerTitle.includes("novel") || lowerTitle.includes("study")) {
          cat = "Books";
        } else if (lowerTitle.includes("job") || lowerTitle.includes("developer") || lowerTitle.includes("manager") || lowerTitle.includes("hiring")) {
          cat = "Jobs";
        }
        res.json({ category: cat });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Failed to suggest category: " + err.message });
    }
  });

  app.post("/api/ai/moderate", async (req, res) => {
    const { title, description, price } = req.body;

    const prompt = `You are a strict security and AI fraud moderation algorithm for 'Bharat Marketplace'.
Analyze this listing proposal:
- Title: "${title}"
- Description: "${description || ""}"
- Offered Price: ₹${price}

Please moderate the item for:
1. Extremist language, abuse, or hate speech.
2. Unbelievably unrealistic prices (e.g., iPhone 15 Pro Max listed for ₹2,000 might be a scam setup).
3. Restricted items (drugs, firearms, financial scams, credit card schemes, fake jobs).

Output your evaluation in strict valid JSON format with the following keys:
- "isApproved": boolean (true if clean, false if flagged/rejected)
- "reason": string (brief description of why it was approved or flagged/rejected)
- "trustScore": number (from 0 to 100, where 100 is perfectly legitimate)
- "isDuplicate": boolean (false by default unless looks highly suspicious)`;

    try {
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        const responseText = response.text || "{}";
        // Extract json clean
        const cleanedJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const results = JSON.parse(cleanedJson);
        res.json(results);
      } else {
        // fallback moderator rules
        let isApproved = true;
        let reason = "Verified by AI Moderation: Safe listing.";
        let trustScore = 95;

        const lowerDesc = (description || "").toLowerCase();
        const lowerTitle = title.toLowerCase();

        if (lowerDesc.includes("scam") || lowerDesc.includes("hack") || lowerDesc.includes("cheat") || lowerDesc.includes("free money")) {
          isApproved = false;
          reason = "Flagged: Contains suspicious keyword triggers (scam/cheat/hack).";
          trustScore = 12;
        } else if (Number(price) < 100 && (lowerTitle.includes("iphone") || lowerTitle.includes("car") || lowerTitle.includes("flat"))) {
          isApproved = false;
          reason = "Flagged: Unbelievably low price point detected for a premium asset. High probability of phishing or scam.";
          trustScore = 25;
        }

        res.json({
          isApproved,
          reason,
          trustScore,
          isDuplicate: false
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: "AI Moderation failed: " + err.message });
    }
  });

  // Setup Vite development middleware OR static built server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  // The port must strictly be 3000
  app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Bharat Marketplace backend live at http://localhost:3000");
  });
}

startServer();
