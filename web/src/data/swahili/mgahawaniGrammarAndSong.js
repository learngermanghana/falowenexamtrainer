// Teacher-provided source: "22MGAHAWANI GRAMMAR AND SONG LYRICS.docx".
// Preserve the seven grammar topics, examples, dialogues, and complete song text.
// Prices are examples from the teacher's document, not real menu prices.
export const MGAHAWANI_GRAMMAR = Object.freeze({
  introduction: "At a restaurant, we ask what food and drinks are available, place an order, describe what we want or do not want, ask the price, and pay.",
  chapters: [
    {
      id:"polite",number:1,title:"Making a polite request",sw:"Kuomba kwa adabu",
      explanation:"Naomba… and Ninaomba… express a polite request. Both can mean “I would like…” or “…please”. Tafadhali means “please”, and asante means “thank you”.",
      columns:["Pattern","Example","Meaning"],
      rows:[
        ["Naomba + item","Naomba wali na samaki.","Rice and fish, please."],
        ["Ninaomba + item","Ninaomba maji.","I would like some water."],
        ["Naomba + quantity + item","Naomba vikombe viwili vya chai.","Two cups of tea, please."],
        ["Requesting the bill","Naomba bili, tafadhali.","The bill, please."]
      ],
      note:"Ninataka means “I want”. Naomba and ninaomba make the request more courteous: Ninataka maji states what I want; Naomba maji politely asks for it."
    },
    {
      id:"persons",number:2,title:"The six grammatical persons",sw:"Nafsi sita",
      explanation:"The six persons are mimi, wewe, yeye, sisi, ninyi, and wao. Mimi, wewe and yeye are singular; sisi, ninyi and wao are plural. Yeye refers to either “he” or “she”.",
      columns:["Singular","Meaning","Plural","Meaning"],
      rows:[["mimi","I","sisi","we"],["wewe","you, one person","ninyi","you, more than one person"],["yeye","he or she","wao","they"]],
      note:"In Swahili, the verb itself shows the person. Mimi ninataka wali and Ninataka wali both mean “I want rice”. The independent pronoun mimi can make the speaker explicit or add emphasis."
    },
    {
      id:"present",number:3,title:"Present tense: affirmative and negative",sw:"Wakati uliopo: hali ya kukubali na kukanusha",
      explanation:"Kutaka means “to want”. The affirmative says what each person wants; the negative says what each person does not want.",
      columns:["Person","Affirmative","Negative"],
      rows:[
        ["mimi — I","Mimi ninataka wali.","Mimi sitaki wali."],
        ["wewe — you, singular","Wewe unataka wali.","Wewe hutaki wali."],
        ["yeye — he or she","Yeye anataka wali.","Yeye hataki wali."],
        ["sisi — we","Sisi tunataka wali.","Sisi hatutaki wali."],
        ["ninyi — you, plural","Ninyi mnataka wali.","Ninyi hamtaki wali."],
        ["wao — they","Wao wanataka wali.","Wao hawataki wali."]
      ],
      partsTitle:"How the affirmative is formed",
      partsExplanation:"Subject prefix + -na- + verb stem. The present-tense marker is -na-, and the stem is -taka. Subject prefixes: ni-, u-, a-, tu-, m-, and wa-.",
      partsColumns:["Person","Parts","Complete verb"],
      partsRows:[
        ["mimi","ni- + -na- + -taka","ninataka"],
        ["wewe","u- + -na- + -taka","unataka"],
        ["yeye","a- + -na- + -taka","anataka"],
        ["sisi","tu- + -na- + -taka","tunataka"],
        ["ninyi","m- + -na- + -taka","mnataka"],
        ["wao","wa- + -na- + -taka","wanataka"]
      ],
      negativeTitle:"How the negative is formed",
      negativeExplanation:"For this regular -a-ending verb, use si-, hu-, ha-, hatu-, ham-, or hawa-. Drop the present marker -na- and change final -a to -i: -taka becomes -taki.",
      negativeExamples:"ni-na-taka → si-taki; u-na-taka → hu-taki; a-na-taka → ha-taki; tu-na-taka → hatu-taki; m-na-taka → ham-taki; wa-na-taka → hawa-taki.",
      note:"Here hutaki means “you do not want”; its hu- is part of the negative form. This pattern is for regular -a-ending verbs in the present negative, not every verb or tense."
    },
    {
      id:"questions",number:4,title:"Asking about availability and prices",sw:"Chakula, vinywaji na bei",
      explanation:"Mna…? asks restaurant staff “Do you have…?” It addresses more than one person or the establishment collectively. Gani asks “what” or “which”; ngapi asks “how many” or “how much”.",
      columns:["Purpose","Question","Meaning"],
      rows:[
        ["Available food","Mna chakula gani?","What food do you have?"],
        ["A particular dish","Mna wali na samaki?","Do you have rice and fish?"],
        ["Available drinks","Mna vinywaji gani?","What drinks do you have?"],
        ["A particular drink","Mna juisi ya embe?","Do you have mango juice?"],
        ["Price","Chai ni shilingi ngapi?","How much is the tea?"],
        ["Total","Jumla ni shilingi ngapi?","How much is it altogether?"],
        ["Payment","Ninaweza kulipa kwa simu?","Can I pay by mobile money?"]
      ]
    },
    {
      id:"numbers",number:5,title:"Numbers from one to thousands",sw:"Namba na bei",
      explanation:"Count using moja, mbili, tatu, nne, tano, sita, saba, nane, tisa and kumi. In compound numbers, na means “and”: kumi na moja (11), ishirini na moja (21), thelathini na tano (35).",
      columns:["Number","Swahili","Number","Swahili"],
      rows:[["1","moja","6","sita"],["2","mbili","7","saba"],["3","tatu","8","nane"],["4","nne","9","tisa"],["5","tano","10","kumi"]],
      partsTitle:"Tens and hundreds",
      partsColumns:["Number","Swahili","Number","Swahili"],
      partsRows:[["10","kumi","60","sitini"],["20","ishirini","70","sabini"],["30","thelathini","80","themanini"],["40","arobaini","90","tisini"],["50","hamsini","100","mia moja"]],
      partsExplanation:"Hundreds use mia: 200 = mia mbili, 300 = mia tatu, 500 = mia tano, 900 = mia tisa. 125 = mia moja ishirini na tano.",
      negativeTitle:"Thousands and restaurant prices",
      negativeExplanation:"Elfu means “thousand” and comes before the number of thousands. Shilingi identifies the currency amount. These are classroom practice prices, not restaurant menu prices.",
      negativeColumns:["Amount","Swahili price"],
      negativeRows:[
        ["1,000","shilingi elfu moja"],["2,000","shilingi elfu mbili"],
        ["3,000","shilingi elfu tatu"],["5,000","shilingi elfu tano"],
        ["8,000","shilingi elfu nane"],["10,000","shilingi elfu kumi"],
        ["15,000","shilingi elfu kumi na tano"],["20,000","shilingi elfu ishirini"],
        ["2,500","shilingi elfu mbili na mia tano"]
      ],
      note:"Chai ni shilingi elfu moja = The tea costs one thousand shillings. Jumla ni shilingi elfu tano = The total is five thousand shillings."
    },
    {
      id:"agreement",number:6,title:"Numbers as numeral adjectives",sw:"Upatanisho wa nambari",
      explanation:"A numeral adjective says how many of a noun there are, and normally follows it: sahani mbili (“two plates”), vikombe vitatu (“three cups”). 1, 2, 3, 4, 5 and 8 agree with noun classes.",
      columns:["No.","VI class — cups","MA class — oranges","N class — plates"],
      rows:[
        ["2","vikombe viwili","machungwa mawili","sahani mbili"],
        ["3","vikombe vitatu","machungwa matatu","sahani tatu"],
        ["4","vikombe vinne","machungwa manne","sahani nne"],
        ["5","vikombe vitano","machungwa matano","sahani tano"],
        ["8","vikombe vinane","machungwa manane","sahani nane"]
      ],
      partsTitle:"One item",
      partsExplanation:"The singular noun determines the form: kikombe kimoja (one cup), chungwa moja (one orange), sahani moja (one plate), and mteja mmoja (one customer).",
      negativeTitle:"Numbers that do not take these prefixes",
      negativeExplanation:"Sita, saba and tisa do not change with noun class. Kumi and the tens also remain unchanged. Say vikombe sita, not vikombe visita.",
      negativeColumns:["No.","Cups","Oranges"],
      negativeRows:[
        ["6","vikombe sita","machungwa sita"],
        ["7","vikombe saba","machungwa saba"],
        ["9","vikombe tisa","machungwa tisa"],
        ["10","vikombe kumi","machungwa kumi"]
      ],
      note:"In vikombe viwili vya chai, viwili and vya agree with vikombe. One cup is kikombe kimoja cha chai. In shilingi elfu tano, elfu is unchanged."
    },
    {
      id:"locative",number:7,title:"The locative suffix -ni",sw:"Kiambishi tamati -ni",
      explanation:"The suffix -ni can turn a suitable common noun into a place expression. Mgahawa means “restaurant”; mgahawani means “at”, “in”, or “to the restaurant”, depending on the verb.",
      columns:["Noun","Place expression","Meaning"],
      rows:[
        ["mgahawa","mgahawani","at, in, or to the restaurant"],
        ["soko","sokoni","at, in, or to the market"],
        ["nyumba","nyumbani","at home or to the house"],
        ["meza","mezani","on or at the table"]
      ],
      partsTitle:"Location versus movement",
      partsExplanation:"Ninakula mgahawani = I am eating at the restaurant. Ninakwenda mgahawani = I am going to the restaurant. The verb tells whether the meaning is location or movement.",
      negativeTitle:"Where -ni is not added",
      negativeExplanation:"Country and city names normally stand alone: Niko Ujerumani; Ninakwenda Tanzania; Niko Dar es Salaam. Do not form Ujerumanini, Tanzaniani, or Dar es Salaamni in these sentences.",
      note:"Not every word ending in ni is locative. Sahani means “plate”; its ending is not a locative suffix."
    }
  ],
  conversation:[
    ["Mteja","Habari! Mna chakula gani?"],
    ["Mhudumu","Salama, karibu! Tuna wali, samaki na nyama."],
    ["Mteja","Naomba wali na samaki. Sitaki nyama."],
    ["Mhudumu","Na kinywaji?"],
    ["Mteja","Naomba maji, tafadhali."],
    ["Mteja","Naomba bili. Jumla ni shilingi ngapi?"],
    ["Mhudumu","Jumla ni shilingi elfu tano."],
    ["Mteja","Asante sana!"]
  ]
});
export const MGAHAWANI_SONG = Object.freeze({
 title:"MGAHAWANI",
 sections:[
  {title:"Utangulizi — Karibu!",lines:[
    "Habari yako?","Salama, asante!","Karibu, karibu!","Asante sana!",
    "Nikuhudumie nini?","Naomba menyu, tafadhali.","Karibu, hii hapa menyu.","Asante! Mna chakula gani?",
    "Tuna wali, ugali na kuku,","Tuna samaki na mbogamboga.","Naomba wali na kuku,","Na mboga kidogo, tafadhali!"
  ]},
  {title:"Kiitikio",lines:["Naomba, naomba, tafadhali,","Naomba chakula na maji.","Asante, asante, asante sana,","Mgahawani tunaagiza kwa adabu!"]},
  {title:"Ubeti wa kwanza — Chakula",lines:[
    "Unataka kula nini?","Ninataka wali na samaki.","Unataka pilipili?","Hapana, asante, sitaki.",
    "Basi, bila pilipili?","Ndiyo, tafadhali, asante!","Karibu, hiki hapa chakula.","Asante sana, chakula kitamu!"
  ]},
  {title:"Kiitikio",lines:["Naomba, naomba, tafadhali,","Naomba chakula na maji.","Asante, asante, asante sana,","Mgahawani tunaagiza kwa adabu!"]},
  {title:"Ubeti wa pili — Kinywaji",lines:[
    "Unataka kunywa nini?","Naomba juisi ya embe.","Na wewe, utakunywa nini?","Mimi nitakunywa chai.",
    "Chai yenye sukari?","Sukari kidogo, tafadhali.","Kikombe kimoja au viwili?","Vikombe viwili, asante!"
  ]},
  {title:"Daraja — Kulipa",lines:["Naomba bili, tafadhali.","Jumla ni shilingi ngapi?","Jumla ni shilingi elfu tano.","Hizi hapa, asante sana!"]},
  {title:"Kiitikio cha mwisho",lines:["Naomba, naomba, tafadhali,","Naomba chakula na maji.","Asante, asante, asante sana,","Mgahawani tunaagiza kwa adabu!"]},
  {title:"Mwisho — Karibu tena!",lines:["Asante kwa chakula!","Asante kwa huduma!","Karibu, karibu tena!","Asante sana, kwa heri!"]}
 ]
});
