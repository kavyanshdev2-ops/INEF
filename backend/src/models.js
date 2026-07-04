import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const journalSchema = new Schema({
  author: String,
  title: String,
  story: String,
  date: String,
  mood: String,
  wordsCount: Number,
  createdBy: String,
});

const ticketSchema = new Schema({
  subjectIdentity: String,
  digitalAddress: String,
  inquiryNature: String,
  messageVector: String,
  timestamp: String,
});

const auditSchema = new Schema({
  message: String,
  timestamp: String,
});

const orderSchema = new Schema({
  discordUsername: String,
  items: Array,
  subtotal: Number,
  processingFee: Number,
  total: Number,
  timestamp: String,
});

const configSchema = new Schema({
  allowAnonymous: { type: Boolean, default: true },
  discordWebhookUrl: { type: String, default: '' },
});

export const Journal = models.Journal || model('Journal', journalSchema);
export const Ticket = models.Ticket || model('Ticket', ticketSchema);
export const AuditLog = models.AuditLog || model('AuditLog', auditSchema);
export const Order = models.Order || model('Order', orderSchema);
export const AppConfig = models.AppConfig || model('AppConfig', configSchema);
