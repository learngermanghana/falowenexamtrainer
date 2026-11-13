import React, { useRef, useState } from "react";
import "./BookShare.css";

// Instagram has no supported website URL that publishes a prefilled post.
// Prepare the image and caption instead of sending readers to a broken share link.
export default function BookShare({ page, title = page.title, description = page.description, inlineActions = false }) {
  const dialog = useRef(null);
  const textarea = useRef(null);
  const inlineTextarea = useRef(null);
  const [open, setOpen] = useState(false);
  const [instagramMode, setInstagramMode] = useState(false);
  const [inlineInstagram, setInlineInstagram] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const url = "https://www.falowen.app" + page.href;
  const caption = [message.trim(), url].filter(Boolean).join("\n\n");
  const encodedUrl = encodeURIComponent(url);
  const linkedInUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl;

  function prepareInstagramInline() {
    setMessage(title + "\n\n" + description);
    setStatus("");
    setInlineInstagram(current => !current);
  }

  function show(forInstagram = false) {
    setMessage(title + "\n\n" + description);
    setInstagramMode(forInstagram);
    setStatus("");
    setOpen(true);
    setInlineInstagram(false);
    dialog.current?.showModal();
  }

  async function copy() {
    try {
      if (typeof navigator.clipboard?.writeText !== "function") throw Error("Clipboard unavailable");
      await navigator.clipboard.writeText(caption);
      setStatus("Message and book link copied. Paste them into your post.");
    } catch {
      const field = inlineInstagram ? inlineTextarea.current : textarea.current;
      field?.focus();
      field?.select();
      setStatus("Select and copy the message above. The book link is also shown below.");
    }
  }

  async function share() {
    try {
      await navigator.share({ title, text: message, url });
    } catch (error) {
      if (error?.name !== "AbortError") setStatus("Choose an app below or copy your message.");
    }
  }

  return <>
    {inlineActions ? <section className="fb-social-share" aria-label="Share this book">
      <strong>Share this book</strong>
      <div className="fb-social-share-links">
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label={"Share " + title + " on LinkedIn"}>LinkedIn</a>
        <button type="button" onClick={prepareInstagramInline} aria-expanded={inlineInstagram} aria-label={"Prepare an Instagram post for " + title}>Instagram</button>
        <button type="button" onClick={() => show(false)}>More sharing options</button>
      </div>
      {inlineInstagram && <div className="fb-instagram-inline" role="region" aria-label="Instagram post preparation">
        <img src={page.cover || page.thumbnail} alt={title + " book cover"} width="145" height="205" />
        <div>
          <strong>Prepare an Instagram post</strong>
          <p>Instagram does not offer a direct prefilled web share link. Download the share image, copy your caption and create a post or Story in Instagram.</p>
          <label>Your Instagram caption
            <textarea ref={inlineTextarea} rows="4" value={message} onChange={event => setMessage(event.target.value)} />
          </label>
          <div className="fb-social-share-links">
            <button type="button" onClick={copy}>Copy caption and book link</button>
            <a href={page.thumbnail} download>Download share image (JPG)</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Open Instagram</a>
          </div>
          <small>For a clickable book link, add a Story link sticker or put the URL in your profile bio.</small>
          <div role="status">{status}</div>
        </div>
      </div>}
    </section> : <button type="button" className="fb-btn fb-btn-soft" onClick={() => show(false)}
      aria-label={"Share " + title}>{page.href === "/books" ? "Share bookstore" : "Share book"}</button>}
    <dialog ref={dialog} className="fb-share-dialog" aria-label={"Share " + title} onClose={() => setOpen(false)}>
      {open && <>
        <header><strong>Share {title}</strong><button type="button" autoFocus onClick={() => dialog.current?.close()}>Close</button></header>
        <img src={page.thumbnail} alt={title + " share thumbnail"} width="1200" height="630" />
        {instagramMode && <div className="fb-instagram-help">
          <strong>Post to Instagram</strong>
          <p>Instagram does not offer a direct prefilled web share link. Download the thumbnail, copy the caption and create a post or Story in Instagram.</p>
          <p>For a clickable book link, use a Story link sticker or place the URL in your profile bio.</p>
        </div>}
        <label>Your message<textarea ref={textarea} rows="4" value={message} onChange={e => setMessage(e.target.value)} /></label>
        <a href={url} className="fb-share-url">{url}</a>
        <div className="fb-share-actions">
          <a href={"https://wa.me/?text=" + encodeURIComponent(caption)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl} target="_blank" rel="noopener noreferrer">Facebook</a>
          <button type="button" onClick={() => setInstagramMode(true)}>Instagram</button>
          {typeof navigator.share === "function" && <button type="button" onClick={share}>More apps</button>}
          <button type="button" onClick={copy}>Copy message</button>
          <a href={page.thumbnail} download>Download thumbnail</a>
          {instagramMode && <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Open Instagram</a>}
        </div>
        <small>For LinkedIn or Facebook, copy your message and paste it into your post.</small>
        <div role="status">{status}</div>
      </>}
    </dialog>
  </>;
}
