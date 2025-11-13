import React from 'react';

function generateRandomString(length = 64) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array).map((v) => possible[v % possible.length]).join('');
}

async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return await window.crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * startAuth({ clientId, redirectUri, scopes })
 * - generates a code_verifier, stores it, and redirects the user to Spotify's authorize endpoint.
 */
export async function startAuth({ clientId, redirectUri = window.location.origin + '/', scopes = 'playlist-modify-private playlist-modify-public' }) {
  if (!clientId) throw new Error('clientId required');
  if (!redirectUri) throw new Error('redirectUri required');

  const codeVerifier = generateRandomString(128);
  const hash = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hash);
  const state = generateRandomString(16);

  window.localStorage.setItem('pkce_code_verifier', codeVerifier);
  window.localStorage.setItem('pkce_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: scopes,
    state,
    show_dialog: 'true'
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('Redirecting to Spotify authorize:', authUrl);
  window.location.href = authUrl;
}

/**
 * handleRedirectCallback({ clientId, redirectUri })
 * - Call on app load. If a ?code= is present, exchanges it for tokens using the stored code_verifier.
 * - Stores tokens in localStorage and returns the token response.
 */
export async function handleRedirectCallback({ clientId, redirectUri = window.location.origin + '/' }) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!code) {
    console.log('handleRedirectCallback: no code present');
    return null;
  }

  const expectedState = window.localStorage.getItem('pkce_state');
  if (expectedState && state !== expectedState) {
    throw new Error('State mismatch in OAuth callback');
  }

  const codeVerifier = window.localStorage.getItem('pkce_code_verifier');
  if (!codeVerifier) throw new Error('PKCE code_verifier missing from localStorage');

  // 🔧 Instead of hitting Spotify directly (which is CORS-blocked),
  // send the code & verifier to your backend proxy:
  const body = new URLSearchParams({
    code,
    code_verifier: codeVerifier,
  });

  const res = await fetch('http://127.0.0.1:8081/api/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code, redirectUri, clientId, codeVerifier })
});


  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    console.error('Token exchange failed', res.status, json);
    throw new Error('Token exchange failed: ' + res.status + ' ' + JSON.stringify(json));
  }

  // Store the token and expiry
  if (json.access_token) window.localStorage.setItem('spotify_access_token', json.access_token);
  if (json.refresh_token) window.localStorage.setItem('spotify_refresh_token', json.refresh_token);
  if (json.expires_in) {
    const expiresAt = Date.now() + json.expires_in * 1000;
    window.localStorage.setItem('spotify_access_token_expires_at', String(expiresAt));
  }

  window.localStorage.removeItem('pkce_code_verifier');
  window.localStorage.removeItem('pkce_state');

  try {
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  } catch (e) {}

  console.log('✅ Token exchange succeeded via backend proxy');
  return json;
}


/**
 * getStoredToken()
 * - convenience: returns stored access token if not expired.
 */
export function getStoredToken() {
  const token = window.localStorage.getItem('spotify_access_token');
  const expiresAt = Number(window.localStorage.getItem('spotify_access_token_expires_at') || 0);
  if (!token) return null;
  if (expiresAt && Date.now() > expiresAt) return null;
  return token;
}

