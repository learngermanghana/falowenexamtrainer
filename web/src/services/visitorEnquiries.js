export async function sendVisitorEvent(event, source, contact) {
  const response = await fetch('/api/public/visitor-enquiries', {
    method:'POST', headers:{'Content-Type':'application/json'}, keepalive:true,
    body:JSON.stringify({event, source, ...contact})
  });
  if (!response.ok || !(await response.json()).ok) throw Error('Enquiry unavailable');
}
