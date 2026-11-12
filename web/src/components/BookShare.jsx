import React, { useRef, useState } from "react";
import "./BookShare.css";

export default function BookShare({ page, title = page.title, description = page.description }) {
  const dialog = useRef(null);
  const textarea = useRef(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const url = "https://www.falowen.app" + page.href;
  const caption = [message.trim(), url].filter(Boolean).join("\n\n");
  const encodedUrl = encodeURIComponent(url);

  function show() {
    setMessage(title + "\n\n" + description);
    setStatus("");
    setOpen(true);
    dialog.current.showModal();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(caption);
      setStatus("Message and link copied.");
    } catch {
      textarea.current.focus();
      textarea.current.select();
      setStatus("Select and copy your message. The book link is below.");
    }
  }
  async function share() {
    try {
      await navigator.share({ title, text: message, url });
    } catch (error) {
      if (error.name !== "AbortError") setStatus("Choose an app below or copy your message.");
    }
  }

  return <>
    <button type="button" className="fb-btn fb-btn-soft" onClick={show}
      aria-label={"Share " + title}>{page.href === "/books" ? "Share bookstore" : "Share book"}</button>
    <dialog ref={dialog} className="fb-share-dialog" aria-label={"Share " + title} onClose={() => setOpen(false)}>
      {open && <>
        <header><strong>Share {title}</strong><button type="button" autoFocus onClick={() => dialog.current.close()}>Close</button></header>
        <img src={page.thumbnail} alt={title + " share thumbnail"} width="1200" height="630" />
        <label>Your message<textarea ref={textarea} rows="4" value={message} onChange={e => setMessage(e.target.value)} /></label>
        <a href={url} className="fb-share-url">{url}</a>
        <div className="fb-share-actions">
          <a href={"https://wa.me/?text=" + encodeURIComponent(caption)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl} target="_blank" rel="noopener noreferrer">Facebook</a>
          {typeof navigator.share === "function" && <button type="button" onClick={share}>More apps</button>}
          <button type="button" onClick={copy}>Copy message</button>
          <a href={page.thumbnail} download>Download thumbnail</a>
        </div>
        <small>For LinkedIn or Facebook, copy your message and paste it into your post.</small>
        <div role="status">{status}</div>
      </>}
    </dialog>
  </>;
}
