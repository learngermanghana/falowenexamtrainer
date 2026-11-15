// Planned A1 learning sequence reviewed against Dr. Ruth's 10-topic syllabus.
// Retain the identities and routes of the three existing Falowen workbooks:
// Day 1 = pronunciation, Day 5 = family practice, Day 6 = restaurant.
// Planned entries are navigation previews only, never assignments or published workbooks.
import { SWAHILI_DAY_ONE } from "./dayOne";
import { SWAHILI_DAY_FIVE } from "./dayFive";
import { SWAHILI_DAY_SIX } from "./daySix";

const planned = (day, title, objective, grammar) =>
  Object.freeze({ day, chapter: `Somo la ${day}`, title, objective, grammar, status: "coming-soon", practiceOnly: true });

export const SWAHILI_A1_CURRICULUM = Object.freeze([
  SWAHILI_DAY_ONE,
  planned(2, "Salamu", "Greet people and respond appropriately in everyday situations.", "Common greetings and personal pronouns"),
  planned(3, "Utambulisho", "Introduce yourself and other people using short sentences.", "Present-tense kuwa and subject markers"),
  planned(4, "Nchi na Lugha", "Say where people come from and which languages they speak.", "Questions: nani, wapi, gani; present tense"),
  SWAHILI_DAY_FIVE,
  SWAHILI_DAY_SIX,
  planned(7, "Chakula na Vinywaji", "Name foods and drinks and express simple preferences.", "Ninapenda, sipendi, nataka; simple negation"),
  planned(8, "Namba na Umri", "Give your age, phone number and other basic personal details.", "Numbers and kuwa na; age questions"),
  planned(9, "Marafiki", "Introduce friends and describe people in simple terms.", "Adjectives and basic M-/Wa- agreement"),
  planned(10, "Sokoni", "Ask prices, quantities and buy food at a market.", "Numbers, Ji-/Ma- nouns and polite requests"),
  planned(11, "Dukani", "Ask about common products, prices and quantities in a shop.", "Ki-/Vi- and N-/N- noun classes"),
  planned(12, "Mapishi ya Kitanzania", "Follow simple cooking instructions and talk about Tanzanian dishes.", "Imperatives and sequence words"),
  planned(13, "Nyumbani", "Describe your home, rooms and where you live.", "Locative -ni and common prepositions"),
  planned(14, "Vitu vya Nyumbani", "Name household objects and say where they are.", "Basic locatives: -po, -ko, -mo"),
  planned(15, "Shughuli za Kila Siku", "Describe simple everyday activities and routines.", "Present tense and habitual hu-"),
  planned(16, "Saa na Siku", "Tell time, name weekdays and discuss a simple schedule.", "Time expressions and days of the week"),
  planned(17, "Burudani na Mapendeleo", "Talk about hobbies and things you like or dislike.", "Preference verbs and short questions"),
  planned(18, "Mjini", "Name places in town and ask for simple directions.", "Wapi? and basic location expressions"),
  planned(19, "Usafiri", "Talk about local transport and simple journeys.", "Motion verbs, kwa and common travel phrases"),
  planned(20, "Hospitalini", "Describe basic symptoms and understand simple medical instructions.", "Body vocabulary, ninaumwa and polite imperatives"),
]);

export const SWAHILI_A1_PUBLISHED_LESSONS = Object.freeze(
  SWAHILI_A1_CURRICULUM.filter((lesson) => lesson.status !== "coming-soon")
);
export const SWAHILI_A1_ASSIGNMENTS = Object.freeze(
  SWAHILI_A1_PUBLISHED_LESSONS.filter((lesson) => !lesson.practiceOnly)
);
