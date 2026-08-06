/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK if key is available
const apiKey = typeof window !== 'undefined' 
  ? (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY 
  : '';

let aiInstance: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiInstance = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Gemini AI failed to initialize:', e);
  }
}

const SYSTEM_CONCIERGE_PROMPT = `
You are INEFFABLE Concierge Unit Alpha, an elite, high-end automated luxury support assistant for INEFFABLE (a premium underground fashion, 3D library, and Minecraft gaming sanctuary).
Respond with supreme polish, warm authority, and quick concise answers. Keep responses under 3-4 sentences.
Topics you cover:
- Orders & Heavyweight Couture (460GSM french terry hoodies, oversized tees, custom drops, global shipping).
- Membership Ranks (Vanguard, Apex, Celestial, Paragon and their exclusive perks).
- Minecraft SMP Gaming Server (IP: play.ineffable.cc, Java & Bedrock cross-play, custom survival economy, whitelist).
- Community Journals & 3D Interactive Bookshelf.
- Google Chat live sync support.
Always address the user with respect and confirm their inquiry status clearly.
`;

/**
 * Generate AI Concierge response
 */
export async function generateConciergeReply(
  userEmail: string,
  userMessage: string,
  chatHistory: { sender: string; text: string }[]
): Promise<string> {
  // Attempt Gemini API call if key is present
  if (aiInstance) {
    try {
      const formattedHistory = chatHistory.slice(-6).map(m => `${m.sender}: ${m.text}`).join('\n');
      const prompt = `${SYSTEM_CONCIERGE_PROMPT}\n\nRegistered User Email: ${userEmail}\nRecent Chat Context:\n${formattedHistory}\n\nUser Question: ${userMessage}\n\nConcierge Reply:`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call error, using domain response engine:', err);
    }
  }

  // Smart domain-driven fallback response generator
  const msgLower = userMessage.toLowerCase();

  if (msgLower.includes('hoodie') || msgLower.includes('tee') || msgLower.includes('order') || msgLower.includes('shipping') || msgLower.includes('cloth') || msgLower.includes('apparel') || msgLower.includes('drop')) {
    return `Inquiry recorded for ${userEmail}. All INEFFABLE couture items are crafted from 460GSM french terry cotton and dispatched with tracked express delivery within 24-48 standard hours. Would you like me to check order status or share sizing guidelines?`;
  }

  if (msgLower.includes('minecraft') || msgLower.includes('smp') || msgLower.includes('server') || msgLower.includes('ip') || msgLower.includes('whitelist') || msgLower.includes('game')) {
    return `Greetings traveler! Our high-performance Minecraft SMP operates on play.ineffable.cc (Java 1.20+ / Bedrock port 19132). Whitelist access is auto-granted to verified email accounts including ${userEmail}.`;
  }

  if (msgLower.includes('membership') || msgLower.includes('rank') || msgLower.includes('apex') || msgLower.includes('vanguard') || msgLower.includes('perk') || msgLower.includes('tier')) {
    return `Your email (${userEmail}) is connected to our Sanctuary Membership Registry. Members receive priority access to limited drops, 3D journal publishing rights, and special Discord role multipliers.`;
  }

  if (msgLower.includes('google chat') || msgLower.includes('chat') || msgLower.includes('space') || msgLower.includes('sync')) {
    return `Google Chat live synchronization is active for ${userEmail}! You can click "Sync to Google Chat" below to post this conversation directly to your Google Workspace Chat space or direct messages.`;
  }

  if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey') || msgLower.includes('help')) {
    return `Welcome to INEFFABLE Live Concierge, connected to ${userEmail}. How may our team assist you today with orders, membership ranks, Minecraft SMP, or Google Chat integration?`;
  }

  return `Transmission received for ${userEmail}. Your inquiry has been prioritized by Concierge Unit Alpha. A representative is also available via our synced Google Chat space or direct email broadcast. How else can I assist your session?`;
}
