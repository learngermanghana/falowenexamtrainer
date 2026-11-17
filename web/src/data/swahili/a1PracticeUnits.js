// A1 practice workbooks and their matching model answers.
export const SWAHILI_A1_PRACTICE_UNITS = Object.freeze({
  "2": {
    "day": 2,
    "chapter": "Somo la 2",
    "title": "Salamu",
    "objective": "Greet people and respond appropriately in everyday situations.",
    "grammar": "Common greetings and personal pronouns",
    "practiceOnly": true,
    "rule": "Greetings change with the time or situation. Use Habari za asubuhi? in the morning and Habari za jioni? in the evening. Nzuri is a short reply. For a respectful greeting to an elder, use Shikamoo and listen for Marahaba. In Habari yako? the word yako addresses one person; Habari zenu? addresses a group.",
    "examples": [
      {
        "swahili": "Habari za asubuhi?",
        "english": "Good morning."
      },
      {
        "swahili": "Nzuri, asante.",
        "english": "Fine, thank you."
      },
      {
        "swahili": "Shikamoo. — Marahaba.",
        "english": "A respectful greeting and reply."
      }
    ],
    "check": {
      "question": "What is the reply to Shikamoo?",
      "options": [
        "Kwaheri.",
        "Marahaba.",
        "Habari za jioni?"
      ],
      "answer": 1,
      "why": "Marahaba answers the respectful greeting Shikamoo."
    },
    "speaking": "Greet a classmate in the morning, ask how they are and end the conversation. Swap roles and greet an elder.",
    "writing": {
      "prompt": "Write four lines of a morning greeting and farewell between classmates.",
      "model": "Habari za asubuhi? — Nzuri, asante. Habari yako? — Njema, asante. Kwaheri! — Kwaheri!"
    },
    "reading": {
      "text": "Asubuhi, Asha anamwona Juma. Asha anasema, “Habari za asubuhi?” Juma anasema, “Nzuri, asante.”",
      "questions": [
        {
          "question": "Asha anamsalimu nani?",
          "answer": "Juma."
        },
        {
          "question": "Asha anasema nini?",
          "answer": "Habari za asubuhi?"
        },
        {
          "question": "Juma anajibu nini?",
          "answer": "Nzuri, asante."
        }
      ]
    }
  },
  "3": {
    "day": 3,
    "chapter": "Somo la 3",
    "title": "Utambulisho",
    "objective": "Introduce yourself and other people using short sentences.",
    "grammar": "Present-tense kuwa and subject markers",
    "practiceOnly": true,
    "rule": "Use ni with a name or role and si to deny a role. For an action in progress, attach the subject marker and -na- to the verb: ni-na-soma, u-na-soma, a-na-soma.",
    "examples": [
      {
        "swahili": "Mimi ni mwanafunzi.",
        "english": "I am a student."
      },
      {
        "swahili": "Yeye si mwalimu.",
        "english": "They are not a teacher."
      },
      {
        "swahili": "Anasoma Kiswahili.",
        "english": "They study Kiswahili."
      }
    ],
    "check": {
      "question": "Which sentence means “She studies Kiswahili”?",
      "options": [
        "Anasoma Kiswahili.",
        "Ninasoma Kiswahili.",
        "Unasoma Kiswahili."
      ],
      "answer": 0,
      "why": "A- marks he or she; -na- marks the present."
    },
    "speaking": "Introduce yourself at a new class. Ask your partner their name and introduce them to a third person.",
    "writing": {
      "prompt": "Write four sentences giving your name and role, then introduce another person and say what they study.",
      "model": "Ninaitwa Amina. Mimi ni mwanafunzi. Huyu ni Omar. Anasoma Kiswahili."
    },
    "reading": {
      "text": "Ninaitwa Mariam. Mimi ni mwanafunzi. Huyu ni Musa. Yeye ni mwalimu.",
      "questions": [
        {
          "question": "Mwanafunzi anaitwa nani?",
          "answer": "Mariam."
        },
        {
          "question": "Mwalimu anaitwa nani?",
          "answer": "Musa."
        },
        {
          "question": "Musa ni nani?",
          "answer": "Mwalimu."
        }
      ]
    }
  },
  "4": {
    "day": 4,
    "chapter": "Somo la 4",
    "title": "Nchi na Lugha",
    "objective": "Say where people come from and which languages they speak.",
    "grammar": "Questions: nani, wapi, gani; present tense",
    "practiceOnly": true,
    "rule": "Use unatoka wapi? to ask where someone comes from and unazungumza lugha gani? to ask which language they speak. Change u- to ni- to give your own answer and to a- to speak about another person. Use nani for who, as in Huyu ni nani?",
    "examples": [
      {
        "swahili": "Ninatoka Tanzania.",
        "english": "I come from Tanzania."
      },
      {
        "swahili": "Anazungumza Kiswahili.",
        "english": "They speak Swahili."
      },
      {
        "swahili": "Unatoka wapi?",
        "english": "Where do you come from?"
      }
    ],
    "check": {
      "question": "Which word asks “which” in lugha gani?",
      "options": [
        "wapi",
        "nani",
        "gani"
      ],
      "answer": 2,
      "why": "Gani follows lugha to ask which language."
    },
    "speaking": "Meet a new classmate. Ask where they come from and which languages they speak, then introduce them to the group.",
    "writing": {
      "prompt": "Write a brief introduction with your country and two languages, followed by one question for your partner.",
      "model": "Ninatoka Ghana. Ninazungumza Kiingereza na Kiswahili. Unazungumza lugha gani?"
    },
    "reading": {
      "text": "Fatuma anatoka Tanzania. Anazungumza Kiswahili. David anatoka Kenya na anazungumza Kiswahili na Kiingereza.",
      "questions": [
        {
          "question": "Fatuma anatoka wapi?",
          "answer": "Tanzania."
        },
        {
          "question": "David anatoka wapi?",
          "answer": "Kenya."
        },
        {
          "question": "David anazungumza lugha gani?",
          "answer": "Kiswahili na Kiingereza."
        }
      ]
    }
  },
  "7": {
    "day": 7,
    "chapter": "Somo la 7",
    "title": "Chakula na Vinywaji",
    "objective": "Share food and drink preferences, then agree what to bring to a class picnic. Apply polite ordering in the listening exercise.",
    "grammar": "Vitenzi, mapendeleo na kuomba kwa adabu",
    "practiceOnly": true,
    "check": {
      "question": "Which phrase means “I don’t like milk”?",
      "options": [
        "Ninapenda maziwa.",
        "Nataka maziwa.",
        "Sipendi maziwa."
      ],
      "answer": 2,
      "why": "Sipendi expresses dislike."
    },
    "speaking": "Plan a class picnic. Ask your partner what they like to eat and drink, offer two choices, and agree who will bring each item. Change one choice if your partner dislikes it.",
    "writing": {
      "prompt": "Write a short picnic message. Say what you like, decline one drink politely, and say what you will bring.",
      "model": "Ninapenda chapati na matunda. Sitaki soda, asante. Nitaleta chapati na maji."
    },
    "reading": {
      "text": "Hassan na Amina wanapanga kula pamoja baada ya darasa. Hassan anapenda chapati na chai. Amina hapendi chai. Anapenda juisi ya embe. Hassan ataleta chapati na Amina ataleta juisi.",
      "questions": [
        {
          "question": "Hassan anapenda kinywaji gani?",
          "answer": "Chai."
        },
        {
          "question": "Amina anapenda juisi gani?",
          "answer": "Juisi ya embe."
        },
        {
          "question": "Nani ataleta chapati?",
          "answer": "Hassan."
        }
      ]
    },
    "grammarSections": [
      {
        "title": "Wakati uliopo · Preferences and wants",
        "rule": "For affirmative present forms, use a subject prefix + -na- + a verb stem. For the negative forms of -penda and -taka, use the negative prefix, drop -na-, and change the final -a to -i.",
        "examples": [
          {
            "swahili": "Mimi ninapenda chai. / Sipendi chai.",
            "english": "I like tea. / I do not like tea."
          },
          {
            "swahili": "Wewe unapenda chai. / Hupendi chai.",
            "english": "You like tea. / You do not like tea. (one person)"
          },
          {
            "swahili": "Yeye anapenda chai. / Hapendi chai.",
            "english": "He or she likes tea. / He or she does not like tea."
          },
          {
            "swahili": "Sisi tunapenda chai. / Hatupendi chai.",
            "english": "We like tea. / We do not like tea."
          },
          {
            "swahili": "Ninyi mnapenda chai. / Hampendi chai.",
            "english": "You like tea. / You do not like tea. (more than one person)"
          },
          {
            "swahili": "Wao wanapenda chai. / Hawapendi chai.",
            "english": "They like tea. / They do not like tea."
          },
          {
            "swahili": "Ninataka maji. / Sitaki kahawa.",
            "english": "I want water. / I do not want coffee."
          },
          {
            "swahili": "Ninapenda kunywa chai.",
            "english": "I like drinking tea."
          }
        ]
      },
      {
        "title": "Kuomba kwa adabu · Polite ordering",
        "rule": "Nataka and ninataka express what you want. Use naomba or ninaomba to make a request. Add tafadhali for ‘please’ and asante for ‘thank you’.",
        "examples": [
          {
            "swahili": "Naomba wali na kuku, tafadhali.",
            "english": "Rice and chicken, please."
          },
          {
            "swahili": "Ninaomba maji baridi.",
            "english": "I would like some cold water."
          },
          {
            "swahili": "Naomba menyu, tafadhali.",
            "english": "The menu, please."
          },
          {
            "swahili": "Naomba bili. Bili ni kiasi gani?",
            "english": "The bill, please. How much is it?"
          },
          {
            "swahili": "Hapana, asante.",
            "english": "No, thank you."
          }
        ]
      },
      {
        "title": "Njaa, kiu na kushiba · Hunger, thirst and fullness",
        "rule": "Use nina with njaa (hunger) and kiu (thirst). Use nimeshiba after you have eaten enough.",
        "examples": [
          {
            "swahili": "Nina njaa. Naomba chakula.",
            "english": "I am hungry. I would like some food."
          },
          {
            "swahili": "Nina kiu. Naomba maji.",
            "english": "I am thirsty. I would like some water."
          },
          {
            "swahili": "Nimeshiba, asante.",
            "english": "I am full, thank you."
          }
        ]
      },
      {
        "title": "Msamiati · Food, drinks and meals",
        "rule": "Ask Unataka chakula gani? to ask what food someone wants. Unapenda kunywa nini? asks what someone likes to drink. Unataka kunywa nini? asks what they want to drink.",
        "examples": [
          {
            "swahili": "Chakula: wali, kuku, samaki, chapati, matunda.",
            "english": "Food: rice, chicken, fish, flatbread, fruit."
          },
          {
            "swahili": "Vinywaji: maji, chai, kahawa, maziwa, juisi.",
            "english": "Drinks: water, tea, coffee, milk, juice."
          },
          {
            "swahili": "Kifungua kinywa · chakula cha mchana · chakula cha jioni",
            "english": "Breakfast · lunch · dinner."
          }
        ]
      }
    ],
    "listening": {
      "audioUrlEndpoint": "/api/course-media/swahili/a1/day-7/audio-url",
      "questions": [
        {
          "id": "meal",
          "question": "Mteja anaagiza chakula gani?",
          "choices": [
            "Wali na samaki",
            "Wali na kuku",
            "Chapati na kuku"
          ],
          "answer": "Wali na kuku"
        },
        {
          "id": "drink",
          "question": "Mteja anataka kunywa nini?",
          "choices": [
            "Chai",
            "Kahawa",
            "Maji baridi"
          ],
          "answer": "Maji baridi"
        },
        {
          "id": "offer",
          "question": "Mhudumu anampa mteja chaguo gani lingine la kinywaji?",
          "choices": [
            "Chai au kahawa",
            "Juisi au maziwa",
            "Maji au soda"
          ],
          "answer": "Chai au kahawa"
        },
        {
          "id": "accept",
          "question": "Je, mteja anakubali chai au kahawa?",
          "choices": [
            "Ndiyo, anakubali chai",
            "Hapana, maji yanatosha",
            "Ndiyo, anakubali kahawa"
          ],
          "answer": "Hapana, maji yanatosha"
        },
        {
          "id": "bill",
          "question": "Bili ni shilingi ngapi?",
          "choices": [
            "Shilingi elfu tatu",
            "Shilingi elfu nne",
            "Shilingi elfu tano"
          ],
          "answer": "Shilingi elfu tano"
        }
      ]
    }
  },
  "8": {
    "day": 8,
    "chapter": "Somo la 8",
    "title": "Namba na Umri",
    "objective": "Confirm a phone number and classroom number, and use age as a short review.",
    "grammar": "Compound numbers, digit-by-digit confirmation and age review",
    "practiceOnly": true,
    "rule": "Use na to join tens and units in numbers such as ishirini na moja. Read a phone number one digit at a time, including the opening zero. For age, use nina miaka followed by the number of years.",
    "examples": [
      {
        "swahili": "Darasa letu ni namba ishirini na moja.",
        "english": "Our classroom is number twenty-one."
      },
      {
        "swahili": "0725: sifuri, saba, mbili, tano.",
        "english": "0725: zero, seven, two, five."
      },
      {
        "swahili": "Tafadhali, rudia namba ya simu.",
        "english": "Please repeat the phone number."
      },
      {
        "swahili": "Nina miaka ishirini na tatu.",
        "english": "I am twenty-three years old."
      }
    ],
    "check": {
      "question": "What is ishirini na tatu?",
      "options": [
        "13",
        "23",
        "32"
      ],
      "answer": 1,
      "why": "Ishirini is twenty and tatu adds three."
    },
    "speaking": "One learner reads a fictional phone number and a classroom number. Their partner writes both down, asks for a repeat, and reads them back to confirm. Swap roles.",
    "writing": {
      "prompt": "Write a short message giving a classroom number in words and a four-digit fictional contact code in digits and in words.",
      "model": "Darasa letu ni namba ishirini na moja. Msimbo ni 0725: sifuri, saba, mbili, tano."
    },
    "reading": {
      "text": "Amina anasoma Kiswahili katika darasa namba ishirini na moja. Msimbo wa kuingia ni 0725. Juma anauliza, “Tafadhali, rudia msimbo.” Amina anasema, “Sifuri, saba, mbili, tano.”",
      "questions": [
        {
          "question": "Darasa lina namba gani?",
          "answer": "Ishirini na moja."
        },
        {
          "question": "Msimbo wa kuingia ni upi?",
          "answer": "0725."
        },
        {
          "question": "Msimbo unaanza na namba gani?",
          "answer": "Sifuri."
        }
      ]
    }
  },
  "9": {
    "day": 9,
    "chapter": "Somo la 9",
    "title": "Marafiki",
    "objective": "Describe friends and make a simple plan to meet.",
    "grammar": "M-/Wa- adjective agreement and invitations with Je, ungependa …?",
    "practiceOnly": true,
    "rule": "Adjectives usually follow the noun. With many adjectives for people, use m- for one person and wa- for several: rafiki mrefu → marafiki warefu. Use Je, ungependa …? to invite a friend and Tukutane … to suggest where or when to meet.",
    "examples": [
      {
        "swahili": "rafiki mrefu / marafiki warefu",
        "english": "a tall friend / tall friends"
      },
      {
        "swahili": "Je, ungependa kucheza mpira Jumamosi?",
        "english": "Would you like to play football on Saturday?"
      },
      {
        "swahili": "Tukutane uwanjani.",
        "english": "Let's meet at the playing field."
      }
    ],
    "check": {
      "question": "Which phrase means “tall friends”?",
      "options": [
        "marafiki warefu",
        "marafiki mrefu",
        "rafiki mrefu"
      ],
      "answer": 0,
      "why": "Warefu agrees with people in the plural."
    },
    "speaking": "Describe one friend and invite your partner to an activity. Your partner suggests a day or place. Agree on both, then swap roles.",
    "writing": {
      "prompt": "Write a short message to a friend. Invite them to an activity and suggest a day and meeting place.",
      "model": "Habari, Neema! Je, ungependa kucheza mpira Jumamosi? Tukutane uwanjani."
    },
    "reading": {
      "text": "Pili na Neema ni marafiki. Wote wanapenda mpira. Pili anamwalika Neema kucheza mpira Jumamosi. Neema anakubali. Wanapanga kukutana uwanjani.",
      "questions": [
        {
          "question": "Pili na Neema wanapenda nini?",
          "answer": "Mpira."
        },
        {
          "question": "Watacheza mpira siku gani?",
          "answer": "Jumamosi."
        },
        {
          "question": "Watakutana wapi?",
          "answer": "Uwanjani."
        }
      ]
    }
  },
  "10": {
    "day": 10,
    "chapter": "Somo la 10",
    "title": "Sokoni",
    "objective": "Buy produce by weight, bargain politely and confirm the total at a market stall.",
    "grammar": "Prices per kilo, quantity agreement and bargaining",
    "practiceOnly": true,
    "grammarSections": [
      {
        "title": "Bei kwa kilo · Price per kilo",
        "rule": "Use Kilo moja ya … ni bei gani? to ask the price per kilo. Use nusu kilo ya … to request half a kilo.",
        "examples": [
          {
            "swahili": "Kilo moja ya nyanya ni bei gani?",
            "english": "How much is one kilo of tomatoes?"
          },
          {
            "swahili": "Naomba nusu kilo ya nyanya.",
            "english": "I'd like half a kilo of tomatoes."
          }
        ]
      },
      {
        "title": "Idadi · Counting produce",
        "rule": "Countable ma-class plurals use forms such as mawili and matatu. Ndizi uses mbili or tatu. The question word also agrees: mayai mangapi? and ndizi ngapi?",
        "examples": [
          {
            "swahili": "Naomba mayai mawili na ndizi tatu.",
            "english": "I'd like two eggs and three bananas."
          }
        ]
      },
      {
        "title": "Kupatana bei · Agreeing on a price",
        "rule": "Use unaweza kupunguza bei? to ask politely for a lower price. Use jumla ni shilingi ngapi? to confirm the total.",
        "examples": [
          {
            "swahili": "Unaweza kupunguza bei kidogo, tafadhali?",
            "english": "Could you lower the price a little, please?"
          },
          {
            "swahili": "Jumla ni shilingi ngapi?",
            "english": "How much is the total?"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "sw": "soko",
        "en": "market"
      },
      {
        "sw": "nyanya",
        "en": "tomatoes"
      },
      {
        "sw": "vitunguu",
        "en": "onions"
      },
      {
        "sw": "mayai",
        "en": "eggs"
      },
      {
        "sw": "ndizi",
        "en": "bananas"
      },
      {
        "sw": "nusu kilo",
        "en": "half a kilo"
      },
      {
        "sw": "punguzo",
        "en": "discount"
      }
    ],
    "check": {
      "question": "How do you ask the seller to lower the price?",
      "options": [
        "Jumla ni shilingi ngapi?",
        "Unaweza kupunguza bei?",
        "Unataka mayai mangapi?"
      ],
      "answer": 1,
      "why": "Kupunguza bei means to lower the price."
    },
    "speaking": "At a market stall, tomatoes are 4,000 shillings per kilo and bananas are 500 shillings each. The buyer asks for half a kilo of tomatoes and two bananas, asks for a better price and confirms the total. Swap roles and change the produce.",
    "writing": {
      "prompt": "Write a dialogue asking the price per kilo of tomatoes, ordering half a kilo and two bananas, and asking the seller for a discount.",
      "model": "Mteja: Kilo moja ya nyanya ni bei gani? Muuzaji: Shilingi elfu nne. Mteja: Naomba nusu kilo ya nyanya na ndizi mbili. Unaweza kupunguza bei kidogo? Muuzaji: Sawa, jumla ni shilingi elfu mbili na mia tano."
    },
    "reading": {
      "text": "Asha ananunua nyanya na ndizi sokoni. Kilo moja ya nyanya ni shilingi elfu nne. Asha anaomba nusu kilo ya nyanya na ndizi mbili. Ndizi mbili ni shilingi elfu moja. Muuzaji anasema jumla ni shilingi elfu tatu. Asha anaomba punguzo. Muuzaji anasema, “Sawa, ni shilingi elfu mbili na mia tano.”",
      "questions": [
        {
          "question": "Asha anaomba nyanya kiasi gani?",
          "answer": "Nusu kilo."
        },
        {
          "question": "Asha ananunua ndizi ngapi?",
          "answer": "Ndizi mbili."
        },
        {
          "question": "Asha analipa shilingi ngapi baada ya punguzo?",
          "answer": "Shilingi elfu mbili na mia tano."
        }
      ]
    }
  },
  "11": {
    "day": 11,
    "chapter": "Somo la 11",
    "title": "Dukani",
    "objective": "Ask what is in stock, choose a product and pay at a shop counter.",
    "grammar": "Stock questions, Ki-/Vi- agreement and paying",
    "practiceOnly": true,
    "grammarSections": [
      {
        "title": "Bidhaa zilizopo · Stock",
        "rule": "Use Mna …? to ask what the shop has. The shopkeeper can answer with Tuna … or Hatuna ….",
        "examples": [
          {
            "swahili": "Mna madaftari makubwa?",
            "english": "Do you have large notebooks?"
          },
          {
            "swahili": "Hatuna madaftari makubwa. Tuna madaftari madogo.",
            "english": "We don't have large notebooks. We have small notebooks."
          }
        ]
      },
      {
        "title": "Hiki na hivi · This and these",
        "rule": "A ki-class noun such as kitabu takes hiki. Its vi-class plural vitabu takes hivi. The number also agrees: kitabu kimoja, vitabu viwili.",
        "examples": [
          {
            "swahili": "Kitabu hiki ni bei gani?",
            "english": "How much is this book?"
          },
          {
            "swahili": "Naomba vitabu viwili.",
            "english": "I'd like two books."
          }
        ]
      },
      {
        "title": "Kulipa · Paying",
        "rule": "Use Nitachukua … when you've chosen what to buy. Ask Naweza kulipa …? to check a payment method.",
        "examples": [
          {
            "swahili": "Nitachukua kalamu mbili.",
            "english": "I'll take two pens."
          },
          {
            "swahili": "Naweza kulipa kwa simu?",
            "english": "Can I pay by mobile phone?"
          },
          {
            "swahili": "Risiti, tafadhali.",
            "english": "A receipt, please."
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "sw": "duka",
        "en": "shop"
      },
      {
        "sw": "bidhaa",
        "en": "product / goods"
      },
      {
        "sw": "daftari",
        "en": "notebook"
      },
      {
        "sw": "kitabu",
        "en": "book"
      },
      {
        "sw": "kalamu",
        "en": "pen"
      },
      {
        "sw": "risiti",
        "en": "receipt"
      },
      {
        "sw": "pesa taslimu",
        "en": "cash"
      }
    ],
    "check": {
      "question": "What does the shopkeeper say when there are no large notebooks?",
      "options": [
        "Tuna madaftari makubwa.",
        "Hatuna madaftari makubwa.",
        "Naomba madaftari makubwa."
      ],
      "answer": 1,
      "why": "Hatuna means we don't have."
    },
    "speaking": "Role-play buying school supplies. Ask for a large notebook, choose an alternative when it is out of stock, add two pens and ask how you can pay. Request a receipt.",
    "writing": {
      "prompt": "Write a shop dialogue. Ask if large notebooks are in stock. Choose a small notebook and two pens. Ask to pay by phone and request a receipt.",
      "model": "Mteja: Mna madaftari makubwa? Muuzaji: Hatuna, lakini tuna madaftari madogo. Mteja: Nitachukua daftari dogo moja na kalamu mbili. Naweza kulipa kwa simu? Muuzaji: Ndiyo. Mteja: Risiti, tafadhali."
    },
    "reading": {
      "text": "Nuru anaenda dukani kununua daftari kubwa. Muuzaji anasema, “Hatuna madaftari makubwa. Tuna madaftari madogo.” Nuru anachukua daftari dogo moja na kalamu mbili. Jumla ni shilingi elfu nne. Nuru analipa kwa simu na anaomba risiti.",
      "questions": [
        {
          "question": "Muuzaji ana madaftari ya aina gani?",
          "answer": "Madaftari madogo."
        },
        {
          "question": "Nuru ananunua kalamu ngapi?",
          "answer": "Kalamu mbili."
        },
        {
          "question": "Nuru analipa kwa njia gani?",
          "answer": "Analipa kwa simu."
        }
      ]
    }
  },
  "12": {
    "day": 12,
    "chapter": "Somo la 12",
    "title": "Mapishi ya Kitanzania",
    "objective": "Follow simple cooking instructions and talk about Tanzanian dishes.",
    "grammar": "Imperatives and sequence words",
    "practiceOnly": true,
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
    "speaking": "Explain three steps for preparing a simple salad. Your partner repeats them in the right order.",
    "writing": {
      "prompt": "Write three instructions to prepare a tomato and onion salad. Use kwanza, kisha and mwishowe.",
      "model": "Kwanza, osha nyanya. Kisha, kata nyanya na vitunguu. Mwishowe, ongeza chumvi."
    },
    "reading": {
      "text": "Kwanza, osha mchele. Kisha, ongeza maji. Pika mchele mpaka uive. Mwishowe, toa wali kwenye sufuria.",
      "questions": [
        {
          "question": "Unaosha nini kwanza?",
          "answer": "Mchele."
        },
        {
          "question": "Unaongeza nini?",
          "answer": "Maji."
        },
        {
          "question": "Unatoa wali kutoka wapi?",
          "answer": "Kutoka kwenye sufuria."
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
    "practiceOnly": true,
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
    "speaking": "Draw a simple home plan. Describe where two rooms are while your partner follows on the drawing.",
    "writing": {
      "prompt": "Write four sentences about an imaginary home. Include one room and two location phrases.",
      "model": "Ninaishi hapa. Nyumba ina vyumba viwili. Bafu liko karibu na jiko. Bustani iko nyuma ya nyumba."
    },
    "reading": {
      "text": "Nyumba ya Nia ina vyumba viwili. Bafu liko karibu na jiko. Bustani iko mbele ya nyumba.",
      "questions": [
        {
          "question": "Nyumba ina vyumba vingapi?",
          "answer": "Viwili."
        },
        {
          "question": "Bafu liko wapi?",
          "answer": "Karibu na jiko."
        },
        {
          "question": "Bustani iko wapi?",
          "answer": "Mbele ya nyumba."
        }
      ]
    }
  },
  "14": {
    "day": 14,
    "chapter": "Somo la 14",
    "title": "Vitu vya Nyumbani",
    "objective": "Name household objects and say where they are.",
    "grammar": "Basic locatives: -po, -ko, -mo",
    "practiceOnly": true,
    "rule": "Where you put an object affects how you describe its location: -po can point to a specific spot, -ko to a more general place and -mo to the inside of something. The beginning agrees with the object: kiti takes ki-, funguo takes zi-.",
    "examples": [
      {
        "swahili": "Kiti kipo hapa.",
        "english": "The chair is right here."
      },
      {
        "swahili": "Chumba kiko ghorofani.",
        "english": "The room is upstairs."
      },
      {
        "swahili": "Funguo zimo ndani ya mfuko.",
        "english": "The keys are in the bag."
      }
    ],
    "check": {
      "question": "Which form fits keys inside a bag?",
      "options": [
        "ziko",
        "zimo",
        "zipo"
      ],
      "answer": 1,
      "why": "-Mo points to the inside, and funguo takes zi-."
    },
    "speaking": "Ask where three everyday objects are. Describe what is here, upstairs or inside a bag.",
    "writing": {
      "prompt": "Write three sentences locating a chair, a room and your keys. Use one example each of -po, -ko and -mo.",
      "model": "Kiti kipo hapa. Chumba kiko ghorofani. Funguo zimo ndani ya mfuko."
    },
    "reading": {
      "text": "Kiti kipo pale karibu na mlango. Chumba kiko ghorofani. Vitabu vimo ndani ya sanduku.",
      "questions": [
        {
          "question": "Kiti kipo wapi?",
          "answer": "Pale karibu na mlango."
        },
        {
          "question": "Chumba kiko wapi?",
          "answer": "Ghorofani."
        },
        {
          "question": "Vitabu vimo wapi?",
          "answer": "Ndani ya sanduku."
        }
      ]
    }
  },
  "15": {
    "day": 15,
    "chapter": "Somo la 15",
    "title": "Shughuli za Kila Siku",
    "objective": "Describe simple everyday activities and routines.",
    "grammar": "Present tense and habitual hu-",
    "practiceOnly": true,
    "rule": "The present uses a subject marker and -na-: ninakula, unakula, anakula. For a repeated habit, hu- can replace this subject-and-tense pattern; use an explicit subject if it is unclear who does it.",
    "examples": [
      {
        "swahili": "Ninasoma sasa.",
        "english": "I am studying now."
      },
      {
        "swahili": "Kila asubuhi, mimi husoma.",
        "english": "I study every morning."
      },
      {
        "swahili": "Asha huamka mapema.",
        "english": "Asha usually wakes early."
      }
    ],
    "check": {
      "question": "Which sentence presents a routine?",
      "options": [
        "Kila asubuhi mimi huamka mapema.",
        "Ninaamka sasa.",
        "Asha anasoma sasa."
      ],
      "answer": 0,
      "why": "Hu- and kila asubuhi signal a repeated habit here."
    },
    "speaking": "Compare morning routines. Use one sentence for what you are doing now and two for your habits.",
    "writing": {
      "prompt": "Write four sentences about your routine, including two with hu- and one about what you are doing now.",
      "model": "Kila asubuhi mimi huamka mapema. Kisha mimi hunywa chai. Jioni mimi husoma nyumbani. Sasa ninaandika."
    },
    "reading": {
      "text": "Kila asubuhi Asha huamka mapema. Baadaye yeye hunywa chai. Jioni husoma nyumbani. Sasa anaandika barua.",
      "questions": [
        {
          "question": "Asha hunywa nini asubuhi?",
          "answer": "Chai."
        },
        {
          "question": "Husoma wapi jioni?",
          "answer": "Nyumbani."
        },
        {
          "question": "Anafanya nini sasa?",
          "answer": "Anaandika barua."
        }
      ]
    }
  },
  "16": {
    "day": 16,
    "chapter": "Somo la 16",
    "title": "Saa na Siku",
    "objective": "Tell time, name weekdays and discuss a simple schedule.",
    "grammar": "Time expressions and days of the week",
    "practiceOnly": true,
    "rule": "The Swahili clock counts from roughly 6 a.m. or 6 p.m. So saa moja asubuhi is 7 a.m. and saa moja jioni is 7 p.m. Add the period of the day and use na nusu for half past.",
    "examples": [
      {
        "swahili": "saa mbili asubuhi",
        "english": "8 a.m."
      },
      {
        "swahili": "saa tatu na nusu asubuhi",
        "english": "9:30 a.m."
      },
      {
        "swahili": "Jumatatu",
        "english": "Monday."
      }
    ],
    "check": {
      "question": "What is saa nne asubuhi?",
      "options": [
        "4 a.m.",
        "4 p.m.",
        "10 a.m."
      ],
      "answer": 2,
      "why": "Add six to the morning Swahili clock number for saa nne asubuhi."
    },
    "speaking": "Plan a morning study session. Ask for the day and time, suggest another time and confirm the final arrangement.",
    "writing": {
      "prompt": "Write a two-event schedule with weekdays and times in Kiswahili, then add the matching digital times.",
      "model": "Jumatatu ninasoma saa mbili asubuhi (08:00). Ijumaa ninakutana na Asha saa moja jioni (19:00)."
    },
    "reading": {
      "text": "Jumatatu darasa linaanza saa mbili asubuhi. Jumatano darasa linaanza saa tatu na nusu asubuhi.",
      "questions": [
        {
          "question": "Darasa linaanza saa ngapi Jumatatu?",
          "answer": "Saa mbili asubuhi (08:00)."
        },
        {
          "question": "Darasa linaanza saa ngapi Jumatano?",
          "answer": "Saa tatu na nusu asubuhi (09:30)."
        },
        {
          "question": "Ni siku gani darasa linaanza baadaye?",
          "answer": "Jumatano."
        }
      ]
    }
  },
  "17": {
    "day": 17,
    "chapter": "Somo la 17",
    "title": "Burudani na Mapendeleo",
    "objective": "Talk about hobbies and things you like or dislike.",
    "grammar": "Preference verbs and short questions",
    "practiceOnly": true,
    "rule": "Use kupenda with an activity in the ku- form: kusoma (to read), kucheza (to play), kuimba (to sing). Ask Unapenda kufanya nini? and reply with Ninapenda or Sipendi.",
    "examples": [
      {
        "swahili": "Ninapenda kusoma.",
        "english": "I like reading."
      },
      {
        "swahili": "Sipendi kucheza mpira.",
        "english": "I do not like playing football."
      },
      {
        "swahili": "Unapenda kuimba?",
        "english": "Do you like singing?"
      }
    ],
    "check": {
      "question": "Which sentence means “I like singing”?",
      "options": [
        "Unapenda kuimba?",
        "Ninapenda kuimba.",
        "Sipendi kuimba."
      ],
      "answer": 1,
      "why": "Ninapenda means I like and kuimba means singing."
    },
    "speaking": "Interview a partner about two hobbies and suggest one activity you both like.",
    "writing": {
      "prompt": "Write two hobbies you like and one you dislike, then write one question for a partner.",
      "model": "Ninapenda kusoma na kuimba. Sipendi kucheza mpira. Unapenda kufanya nini?"
    },
    "reading": {
      "text": "Neema anapenda kuimba na kusoma. Hapendi kucheza mpira. Baraka anapenda kucheza mpira na kusoma.",
      "questions": [
        {
          "question": "Neema anapenda kufanya nini?",
          "answer": "Kuimba na kusoma."
        },
        {
          "question": "Neema hapendi nini?",
          "answer": "Kucheza mpira."
        },
        {
          "question": "Wote wanapenda nini?",
          "answer": "Kusoma."
        }
      ]
    }
  },
  "18": {
    "day": 18,
    "chapter": "Somo la 18",
    "title": "Mjini",
    "objective": "Name places in town and ask for simple directions.",
    "grammar": "Wapi? and basic location expressions",
    "practiceOnly": true,
    "rule": "Ask Wapi? for a location. The location verb agrees with the place: soko liko wapi? and shule iko wapi? Use nenda moja kwa moja for go straight and geuka kulia or kushoto for turn right or left.",
    "examples": [
      {
        "swahili": "Soko liko wapi?",
        "english": "Where is the market?"
      },
      {
        "swahili": "Geuka kushoto.",
        "english": "Turn left."
      },
      {
        "swahili": "Benki iko karibu na soko.",
        "english": "The bank is near the market."
      }
    ],
    "check": {
      "question": "Which instruction means “turn right”?",
      "options": [
        "Geuka kulia.",
        "Geuka kushoto.",
        "Nenda moja kwa moja."
      ],
      "answer": 0,
      "why": "Kulia means on or to the right."
    },
    "speaking": "Use an imaginary town map. Ask for the bank and give two directions plus a landmark. Swap roles for the market.",
    "writing": {
      "prompt": "Write directions from a school to a bank. Include two instructions and a landmark.",
      "model": "Kutoka shuleni, nenda moja kwa moja. Geuka kulia. Benki iko karibu na soko."
    },
    "reading": {
      "text": "Kutoka shuleni, nenda moja kwa moja. Geuka kushoto. Soko liko mbele yako. Benki iko karibu na soko.",
      "questions": [
        {
          "question": "Unaanzia wapi?",
          "answer": "Shuleni."
        },
        {
          "question": "Unageuka upande gani?",
          "answer": "Kushoto."
        },
        {
          "question": "Benki iko karibu na nini?",
          "answer": "Soko."
        }
      ]
    }
  },
  "19": {
    "day": 19,
    "chapter": "Somo la 19",
    "title": "Usafiri",
    "objective": "Talk about local transport and simple journeys.",
    "grammar": "Motion verbs, kwa and common travel phrases",
    "practiceOnly": true,
    "rule": "Use kwenda for going, kutoka for leaving or coming from, and kufika for arriving. Put kwa before the transport method. Use kutoka … hadi … to show a route.",
    "examples": [
      {
        "swahili": "Ninasafiri kwa basi.",
        "english": "I travel by bus."
      },
      {
        "swahili": "Ninakwenda mjini.",
        "english": "I am going into town."
      },
      {
        "swahili": "kutoka nyumbani hadi sokoni",
        "english": "from home to the market."
      }
    ],
    "check": {
      "question": "Which phrase means “by train”?",
      "options": [
        "hadi treni",
        "kutoka treni",
        "kwa treni"
      ],
      "answer": 2,
      "why": "Kwa introduces the transport method."
    },
    "speaking": "Ask how to travel to town. Compare two types of transport and say where your trip starts and ends.",
    "writing": {
      "prompt": "Describe a short journey. Name the starting point, the destination, the transport and one time.",
      "model": "Ninatoka nyumbani saa mbili asubuhi. Ninakwenda mjini kwa basi. Ninafika saa tatu asubuhi."
    },
    "reading": {
      "text": "Musa anatoka nyumbani saa moja asubuhi. Anakwenda sokoni kwa daladala. Anafika saa mbili asubuhi.",
      "questions": [
        {
          "question": "Musa anatoka wapi?",
          "answer": "Nyumbani."
        },
        {
          "question": "Anasafiri kwa nini?",
          "answer": "Kwa daladala."
        },
        {
          "question": "Anafika saa ngapi?",
          "answer": "Saa mbili asubuhi."
        }
      ]
    }
  },
  "20": {
    "day": 20,
    "chapter": "Somo la 20",
    "title": "Hospitalini",
    "objective": "Describe basic symptoms and understand simple medical instructions.",
    "grammar": "Body vocabulary, ninaumwa and polite imperatives",
    "practiceOnly": true,
    "rule": "Say ninaumwa to report feeling unwell, then name what hurts. The subject agreement follows the body part: kichwa kinauma (head) and tumbo linauma (stomach). Use tafadhali when making a polite request.",
    "examples": [
      {
        "swahili": "Ninaumwa.",
        "english": "I feel unwell."
      },
      {
        "swahili": "Kichwa kinauma.",
        "english": "My head hurts."
      },
      {
        "swahili": "Tafadhali, naomba kuonana na daktari.",
        "english": "Please, I would like to see a doctor."
      }
    ],
    "check": {
      "question": "Which sentence says “My stomach hurts”?",
      "options": [
        "Tumbo kinauma.",
        "Tumbo linauma.",
        "Kichwa kinauma."
      ],
      "answer": 1,
      "why": "Tumbo takes li- here; linauma means it hurts."
    },
    "speaking": "Take turns as a patient and a clinic receptionist. Say where it hurts and make a polite request to see a doctor.",
    "writing": {
      "prompt": "Write four short lines between a receptionist and a patient asking to see a doctor.",
      "model": "Habari. Una shida gani? — Ninaumwa. Kichwa kinauma. — Tafadhali, subiri hapa. — Asante. Naomba kuonana na daktari."
    },
    "reading": {
      "text": "Asha yuko hospitalini. Anasema, “Tumbo linauma.” Anaomba kuonana na daktari. Mhudumu anasema, “Tafadhali, subiri hapa.”",
      "questions": [
        {
          "question": "Asha yuko wapi?",
          "answer": "Hospitalini."
        },
        {
          "question": "Anaumwa sehemu gani?",
          "answer": "Tumbo."
        },
        {
          "question": "Mhudumu anamwambia nini?",
          "answer": "Tafadhali, subiri hapa."
        }
      ]
    }
  }
});
