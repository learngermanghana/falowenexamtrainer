import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {getBackendUrl} from "../services/backendUrl";
import {BOOK_PAGES, indicativeUsd} from "./BooksCatalog";
import "./BookStoreCheckout.css";
import "./BookProductPage.css";

const API = getBackendUrl();
const money = amount => `GH₵${Number(amount).toFixed(2)}`;
const productForSlug = slug => Object.entries(BOOK_PAGES).find(([,page]) => page.href === `/books/${slug}`);
async function request(path, options = {}) {
  const response = await fetch(API + path, options);
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw Error(data.error || "Unable to load the bookstore. Please try again.");
  return data;
}
function PreviewSlides({productId, title, cover}) {
  const track = useRef(null);
  const [current, setCurrent] = useState(0);
  const pages = productId === "a1-course-workbook" ? [1,2,3]
    : productId === "a1-writing-model-exams" ? [5,11,21]
    : productId === "writing-skills-a1-c2" ? [5,7,9] : [5,21,31];
  const move = index => track.current?.scrollTo({left:index * track.current.clientWidth, behavior:"smooth"});
  return <section className="fb-slides" aria-label="Book preview slideshow">
    <div className="fb-slides-track" ref={track} onScroll={event => {
      const el=event.currentTarget;
      if(el.clientWidth) setCurrent(Math.round(el.scrollLeft/el.clientWidth));
    }}>
      <div className="fb-slide"><img src={cover} alt={`${title} cover`} width="300" height="425" /></div>
      {pages.map(page=><div className="fb-slide" key={page}>
        <a href={`/books/previews/${productId}-${page}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge preview page ${page}`}>
          <img src={`/books/previews/${productId}-${page}.webp`} alt={`${title} · Preview page ${page}`} loading="lazy" width="950" height="1344" />
        </a>
      </div>)}
    </div>
    <div className="fb-slides-controls">
      <button type="button" aria-label="Previous preview" disabled={current===0} onClick={()=>move(current-1)}>←</button>
      <span aria-live="polite">{current+1} / {pages.length+1}</span>
      <button type="button" aria-label="Next preview" disabled={current===pages.length} onClick={()=>move(current+1)}>→</button>
    </div>
    <p className="fb-muted">Swipe to preview · Tap a page to enlarge.{productId === "b1-four-skills-exam-guide" && " Preview backgrounds adjusted for readability."}</p>
  </section>;
}
export default function BookProductPage({slug, checkout=false, basePath="/books"}) {
  const bookHref = href => basePath + href.slice("/books".length);
  const product = productForSlug(slug);
  const productId = product?.[0], page = product?.[1];
  const [catalog,setCatalog]=useState(null), [fx,setFx]=useState(null);
  const [edition,setEdition]=useState(()=>new URLSearchParams(window.location.search).get("edition") || "");
  const [customer,setCustomer]=useState({name:"",email:"",phone:""});
  const [quantity,setQuantity]=useState(1), [delivery,setDelivery]=useState("collection"), [address,setAddress]=useState("");
  const [error,setError]=useState(""), [busy,setBusy]=useState(false);
  useEffect(()=>{
    let active=true;
    request("/books/catalog").then(data=>{if(active) setCatalog(data);}).catch(e=>{if(active) setError(e.message);});
    request("/fx/usd-ghs").then(data=>{if(active) setFx(data);}).catch(()=>{});
    return ()=>{active=false;};
  },[]);
  const listing=catalog?.catalogTitles?.find(item=>item.id===productId);
  const offers=(listing?.bookIds || []).map(id=>catalog?.books?.find(book=>book.id===id)).filter(Boolean);
  const selected=offers.find(book=>book.id===edition) || offers[0];
  const available=listing?.status==="available" && Boolean(selected);
  const canPay=available && catalog?.paymentsEnabled===true;
  useEffect(()=>{
    const meta=document.querySelector('meta[name="description"]'), previousDescription=meta?.getAttribute("content");
    if(meta && listing?.description) meta.setAttribute("content",listing.description);
    const previous=document.title;
    document.title=(checkout ? "Checkout · " : "")+(listing?.title || "Falowen Books")+" | Falowen";
    const existing=document.head.querySelector('link[rel="canonical"]');
    const canonical=existing || document.createElement("link"), old=existing?.getAttribute("href");
    canonical.rel="canonical"; canonical.href="https://www.falowen.app/books/"+slug;
    if(!existing) document.head.appendChild(canonical);
    return ()=>{document.title=previous; if(meta && previousDescription!==null) meta.setAttribute("content",previousDescription); if(!existing) canonical.remove(); else if(old===null) canonical.removeAttribute("href"); else canonical.setAttribute("href",old);};
  },[listing?.title,listing?.description,slug,checkout]);
  async function pay(event) {
    event.preventDefault();
    if(!canPay || busy) return;
    setBusy(true); setError("");
    try {
      const data=await request("/books/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        bookId:selected.id,...customer, quantity:selected.format==="digital"?1:Number(quantity),
        ...(selected.format==="printed"?{deliveryMethod:delivery,deliveryAddress:delivery==="delivery"?address:""}:{}),
      })});
      const url=new URL(data.authorization_url);
      if(url.protocol!=="https:" || !["checkout.paystack.com","paystack.com"].includes(url.hostname)) throw Error("Unexpected payment destination.");
      window.location.assign(url.toString());
    } catch(e) {setError(e.message);setBusy(false);}
  }
  if(!product) return <main className="fb-page"><div className="fb-shell"><h1>Book not found</h1><Link to={basePath}>Browse books</Link></div></main>;
  const total=selected ? selected.priceGhs*(selected.format==="printed"?Number(quantity):1) : 0;
  return <main className="fb-page"><div className="fb-shell fb-product-shell">
    <nav className="fb-breadcrumb" aria-label="Breadcrumb"><Link to={basePath === "/books" ? "/" : "/campus/course"}>Falowen</Link><span>/</span><Link to={basePath}>Books</Link>{checkout && <><span>/</span><Link to={bookHref(page.href)}>Book details</Link></>}</nav>
    {error && <p className="fb-error" role="alert">{error}</p>}
    {!listing ? <p role="status">{error ? "Book information is unavailable. Please reload to try again." : "Loading book…"}</p> : <>
      <section className="fb-product-layout">
        {!checkout && <PreviewSlides productId={productId} title={listing.title} cover={page.cover} />}
        <div className="fb-product-info">
          <p className="fb-eyebrow">LEARN LANGUAGE EDUCATION ACADEMY · FALOWEN</p>
          <h1>{checkout ? "Checkout" : listing.title}</h1>
          {checkout ? <><h2>{listing.title}</h2><Link to={bookHref(page.href)}>← Back to book details</Link></> : <>
            <p className="fb-lede">{listing.description}</p><p>{listing.pages} pages · {listing.levelTags?.join(" / ")}</p>
          </>}
          {available ? <>
            <fieldset className="fb-product-editions"><legend>Choose your format</legend>
              {offers.map(book=><label key={book.id} className="fb-edition">
                <input type="radio" name="edition" checked={book.id===selected.id} onChange={()=>{setEdition(book.id);setQuantity(1);}} />
                <span>{book.format==="digital"?"Digital PDF":"Printed book"}</span>
                <strong>{money(book.priceGhs)}<small>{indicativeUsd(book.priceGhs,fx)}</small></strong>
              </label>)}
            </fieldset>
            {!checkout && (canPay ? <Link className="fb-btn fb-btn-primary fb-pay" to={`${bookHref(page.href)}/checkout?edition=${encodeURIComponent(selected.id)}`}>Buy Now</Link>
              : <button className="fb-btn fb-btn-primary" disabled>Checkout temporarily unavailable</button>)}
          </> : <p role="status">Coming Soon · Unavailable for purchase</p>}
          {checkout && available && <form className="fb-form" onSubmit={pay}>
            <h2>Your contact details</h2>
            {[["name","Full name","text"],["email","Email address","email"],["phone","Phone / WhatsApp","tel"]].map(([id,label,type])=><label key={id}>{label}
              <input required type={type} minLength={id==="name"?3:undefined} maxLength={id==="name"?120:id==="email"?254:25}
                autoComplete={id==="phone"?"tel":id} value={customer[id]} onChange={e=>setCustomer({...customer,[id]:e.target.value})} />
            </label>)}
            <label>Quantity<input type="number" min="1" max="20" step="1" required value={selected.format==="digital"?1:quantity}
              disabled={selected.format==="digital"} onChange={e=>setQuantity(e.target.value)} /></label>
            {selected.format==="digital" ? <p>One PDF per purchase. After verified payment, a secure download is provided when available, or Falowen arranges delivery manually.</p> : <>
              <label>Collection or delivery<select value={delivery} onChange={e=>setDelivery(e.target.value)}><option value="collection">Collection</option><option value="delivery">Delivery</option></select></label>
              {delivery==="delivery" && <label>Delivery address<textarea required maxLength={500} autoComplete="street-address" value={address} onChange={e=>setAddress(e.target.value)} /></label>}
              <p>Printed on demand. Delivery is arranged and charged separately by Falowen.</p>
            </>}
            <div className="fb-total"><span>Book total</span><strong>{money(total)}<small>{indicativeUsd(total,fx)}</small></strong></div>
            <p>Paystack charges in GHS. USD is an estimate only.</p>
            <button type="submit" className="fb-btn fb-btn-primary fb-pay" disabled={!canPay||busy}>{busy?"Opening Paystack…":canPay?`Continue to Paystack · ${money(total)}`:"Checkout temporarily unavailable"}</button>
          </form>}
          {!checkout && <section className="fb-related" aria-label="Related books"><h2>Explore other books</h2>
            <div>{catalog.catalogTitles.filter(item=>item.id!==productId && BOOK_PAGES[item.id]).map(item=><Link key={item.id} to={bookHref(BOOK_PAGES[item.id].href)}>
              <img src={BOOK_PAGES[item.id].cover} alt="" width="70" height="100" /><span>{item.title}{item.status!=="available" && <small>Coming Soon</small>}</span>
            </Link>)}</div>
          </section>}
        </div>
      </section>
    </>}
  </div></main>;
}
