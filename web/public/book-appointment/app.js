/* Falowen public appointment page. Intentionally no React/auth bundle or polling. */
(() => {
  "use strict";
  const API = "/api/public/appointments";
  const INITIAL_DATES = 5;
  const MORE_DATES = 5;
  const el = id => document.getElementById(id);
  const ui = {
    error:el("booking-error"),choose:el("choose-step"),details:el("details-step"),
    success:el("success-step"),dates:el("booking-dates"),times:el("booking-times"),
    availability:el("availability-content"),loading:el("loading-slots"),
    empty:el("no-availability"),count:el("availability-count"),
    more:el("more-dates"),refresh:el("refresh-times"),
    form:el("booking-contact-form"),confirm:el("booking-confirm"),
    back:el("back-to-times"),again:el("booking-again"),
    summaryTitle:el("summary-title"),summaryDesc:el("summary-description"),
    summaryCard:el("summary-card"),summaryNext:el("summary-next"),
    mobileAction:el("mobile-action"),mobileSelection:el("mobile-selection"),mobileNext:el("mobile-next"),
    timesHeading:el("times-heading"),successDesc:el("success-description"),
    successDetails:el("success-details"),successEmail:el("success-email")
  };
  const state = {
    slots:[],selectedDate:"",selectedSlotId:"",visibleDates:INITIAL_DATES,
    step:"choose",loading:true,busy:false,confirmation:null
  };
  const shortDate = new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
  const longDate = new Intl.DateTimeFormat("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
  const dayName = new Intl.DateTimeFormat("en-GB",{weekday:"short",timeZone:"UTC"});
  const monthName = new Intl.DateTimeFormat("en-GB",{month:"short",timeZone:"UTC"});
  const toDate = value => new Date(value+"T12:00:00Z");
  const formatDate = (value,long) => (long?longDate:shortDate).format(toDate(value));
  const formatTime = value => {
    const [h,m] = String(value).split(":").map(Number);
    if (!Number.isInteger(h) || !Number.isInteger(m)) return value;
    return String((h%12)||12)+":"+String(m).padStart(2,"0")+" "+(h<12?"AM":"PM");
  };
  const selectedSlot = () => state.slots.find(slot=>slot.slotId===state.selectedSlotId) || null;
  const getDates = () => [...new Set(state.slots.map(slot=>slot.date))].sort();
  const dateSlots = date => state.slots.filter(slot=>slot.date===date).sort((a,b)=>a.time.localeCompare(b.time));
  const add = (tag,cls,text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function showError(message) {
    ui.error.hidden = !message;
    ui.error.textContent = message || "";
  }
  function normalizeSlots(data) {
    if (!data || data.ok !== true || !Array.isArray(data.slots)) throw new Error("Appointment availability could not be loaded.");
    return data.slots.filter(slot =>
      slot && /^[0-9a-f-]{30,40}$/i.test(String(slot.slotId||"")) &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(slot.date||"")) &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(String(slot.time||"")) &&
      Number(slot.durationMinutes)>=15 && Number(slot.durationMinutes)<=120
    ).map(slot=>({
      slotId:String(slot.slotId),date:String(slot.date),time:String(slot.time),
      durationMinutes:Number(slot.durationMinutes),topic:String(slot.topic||"Falowen consultation").slice(0,120)
    })).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,300);
  }
  async function responseJson(response) {
    const data = await response.json().catch(()=>null);
    if (!response.ok || !data || data.ok!==true) {
      const error = new Error(data && data.error ? String(data.error) : "The booking service is unavailable. Please try again.");
      error.code = data && data.code;
      throw error;
    }
    return data;
  }
  async function loadSlots() {
    if (state.loading && state.slots.length) return;
    state.loading=true;
    showError("");
    render();
    try {
      const response = await fetch(API+"?view=public",{headers:{"Accept":"application/json"},cache:"no-store",credentials:"omit"});
      const data = await responseJson(response);
      state.slots = normalizeSlots(data);
      const dates=getDates();
      if (!dates.includes(state.selectedDate)) state.selectedDate=dates[0]||"";
      if (!selectedSlot()) {
        state.selectedSlotId="";
        if (state.step==="details") state.step="choose";
      }
    } catch(error) {
      showError(error.message || "We couldn't refresh appointment times.");
    } finally {
      state.loading=false;
      render();
    }
  }
  function renderDates() {
    ui.dates.replaceChildren();
    const dates=getDates();
    const shown=dates.slice(0,state.visibleDates);
    shown.forEach(date=>{
      const button=add("button","booking-date-button"+(state.selectedDate===date?" is-selected":""));
      button.type="button";
      button.setAttribute("aria-pressed",String(state.selectedDate===date));
      button.setAttribute("aria-label",formatDate(date,true)+", "+dateSlots(date).length+" available times");
      const when=toDate(date);
      button.append(
        add("span","day-name",dayName.format(when)),
        add("span","day-number",String(when.getUTCDate()).padStart(2,"0")),
        add("span","month-name",monthName.format(when)),
        add("span","times-count",dateSlots(date).length+(dateSlots(date).length===1?" time":" times"))
      );
      button.addEventListener("click",()=>{
        state.selectedDate=date;
        const chosen=selectedSlot();
        if (chosen && chosen.date!==date) state.selectedSlotId="";
        showError("");
        render();
      });
      ui.dates.append(button);
    });
    ui.more.hidden=shown.length===dates.length;
    if (!ui.more.hidden) ui.more.firstChild.textContent="Show "+Math.min(MORE_DATES,dates.length-shown.length)+" more dates ";
  }
  function renderTimes() {
    ui.times.replaceChildren();
    const daySlots=dateSlots(state.selectedDate);
    ui.timesHeading.textContent=state.selectedDate?"Available times · "+formatDate(state.selectedDate):"Available times";
    daySlots.forEach(slot=>{
      const active=slot.slotId===state.selectedSlotId;
      const button=add("button","booking-time-button"+(active?" is-selected":""));
      button.type="button";
      button.setAttribute("aria-pressed",String(active));
      button.setAttribute("aria-label",formatTime(slot.time)+", "+slot.durationMinutes+" minutes, "+slot.topic);
      const time=add("span","time-block");
      time.append(add("strong","time-main",formatTime(slot.time)),add("small","time-sub",slot.durationMinutes+" minutes"));
      button.append(time,add("span","time-topic",slot.topic),add("span","time-arrow",active?"✓":"→"));
      button.addEventListener("click",()=>{
        state.selectedSlotId=slot.slotId;
        showError("");
        render();
      });
      ui.times.append(button);
    });
  }
  function renderSummary() {
    const chosen=selectedSlot();
    ui.summaryCard.replaceChildren();
    if (!chosen && !state.confirmation) {
      ui.summaryTitle.textContent="Let's find a time that works.";
      ui.summaryDesc.textContent="Select any available time and we'll take care of the rest.";
      const holder=add("div","booking-placeholder");
      const icon=add("span","booking-calendar-icon");
      icon.setAttribute("aria-hidden","true");
      icon.textContent="▢";
      icon.style.fontSize="32px";
      holder.append(icon,add("span","", "Your selected appointment will appear here."));
      ui.summaryCard.append(holder);
      ui.summaryNext.disabled=true;
      ui.summaryNext.firstElementChild.textContent="Continue";
      return;
    }
    const booking=state.confirmation||chosen;
    ui.summaryTitle.textContent=state.step==="success"?"You're all set.":"A little time for a great conversation.";
    ui.summaryDesc.textContent=state.step==="success"?"Your appointment is confirmed.":"Review your appointment before confirming.";
    const card=add("div","booking-summary-selected");
    card.append(
      add("span","booking-summary-tag",state.step==="success"?"CONFIRMED":"FALOWEN CONSULTATION"),
      add("strong","",formatDate(booking.date,true)),
      add("strong","",formatTime(booking.time)+" GMT"),
      add("span","",booking.durationMinutes+" minutes · "+(booking.topic||"Falowen consultation"))
    );
    ui.summaryCard.append(card);
    ui.summaryNext.disabled=state.busy || !chosen || state.step==="success";
    ui.summaryNext.firstElementChild.textContent=state.step==="details"?(state.busy?"Confirming…":"Confirm appointment"):"Continue";
  }
  function renderSuccess() {
    const confirmation=state.confirmation;
    if (!confirmation) return;
    ui.successDetails.replaceChildren();
    ui.successDetails.append(
      add("strong","",confirmation.topic||"Falowen consultation"),
      add("span","",formatDate(confirmation.date,true)+" at "+formatTime(confirmation.time)+" GMT"),
      add("span","", "Booking reference: "+confirmation.bookingId)
    );
    ui.successDesc.textContent="Your consultation is booked. Please keep your confirmation details.";
    ui.successEmail.textContent=confirmation.confirmationEmailSent
      ? "We sent your appointment confirmation and meeting details to "+confirmation.email+"."
      : "Your booking is saved, but we couldn't send the confirmation email. Keep your reference and contact Falowen if you need the meeting link.";
  }
  function render() {
    const chosen=selectedSlot();
    ui.choose.hidden=state.step!=="choose";
    ui.details.hidden=state.step!=="details";
    ui.success.hidden=state.step!=="success";
    ui.loading.hidden=!state.loading;
    ui.refresh.disabled=state.loading||state.busy;
    ui.availability.hidden=state.loading||!state.slots.length;
    ui.empty.hidden=state.loading||!!state.slots.length;
    const dates=getDates();
    ui.count.textContent=state.loading?"Checking availability…":state.slots.length
      +(state.slots.length===1?" time":" times")+" available across "+dates.length
      +(dates.length===1?" date":" dates");
    if (!state.loading && state.slots.length) {
      renderDates();
      renderTimes();
    }
    ui.confirm.disabled=state.busy;
    ui.confirm.firstChild.textContent=state.busy?"Confirming… ":"Confirm appointment ";
    renderSummary();
    if (state.step==="success") renderSuccess();
    ui.summaryNext.hidden=state.step==="success";
    const mobileVisible=state.step==="choose" && !!chosen;
    ui.mobileAction.hidden=!mobileVisible;
    if (mobileVisible) ui.mobileSelection.textContent=formatDate(chosen.date)+" · "+formatTime(chosen.time);
    ui.mobileNext.disabled=state.busy;
  }
  function next() {
    if (state.busy) return;
    if (state.step==="choose") {
      if (!selectedSlot()) {showError("Please choose an available date and time first.");return;}
      showError("");
      state.step="details";
      render();
      ui.details.scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }
    if (state.step==="details") ui.form.requestSubmit();
  }
  async function book(event) {
    event.preventDefault();
    if (state.busy) return;
    const chosen=selectedSlot();
    if (!chosen) {state.step="choose";showError("That time is no longer available. Choose another.");render();return;}
    if (!ui.form.reportValidity()) return;
    const values=new FormData(ui.form);
    const name=String(values.get("name")||"").trim();
    const email=String(values.get("email")||"").trim();
    if (name.length<2 || !email) {showError("Please enter your full name and email.");return;}
    const payload={
      action:"book",slotId:chosen.slotId,name,email,
      phone:String(values.get("phone")||"").trim(),
      notes:String(values.get("notes")||"").trim(),
      website:String(values.get("website")||"")
    };
    state.busy=true;showError("");render();
    try {
      const result=await responseJson(await fetch(API,{
        method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},
        credentials:"omit",cache:"no-store",body:JSON.stringify(payload)
      }));
      state.confirmation={...result,email,topic:result.topic||chosen.topic,durationMinutes:chosen.durationMinutes};
      state.slots=state.slots.filter(slot=>slot.slotId!==chosen.slotId);
      state.selectedSlotId="";state.step="success";
      ui.form.reset();
      window.scrollTo({top:0,behavior:"smooth"});
    } catch(error) {
      if (error.code==="slot_unavailable") {
        state.step="choose";
        state.selectedSlotId="";
        await loadSlots();
        showError("That time has just been booked. Please select another time.");
      } else {
        showError(error.message||"We couldn't confirm your appointment. Please try again.");
      }
    } finally {
      state.busy=false;
      render();
    }
  }
  ui.more.addEventListener("click",()=>{state.visibleDates+=MORE_DATES;renderDates();});
  ui.refresh.addEventListener("click",loadSlots);
  ui.summaryNext.addEventListener("click",next);
  ui.mobileNext.addEventListener("click",next);
  ui.back.addEventListener("click",()=>{state.step="choose";showError("");render();});
  ui.form.addEventListener("submit",book);
  ui.again.addEventListener("click",()=>{
    state.confirmation=null;state.selectedSlotId="";state.step="choose";
    state.visibleDates=INITIAL_DATES;
    showError("");loadSlots();
    window.scrollTo({top:0,behavior:"smooth"});
  });
  loadSlots();
})();
