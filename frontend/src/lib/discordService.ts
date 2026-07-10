/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validates whether the given email address has a valid @gmail.com domain suffix.
 * @param email - The email string to validate
 * @returns boolean
 */
export function validateGmailAddress(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  // Basic email pattern check along with strict @gmail.com ending
  const gmailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i;
  return gmailPattern.test(normalized);
}

interface TicketData {
  id: string;
  subjectIdentity: string;
  digitalAddress: string;
  inquiryNature: string;
  messageVector: string;
  createdAt: string;
}

/**
 * Sends a structured ticket payload to the configured Discord Webhook.
 * @param ticket - The ticket details to dispatch
 * @returns Promise<{ success: boolean; message: string }>
 */
export async function sendDiscordTicket(ticket: TicketData): Promise<{ success: boolean; message: string }> {
  const webhookUrl = (import.meta as any).env.VITE_DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      success: false,
      message: "Discord Webhook routing inactive (VITE_DISCORD_WEBHOOK_URL environment variable is not defined)."
    };
  }

  // Double-check Gmail validation before sending
  if (!validateGmailAddress(ticket.digitalAddress)) {
    return {
      success: false,
      message: "Invalid address format. Digital address must be a valid @gmail.com address."
    };
  }

  try {
    const discordPayload = {
      username: "Cyber Zen Core Dispatch",
      avatar_url: "https://cdn.discordapp.com/attachments/1503335250670129367/1524151112842870804/a_51c55f7f3261d88e6442853377345a86.gif",
      embeds: [
        {
          title: `📬 NEW DISCORD TICKET FILED`,
          description: `A secure request has been logged on the gateway.`,
          color: 0xeb3f5e, // Cyber Pink (#eb3f5e)
          fields: [
            { name: "Ticket ID", value: `\`${ticket.id}\``, inline: true },
            { name: "Subject Identity", value: ticket.subjectIdentity, inline: true },
            { name: "Digital Address (Gmail)", value: `\`${ticket.digitalAddress}\``, inline: true },
            { name: "Inquiry Nature", value: ticket.inquiryNature, inline: true },
            { name: "Timestamp (UTC)", value: `\`${ticket.createdAt}\``, inline: true },
            { name: "Message Vector Details", value: ticket.messageVector }
          ],
          footer: {
            text: "Cyber Zen Core Automated Support Registry"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordPayload)
    });

    if (response.ok) {
      return {
        success: true,
        message: "Discord node confirmed receipt & connected the ticket successfully."
      };
    } else {
      return {
        success: false,
        message: `Discord Webhook node returned status code: ${response.status}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "An unknown network error occurred during Discord dispatch."
    };
  }
}

/**
 * Sends a live chat message from a ticket to the configured Discord Webhook.
 * @param ticketId - The ID of the ticket the chat belongs to
 * @param sender - The sender identity ('user' | 'support')
 * @param senderName - The display name of the sender
 * @param messageText - The body of the chat message
 * @returns Promise<{ success: boolean; message: string }>
 */
export async function sendDiscordChatMessage(
  ticketId: string,
  sender: 'user' | 'support',
  senderName: string,
  messageText: string
): Promise<{ success: boolean; message: string }> {
  const webhookUrl = (import.meta as any).env.VITE_DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      success: false,
      message: "Discord Webhook routing inactive."
    };
  }

  try {
    const isUser = sender === 'user';
    const embedColor = isUser ? 0x0ea5e9 : 0x10b981; // Blue for user, Emerald for support/system
    const embedTitle = isUser ? `💬 LIVE CHAT MESSAGE FROM USER` : `🤖 LIVE CHAT MESSAGE FROM LAB ENGINE`;

    const discordPayload = {
      username: "Cyber Zen Chat Relay",
      avatar_url: "https://cdn.discordapp.com/attachments/1503335250670129367/1524151112842870804/a_51c55f7f3261d88e6442853377345a86.gif",
      embeds: [
        {
          title: embedTitle,
          color: embedColor,
          fields: [
            { name: "Ticket Connection", value: `\`${ticketId}\``, inline: true },
            { name: "Sender Identity", value: `**${senderName}** (${sender.toUpperCase()})`, inline: true },
            { name: "Transmission Date (UTC)", value: `\`${new Date().toISOString()}\``, inline: true },
            { name: "Signal Content", value: messageText }
          ],
          footer: {
            text: "Cyber Zen Core Real-Time Chat Node"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordPayload)
    });

    if (response.ok) {
      return {
        success: true,
        message: "Discord channel notified of live transmission."
      };
    } else {
      return {
        success: false,
        message: `Discord Webhook response code: ${response.status}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "An unknown network error occurred during chat routing."
    };
  }
}

