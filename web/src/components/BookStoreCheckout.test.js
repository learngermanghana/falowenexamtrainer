import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import BookStoreCheckout from "./BookStoreCheckout";
const originalFetch=global.fetch;
const catalog={paymentsEnabled:true,catalogTitles:[
 {id:"a1-course-workbook",title:"A1 Course",status:"available",bookIds:["a1-digital","a1-printed"],pages:250},
 {id:"writing-skills-a1-c2",title:"Writing guide",status:"coming_soon",bookIds:["writing-skills-a1-c2-digital"],pages:32}
],books:[{id:"a1-digital",format:"digital",priceGhs:99},{id:"a1-printed",format:"printed",priceGhs:800},{id:"writing-skills-a1-c2-digital",format:"digital",priceGhs:39}]};
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
test("digital checkout restricts quantity to one and hides delivery address",async()=>{
 render(<BookStoreCheckout checkout/>);await screen.findByLabelText("Quantity");
 expect(screen.getByLabelText("Quantity")).toBeDisabled();
 expect(screen.queryByLabelText("Collection or delivery")).toBeNull();
});
