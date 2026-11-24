export const SWAHILI_A1_LEGACY_UNITS = Object.freeze({
  "12": {
    "day": 12,
    "chapter": "Somo la 12",
    "title": "Mapishi ya Kitanzania",
    "objective": "Read a family cooking story, understand an ugali conversation and give simple cooking instructions.",
    "grammar": "Amri, mpangilio wa hatua na mapishi",
    "practiceOnly": false,
    "rule": "Use instructions in the order they happen, starting with kwanza, then kisha, and finally mwishowe. Examples of commands to one person include osha, kata and ongeza. Ongeza comes from kuongeza.",
    "examples": [
      {
        "swahili": "Osha nyanya.",
        "english": "Wash the tomatoes."
      },
      {
        "swahili": "Kata vitunguu.",
        "english": "Cut the onions."
      },
      {
        "swahili": "Ongeza chumvi.",
        "english": "Add salt."
      }
    ],
    "check": {
      "question": "Which instruction means “Add salt”?",
      "options": [
        "Ongeza chumvi.",
        "Kata chumvi.",
        "Osha chumvi."
      ],
      "answer": 0,
      "why": "Ongeza means add."
    },
    "speaking": "Talk about Tanzanian food and explain how to prepare ugali. Use sequence words, change partners and repeat the instructions.",
    "writing": {
      "prompt": "Andika maelekezo mafupi ya kupika ugali. Write 5–7 short sentences explaining the ingredients, how to prepare the hot water, when to add flour and how to finish.",
      "guide": {
        "heading": "Kuandika · Jinsi ya kupika ugali",
        "steps": [
          "Name the dish and two ingredients (unga wa mahindi and maji).",
          "Start with Kwanza and explain what happens to the water.",
          "Use Kisha or Halafu to explain adding flour slowly and stirring.",
          "Finish with Mwishowe and describe when the ugali is ready."
        ],
        "phrases": [
          "Tunahitaji …",
          "Kwanza, …",
          "Kisha, …",
          "Halafu, …",
          "Tia unga polepole.",
          "Koroga mpaka …",
          "Mwishowe, …"
        ],
        "placeholder": "Leo tunapika ugali. Tunahitaji …\\nKwanza, …",
        "minimumLines": 5
      }
    },
    "reading": {
      "title": "Mapishi Jikoni kwa Mama",
      "text": "Leo ni siku ya Jumapili. Mama yupo jikoni anapika chakula cha jioni kwa ajili ya familia.\n\nAnapika wali wa nazi na samaki. Kwanza, anasafisha mchele na kutumia tui la nazi kupika wali. Pili, anakaanga samaki na kuweka viungo vyenye harufu nzuri. Watoto pia wanapenda kula ugali na maharage, lakini leo chakula kikuu ni wali na samaki.\n\nBaada ya kupika, familia yote inakaa pamoja mezani kula chakula cha jioni. Baba anasema, “Chakula hiki ni kitamu sana, asante!”",
      "questions": [
        {
          "id": "read-1",
          "question": "Mama yupo wapi leo na anafanya nini?",
          "choices": [
            "Yupo dukani ananunua nguo",
            "Yupo jikoni anapika chakula cha jioni",
            "Yupo mlimani anatembea",
            "Yupo shuleni anafundisha"
          ]
        },
        {
          "id": "read-2",
          "question": "Mama anapika chakula gani kikuu leo?",
          "choices": [
            "Ugali na nyama",
            "Chipsi na kuku",
            "Wali wa nazi na samaki",
            "Mkate na chai"
          ]
        },
        {
          "id": "read-3",
          "question": "Mama anatumia nini kupika wali wa nazi?",
          "choices": [
            "Maji tu",
            "Tui la nazi",
            "Maziwa ya ng’ombe",
            "Juisi ya embe"
          ]
        },
        {
          "id": "read-4",
          "question": "Watoto wanapenda kula chakula gani kingine cha Kitanzania?",
          "choices": [
            "Pizza na pasta",
            "Ugali na maharage",
            "Supu na mkate",
            "Matunda na juisi"
          ]
        },
        {
          "id": "read-5",
          "question": "Baba anasema nini baada ya kuonja chakula mezani?",
          "choices": [
            "Sitaki kula leo.",
            "Chakula ni baridi.",
            "Chakula hiki ni kitamu sana, asante!",
            "Naomba bili, tafadhali."
          ]
        }
      ]
    },
    "grammarSections": [
      {
        "title": "Vitenzi vya kupika · Cooking verbs",
        "rule": "Many regular Kiswahili verbs end in -a. To give one person a simple positive command, use the verb stem without ku-: kuosha → osha, kukata → kata, kupika → pika, kuongeza → ongeza. For a polite request, add tafadhali.",
        "examples": [
          {
            "swahili": "Osha mchele, tafadhali.",
            "english": "Wash the rice, please."
          },
          {
            "swahili": "Kata vitunguu.",
            "english": "Cut the onions."
          },
          {
            "swahili": "Ongeza tui la nazi.",
            "english": "Add coconut milk."
          },
          {
            "swahili": "Koroga ugali.",
            "english": "Stir the ugali."
          }
        ]
      },
      {
        "title": "Mpangilio wa hatua · Sequence words",
        "rule": "Use kwanza (first), kisha or halafu (then), baadaye (afterwards) and mwishowe (finally) to give instructions in a clear order.",
        "examples": [
          {
            "swahili": "Kwanza, osha mchele.",
            "english": "First, wash the rice."
          },
          {
            "swahili": "Kisha, ongeza tui la nazi.",
            "english": "Then, add coconut milk."
          },
          {
            "swahili": "Baadaye, pika wali.",
            "english": "Afterwards, cook the rice."
          },
          {
            "swahili": "Mwishowe, pakua chakula.",
            "english": "Finally, serve the food."
          }
        ]
      },
      {
        "title": "Unahitaji nini? · Ingredients and quantities",
        "rule": "Use unahitaji nini? to ask what someone needs; tunahitaji … means we need. Kwa ugali, use unga wa mahindi and maji. The phrase maji ya moto means hot water.",
        "examples": [
          {
            "swahili": "Unahitaji nini kupika ugali?",
            "english": "What do you need to cook ugali?"
          },
          {
            "swahili": "Tunahitaji unga wa mahindi na maji.",
            "english": "We need maize flour and water."
          },
          {
            "swahili": "Tia unga polepole.",
            "english": "Add the flour slowly."
          },
          {
            "swahili": "Koroga mpaka ugali uwe mgumu.",
            "english": "Stir until the ugali becomes firm."
          }
        ]
      },
      {
        "title": "Chakula na maoni · Food and opinions",
        "rule": "Use ninapenda … to say what you like, napenda … in natural speech, and chakula hiki ni kitamu to describe a tasty meal. Questions with unajua …? ask if someone knows how to do something.",
        "examples": [
          {
            "swahili": "Ninapenda wali wa nazi na samaki.",
            "english": "I like coconut rice and fish."
          },
          {
            "swahili": "Unajua kupika ugali?",
            "english": "Do you know how to cook ugali?"
          },
          {
            "swahili": "Ndiyo, najua kupika.",
            "english": "Yes, I know how to cook."
          },
          {
            "swahili": "Chakula hiki ni kitamu sana.",
            "english": "This food is very delicious."
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "sw": "jikoni",
        "en": "in the kitchen"
      },
      {
        "sw": "mapishi",
        "en": "cooking / recipes"
      },
      {
        "sw": "wali wa nazi",
        "en": "coconut rice"
      },
      {
        "sw": "samaki",
        "en": "fish"
      },
      {
        "sw": "mchele",
        "en": "uncooked rice"
      },
      {
        "sw": "tui la nazi",
        "en": "coconut milk"
      },
      {
        "sw": "viungo",
        "en": "spices / seasonings"
      },
      {
        "sw": "ugali",
        "en": "maize-flour staple"
      },
      {
        "sw": "unga wa mahindi",
        "en": "maize flour"
      },
      {
        "sw": "maji ya moto",
        "en": "hot water"
      },
      {
        "sw": "kukoroga",
        "en": "to stir"
      },
      {
        "sw": "maharage",
        "en": "beans"
      }
    ],
    "groupPractice": {
      "heading": "Kuzungumza · Mapishi jikoni",
      "intro": "Practise together in pairs or groups of three. Explain ingredients and give instructions; switch roles after each round.",
      "stages": [
        {
          "title": "Chakula ninachopenda · Favourite food",
          "instruction": "Ask your partner what Tanzanian food they like. Reply using Ninapenda… and say why."
        },
        {
          "title": "Viungo vya ugali · Ingredients for ugali",
          "instruction": "One learner asks Unahitaji nini kupika ugali? The partner names unga wa mahindi and maji and explains why the water must be hot."
        },
        {
          "title": "Mpangilio wa mapishi · Cooking steps",
          "instruction": "Explain how to make ugali with kwanza, kisha, halafu and mwishowe. A partner repeats the actions in the correct order."
        }
      ],
      "phrases": [
        {
          "swahili": "Unapenda kula chakula gani?",
          "english": "What food do you like eating?"
        },
        {
          "swahili": "Ninapenda ugali na nyama.",
          "english": "I like ugali and meat."
        },
        {
          "swahili": "Unajua kupika ugali?",
          "english": "Do you know how to cook ugali?"
        },
        {
          "swahili": "Tunahitaji unga wa mahindi na maji.",
          "english": "We need maize flour and water."
        },
        {
          "swahili": "Kwanza, chemsha maji.",
          "english": "First, boil the water."
        },
        {
          "swahili": "Halafu, tia unga polepole na ukoroge.",
          "english": "Then add the flour slowly and stir."
        }
      ],
      "challenge": "In groups of three, explain ugali preparation for 45 seconds without reading. One learner speaks, another repeats the steps and the third checks the sequence. Then rotate roles."
    },
    "referencePractice": {
      "heading": "Mazoezi ya msamiati · Cooking phrases",
      "instruction": "No Day 12 song is linked yet. Practise these expressions before the group discussion.",
      "phrases": [
        {
          "swahili": "Nina njaa sana.",
          "english": "I am very hungry."
        },
        {
          "swahili": "Unahitaji nini kwa ugali?",
          "english": "What do you need for ugali?"
        },
        {
          "swahili": "Maji ya moto ni muhimu.",
          "english": "Hot water is important."
        },
        {
          "swahili": "Chakula hiki ni kitamu sana.",
          "english": "This food is very delicious."
        }
      ]
    },
    "listening": {
      "audioUrlEndpoint": "/api/course-media/swahili/a1/day-12/audio-url",
      "questions": [
        {
          "id": "listen-favorite",
          "question": "Mzungumzaji A anapenda chakula gani cha Kitanzania?",
          "choices": [
            "Ugali",
            "Chapati",
            "Wali wa nazi",
            "Pilau"
          ]
        },
        {
          "id": "listen-knowledge",
          "question": "Mzungumzaji B anasema nini kuhusu kupika ugali?",
          "choices": [
            "Hajui kupika ugali",
            "Anajua kupika ugali vizuri",
            "Anataka kununua ugali",
            "Anapika samaki"
          ]
        },
        {
          "id": "listen-ingredients",
          "question": "Wanahitaji nini kupika ugali?",
          "choices": [
            "Mchele na tui la nazi",
            "Unga wa mahindi na maji",
            "Nyama na vitunguu",
            "Maziwa na sukari"
          ]
        },
        {
          "id": "listen-water",
          "question": "Maji yanapaswa kuwa ya namna gani?",
          "choices": [
            "Baridi",
            "Ya uvuguvugu",
            "Ya moto",
            "Yenye chumvi nyingi"
          ]
        },
        {
          "id": "listen-process",
          "question": "Baada ya kutia unga polepole, wanafanya nini?",
          "choices": [
            "Wanakoroga mpaka ugali uwe mgumu",
            "Wanaongeza sukari",
            "Wanakaanga samaki",
            "Wanaweka wali kwenye sahani"
          ]
        }
      ]
    }
  },
  "13": {
    "day": 13,
    "chapter": "Somo la 13",
    "title": "Nyumbani",
    "objective": "Describe your home, rooms and where you live.",
    "grammar": "Locative -ni and common prepositions",
    "practiceOnly": false,
    "rule": "On familiar place nouns, -ni can give a location: nyumba → nyumbani and jikoni means in the kitchen. Use karibu na for near, mbele ya for in front of, and nyuma ya for behind.",
    "examples": [
      {
        "swahili": "Niko nyumbani.",
        "english": "I am at home."
      },
      {
        "swahili": "Mama yuko jikoni.",
        "english": "Mother is in the kitchen."
      },
      {
        "swahili": "Chumba kiko karibu na bafu.",
        "english": "The room is near the bathroom."
      }
    ],
    "check": {
      "question": "Which phrase means “behind the house”?",
      "options": [
        "mbele ya nyumba",
        "karibu na nyumba",
        "nyuma ya nyumba"
      ],
      "answer": 2,
      "why": "Nyuma ya puts something behind a place."
    },
    "speaking": "Describe an imaginary home and its rooms. Ask and answer where the kitchen, bedroom and furniture are, then change roles.",
    "writing": {
      "prompt": "Andika kuhusu nyumba ya kufikirika. Write 5–7 sentences about an imaginary home, its rooms and where things are.",
      "guide": {
        "heading": "Kuandika · Nyumba yangu",
        "steps": [
          "Say how many bedrooms your imaginary home has.",
          "Name three rooms or objects.",
          "Describe two locations using karibu na, mbele ya, nyuma ya or upande wa kulia.",
          "Say what you like about the house."
        ],
        "phrases": [
          "Nyumba yangu ina …",
          "Hiki ni chumba cha …",
          "Meza iko karibu na …",
          "Bafu liko …",
          "Ninapenda …"
        ],
        "placeholder": "Nyumba yangu ina …\nHiki ni …",
        "minimumLines": 5
      }
    },
    "reading": {
      "text": "Nyumba ya Nia ina vyumba viwili. Bafu liko karibu na jiko. Bustani iko mbele ya nyumba.",
      "questions": [
        {
          "id": "read-1",
          "question": "Nyumba ina vyumba vingapi?",
          "choices": [
            "Kimoja",
            "Viwili",
            "Vitatu"
          ]
        },
        {
          "id": "read-2",
          "question": "Bafu liko wapi?",
          "choices": [
            "Karibu na jiko",
            "Nyuma ya bustani",
            "Mbele ya mlango"
          ]
        },
        {
          "id": "read-3",
          "question": "Bustani iko wapi?",
          "choices": [
            "Nyuma ya nyumba",
            "Mbele ya nyumba",
            "Ndani ya jiko"
          ]
        }
      ],
      "title": "Nyumba ya Nia"
    },
    "grammarSections": [
      {
        "title": "Mahali · Places",
        "rule": "Nyumbani means at home and jikoni means in the kitchen. Ask wapi? to ask where something is.",
        "examples": [
          {
            "swahili": "Niko nyumbani.",
            "english": "I am at home."
          },
          {
            "swahili": "Jikoni iko wapi?",
            "english": "Where is the kitchen?"
          }
        ]
      },
      {
        "title": "Kueleza mahali · Locations",
        "rule": "Karibu na means near, mbele ya in front of, nyuma ya behind, and upande wa kulia on the right. Location forms agree with the noun: meza iko, chumba kiko, bafu liko.",
        "examples": [
          {
            "swahili": "Meza iko karibu na dirisha.",
            "english": "The table is near the window."
          },
          {
            "swahili": "Chumba kiko mbele ya nyumba.",
            "english": "The room is in front of the house."
          },
          {
            "swahili": "Bafu liko karibu na mlango.",
            "english": "The bathroom is near the door."
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "sw": "nyumba",
        "en": "house"
      },
      {
        "sw": "nyumbani",
        "en": "at home"
      },
      {
        "sw": "chumba cha wageni",
        "en": "living room"
      },
      {
        "sw": "chumba cha kulala",
        "en": "bedroom"
      },
      {
        "sw": "jikoni",
        "en": "in the kitchen"
      },
      {
        "sw": "bafu",
        "en": "bathroom"
      },
      {
        "sw": "meza",
        "en": "table"
      },
      {
        "sw": "kiti",
        "en": "chair"
      },
      {
        "sw": "dirisha",
        "en": "window"
      },
      {
        "sw": "mlango",
        "en": "door"
      },
      {
        "sw": "karibu na",
        "en": "near"
      }
    ],
    "groupPractice": {
      "heading": "Kuzungumza · Nyumbani",
      "intro": "Work in pairs. One learner welcomes a visitor; the other asks about the home. Then swap roles.",
      "stages": [
        {
          "title": "Karibu nyumbani",
          "instruction": "Greet the visitor and welcome them into an imaginary home."
        },
        {
          "title": "Vyumba na vitu",
          "instruction": "Ask where the kitchen, bedroom and table are. Answer with location phrases."
        },
        {
          "title": "Idadi ya vyumba",
          "instruction": "Ask how many bedrooms there are and answer in a complete sentence."
        }
      ],
      "phrases": [
        {
          "swahili": "Karibu nyumbani kwangu.",
          "english": "Welcome to my home."
        },
        {
          "swahili": "Chumba cha kulala kiko wapi?",
          "english": "Where is the bedroom?"
        },
        {
          "swahili": "Meza iko karibu na dirisha.",
          "english": "The table is near the window."
        },
        {
          "swahili": "Ina vyumba vitatu vya kulala.",
          "english": "It has three bedrooms."
        }
      ],
      "challenge": "Draw an imaginary home and describe three rooms and two locations to a partner. Swap roles."
    },
    "listening": {
      "audioUrlEndpoint": "/api/course-media/swahili/a1/day-13/audio-url",
      "questions": [
        {
          "id": "listen-room",
          "question": "A anamwonyesha B chumba gani kwanza?",
          "choices": [
            "Chumba cha wageni",
            "Chumba cha kulala",
            "Bafu",
            "Jikoni"
          ]
        },
        {
          "id": "listen-table",
          "question": "Meza iko wapi?",
          "choices": [
            "Karibu na dirisha",
            "Nyuma ya nyumba",
            "Jikoni",
            "Karibu na bafu"
          ]
        },
        {
          "id": "listen-kitchen",
          "question": "Jikoni iko upande gani?",
          "choices": [
            "Upande wa kushoto",
            "Upande wa kulia",
            "Nyuma ya nyumba",
            "Mbele ya mlango"
          ]
        },
        {
          "id": "listen-bedrooms",
          "question": "Nyumba ina vyumba vingapi vya kulala?",
          "choices": [
            "Kimoja",
            "Viwili",
            "Vitatu",
            "Vinne"
          ]
        },
        {
          "id": "listen-bathroom",
          "question": "Bafu liko wapi?",
          "choices": [
            "Karibu na mlango mkuu",
            "Karibu na dirisha",
            "Upande wa kushoto",
            "Nyuma ya meza"
          ]
        }
      ]
    }
  },
});
