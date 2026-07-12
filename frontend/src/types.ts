/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'gaming' | 'membership' | 'shop' | 'journals' | 'contact' | 'cart' | 'login' | 'admin' | 'about' | 'payment-success' | 'payment-failed';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'membership' | 'shop';
  size?: string;
}

export interface AtmosphereConfig {
  petalCount: number;
  driftVelocity: number;
  windAngle: number; // in degrees
  gravity: number;
  colorTheme: 'classic' | 'neon-mint' | 'crimson-moon' | 'monochrome';
}

export interface Sanctuary {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  image: string;
  stats: { label: string; value: string }[];
}

export interface ApparelItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export interface InquiryForm {
  subjectIdentity: string;
  digitalAddress: string;
  inquiryNature: string;
  messageVector: string;
}
