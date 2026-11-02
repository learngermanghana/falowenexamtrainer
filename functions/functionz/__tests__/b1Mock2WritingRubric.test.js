"use strict";
const {RUBRIC_MAXIMA,validateB1Mock2Teil3Rubric,normalizedB1Mock2Teil3Score}=require("../b1Mock2WritingRubric");

const make=(scores)=>({parts:{teil3:{rubric_scores:scores}}});

test("B1 Mock 2 writing Teil 3 uses the teacher 4/4/6/6 rubric",()=>{
  expect(RUBRIC_MAXIMA).toEqual({task_fulfilment:4,cohesion:4,vocabulary:6,grammar:6});
  const full={task_fulfilment:4,cohesion:4,vocabulary:6,grammar:6};
  expect(validateB1Mock2Teil3Rubric(make(full))).toBe(full);
  expect(normalizedB1Mock2Teil3Score(full)).toBe(5);
  expect(normalizedB1Mock2Teil3Score({task_fulfilment:3,cohesion:3,vocabulary:4,grammar:6})).toBe(4);
  expect(normalizedB1Mock2Teil3Score({task_fulfilment:0,cohesion:0,vocabulary:0,grammar:0})).toBe(0);
});

test("B1 Mock 2 cannot publish fabricated or invalid Teil 3 criterion marks",()=>{
  const full={task_fulfilment:4,cohesion:4,vocabulary:6,grammar:6};
  for(const invalid of [
    null,{...full,grammar:7},{...full,grammar:-1},
    {...full,cohesion:Infinity},{...full,vocabulary:"6"},
    {task_fulfilment:4,cohesion:4,vocabulary:6}
  ])expect(()=>validateB1Mock2Teil3Rubric(make(invalid))).toThrow(/Incomplete/);
});
