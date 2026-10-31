// Public music analytics. No API keys, Firebase writes, student IDs or music content stored.
// Consent is opt-in: no GA4 network request or GA cookie before acceptance.
(function () {
  'use strict';
  const measurementId = String(window.FALOWEN_MUSIC_GA4_ID || '').trim();
  if (!/^G-[A-Z0-9]{6,16}$/.test(measurementId) || location.hostname !== 'music.falowen.app') return;
  if (new URLSearchParams(location.search).get('embedded') === '1') return;

  const consentKey = 'falowen_music_analytics_consent_v1';
  const audio = document.getElementById('audio');
  let consent = '';
  let initialized = false;
  let playbackId = null;
  try { consent = localStorage.getItem(consentKey) || ''; } catch {}

  function initAnalytics() {
    if (initialized || consent !== 'accepted') return;
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function event(name, track) {
    if (consent !== 'accepted' || !initialized || typeof window.gtag !== 'function') return;
    // A canonical URL acts as a built-in GA4 report dimension; no custom dimension
    // registration or personal identifiers are required to show popular tracks.
    const id = track && typeof track.id === 'string' ? track.id.trim() : '';
    const locationUrl = new URL('https://music.falowen.app/');
    if (id) locationUrl.searchParams.set('track', id.slice(0, 180));
    window.gtag('event', name, { page_location: locationUrl.href });
  }

  function trackedSong() {
    // app.js controls the current audio, and updates the player title and browser history.
    // Track IDs are embedded in the canonical path when a song is selected.
    const params = new URLSearchParams(location.search);
    const id = params.get('track');
    if (id) return { id };
    const path = location.pathname.match(/\/music\/songs\/([^/]+)\.html$/);
    return path ? { id: decodeURIComponent(path[1]) } : null;
  }

  // Playback events count only a genuine start or restart, never a pause/resume.
  // One audio-ended event counts one complete listen; immediately reset for repeats.
  if (audio) {
    audio.addEventListener('play', () => {
      const track = trackedSong();
      if (!track) return;
      if (playbackId !== track.id) {
        playbackId = track.id;
        event('music_play', track);
      }
    });
    audio.addEventListener('ended', () => {
      const track = trackedSong();
      if (track && playbackId === track.id) event('music_complete', track);
      playbackId = null;
    });
    audio.addEventListener('emptied', () => { playbackId = null; });
  }

  document.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    if (target.closest('#share, #detail-share')) event('music_share', trackedSong());
    const link = target.closest('a[href]');
    if (link) {
      try {
        const url = new URL(link.href);
        if (url.hostname.endsWith('.falowen.app') && url.pathname.startsWith('/classes')) {
          event('music_signup_click', trackedSong());
        }
      } catch {}
    }
  });

  function saveChoice(choice) {
    consent = choice;
    try { localStorage.setItem(consentKey, choice); } catch {}
    document.getElementById('music-analytics-consent')?.remove();
    if (choice === 'accepted') initAnalytics();
  }

  function showConsent() {
    const banner = document.createElement('aside');
    banner.id = 'music-analytics-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Optional music analytics');
    banner.style.cssText = 'position:fixed;z-index:300;bottom:12px;left:12px;right:12px;max-width:520px;margin:auto;padding:16px;border-radius:14px;background:#fff;color:#182b42;border:1px solid #d5dce5;box-shadow:0 10px 36px #11273f30;font:14px/1.5 system-ui,sans-serif';
    const description = document.createElement('p');
    description.style.margin = '0 0 12px';
    description.textContent = 'May we collect optional listening statistics to improve Falowen Music? No student login or answers are tracked. You can decline and still listen.';
    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
    for (const [label, choice] of [['Allow analytics', 'accepted'], ['No thanks', 'declined']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.style.cssText = 'padding:8px 14px;border-radius:9px;border:1px solid #cbd5e1;cursor:pointer;background:' + (choice === 'accepted' ? '#0e2030;color:white' : '#f8fafc;color:#182b42');
      button.addEventListener('click', () => saveChoice(choice));
      controls.appendChild(button);
    }
    banner.append(description, controls);
    document.body.appendChild(banner);
  }

  if (consent === 'accepted') initAnalytics();
  else if (consent !== 'declined') showConsent();
})();