export type Block = { p: string } | { ul: string[] } | { ol: string[] };

export type DetailSection = {
  heading?: string;
  image?: string;
  imageAlt?: string;
  imageSide?: 'left' | 'right';
  body: Block[];
};

export type ProtocolDetail = {
  subtitle: string;
  introHeading?: string;
  intro: string[];
  sections: DetailSection[];
  access: {
    heading: string;
    steps: string[];
    notes: string[];
    buyLabel: string;
    buyHref: string;
  };
  disclaimer: string;
};

const DISCLAIMER =
  'DAO.Disclaimer: All protocols, AI diagnostics, and content are for educational and informational purposes only. They are not veterinary medical advice, diagnosis, or treatment. Always consult your licensed veterinarian. MPTs and Dynamic NFTs are utility tokens and not investment products. NOTE: “All photos are illustrative or from real-life examples. Results vary. Consult your veterinarian.”';

export const protocolDetails: Record<string, ProtocolDetail> = {
  'max-movement': {
    subtitle: 'Detailed protocol overview.',
    intro: [
      'Purchase the Dynamic NFT or MPT on XRPL to unlock lifetime educational access. Upload a short walking video or photo; our Vision Transformer (ViT) AI instantly analyzes gait asymmetry and mobility patterns. Receive personalized whole-food diet, low-impact lake-walk lifestyle guidance, and natural joint-support recommendations.',
      'Every access funds no-kill shelter mobility programs and veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/max-movement/gait-analysis.png',
        imageAlt: 'SuperBud pug with ViT gait-analysis overlay',
        imageSide: 'right',
        body: [
          { p: 'Tokenized RWA mobility solution for injured, senior and veteran working dogs.' },
          { p: 'ViT detects gait asymmetry for instant protocol unlock.' },
          { p: 'Funds no-kill shelters, mobility programs plus pet parent veterans meetups.' },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/max-movement/whole-food.png',
        imageAlt: 'Pug beside bowls of whole-food ingredients',
        imageSide: 'left',
        body: [
          {
            p: 'Bone broth (1–2 tbsp per 20 lbs daily for natural collagen), turmeric paste (½ tsp per 20 lbs and a small pinch of black pepper + coconut oil), sardines or mackerel (1–2x weekly for omega-3s), sweet potatoes and pumpkin.',
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/max-movement/lake-walk.png',
        imageAlt: 'Pug by a mountain lake on a soft trail',
        imageSide: 'right',
        body: [
          {
            p: 'Daily low-impact lake walks (20–40 minutes on soft trails), gentle swimming sessions, and veteran-dog playdates in community settings.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          {
            p: 'Canine Flex Support or Canine Musculoskeletal Support (whole-food glucosamine, chondroitin, and anti-inflammatory nutrients).',
          },
          {
            p: 'Canine Flex Support is a chewable chondroitin and glucosamine supplement for dogs that helps support pathways involved in dogs’ healthy joint function. It provides nutrients that:',
          },
          {
            ul: [
              'Support the body’s normal inflammatory response',
              'Help support pathways involved in healthy joint function, including support for the cartilage',
              'Contains antioxidant vitamins E and C',
              'Support healthy immune system function',
            ],
          },
          {
            p: 'Wear and tear of joints and surrounding tissues, especially in very active and aging dogs, can cause stiffness and trigger the body’s normal inflammatory response function.',
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/max-movement/personal-insight.png',
        imageAlt: 'Golden retriever swimming during pool therapy',
        imageSide: 'left',
        body: [
          {
            p: 'In my 30 years working in alternative healthcare, I saw countless patients and many of their dogs regain their mobility with gentle movement combined with lowering of inflammation with whole-food support.',
          },
          {
            p: 'One patient’s golden retriever Jax could barely stand after long walks. We put together a plan, began pool therapy, changed his diet away from kibble, and began taking natural anti-inflammatory whole-food supplements. Within two weeks, Jax began moving better and began waiting excitedly at the door for his daily walks.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman recommended) on freedompawsinc.com.',
        'Purchase or mint the Dynamic NFT or MPT for Max Movement Pro.',
        'Upload a short walking video or clear photo of your dog.',
        'Our Vision Transformer (ViT) AI instantly analyzes gait and mobility.',
        'Unlock your full personalized whole-food diet, lake-walk lifestyle plan, and natural support guidance.',
      ],
      notes: ['Every access directly funds no-kill shelter mobility programs and veteran-dog lake meetups.'],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'freedom-calm': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Acquire the Dynamic NFT or MPT on XRPL for full protocol access.',
      'Upload a photo; ViT AI detects stress indicators and breathing patterns. Unlock tailored whole-food calming diet, whole food supplement, shaded lake relaxation routines, and natural anxiety-support strategies.',
      'Every access supports no-kill shelter calm-space programs and veteran working-dog meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/freedom-calm/grant.png',
        imageAlt: 'Calm pug with heartbeat overlay and American flag',
        imageSide: 'right',
        body: [
          { p: 'Tokenized calming support for disabled persons, military and veteran service dogs.' },
          {
            p: 'ViT analyzes facial stress cues and channels DAO funds to shelter adoptions and veterans community wellness meetups.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/freedom-calm/whole-food.png',
        imageAlt: 'Pug beside bowls of chamomile and whole-food ingredients',
        imageSide: 'left',
        body: [
          {
            ul: [
              'Greek yogurt or kefir (1–2 tbsp per 20 lbs daily for probiotics)',
              'Chamomile-infused broth',
              'Calming whole foods served in quiet community settings',
            ],
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/freedom-calm/lifestyle.png',
        imageAlt: 'Calm pug resting in the grass by a lake',
        imageSide: 'right',
        body: [
          {
            ul: [
              'Daily low-impact lake walks (20–40 minutes on soft trails)',
              'Gentle swimming sessions',
              'Veteran-dog community settings',
            ],
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          { ul: ['Calming Comfort Pro', 'Canine Adrenal Support (whole-food adrenal and nervous-system nutrients)'] },
          {
            p: 'Calming Comfort Pro is a professional veterinary supplement formulated to promote calm behavior, relaxation, and nervous system health in both dogs and cats.',
          },
          {
            ul: [
              'Beneficial for pets in stressful situations like thunderstorms, fireworks, travel, and separation',
              'Aids in calming dogs and cats',
              'Promotes normal behavior',
              'May help manage stress-related behaviors in dogs and cats',
              'Relief from occasional anxiousness',
              'Supports neurotransmitter synthesis for behavioral health',
              'Promotes a positive mood',
              'Helps control cortisol response in dogs',
            ],
          },
          {
            p: 'Canine Adrenal Support is an adrenal support supplement for dogs that supports the adrenal gland’s ability to rebuild, regenerate, and respond to stress.',
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/freedom-calm/personal-insight.png',
        imageAlt: 'Service golden retriever resting its paw in a veteran’s hand',
        imageSide: 'left',
        body: [
          {
            p: 'We’ve all seen how high-stress circumstances and over-stimulated environments like airports and high-traffic areas affect working dogs and people alike. A veteran patient’s dog became increasingly agitated when faced with stressful situations like thunderstorms, fireworks, travel, and separation anxiety.',
          },
          {
            p: 'For months his dog wouldn’t sleep throughout the night. I told him about Calming Comfort Pro, which he tried. He said it helped decrease his dog’s anxiety, calm down, and sleep without interruption. These results fuel our patriotic DAO veteran and dog support programs.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'liver-kidney-detox': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol 1 Works',
    intro: [
      'Purchase the Dynamic NFT or MPT on XRPL to activate this educational detox protocol.',
      'Upload a photo; ViT AI identifies early liver/kidney stress markers. Receive whole-food cleansing diet, hydration-focused lifestyle guidance, and targeted natural support recommendations.',
      'Every access helps fund no-kill shelter detox and senior-dog care programs plus veteran lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/liver-kidney-detox/grant.png',
        imageAlt: 'Pug with glowing liver and kidney overlay',
        imageSide: 'right',
        body: [
          {
            p: 'RWA-tokenized gentle detox support for rescue and shelter dogs post-medication or environmental exposure.',
          },
          {
            p: 'ViT flags coat dullness and supports shelter rescue promotions and community volunteer meetups for veterans and dog owners.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/liver-kidney-detox/whole-food.png',
        imageAlt: 'Pug beside bowls of organ meat, blueberries, and greens',
        imageSide: 'left',
        body: [
          {
            ul: [
              'Broccoli sprouts (1 tsp per 20 lbs daily for sulforaphane)',
              'Fresh dandelion greens',
              'Cranberries (3–4 berries per 10 lbs)',
              'Fish oils; sardines, anchovies',
              'Blueberries, sweet potato, pumpkin',
            ],
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/liver-kidney-detox/lifestyle.png',
        imageAlt: 'Calm pug resting outdoors',
        imageSide: 'right',
        body: [
          {
            p: 'Increased hydration, hikes at neighborhood lakes or beach, nutrient-dense dietary intake, rest time after high activity, and shaded recovery time.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          {
            p: 'Canine Hepatic Support (liver whole-food extracts; pair with Whole Body Support for kidney synergy, or Canine Renal Support).',
          },
          {
            p: 'Canine Hepatic Support is a liver supplement for dogs formulated to support dogs’ liver metabolism & hepatic circulation.',
          },
          { p: 'It is also formulated to support:' },
          {
            ul: ['Bile production and flow', 'Hepatic immune function'],
          },
          {
            p: 'A dog’s liver is a complex organ that interacts with most organs in the body, including the intestinal tract, cardiovascular system, kidneys, and autonomic nervous system.',
          },
          {
            p: 'Canine Renal Support is a kidney supplement for dogs which provides support for the normal function of dogs’ kidneys while also supporting essential systems related to renal support.',
          },
          {
            p: 'For renal challenges, not only should the kidneys be supported but consideration should also be given to support of the liver, cardiovascular system, and autonomic nervous system.',
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/liver-kidney-detox/personal-insight.png',
        imageAlt: 'Siberian husky resting in a grassy field',
        imageSide: 'left',
        body: [
          {
            p: 'As a foundation to health, the liver and kidney clearance have always been a primary foundation of my recommendations for improving the health of my patients, their dogs and myself. These organs are at the root of a dog’s ability to detoxify toxins and assimilate nutrients.',
          },
          {
            p: 'As with my human patients, I recommend the same approach for our four legged friends, that being to provide them with better detoxification, assimilation, health and longevity. I feel dogs are truly man’s best friend, I feel providing better health to our dogs is why a portion of every sale supports no-kill shelters and our vets with pets outreach.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD. Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'gut-balance': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Acquire the Dynamic NFT or MPT on XRPL for lifelong access.',
      'Upload a photo; ViT AI analyzes digestive patterns and gut health signals. Unlock personalized whole-food gut-support diet, calm lifestyle routines, and natural balance strategies inspired by Buddy’s own journey.',
      'Every access funds no-kill shelter gut-health programs and veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/gut-balance/grant.png',
        imageAlt: 'Pug with digestive tract overlay and DIGESTIVE/GUT badge',
        imageSide: 'right',
        body: [
          {
            p: 'Comprehensive gut-balance and preventive cleanse RWA for no-kill shelter intakes and senior/working dogs.',
          },
          { p: 'ViT detects digestive patterns and drives tokenized community support.' },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/gut-balance/whole-food.png',
        imageAlt: 'Pug beside bowls of pumpkin, broth, and vegetables',
        imageSide: 'left',
        body: [
          {
            ul: [
              'Fresh-ground pumpkin (1–4 tsp per 10–50 lbs)',
              'Hemp hearts (½ tsp per 20 lbs)',
              'Bone broth',
              'Canned pumpkin mixed with Greek yogurt',
              'Small amounts of fermented vegetables',
            ],
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/gut-balance/lifestyle.png',
        imageAlt: 'Two pugs playing outdoors by a lake',
        imageSide: 'right',
        body: [
          {
            p: 'Lake play to boost natural immunity, post-meal lake walks, stress-free family feeding routines, and hygiene-focused shelter adoption meetups.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          {
            p: 'Canine Enteric Support (gut integrity, microbiome, and digestive whole-food nutrients).',
          },
          {
            p: 'Canine Enteric Support is a digestive supplement for dogs which supports the ability of their intestinal cells to regenerate.',
          },
          {
            p: 'A healthy digestive tract is critical to overall health and well-being. In addition to breakdown and absorption of nutrients, digestive health can also have a significant impact on other body systems (immune system, liver, bone marrow, or adrenal glands).',
          },
          {
            p: 'Canine Enteric Support contains a variety of functional foods, both plant and animal, that “feed” the various components of the digestive system to:',
          },
          {
            ul: [
              'Provide general digestive system support',
              'Support the ability of intestinal cells to function, regenerate, and respond to daily metabolic and immune challenges',
            ],
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/gut-balance/personal-insight.png',
        imageAlt: 'Long-haired dog by the water',
        imageSide: 'left',
        body: [
          {
            p: 'When our friend’s dog Charlie came down with symptoms of nausea, throwing up, stomach problems and diarrhea after eating grass and “who knows what” in the yard. He wouldn’t eat for two days, so I had our neighbor begin supplementing him with microbiome digestive support. The day after beginning this whole food supplementation, he regained his appetite and returned with normal energy, good stools, and his tail was wagging again.',
          },
          {
            p: 'This reinforces why gut support is central to every Freedom Paws protocol — and why we dedicate resources to shelter dogs facing similar challenges.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'infrared-spine': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Purchase the Dynamic NFT or MPT on XRPL to unlock this educational spinal protocol. Upload a photo or short video; ViT AI detects spine and joint alignment issues. Receive whole-food anti-inflammatory diet, gentle swimming lifestyle guidance, and natural support recommendations.',
      'Every access supports no-kill shelter mobility programs and veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/infrared-spine/grant.png',
        imageAlt: 'Pug with glowing spine and joint overlay',
        imageSide: 'right',
        body: [
          {
            p: 'Home-therapy RWA for veteran & service dogs. ViT gait analysis unlocks sessions and lake mobility community meetups.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/infrared-spine/whole-food.png',
        imageAlt: 'Pug beside bone broth, turmeric, and fatty fish',
        imageSide: 'left',
        body: [{ p: 'Bone broth plus fatty fish, daily turmeric.' }],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/infrared-spine/lifestyle.png',
        imageAlt: 'Calm pug resting outdoors',
        imageSide: 'right',
        body: [
          {
            p: '10–20 minute red-light sessions combined with lake stretching and play.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          {
            p: 'Canine Musculoskeletal Support (whole-food glucosamine, chondroitin, and anti-inflammatory nutrients).',
          },
          {
            p: 'Canine Musculoskeletal Support is a supplement that promotes the musculoskeletal system health for dogs: tendons, ligaments, bones, joints, and muscles.',
          },
          {
            ul: [
              'Supports optimal musculoskeletal function',
              'Supports healthy movement',
              'Supports joint comfort & overall joint health',
            ],
          },
          {
            p: 'The canine musculoskeletal system has many components: bones, joints, muscles, tendons, ligaments, nerves, blood vessels, and organs that support these tissues including the liver, kidneys, and adrenal glands.',
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/infrared-spine/personal-insight.png',
        imageAlt: 'Long-haired dog by the water',
        imageSide: 'left',
        body: [
          {
            p: 'Many of our patients’ dogs I’ve worked with carried old injuries from service or rescue work in addition to arthritis which had set in.',
          },
          {
            p: 'In addition to supplementing the body through chemistry for these conditions, I also researched and began incorporating red light therapy. Red light therapy supports tissue function of ligaments, tendons, circulation to the muscles, and fascia to provide muscle comfort, aiding joint health, and soft tissue. I found it works great with daily mobility exercises, and I’ve witnessed many dogs regain their mobility and increase their quality of life with this combination of therapies.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'allergy-shield': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Acquire the Dynamic NFT or MPT on XRPL for full protocol access.',
      'Upload a photo; ViT AI identifies skin, coat, and allergy patterns. Unlock omega-rich whole-food diet, grooming-focused lifestyle routines, and natural coat-support strategies.',
      'Every access funds no-kill shelter skin-care programs and veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/allergy-shield/grant.png',
        imageAlt: 'Pug with ViT skin and coat analysis overlay',
        imageSide: 'right',
        body: [
          {
            p: 'Addresses the #1 canine issue through tokenized RWA + ViT skin pattern recognition.',
          },
          { p: 'Directly funds shelter rescue promotions and community volunteer meetups.' },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/allergy-shield/whole-food.png',
        imageAlt: 'Pug beside coconut, blueberries, and leafy greens',
        imageSide: 'left',
        body: [
          {
            p: 'Coconut oil (1 tsp per 10 lbs), chia and hemp seeds, turmeric, Omega-3 fatty acids, blueberries, ginger, green leafy vegetables.',
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/allergy-shield/lifestyle.png',
        imageAlt: 'Calm pug resting outdoors',
        imageSide: 'right',
        body: [
          {
            p: 'Whole food diet, hypoallergenic grooming, community lake days, and reduced urban exposure.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          { p: 'Canine Dermal Support (skin and coat whole-food nutrients).' },
          {
            p: 'Canine Dermal Support is a dog skin health supplement containing whole food-based ingredients to support your patients’ general skin health. This powder supplement contains whole food ingredients to help:',
          },
          {
            ul: [
              'Maintain proper liver, adrenal, immune, and intestinal function',
              'Support and maintain the skin’s ability to withstand the effects of environmental exposure',
            ],
          },
          {
            p: 'Nutrition plays a major role in skin health. Healthy skin is a result of a well-functioning, synchronized effort by tissues and organs in the body.',
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/allergy-shield/personal-insight.png',
        imageAlt: 'Before and after skin improvement on a dog',
        imageSide: 'left',
        body: [
          {
            p: 'Skin being the largest organ of a dog’s body, it is affected by both internal health and external environmental variants. Seasonal allergies plagued many dogs I’ve cared for over the years.',
          },
          {
            p: 'An all too common story. The dog parents did everything including medicated shampoo and medication from their vet without success. Creams, lotions and potions, and nothing works.',
          },
          {
            p: 'The breakthrough came after providing whole food supplementation of Allergy Shield Dermal Support and switching the dog to a whole-food diet which returned the dog to itch-free days and happier demeanor.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'fresh-smile-dental': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Purchase the Dynamic NFT or MPT on XRPL to unlock lifetime educational access.',
      'Upload a photo; ViT AI analyzes teeth, gums, and oral health markers.',
      'Receive dental-supporting whole-food diet, gentle chewing lifestyle guidance, and natural oral-care recommendations.',
      'Every access helps fund no-kill shelter dental programs and veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/fresh-smile-dental/grant.png',
        imageAlt: 'Pug with ViT plaque detection overlay',
        imageSide: 'right',
        body: [
          { p: 'Preventive dental RWA for shelter and veteran dogs.' },
          {
            p: 'ViT plaque detection provides tokenized access and community dental-check meetups.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/fresh-smile-dental/whole-food.png',
        imageAlt: 'Pug beside coconut oil, carrots, and fish with greens',
        imageSide: 'left',
        body: [
          {
            p: 'Coconut oil pulling, raw meaty bones or chews, fruits and vegetables, yogurt or kefir, parsley and mint in meals.',
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/fresh-smile-dental/lifestyle.png',
        imageAlt: 'Calm pug resting outdoors by a lake',
        imageSide: 'right',
        body: [
          {
            p: 'Daily chew time during lake outings and group dental meetups.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          { p: 'Canine Whole Body Support (multisystem including oral health).' },
          {
            p: 'Canine Whole Body Support provides general multisystem support for daily maintenance of all dogs’ body systems.',
          },
          {
            ul: ['Provides general multisystem support for daily maintenance of all body systems'],
          },
          {
            p: 'Supplements like Canine Whole Body Support, made from whole foods, organ and tissue extracts, botanicals, and other ingredients, can fill nutrition gaps. Indications for Use:',
          },
          {
            ul: [
              'Daily supplement for any patient',
              'Growing animals',
              'Performance/working animals',
              'Senior animals',
            ],
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/fresh-smile-dental/personal-insight.png',
        imageAlt: 'Golden retriever smiling with healthy teeth',
        imageSide: 'left',
        body: [
          {
            p: 'Dental health affects everything in our bodies and is a foundation to overall body health. Infections in the mouth can cause systemic problems elsewhere, so it is important to look at your dog’s mouth, including tongue, gums and teeth.',
          },
          {
            p: 'Dental issues can cause a host of other diseases affecting our four legged friends and for this reason, I provide our family dogs with oral and whole body health supplementation and chews to reduce plaque buildup.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'heart-strong': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Acquire the Dynamic NFT or MPT on XRPL for full protocol access. Upload a photo; ViT AI evaluates heart and cardiovascular indicators.',
      'Unlock heart-healthy whole-food diet, moderate lake-walk lifestyle routines, and natural cardiovascular-support strategies.',
      'Every access supports no-kill shelter senior-dog heart programs and veteran lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/heart-strong/grant.png',
        imageAlt: 'Pug with ViT heart and cardiovascular monitoring overlay',
        imageSide: 'right',
        body: [
          { p: 'Longevity tokenization for working dogs.' },
          {
            p: 'ViT stamina monitoring powers patriotic DAO impact and veterans and healthy dog programs.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/heart-strong/whole-food.png',
        imageAlt: 'Pug beside bowls of blueberries and leafy greens',
        imageSide: 'left',
        body: [
          {
            p: 'Mackerel or sardines (omega-3s), CoQ10-rich organ meats in small amounts, leafy greens.',
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/heart-strong/lifestyle.png',
        imageAlt: 'Senior pug portrait outdoors',
        imageSide: 'right',
        body: [
          {
            p: 'Moderate lakeside cardio like fetch and swimming.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          { p: 'Canine Cardiac Support.' },
          {
            p: 'Canine Cardiac Support is a heart supplement for dogs that provides selenium to support pathways involved in cardiac function.',
          },
          {
            ul: [
              'The cardiovascular system is a complex, coordinated group of organs and tissues with the heart at the center.',
            ],
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/heart-strong/personal-insight.png',
        imageAlt: 'Australian shepherd portrait',
        imageSide: 'left',
        body: [
          {
            p: 'My neighbor’s dog Jax went from a high-wired active dog chasing frisbees every day to laying around 90% of the time within one week.',
          },
          {
            p: 'After a visit to the vet, he was diagnosed with a murmur and congestive heart failure. He began supporting Jax with whole food cardiovascular support, and keeping him to a slow walk on their outings which helped get his energy and activity levels back to normal.',
          },
          {
            p: 'Strong hearts mean more oxygen to every cell in the body. Jax went on to live to 14 incredible years old illustrating “an ounce of prevention is worth a pound of cure”.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'patriot-immune': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Purchase the Dynamic NFT or MPT on XRPL to activate this educational immune protocol.',
      'Upload a photo; ViT AI assesses overall vitality and immune markers. Receive immune-boosting whole-food diet, moderate exercise lifestyle guidance, and natural vitality recommendations.',
      'Every access funds no-kill shelter wellness programs and patriotic veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/patriot-immune/grant.png',
        imageAlt: 'Pug with ViT immune system and vitality monitoring overlay',
        imageSide: 'right',
        body: [
          { p: 'Broad resilience RWA for veteran and shelter dogs.' },
          { p: 'ViT holistic pattern recognition.' },
          {
            p: 'Veterans and dog parents community meetups drives XRPL adoption and real-world impact.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/patriot-immune/whole-food.png',
        imageAlt: 'Pug beside mushroom broth, berries, and medicinal mushrooms',
        imageSide: 'left',
        body: [
          {
            p: 'Medicinal mushroom broth (reishi and turkey tail powder), echinacea greens, mixed berries.',
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/patriot-immune/lifestyle.png',
        imageAlt: 'Pug portrait outdoors',
        imageSide: 'right',
        body: [
          {
            p: 'Outdoor walks, shelter volunteer days, patriotic community meetups.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          {
            p: 'Mushroom Complex and Canine Whole Body Support (immune and multisystem whole-food blend).',
          },
          {
            p: 'Mushroom Complex, a powdered mushroom supplement for dogs and cats, is a potent whole-food source of beta glucans and provides ingredients clinically supported to promote immune health.',
          },
          {
            ul: [
              'Clinically supported ingredients to promote immune health in dogs.',
              'Provides targeted immune support for the canine adaptive immune systems.',
              'Promotes normal cell growth and healthy cellular processes in dogs.',
              'Supports the canine gut-immune axis via microbiome modulation to promote a healthy inflammatory response.',
            ],
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/patriot-immune/personal-insight.png',
        imageAlt: 'Buddy the pug resting on a grey blanket',
        imageSide: 'left',
        body: [
          {
            p: 'This protocol is the heart of Freedom Paws because of my own pug Buddy’s journey. At 12 he was diagnosed with mast cell cancer — growing to a 2-inch tumor plus multiple smaller ones. The vet said it was inoperable and gave him 4–6 months to live.',
          },
          {
            p: 'I knew we could do better. With whole-food nutrition, targeted supplements, daily walks, and the love of our family and community,',
          },
          {
            p: 'Buddy not only beat the odds but thrived and lived to 14 following me everywhere, playing, sleeping soundly and living with pure joy every single day. His incredible journey showed me that resilience of a dog’s potential, community, and natural support can create miracles — and that’s exactly why every MPT sale helps fund no-kill shelters, natural food sources and veteran dog programs. Buddy’s story inspires everything we do!',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },

  'clear-vision': {
    subtitle: 'Detailed protocol overview.',
    introHeading: 'How Protocol Works;',
    intro: [
      'Acquire the Dynamic NFT or MPT on XRPL for lifetime educational access.',
      'Upload a photo; ViT AI detects early eye changes, clouding, and redness. Unlock antioxidant-rich whole-food diet, shaded lake-walk lifestyle routines, and natural vision-support strategies.',
      'Every access helps fund no-kill shelter vision programs and veteran-dog lake meetups. Educational wellness information only — not veterinary medical advice.',
    ],
    sections: [
      {
        heading: 'Grant:',
        image: '/images/protocols/details/clear-vision/grant.png',
        imageAlt: 'Pug with ViT eye change detection overlay',
        imageSide: 'right',
        body: [
          { p: 'Tokenized ocular RWA support for senior, veteran, and service dogs.' },
          { p: 'ViT detects early eye changes (clouding, redness).' },
          {
            p: 'Funds no-kill shelter vision programs plus lakeside veterans dog meetups for prevention.',
          },
        ],
      },
      {
        heading: 'Whole-Food Diet',
        image: '/images/protocols/details/clear-vision/whole-food.png',
        imageAlt: 'Pug beside bowls of blueberries, carrots, and leafy greens',
        imageSide: 'left',
        body: [
          {
            p: 'Blueberries (1/4 cup per 20 lbs daily for antioxidants), grated carrots (1–2 tbsp per 20 lbs for beta-carotene), spinach or kale (lutein source).',
          },
        ],
      },
      {
        heading: 'Lifestyle',
        image: '/images/protocols/details/clear-vision/lifestyle.png',
        imageAlt: 'Pug in shaded outdoor light',
        imageSide: 'right',
        body: [
          {
            p: 'Shaded lake walks to reduce UV exposure, gentle eye massage routines, community veteran-dog vision-check meetups.',
          },
        ],
      },
      {
        heading: 'Recommended Supplement',
        body: [
          {
            p: 'Eyeplex (whole-food ocular support with porcine eye PMG extract, organic carrot, shiitake/reishi, and buckwheat).',
          },
          {
            p: 'Eyeplex works through nutrition, not medication. It supports the tissues, glands, and immune responses involved in normal eye function.',
          },
          {
            ul: [
              'Normal eye structure and circulation',
              'Antioxidant protection for delicate eye tissues',
              'Nutritional support for immune-related eye conditions',
              'Support for tear production and surface health',
              'Support for stress response through adrenal nutrition',
            ],
          },
          {
            p: 'This type of support is especially helpful for dogs with chronic eye stress, breed-related risks, or immune-mediated eye conditions.',
          },
        ],
      },
      {
        heading: 'My Personal Insight',
        image: '/images/protocols/details/clear-vision/personal-insight.png',
        imageAlt: 'Close-up of a healthy dog eye',
        imageSide: 'left',
        body: [
          {
            p: 'I’ve seen how early eye changes could quietly steal a dog’s joy. With proper support and regular check ups, sparkling eyes can stay clear and engaged until the very end thanks to antioxidant-rich whole foods and the simple pleasure of shaded play & walks.',
          },
          {
            p: 'Our eyes as well as our dog’s are the window from which we see the world to build memories, and those memories for me drive this protocol and our commitment to helping shelter and veterans dogs see the world clearly too.',
          },
        ],
      },
    ],
    access: {
      heading: 'How to Access This Protocol',
      steps: [
        'Connect your XRPL wallet (Xaman wallet recommended).',
        'Go to the Token Shop and purchase the Multi Purpose Token (MPT) for this protocol with XRP or RLUSD.',
        'Receive immediate educational access plus your dog’s own Dynamic NFT health record.',
      ],
      notes: [
        'You can update the NFT later with new photos or notes.',
        'Every purchase supports no-kill shelters, veterans, and lake initiatives through our Patriotic Educational canine outreach programs.',
      ],
      buyLabel: 'Buy MPT',
      buyHref: '#',
    },
    disclaimer: DISCLAIMER,
  },
};
