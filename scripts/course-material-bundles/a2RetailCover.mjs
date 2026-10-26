import { StandardFonts, rgb } from "pdf-lib";

// A2-only retail print cover. Internal editorial proof remains separately marked.
export const addA2RetailCover = async pdf => {
 if (!pdf || typeof pdf.addPage !== "function") throw new Error("PDF document required");
 const white=rgb(1,1,1), navy=rgb(0.06,0.14,0.25), teal=rgb(0.12,0.72,0.68),
  dark=rgb(0.04,0.28,0.35), slate=rgb(0.17,0.27,0.37);
 const regular=await pdf.embedFont(StandardFonts.Helvetica);
 const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const page=pdf.addPage([595.28,841.89]);
 page.drawRectangle({x:0,y:0,width:595.28,height:841.89,color:navy});
 page.drawRectangle({x:0,y:0,width:14,height:841.89,color:teal});
 page.drawEllipse({x:475,y:645,xScale:225,yScale:225,color:dark});
 page.drawEllipse({x:490,y:650,xScale:130,yScale:130,borderColor:teal,borderWidth:2,borderOpacity:0.4});
 page.drawText("FALOWEN",{x:45,y:755,size:27,font:bold,color:white});
 page.drawText("GERMAN LANGUAGE LEARNING",{x:45,y:702,size:11,font:bold,color:teal});
 page.drawLine({start:{x:45,y:670},end:{x:547,y:670},color:teal,thickness:1});
 page.drawText("DEUTSCH",{x:42,y:525,size:69,font:bold,color:white});
 page.drawText("A2",{x:38,y:352,size:155,font:bold,color:teal});
 page.drawEllipse({x:463,y:405,xScale:56,yScale:56,borderColor:teal,borderWidth:2,color:dark});
 page.drawText("CEFR",{x:433,y:410,size:16,font:bold,color:white});
 page.drawText("LEVEL",{x:430,y:385,size:12,font:regular,color:teal});
 page.drawText("Grammar Notes",{x:45,y:309,size:29,font:bold,color:white});
 page.drawText("& Workbook",{x:45,y:275,size:29,font:bold,color:white});
 page.drawText("Build your German confidence beyond A1.",{x:45,y:244,size:14,font:regular,color:rgb(0.75,0.9,0.9)});
 page.drawRectangle({x:45,y:131,width:500,height:75,color:dark});
 page.drawText("GRAMMAR  /  WRITING  /  READING  /  LISTENING",{x:62,y:175,size:12.5,font:bold,color:white});
 page.drawText("Guided lessons and practice activities",{x:62,y:149,size:12,font:regular,color:rgb(0.8,0.94,0.93)});
 page.drawRectangle({x:0,y:0,width:595.28,height:92,color:white});
 page.drawRectangle({x:45,y:32,width:116,height:9,color:rgb(0.1,0.1,0.1)});
 page.drawRectangle({x:45,y:20,width:116,height:9,color:rgb(0.8,0.17,0.19)});
 page.drawRectangle({x:45,y:8,width:116,height:9,color:rgb(0.95,0.74,0.24)});
 page.drawText("FALOWEN EDITION",{x:396,y:34,size:12,font:bold,color:slate});
 pdf.setTitle("Falowen Deutsch A2 - Grammar Notes & Workbook");
 pdf.setAuthor("Falowen | Learn Language Education Academy");
 pdf.setSubject("German A2 grammar, writing, reading and listening workbook");
 pdf.setCreator("Falowen Course Material Bundle");
 return page;
};
