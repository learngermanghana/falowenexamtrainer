import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import BookStoreCheckout from "./BookStoreCheckout";
const originalFetch=global.fetch;
const catalog={paymentsEnabled:true,catalogTitles:[
 {id:"a1-course-workbook",title:"A1 Course",status:"available",bookIds:["a1-digital","a1-printed"],pages:250},
 {id:"writing-skills-a1-c2",title:"Writing guide",status:"coming_soon",bookIds:["writing-skills-a1-c2-digital"],pages:32}
],books:[{id:"a1-digital",format:"digital",priceGhs:249},{id:"a1-printed",format:"printed",priceGhs:800},{id:"writing-skills-a1-c2-digital",format:"digital",priceGhs:79}]};
beforeEach(()=>{window.history.replaceState({},"","/books");global.fetch=jest.fn(async url=>({ok:true,json:async()=>String(url).includes("/books/catalog")?catalog:{usdToGhs:10}}));});
afterEach(()=>{global.fetch=originalFetch;});
test("detail uses actual selected pages, separate checkout and related books without customer fields",async()=>{
 render(<BookStoreCheckout detailBook="a1"/>);
 expect(await screen.findByRole("link",{name:"Buy Now"})).toHaveAttribute("href","/books/deutsch-a1-course-workbook/checkout?edition=a1-digital");
 expect(screen.getByRole("img",{name:/Preview page 2/})).toHaveAttribute("src","/books/previews/a1-course-workbook-2.webp");
 expect(screen.getByRole("region",{name:"Related books"})).toHaveTextContent("Writing guide");
 expect(screen.queryByLabelText("Full name")).toBeNull();
 expect(global.fetch.mock.calls.every(([,options])=>!options?.method)).toBe(true);
});
test("checkout retains format, calculates quantity and posts delivery to existing API",async()=>{
 window.history.replaceState({},"","/books/deutsch-a1-course-workbook/checkout?edition=a1-printed");
 global.fetch=jest.fn(async url=>String(url).includes("/books/checkout")?{ok:false,json:async()=>({error:"Test payment response"})}:{ok:true,json:async()=>String(url).includes("/books/catalog")?catalog:{usdToGhs:10}});
 render(<BookStoreCheckout checkout/>);
 await screen.findByLabelText("Full name");
 for(const [label,value] of [["Full name","Test Reader"],["Email address","reader@example.com"],["Phone / WhatsApp","+233241234567"],["Quantity","3"],["Collection or delivery","delivery"]]) fireEvent.change(screen.getByLabelText(label),{target:{value}});
 fireEvent.change(screen.getByLabelText("Delivery address"),{target:{value:"Accra, Example Street"}});
 fireEvent.click(screen.getByRole("button",{name:"Continue to Paystack · GH₵2400.00"}));
 await screen.findByRole("alert");
 const call=global.fetch.mock.calls.find(([url])=>url.includes("/books/checkout"));
 expect(JSON.parse(call[1].body)).toEqual({bookId:"a1-printed",name:"Test Reader",email:"reader@example.com",phone:"+233241234567",quantity:3,deliveryMethod:"delivery",deliveryAddress:"Accra, Example Street"});
 expect(screen.getByRole("button",{name:/Continue to Paystack/})).toBeEnabled();
});
test("coming soon blocks detail and direct checkout purchases",async()=>{
 const view=render(<BookStoreCheckout detailBook="writing"/>);
 await screen.findByText(/Coming Soon · Unavailable/);
 expect(screen.queryByRole("link",{name:"Buy Now"})).toBeNull();view.unmount();
 render(<BookStoreCheckout detailBook="writing" checkout/>);
 await screen.findByText(/Coming Soon · Unavailable/);
 expect(screen.queryByLabelText("Full name")).toBeNull();
});
test("A2 printed edition uses the published unit price, quantity and address fields",async()=>{
 const a2Catalog={
  paymentsEnabled:true,
  catalogTitles:[{id:"a2-course-workbook",title:"Deutsch A2 — Course & Workbook",status:"available",
    bookIds:["a2-course-workbook-digital","a2-course-workbook-printed"],pages:328,levelTags:["A2"]}],
  books:[{id:"a2-course-workbook-digital",format:"digital",priceGhs:299},
    {id:"a2-course-workbook-printed",format:"printed",priceGhs:1050}],
 };
 window.history.replaceState({},"",
   "/books/deutsch-a2-course-workbook/checkout?edition=a2-course-workbook-printed");
 global.fetch=jest.fn(async url=>String(url).includes("/books/checkout")
  ? {ok:false,json:async()=>({error:"Test payment response"})}
  : {ok:true,json:async()=>String(url).includes("/books/catalog")?a2Catalog:{usdToGhs:10}});
 render(<BookStoreCheckout slug="deutsch-a2-course-workbook" checkout/>);
 expect(await screen.findByLabelText("Quantity")).toHaveValue(1);
 expect(screen.getByLabelText("Quantity")).toBeEnabled();
 expect(screen.getByRole("radio",{name:/Printed on demand/})).toBeChecked();
 expect(screen.getByRole("button",{name:"Continue to Paystack · GH₵1050.00"})).toBeEnabled();
 for(const [label,value] of [["Full name","Test Reader"],["Email address","reader@example.com"],
   ["Phone / WhatsApp","+233241234567"],["Quantity","2"]])
  fireEvent.change(screen.getByLabelText(label),{target:{value}});
 fireEvent.change(screen.getByLabelText("Collection or delivery"),{target:{value:"delivery"}});
 fireEvent.change(screen.getByLabelText("Delivery address"),
  {target:{value:"Accra, Example Street"}});
 fireEvent.click(screen.getByRole("button",{name:"Continue to Paystack · GH₵2100.00"}));
 await screen.findByRole("alert");
 const call=global.fetch.mock.calls.find(([url])=>String(url).includes("/books/checkout"));
 expect(JSON.parse(call[1].body)).toEqual({
  bookId:"a2-course-workbook-printed",name:"Test Reader",
  email:"reader@example.com",phone:"+233241234567",
  quantity:2,deliveryMethod:"delivery",deliveryAddress:"Accra, Example Street",
 });
});

test("A1 digital checkout shows flat GH₵249, restricts quantity and hides delivery address",async()=>{
 window.history.replaceState({},"","/books/deutsch-a1-course-workbook/checkout?edition=a1-digital");
 render(<BookStoreCheckout checkout/>);await screen.findByLabelText("Quantity");
 expect(screen.getByRole("button",{name:"Continue to Paystack · GH₵249.00"})).toBeEnabled();
 expect(screen.getByLabelText("Quantity")).toBeDisabled();
 expect(screen.queryByLabelText("Collection or delivery")).toBeNull();
});


test("writing guide provides both paid editions and clearly discloses manual PDF delivery", async () => {
  const writingCatalog = {paymentsEnabled:true,catalogTitles:[
    {id:"writing-skills-a1-c2",title:"Writing guide",status:"available",pages:68,
      bookIds:["writing-skills-a1-c2-digital","writing-skills-a1-c2-printed"],levelTags:["A1","C2"]}
  ],books:[
    {id:"writing-skills-a1-c2-digital",format:"digital",priceGhs:79,deliveryMode:"manual_email"},
    {id:"writing-skills-a1-c2-printed",format:"printed",priceGhs:250,deliveryMode:"print_on_demand"}
  ]};
  global.fetch=jest.fn(async url=>({ok:true,json:async()=>String(url).includes("/books/catalog")?writingCatalog:{usdToGhs:10}}));
  window.history.replaceState({},"","/books/how-to-unlock-your-german-writing-skills-a1-c2");
  const view=render(<BookStoreCheckout detailBook="writing" />);
  expect(await screen.findByRole("radio",{name:/Printed book/})).toBeInTheDocument();
  expect(screen.getByRole("radio",{name:/Digital PDF/})).toBeChecked();
  expect(screen.getByText(/not an instant download/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio",{name:/Printed book/}));
  expect(screen.getByRole("link",{name:"Buy Now"})).toHaveAttribute("href",
    "/books/how-to-unlock-your-german-writing-skills-a1-c2/checkout?edition=writing-skills-a1-c2-printed");
  view.unmount();
});

test("B1 digital checkout uses GH₵399 and does not collect a delivery address", async()=>{
 const b1Catalog={paymentsEnabled:true,catalogTitles:[{id:"b1-course-workbook",
  title:"Deutsch B1 — Course & Workbook",status:"available",pages:420,
  bookIds:["b1-course-workbook-digital","b1-course-workbook-printed"],levelTags:["B1"]}],
  books:[{id:"b1-course-workbook-digital",format:"digital",priceGhs:399,deliveryMode:"secure_download"},
         {id:"b1-course-workbook-printed",format:"printed",priceGhs:1350}]};
 window.history.replaceState({},"","/books/deutsch-b1-course-workbook/checkout?edition=b1-course-workbook-digital");
 global.fetch=jest.fn(async url=>({ok:true,json:async()=>String(url).includes("/books/catalog")?b1Catalog:{usdToGhs:10}}));
 render(<BookStoreCheckout slug="deutsch-b1-course-workbook" checkout/>);
 expect(await screen.findByRole("button",{name:"Continue to Paystack · GH₵399.00"})).toBeEnabled();
 expect(screen.getByLabelText("Quantity")).toBeDisabled();
 expect(screen.queryByLabelText("Delivery address")).toBeNull();
});
