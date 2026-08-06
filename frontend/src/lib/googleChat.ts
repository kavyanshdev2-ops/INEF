/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App lazily or reuse existing
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Provider with Google Chat OAuth Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/chat.spaces');
provider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');
provider.addScope('https://www.googleapis.com/auth/chat.messages');
provider.addScope('https://www.googleapis.com/auth/chat.messages.create');
provider.addScope('https://www.googleapis.com/auth/chat.messages.readonly');
provider.addScope('https://www.googleapis.com/auth/chat.memberships');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initialize Google Chat Auth listener
 */
export const initGoogleChatAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken && onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn && onAuthFailure) {
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign In with Google Chat API Scopes
 */
export const signInWithGoogleChat = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    if (!token) {
      throw new Error('Google OAuth access token was not returned.');
    }

    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      console.warn('Google Chat sign-in popup was closed by the user.');
    } else {
      console.error('Google Chat Sign In Error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve cached access token
 */
export const getGoogleChatAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Sign out from Google Chat session
 */
export const logoutGoogleChat = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

/* ========================================================================
 * GOOGLE CHAT API WRAPPERS
 * ======================================================================== */

export interface GoogleChatSpace {
  name: string; // e.g. "spaces/AAAA..."
  type: string; // "SPACE", "GROUP_CHAT", "DIRECT_MESSAGE"
  displayName?: string;
  spaceThreadingState?: string;
}

export interface GoogleChatMessage {
  name?: string;
  text: string;
  createTime?: string;
  sender?: {
    name?: string;
    displayName?: string;
    avatarUrl?: string;
    type?: string;
  };
}

/**
 * List existing Google Chat spaces accessible by the user
 */
export const fetchGoogleChatSpaces = async (accessToken: string): Promise<GoogleChatSpace[]> => {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Google Chat API Error (${res.status})`);
    }

    const data = await res.json();
    return data.spaces || [];
  } catch (err: any) {
    console.warn('Failed to fetch Google Chat spaces:', err);
    throw err;
  }
};

/**
 * Create a new Google Chat Space for Support
 */
export const createGoogleChatSpace = async (
  accessToken: string,
  displayName: string = 'INEFFABLE Support Room'
): Promise<GoogleChatSpace> => {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spaceType: 'SPACE',
        displayName,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to create space (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Failed to create Google Chat space:', err);
    throw err;
  }
};

/**
 * Send a message to a specific Google Chat Space
 */
export const postGoogleChatMessage = async (
  accessToken: string,
  spaceName: string,
  messageText: string
): Promise<GoogleChatMessage> => {
  try {
    const endpoint = `https://chat.googleapis.com/v1/${spaceName}/messages`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: messageText,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to send Google Chat message (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Failed to post Google Chat message:', err);
    throw err;
  }
};

/**
 * Fetch messages in a Google Chat Space
 */
export const fetchGoogleChatMessages = async (
  accessToken: string,
  spaceName: string
): Promise<GoogleChatMessage[]> => {
  try {
    const endpoint = `https://chat.googleapis.com/v1/${spaceName}/messages`;
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to fetch messages (${res.status})`);
    }

    const data = await res.json();
    return data.messages || [];
  } catch (err: any) {
    console.warn('Failed to fetch messages:', err);
    throw err;
  }
};
