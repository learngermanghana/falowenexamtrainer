import additional from "../data/a2ReadingPdfSamples4to7.json";
import sample8 from "../data/a2ReadingPdfSample8.json";
import {A2_READING_PRACTICE_SAMPLES} from "./A2ReadingPracticeSamples";

test("A2 Lesen has eight numbered samples without replacing the three existing sets",()=>{
 expect(A2_READING_PRACTICE_SAMPLES).toHaveLength(8);
 expect(A2_READING_PRACTICE_SAMPLES.map(x=>x.id)).toEqual(
  Array.from({length:8},(_,i)=>"a2-reading-practice-"+String(i+1).padStart(2,"0"))
 );
});
test("five imported PDF tests have the correct 4 x 5 structure and uniquely numbered questions",()=>{
 expect(additional).toHaveLength(4);
 for(const sample of [...additional,sample8]){
  const groups=[sample.teil1.questions,sample.teil2.questions,sample.teil3.questions,sample.teil4.people];
  expect(groups.map(x=>x.length)).toEqual([5,5,5,5]);
  expect(groups.flat().map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  for(const q of groups.slice(0,3).flat()){
   expect(q.options).toHaveLength(3);
   expect(q.options.map(c=>c.id)).toEqual(["a","b","c"]);
   expect(q.options.some(c=>c.id===q.answer)).toBe(true);
  }
  expect(groups[3].every(q=>["a","b","c","d","e","f","X"].includes(q.answer))).toBe(true);
  expect(sample.teil4.ads).toHaveLength(6);
  expect(sample.teil2.store.floors).toHaveLength(5);
 }
});
test("A2 PDF answer key groups match the original supplied solutions",()=>{
 const keys=[
 "b a b c b b b b c a b a b c a c b a d X",
 "b a b b a b b b a c b a b c b c b e a X",
 "a b b b b b a b c c b a a c b a e b c X",
 "b b a b b a b b b c a a b b c b a c d X",
 "b b a a b a b a b a b b a b a a b X c d"
 ];
 [...additional,sample8].forEach((sample,index)=>{
  const values=[...sample.teil1.questions,...sample.teil2.questions,...sample.teil3.questions,...sample.teil4.people].map(q=>q.answer);
  expect(values).toEqual(keys[index].split(" "));
 });
});