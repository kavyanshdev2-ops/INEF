import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './db.js';
import { AuditLog, AppConfig, Journal, Order, Ticket } from './models.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const appBaseUrl = process.env.APP_BASE_URL || corsOrigin;

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '2mb' }));

const makeTimestamp = () => new Date().toISOString();
const makeDateLabel = () =>
  new Date()
    .toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
    .toUpperCase();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: makeTimestamp() });
});

app.get('/api/minecraft-status', (_req, res) => {
  res.json({
    online: true,
    ip: 'ineffable.mc-play.org',
    players: { online: 14, max: 150, list: ['KavyanshShakya', 'Aetheris_Operative', 'cyber_fleur'] },
    version: '1.20 - 1.21.x',
    motd: ['INEFFABLE GRID'],
    hostname: 'ineffable.mc-play.org',
    port: 25565,
    isFallback: true,
  });
});

app.get('/api/journals', async (_req, res) => {
  res.json(await Journal.find().sort({ _id: -1 }).lean());
});

app.post('/api/journals', async (req, res) => {
  const { author, title, story, mood, createdBy } = req.body ?? {};
  if (!author || !title || !story || !mood) return res.status(400).json({ error: 'Missing journal fields.' });
  const wordsCount = String(story).trim().split(/\s+/).filter(Boolean).length;
  const journal = await Journal.create({ author, title, story, mood, wordsCount, createdBy, date: makeDateLabel() });
  res.status(201).json(journal);
});

app.delete('/api/journals/:id', async (req, res) => {
  await Journal.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.delete('/api/journals/all', async (_req, res) => {
  await Journal.deleteMany({});
  res.json({ success: true });
});

app.get('/api/tickets', async (_req, res) => {
  res.json(await Ticket.find().sort({ _id: -1 }).lean());
});

app.post('/api/tickets', async (req, res) => {
  const { subjectIdentity, digitalAddress, inquiryNature, messageVector } = req.body ?? {};
  if (!subjectIdentity || !digitalAddress || !messageVector) return res.status(400).json({ error: 'Missing ticket fields.' });
  const ticket = await Ticket.create({ subjectIdentity, digitalAddress, inquiryNature, messageVector, timestamp: makeTimestamp() });
  res.status(201).json(ticket);
});

app.delete('/api/tickets/:id', async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/audit-logs', async (_req, res) => {
  const logs = await AuditLog.find().sort({ _id: 1 }).lean();
  res.json({ logs: logs.map((log) => `[${log.timestamp}] ${log.message}`) });
});

app.post('/api/audit-logs', async (req, res) => {
  const message = String(req.body?.message || '').trim();
  if (!message) return res.status(400).json({ error: 'Missing message.' });
  await AuditLog.create({ message, timestamp: makeTimestamp() });
  res.json({ success: true });
});

app.post('/api/audit-logs/clear', async (_req, res) => {
  await AuditLog.deleteMany({});
  res.json({ logs: [] });
});

app.get('/api/config', async (_req, res) => {
  const config = await AppConfig.findOne().lean();
  res.json(config || { allowAnonymous: true, discordWebhookUrl: '' });
});

app.post('/api/config', async (req, res) => {
  const { allowAnonymous = true, discordWebhookUrl = '' } = req.body ?? {};
  const config = await AppConfig.findOneAndUpdate({}, { allowAnonymous, discordWebhookUrl }, { upsert: true, new: true });
  res.json(config);
});

app.post('/api/checkout', async (req, res) => {
  const { discordUsername, items = [], subtotal = 0, processingFee = 0, total = 0 } = req.body ?? {};
  if (!discordUsername) return res.status(400).json({ error: 'Missing checkout username.' });
  const order = await Order.create({ discordUsername, items, subtotal, processingFee, total, timestamp: makeTimestamp() });
  await AuditLog.create({ message: `CHECKOUT COMPLETED FOR ${discordUsername}`, timestamp: makeTimestamp() });
  res.status(201).json({ success: true, order });
});

app.get('/api/auth/discord/url', (_req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${appBaseUrl}/api/auth/discord/callback`;
  if (!clientId) {
    return res.json({
      simulated: true,
      url: `${appBaseUrl}/login?discord=offline`,
    });
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
  });
  res.json({ simulated: false, url: `https://discord.com/api/oauth2/authorize?${params.toString()}` });
});

app.get('/api/auth/discord/callback', (_req, res) => {
  res.send('<html><body><script>window.close()</script><p>Discord auth callback received.</p></body></html>');
});

async function main() {
  await connectDb();
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
