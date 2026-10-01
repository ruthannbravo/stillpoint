// Content for Stillpoint. Chakras follow the modern seven-chakra system;
// meditation histories are summarized from widely documented sources.

const CHAKRAS = [
  {
    id: "crown",
    name: "Crown",
    sanskrit: "Sahasrara",
    meaning: "thousand-petaled",
    color: "#9b7fd4",
    location: "Top of the head",
    element: "Thought / consciousness",
    mantra: "Silence (or OM)",
    y: 26,
    theme: "Connection, meaning, a sense of something larger than yourself",
    about:
      "The crown is pictured as a thousand-petaled lotus just above the head. In yogic thought it is where individual awareness meets something wider: a sense of meaning, wonder, and belonging to the whole. It is less about doing and more about being.",
    blocked: [
      "Feeling disconnected, lost, or like life has no point",
      "Cynicism or closed-mindedness",
      "Living on autopilot, going through the motions",
      "Spiritual emptiness or loneliness that runs deeper than people",
      "Over-intellectualizing everything",
    ],
    balanced: [
      "A quiet sense of trust and perspective",
      "Openness to awe and new ideas",
      "Feeling part of something larger",
    ],
    practices: [
      "Sit in complete silence for a few minutes each day, with no input",
      "Spend time under open sky: stargazing, sunrise, wide horizons",
      "Keep a short journal of what felt meaningful today",
      "Reduce noise: fewer feeds, more stillness",
    ],
    meditations: ["zazen", "mantra", "yoga-nidra"],
  },
  {
    id: "third-eye",
    name: "Third Eye",
    sanskrit: "Ajna",
    meaning: "to perceive, to command",
    color: "#5b6cc4",
    location: "Between the eyebrows",
    element: "Light",
    mantra: "OM",
    y: 58,
    theme: "Clarity, intuition, insight",
    about:
      "Ajna sits between the brows and governs perception: seeing clearly, both outwardly and inwardly. It is linked with intuition, imagination, and the ability to step back from the stream of thought and observe it.",
    blocked: [
      "Overthinking and racing thoughts",
      "Confusion, brain fog, or indecision",
      "Distrusting your own intuition",
      "Difficulty focusing or seeing the bigger picture",
      "Tension headaches around the brow",
    ],
    balanced: [
      "Clear thinking and good judgement",
      "Trusting your gut",
      "Vivid imagination that serves you",
    ],
    practices: [
      "Candle gazing (trataka) for a few minutes before bed",
      "Write down recurring thoughts to get them out of your head",
      "Reduce screen time in the last hour of the day",
      "Pay attention to dreams and first impressions",
    ],
    meditations: ["trataka", "vipassana", "visualization", "zazen"],
  },
  {
    id: "throat",
    name: "Throat",
    sanskrit: "Vishuddha",
    meaning: "especially pure",
    color: "#4a9fc9",
    location: "Throat",
    element: "Ether / space",
    mantra: "HAM",
    y: 100,
    theme: "Expression, honesty, being heard",
    about:
      "Vishuddha governs communication: speaking your truth, listening well, and expressing what is inside you. It is the bridge between the heart's feelings and the mind's words.",
    blocked: [
      "Struggling to speak up or say no",
      "Fear of being judged when you share",
      "People-pleasing or hiding your real opinions",
      "Talking over others, or oversharing",
      "A tight jaw, sore throat, or lump-in-the-throat feeling",
    ],
    balanced: [
      "Saying what you mean, kindly",
      "Listening without waiting to talk",
      "Creative self-expression",
    ],
    practices: [
      "Chant or hum for a few minutes; feel the vibration in your throat",
      "Sing in the car or shower, loudly and badly",
      "Practice one small honest 'no' this week",
      "Journal what you wish you'd said",
    ],
    meditations: ["nada", "mantra", "chakra"],
  },
  {
    id: "heart",
    name: "Heart",
    sanskrit: "Anahata",
    meaning: "unstruck",
    color: "#5bb37f",
    location: "Center of the chest",
    element: "Air",
    mantra: "YAM",
    y: 148,
    theme: "Love, compassion, forgiveness",
    about:
      "Anahata sits at the center of the seven, linking the lower, earthly chakras with the upper, spiritual ones. It is the home of love: for others and for yourself, along with grief, forgiveness, and compassion.",
    blocked: [
      "Grief, heartbreak, or loneliness that won't lift",
      "Holding grudges or struggling to forgive",
      "Jealousy or difficulty trusting",
      "Being hard on yourself",
      "Closing off to protect yourself, or giving until you are empty",
    ],
    balanced: [
      "Giving and receiving love freely",
      "Empathy with healthy boundaries",
      "Self-compassion",
    ],
    practices: [
      "Place a hand on your chest and breathe slowly when hurting",
      "Write a letter of forgiveness (you don't have to send it)",
      "Do one small, anonymous kindness",
      "Open the chest: gentle backbends, shoulders back, deep breaths",
    ],
    meditations: ["metta", "tonglen", "walking"],
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus",
    sanskrit: "Manipura",
    meaning: "city of jewels",
    color: "#e2b93b",
    location: "Upper abdomen",
    element: "Fire",
    mantra: "RAM",
    y: 192,
    theme: "Confidence, willpower, personal power",
    about:
      "Manipura is the fire in the belly: drive, confidence, and the will to act. It is linked with self-esteem and the sense that you can shape your own life.",
    blocked: [
      "Low self-esteem or feeling powerless",
      "Procrastination and lack of motivation",
      "Imposter syndrome",
      "Needing to control everything, or quick to anger",
      "A knotted, tense, or unsettled stomach",
    ],
    balanced: [
      "Quiet confidence",
      "Following through on what you start",
      "Healthy boundaries and decisiveness",
    ],
    practices: [
      "Set one small goal a day and finish it",
      "Energizing breath (kapalabhati) in the morning",
      "Core-strengthening movement",
      "Spend a few minutes in the sun",
    ],
    meditations: ["pranayama", "visualization", "mantra", "qigong"],
  },
  {
    id: "sacral",
    name: "Sacral",
    sanskrit: "Svadhisthana",
    meaning: "one's own abode",
    color: "#e88a4a",
    location: "Lower abdomen, below the navel",
    element: "Water",
    mantra: "VAM",
    y: 230,
    theme: "Creativity, pleasure, emotional flow",
    about:
      "Svadhisthana is associated with water: flow, feeling, creativity, and pleasure. It governs how you experience emotions and enjoyment, and your capacity to create.",
    blocked: [
      "Creative block or feeling uninspired",
      "Emotional numbness, or emotions that swing wildly",
      "Guilt or shame around pleasure",
      "Difficulty with intimacy",
      "Rigid routines that drain the joy out of life",
    ],
    balanced: [
      "Playfulness and creativity",
      "Feeling emotions without being swept away",
      "Enjoying life's pleasures without guilt",
    ],
    practices: [
      "Move your hips: dance, swim, or flowing yoga",
      "Make something with no goal: draw, cook, write",
      "Spend time near water",
      "Name your feelings out loud as they arise",
    ],
    meditations: ["qigong", "visualization", "nada", "chakra"],
  },
  {
    id: "root",
    name: "Root",
    sanskrit: "Muladhara",
    meaning: "root support",
    color: "#c94f4f",
    location: "Base of the spine",
    element: "Earth",
    mantra: "LAM",
    y: 266,
    theme: "Safety, stability, grounding",
    about:
      "Muladhara is the foundation of the system. It concerns survival and security: feeling safe in your body, your home, your finances, and the world. When it is steady, everything above it has somewhere to stand.",
    blocked: [
      "Anxiety, fear, or a constant sense of threat",
      "Worry about money, work, or home",
      "Feeling ungrounded, scattered, or restless",
      "Trouble sleeping or settling",
      "Tension in the lower back, legs, or feet",
    ],
    balanced: [
      "Feeling safe and at home in your body",
      "Steady routines and energy",
      "Trust that your needs will be met",
    ],
    practices: [
      "Walk barefoot on grass, sand, or earth",
      "Keep a simple, steady daily routine",
      "Strengthen the legs: squats, standing poses, hiking",
      "Name 5 things you see, 4 you hear, 3 you can touch",
    ],
    meditations: ["walking", "body-scan", "qigong", "pranayama"],
  },
];

const MEDITATIONS = [
  {
    id: "vipassana",
    name: "Mindfulness",
    alt: "Vipassana · insight meditation",
    origin: "Theravada Buddhism, India",
    era: "c. 5th century BCE",
    tags: ["calm", "focus"],
    summary: "Observe thoughts, sensations, and breath without judging them.",
    history: [
      "Vipassana, meaning \"seeing things as they really are,\" is one of the oldest meditation practices in India and is traditionally said to have been taught by the Buddha about 2,500 years ago. It was preserved for centuries in the Theravada monasteries of Southeast Asia.",
      "In the 20th century, Burmese teachers such as Ledi Sayadaw and U Ba Khin began teaching it to laypeople. S.N. Goenka carried that lineage worldwide from 1969. In 1979, Jon Kabat-Zinn adapted its core ideas into the secular Mindfulness-Based Stress Reduction (MBSR) program, which is how most people in the West meet mindfulness today.",
    ],
    usedFor: ["Stress and anxiety", "Overthinking", "Emotional reactivity", "Chronic pain", "Focus"],
    steps: [
      "Sit comfortably with a straight but relaxed spine. Close your eyes or soften your gaze.",
      "Bring attention to your breath at the nostrils or belly. Don't control it; just notice it.",
      "When a thought, sound, or sensation pulls you away, quietly note it (\"thinking,\" \"hearing\") and return to the breath.",
      "Gradually widen your attention to whatever arises, watching each experience come and go.",
      "Close by noticing how you feel, without needing it to be different.",
    ],
    duration: "10–30 min",
    chakras: ["third-eye", "crown"],
  },
  {
    id: "metta",
    name: "Loving-Kindness",
    alt: "Metta bhavana",
    origin: "Buddhism, India",
    era: "c. 5th century BCE",
    tags: ["heart"],
    summary: "Send warm wishes to yourself and outward to others.",
    history: [
      "Metta is a Pali word for loving-kindness or goodwill. The practice comes from the Karaniya Metta Sutta, one of the early Buddhist discourses, and it is the first of the four \"divine abodes\" (brahmaviharas): loving-kindness, compassion, sympathetic joy, and equanimity.",
      "Traditionally it was taught as an antidote to fear and ill will. Today it is one of the most studied meditations in psychology, with research linking it to more positive emotion and less self-criticism.",
    ],
    usedFor: ["Self-criticism", "Anger and resentment", "Loneliness", "Grief", "Relationship strain"],
    steps: [
      "Sit comfortably and bring to mind an image of yourself.",
      "Silently repeat: \"May I be safe. May I be happy. May I be healthy. May I live with ease.\"",
      "Bring to mind someone you love, and offer them the same phrases.",
      "Then a neutral person (a cashier, a neighbor), then someone you find difficult.",
      "Finally, extend the wishes to all beings everywhere. Rest in the feeling.",
    ],
    duration: "10–20 min",
    chakras: ["heart"],
  },
  {
    id: "body-scan",
    name: "Body Scan",
    alt: "Sweeping attention",
    origin: "Vipassana tradition, modernized in MBSR",
    era: "Ancient roots · formalized 1979",
    tags: ["calm", "sleep", "grounding"],
    summary: "Move attention slowly through the body, releasing tension.",
    history: [
      "The body scan grows out of the Burmese vipassana lineage of U Ba Khin and S.N. Goenka, where meditators \"sweep\" attention through the body to observe sensations with equanimity.",
      "Jon Kabat-Zinn made it the opening practice of MBSR at the University of Massachusetts Medical School, where it was used with patients living with chronic pain. It is now one of the most common practices for stress and sleep.",
    ],
    usedFor: ["Physical tension", "Insomnia", "Anxiety", "Chronic pain", "Feeling disconnected from the body"],
    steps: [
      "Lie down or sit back comfortably. Take three slow breaths.",
      "Bring attention to the toes of your left foot. Notice any sensation: warmth, tingling, pressure, nothing.",
      "Slowly move attention up through the foot, ankle, calf, knee, and thigh. Then do the right leg.",
      "Continue through the hips, belly, back, chest, hands, arms, shoulders, neck, and face.",
      "Where you find tension, breathe into it and let it soften on the exhale. End by feeling the whole body at once.",
    ],
    duration: "15–45 min",
    chakras: ["root", "crown"],
  },
  {
    id: "mantra",
    name: "Mantra Meditation",
    alt: "Japa · the root of Transcendental Meditation",
    origin: "Vedic tradition, India",
    era: "c. 1500 BCE onward",
    tags: ["calm", "focus"],
    summary: "Repeat a sound or phrase to settle the mind.",
    history: [
      "Mantras appear in the Vedas, among the oldest texts in the world. Japa, the repeated recitation of a mantra (often counted on a 108-bead mala), is found across Hinduism, Buddhism, Jainism, and Sikhism.",
      "In 1955 Maharishi Mahesh Yogi began teaching a form of mantra meditation that became Transcendental Meditation (TM). It spread globally in the 1960s, helped by the Beatles' 1968 visit to his ashram in Rishikesh. TM is taught by certified teachers; the general practice below is open to anyone.",
    ],
    usedFor: ["Stress", "Restless mind", "Low energy", "Building a daily habit", "Spiritual connection"],
    steps: [
      "Choose a mantra: a traditional one like \"Om\" or \"So Hum,\" or a simple word like \"peace.\"",
      "Sit comfortably and close your eyes. Take a few settling breaths.",
      "Begin repeating the mantra silently (or softly aloud), letting it find its own rhythm.",
      "When you notice you've drifted, gently return to the mantra with no frustration.",
      "After 15–20 minutes, stop repeating and sit quietly for a minute before opening your eyes.",
    ],
    duration: "15–20 min, twice daily",
    chakras: ["crown", "throat", "solar-plexus"],
  },
  {
    id: "zazen",
    name: "Zazen",
    alt: "Seated Zen · shikantaza",
    origin: "Chan / Zen Buddhism, China and Japan",
    era: "6th century China · 13th century Japan",
    tags: ["focus", "calm"],
    summary: "Just sit: upright, aware, and open, with no goal.",
    history: [
      "Zen began as Chan Buddhism in China around the 6th century, traditionally traced to the monk Bodhidharma. It emphasized direct experience through sitting meditation over study of scripture.",
      "In 1227 the Japanese monk Dōgen returned from China and wrote instructions for zazen, founding the Sōtō school. He taught shikantaza, \"just sitting\": not trying to achieve anything, simply being fully present.",
    ],
    usedFor: ["Mental clarity", "Discipline", "Existential questions", "Letting go of striving"],
    steps: [
      "Sit on a cushion facing a wall, legs crossed or kneeling, with the spine tall.",
      "Rest your hands in your lap: left on right, thumbs lightly touching to form an oval.",
      "Keep your eyes half open, gaze resting on the floor about a meter ahead.",
      "Breathe naturally. Count breaths from 1 to 10 if it helps, then begin again.",
      "Let thoughts come and go like clouds. Don't follow them, don't push them away. Just sit.",
    ],
    duration: "20–40 min",
    chakras: ["crown", "third-eye"],
  },
  {
    id: "pranayama",
    name: "Breathwork",
    alt: "Pranayama",
    origin: "Yogic tradition, India",
    era: "Described in the Yoga Sutras, c. 2nd century BCE–5th century CE",
    tags: ["calm", "energy", "grounding"],
    summary: "Shape the breath to shift your nervous system.",
    history: [
      "Pranayama, \"extension of the life force,\" is the fourth of the eight limbs of yoga in Patanjali's Yoga Sutras. Later texts such as the 15th-century Hatha Yoga Pradipika describe many techniques in detail, including alternate-nostril breathing and kapalabhati (\"skull-shining breath\").",
      "Modern variations include box breathing, used by military and first responders to stay calm under pressure, and 4-7-8 breathing, popularized by Dr. Andrew Weil.",
    ],
    usedFor: ["Panic and acute anxiety", "Low energy", "Anger", "Sleep", "Focus before a task"],
    steps: [
      "To calm down, use box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 4–6 rounds.",
      "To balance, use alternate-nostril breathing: close the right nostril, inhale left; close the left, exhale right; inhale right; switch and exhale left. Repeat 5–10 rounds.",
      "To energize, use kapalabhati: short, sharp exhales through the nose while the inhale happens passively. 20–30 pumps, then rest. (Skip if pregnant or you have heart or blood-pressure issues.)",
      "Finish by breathing naturally for a minute and noticing the change.",
    ],
    duration: "3–15 min",
    chakras: ["solar-plexus", "root", "throat"],
  },
  {
    id: "yoga-nidra",
    name: "Yoga Nidra",
    alt: "Yogic sleep",
    origin: "Tantric and yogic tradition, India",
    era: "Ancient roots · systematized 1960s",
    tags: ["sleep", "calm"],
    summary: "A guided state between waking and sleep for deep rest.",
    history: [
      "The idea of a conscious, sleep-like state appears in older yogic and tantric texts, but the practice known today was systematized in the 1960s by Swami Satyananda Saraswati of the Bihar School of Yoga.",
      "It became widely used in the West, including through Richard Miller's iRest program, which has been used with military veterans dealing with stress and trauma.",
    ],
    usedFor: ["Insomnia", "Burnout and exhaustion", "Stress", "Deep relaxation"],
    steps: [
      "Lie on your back with a blanket. Let your body be completely still.",
      "Set a sankalpa: a short, positive intention in the present tense (\"I am at peace\").",
      "Rotate awareness quickly through the body, part by part, as if following a guide's voice.",
      "Notice the breath, then pairs of opposites: heaviness and lightness, warmth and cool.",
      "Repeat your sankalpa, then slowly return: wiggle fingers and toes, roll to one side, and rise.",
    ],
    duration: "20–45 min",
    chakras: ["crown", "root"],
  },
  {
    id: "visualization",
    name: "Visualization",
    alt: "Guided imagery",
    origin: "Tibetan Buddhism; modern psychology",
    era: "Ancient · modern clinical use from the 1970s",
    tags: ["energy", "focus", "heart"],
    summary: "Use the imagination to shape how you feel.",
    history: [
      "Detailed visualization is central to Tibetan Buddhist practice, where meditators build up elaborate images of deities, light, and mandalas to cultivate qualities like compassion and wisdom.",
      "In modern times, guided imagery has been adopted in sports psychology, where athletes mentally rehearse performance, and in medicine, where it is used to ease anxiety and pain.",
    ],
    usedFor: ["Confidence", "Creative block", "Anxiety before an event", "Motivation", "Healing intentions"],
    steps: [
      "Sit or lie comfortably and take several slow breaths.",
      "Picture a place where you feel completely safe. Fill in details: colors, sounds, temperature, smells.",
      "Or picture a warm, glowing light entering with each breath and filling the area that feels heavy.",
      "If preparing for something, see yourself doing it calmly and well, step by step.",
      "Let the image fade, take a deep breath, and carry the feeling with you as you open your eyes.",
    ],
    duration: "10–20 min",
    chakras: ["third-eye", "solar-plexus", "sacral"],
  },
  {
    id: "walking",
    name: "Walking Meditation",
    alt: "Kinhin · cankama",
    origin: "Buddhism, across Asia",
    era: "c. 5th century BCE onward",
    tags: ["grounding", "calm"],
    summary: "Turn each step into an anchor for attention.",
    history: [
      "Walking meditation is as old as Buddhism itself; early texts describe monks practicing cankama, mindful walking back and forth along a path. In Zen it is called kinhin and is practiced between periods of seated zazen.",
      "Vietnamese Zen teacher Thich Nhat Hanh made it widely known in the West, teaching people to \"walk as if you are kissing the Earth with your feet.\"",
    ],
    usedFor: ["Restlessness", "Grounding", "When sitting still feels impossible", "Grief", "Anger"],
    steps: [
      "Find a quiet path 10–20 steps long, indoors or out.",
      "Stand still and feel your feet on the ground.",
      "Walk slowly. Notice the lift, the move, the placement of each foot.",
      "Coordinate with the breath if you like: one step per inhale, one per exhale.",
      "At the end of the path, pause, turn mindfully, and walk back.",
    ],
    duration: "10–30 min",
    chakras: ["root", "heart"],
  },
  {
    id: "trataka",
    name: "Candle Gazing",
    alt: "Trataka",
    origin: "Hatha yoga, India",
    era: "Described in the 15th-century Hatha Yoga Pradipika",
    tags: ["focus"],
    summary: "Fix your gaze on a flame to steady a scattered mind.",
    history: [
      "Trataka is listed in the Hatha Yoga Pradipika as one of the six shatkarmas, purification practices meant to prepare body and mind for deeper meditation. It was valued for strengthening concentration.",
      "Today it is used as a simple focus practice and a wind-down ritual before sleep.",
    ],
    usedFor: ["Overthinking", "Poor concentration", "Scattered attention", "Building intuition"],
    steps: [
      "Place a candle at eye level about an arm's length away in a dim, draft-free room.",
      "Sit comfortably and gaze at the flame without blinking for as long as is comfortable (start with 1 minute).",
      "When your eyes water or tire, close them and watch the afterimage of the flame in your mind's eye.",
      "When the afterimage fades, open your eyes and repeat 2–3 times.",
      "Avoid if you have epilepsy, glaucoma, or other eye conditions.",
    ],
    duration: "5–10 min",
    chakras: ["third-eye"],
  },
  {
    id: "nada",
    name: "Sound Meditation",
    alt: "Nada yoga · chanting",
    origin: "Yogic tradition, India",
    era: "Ancient · Nada yoga texts c. medieval period",
    tags: ["calm", "energy"],
    summary: "Use chanting, humming, or bells as the object of attention.",
    history: [
      "Nada yoga, the \"yoga of sound,\" holds that the universe is made of vibration. Practitioners chant, listen to external sounds, and eventually tune into subtle inner sounds.",
      "Chanting \"Om\" is one of the oldest sound practices, described in the Upanishads as the sound of the universe. Bells, gongs, and singing bowls are now widely used in sound meditation.",
    ],
    usedFor: ["Difficulty speaking up", "Racing mind", "Low mood", "Feeling stuck"],
    steps: [
      "Sit tall and take a deep breath into the belly.",
      "On the exhale, chant a long \"Ommm,\" feeling the \"O\" in your chest and the \"mmm\" vibrate in your lips and head.",
      "Or simply hum (bhramari, \"bee breath\"), feeling the vibration in your throat and face.",
      "Repeat for several minutes, then sit in silence and listen to the stillness that follows.",
    ],
    duration: "5–20 min",
    chakras: ["throat", "sacral", "third-eye"],
  },
  {
    id: "tonglen",
    name: "Tonglen",
    alt: "Giving and taking",
    origin: "Tibetan Buddhism",
    era: "Lojong teachings, c. 11th century",
    tags: ["heart"],
    summary: "Breathe in suffering, breathe out relief.",
    history: [
      "Tonglen comes from the Tibetan lojong (\"mind training\") teachings associated with the Indian master Atisha, who brought them to Tibet in the 11th century.",
      "American nun Pema Chödrön made it widely known in the West as a way to stay open in the face of pain instead of shutting down.",
    ],
    usedFor: ["Grief", "Caring for someone who is suffering", "Feeling overwhelmed by pain", "Building compassion"],
    steps: [
      "Rest for a moment in stillness.",
      "Breathe in a feeling of heaviness and heat; breathe out lightness and coolness. Do this a few times.",
      "Bring to mind someone who is suffering. Breathe in their pain as dark smoke; breathe out relief as bright light toward them.",
      "Widen it: breathe in for everyone who feels this way, breathe out ease for all of them.",
      "If it becomes too much, return to your own breath. You can always start with yourself.",
    ],
    duration: "10–20 min",
    chakras: ["heart"],
  },
  {
    id: "chakra",
    name: "Chakra Meditation",
    alt: "Energy center meditation",
    origin: "Tantric tradition, India; modern Western yoga",
    era: "Medieval tantra · modern form 20th century",
    tags: ["energy", "grounding"],
    summary: "Move through each energy center from root to crown.",
    history: [
      "Chakras (\"wheels\") appear in medieval Hindu and Buddhist tantric texts, which describe varying numbers of energy centers along the spine. The seven-chakra system most people know today draws on the 16th-century text Sat-Chakra-Nirupana.",
      "It reached the West largely through Sir John Woodroffe's 1919 book The Serpent Power. Later Western authors added the rainbow color scheme and the psychological associations used today.",
    ],
    usedFor: ["General balancing", "Body awareness", "Low energy", "Self-reflection"],
    steps: [
      "Sit tall and take a few grounding breaths.",
      "Bring attention to the base of the spine. Visualize a red glow and silently chant \"LAM.\" Stay for a few breaths.",
      "Move upward: orange at the lower belly (VAM), yellow at the stomach (RAM), green at the heart (YAM), blue at the throat (HAM), indigo between the brows (OM), violet at the crown (silence).",
      "Linger wherever something feels tight or dull, breathing light into it.",
      "Finish by sensing all seven glowing in a line, then rest.",
    ],
    duration: "15–25 min",
    chakras: ["root", "sacral", "solar-plexus", "heart", "throat", "third-eye", "crown"],
  },
  {
    id: "qigong",
    name: "Qigong",
    alt: "Moving meditation · standing post",
    origin: "Traditional Chinese practice",
    era: "Roots over 2,000 years old",
    tags: ["energy", "grounding"],
    summary: "Slow movement and breath to circulate energy (qi).",
    history: [
      "Qigong (\"cultivating life energy\") draws on Daoist, Buddhist, and Chinese medical traditions stretching back more than two thousand years. A silk chart of breathing and movement exercises found in a tomb at Mawangdui dates to the 2nd century BCE.",
      "The name qigong was standardized in China in the mid-20th century. Today millions practice it, often in parks at dawn, for health and calm.",
    ],
    usedFor: ["Low energy", "Stiffness", "Grounding", "Feeling emotionally stuck", "Gentle movement"],
    steps: [
      "Stand with feet shoulder-width apart, knees soft, tailbone dropped.",
      "Raise your arms slowly in front of you as you inhale, as if lifting a ball of air. Lower them as you exhale.",
      "Repeat 9 times, moving as slowly as you can.",
      "Then hold \"standing post\": arms rounded at chest height as if hugging a tree. Breathe into the lower belly (the dantian).",
      "Finish with palms resting on your lower belly for a few breaths.",
    ],
    duration: "10–20 min",
    chakras: ["sacral", "root", "solar-plexus"],
  },
];

// Maps what people describe to chakras and meditations. Terms are matched
// at word starts, so "anxi" catches anxious/anxiety.
const CONCERNS = [
  {
    label: "anxiety",
    terms: ["anxi", "worr", "nervous", "tense", "jittery", "fearful", "terrified", "apprehens", "uneasy", "panic", "on edge", "scared", "afraid", "fear", "uneasy", "dread"],
    chakras: ["root", "solar-plexus"],
    meditations: ["pranayama", "body-scan", "walking"],
  },
  {
    label: "overthinking",
    terms: ["overthink", "racing", "ruminat", "can't stop thinking", "cant stop thinking", "spiral", "loop", "mind won't", "busy mind", "thoughts"],
    chakras: ["third-eye"],
    meditations: ["vipassana", "trataka", "mantra"],
  },
  {
    label: "stress & overwhelm",
    terms: ["stress", "overwhelm", "pressure", "too much", "burn", "drained", "swamped", "deadline", "chaos", "frazzled"],
    chakras: ["root", "crown"],
    meditations: ["body-scan", "pranayama", "vipassana"],
  },
  {
    label: "sleep & exhaustion",
    terms: ["sleep", "insomnia", "awake at night", "tired", "exhaust", "fatigue", "can't rest", "wired"],
    chakras: ["root", "crown"],
    meditations: ["yoga-nidra", "body-scan", "pranayama"],
  },
  {
    label: "grief & sadness",
    terms: ["sad", "grief", "griev", "unhappy", "miserable", "hurt", "broken", "tearful", "despair", "gloomy", "mourn", "heavy heart", "blue", "loss", "lost someone", "died", "death", "cry", "depress", "down", "low mood", "hopeless", "empty"],
    chakras: ["heart", "crown"],
    meditations: ["metta", "tonglen", "walking"],
  },
  {
    label: "heartbreak & loneliness",
    terms: ["heartbr", "breakup", "break up", "abandon", "unloved", "unwanted", "left out", "nobody cares", "no one cares", "no friends", "broke up", "lonely", "alone", "isolat", "rejected", "miss him", "miss her", "miss them", "divorce"],
    chakras: ["heart"],
    meditations: ["metta", "tonglen"],
  },
  {
    label: "anger & resentment",
    terms: ["angry", "anger", "rage", "hate", "hatred", "hating", "bitter", "pissed", "fed up", "can't stand", "cant stand", "revenge", "hostile", "furious", "frustrat", "irritat", "resent", "grudge", "annoyed", "snap"],
    chakras: ["solar-plexus", "heart"],
    meditations: ["pranayama", "metta", "walking"],
  },
  {
    label: "trust & forgiveness",
    terms: ["forgiv", "trust", "betray", "jealous", "envy", "hurt me", "closed off", "guarded"],
    chakras: ["heart"],
    meditations: ["metta", "tonglen"],
  },
  {
    label: "self-criticism",
    terms: ["hate myself", "not good enough", "disgust", "embarrass", "regret", "stupid", "ugly", "useless", "pathetic", "self critic", "self-critic", "hard on myself", "ashamed", "shame", "worthless", "failure", "guilt"],
    chakras: ["heart", "solar-plexus"],
    meditations: ["metta", "visualization"],
  },
  {
    label: "confidence & motivation",
    terms: ["confiden", "insecur", "self esteem", "self-esteem", "imposter", "impostor", "powerless", "unmotivat", "motivat", "procrastinat", "lazy", "stuck", "weak", "doubt"],
    chakras: ["solar-plexus"],
    meditations: ["visualization", "pranayama", "mantra"],
  },
  {
    label: "control",
    terms: ["control", "perfection", "micromanag", "rigid"],
    chakras: ["solar-plexus"],
    meditations: ["zazen", "vipassana"],
  },
  {
    label: "creativity & pleasure",
    terms: ["creativ", "uninspired", "inspir", "bored", "numb", "joy", "pleasure", "intima", "libido", "sex", "passion", "playful", "flat"],
    chakras: ["sacral"],
    meditations: ["qigong", "visualization", "nada"],
  },
  {
    label: "emotional swings",
    terms: ["mood swing", "emotional", "overreact", "moody", "sensitive", "volatile"],
    chakras: ["sacral", "heart"],
    meditations: ["vipassana", "qigong"],
  },
  {
    label: "speaking up",
    terms: ["speak up", "speak my", "say no", "voice", "express", "communicat", "unheard", "not heard", "shy", "people pleas", "confront", "judged", "tongue", "argument", "honest"],
    chakras: ["throat"],
    meditations: ["nada", "mantra"],
  },
  {
    label: "clarity & focus",
    terms: ["focus", "distract", "concentrat", "confus", "foggy", "fog", "indecis", "decision", "decide", "scattered", "unclear", "intuition", "adhd"],
    chakras: ["third-eye"],
    meditations: ["trataka", "zazen", "vipassana"],
  },
  {
    label: "meaning & purpose",
    terms: ["purpose", "meaning", "pointless", "disconnect", "spiritual", "existential", "lost", "direction", "autopilot", "why am i"],
    chakras: ["crown"],
    meditations: ["zazen", "mantra", "yoga-nidra"],
  },
  {
    label: "safety & stability",
    terms: ["money", "financ", "job", "rent", "bills", "unsafe", "unstable", "insecure", "moving", "home", "survival", "ungrounded", "restless", "fidget", "can't sit"],
    chakras: ["root"],
    meditations: ["walking", "qigong", "body-scan"],
  },
  {
    label: "body tension",
    terms: ["tense", "tension", "tight", "pain", "ache", "headache", "jaw", "shoulders", "stiff", "stomach", "back hurts"],
    chakras: ["root", "solar-plexus"],
    meditations: ["body-scan", "qigong"],
  },
  {
    label: "low energy",
    terms: ["energy", "sluggish", "lethargic", "heavy", "unmotivated", "blah"],
    chakras: ["solar-plexus", "sacral"],
    meditations: ["pranayama", "qigong", "chakra"],
  },
];

const CRISIS_TERMS = [
  "suicid", "kill myself", "end my life", "end it all", "self harm", "self-harm",
  "hurt myself", "cutting myself", "want to die", "don't want to live", "dont want to live",
  "no reason to live", "better off dead",
];

const PROMPTS = [
  "I can't stop overthinking at night",
  "I feel heartbroken and alone",
  "I'm exhausted and burnt out",
  "I struggle to speak up for myself",
  "I feel stuck and uninspired",
];

// Hand-picked YouTube videos for each meditation, chosen October 2026 by
// popularity and fit. Each entry: [title, video id, channel, length, views].
const MEDIA = {
  "vipassana": {
    videos: [
      ["10-Minute Mindfulness Meditation", "ZToicYcHIOU", "Calm", "10 min", "34M"],
      ["20-Minute Mindfulness Meditation for Being Present", "-2zdUXve6fQ", "The Mindful Movement", "21 min", "9.6M"],
      ["20-Minute Guided Meditation with Jon Kabat-Zinn", "1H2Cgc60UlU", "No Nonsense Meditation", "20 min", "1.5M"],
    ],
  },
  "metta": {
    videos: [
      ["Guided Loving-Kindness Meditation", "sDi40FQcaIU", "Buddhism In English", "23 min", "2.3M"],
      ["Loving-Kindness for Mindfulness & Compassion", "-d_AA9H4z9U", "Josh Wise · WiseMindBody", "14 min", "1.4M"],
      ["10-Minute Loving-Kindness with Sharon Salzberg", "FyKKvCO_vSA", "Lion’s Roar", "15 min", "60K"],
    ],
  },
  "body-scan": {
    videos: [
      ["Body Scan Meditation with Jon Kabat-Zinn", "u4gZgnCy5ew", "People in Pain Network", "45 min", "4.6M"],
      ["Compassionate Body Scan", "OS_iqfGjL78", "Mount Sinai Health System", "21 min", "2M"],
      ["The Body Scan for Beginners", "kH-OQn5Ui8g", "Sharp HealthCare", "8 min", "206K"],
    ],
  },
  "mantra": {
    videos: [
      ["5-Minute Mantra Meditation for Beginners", "vbVh43mTHF4", "Yoga with Kassandra", "8 min", "261K"],
      ["So Hum Mantra Guided Meditation", "UCE2PxrSmSU", "Meditative Mind", "30 min", "933K"],
      ["Guided Mantra Meditation", "pMCO7KLif7s", "Hands-On Meditation", "22 min", "338K"],
    ],
  },
  "zazen": {
    videos: [
      ["Beginner’s Introduction to Zazen", "dDJ_wbjBL6c", "Hazy Moon Zen Center", "5 min", "311K"],
      ["25-Minute Zazen Meditation", "4JudZVYYJ40", "Christoph Magnussen", "34 min", "395K"],
      ["How to Sit Zazen", "5oDxR8c5e7E", "The Zen Gateway", "7 min", "34K"],
    ],
  },
  "pranayama": {
    videos: [
      ["4-7-8 Breathing with Dr. Andrew Weil", "YRPh_GaiL8s", "Andrew Weil, M.D.", "6 min", "4.9M"],
      ["Box Breathing Exercise", "FJJazKtH_9I", "Take a Deep Breath", "6 min", "2.5M"],
      ["Alternate-Nostril Breathing", "8VwufJrUhic", "Yoga With Adriene", "11 min", "1.5M"],
    ],
  },
  "yoga-nidra": {
    videos: [
      ["20-Minute Yoga Nidra", "7H0FKzeuVVs", "Lizzy Hill", "20 min", "16M"],
      ["30-Minute Yoga Nidra for Deep Rest", "8mM5Oks8yZc", "Ally Boothroyd · Sarovara Yoga", "32 min", "7.7M"],
      ["10-Minute Yoga Nidra", "_noquwycq78", "Ally Boothroyd · Sarovara Yoga", "11 min", "4.1M"],
    ],
  },
  "visualization": {
    videos: [
      ["10-Minute Manifestation Visualisation", "NVPrxcR_RZI", "Manifest by Jess", "11 min", "13M"],
      ["10-Minute Guided Imagery Meditation", "t1rRo6cgM_E", "City of Hope", "11 min", "2.5M"],
      ["Guided Imagery: A Walk Through the Forest", "6am3OS-Ejzk", "Mindfully", "12 min", "128K"],
    ],
  },
  "walking": {
    videos: [
      ["Mindful Walking Meditation", "aCwEwz1xU2M", "Declutter The Mind", "20 min", "219K"],
      ["10-Minute Guided Walking Meditation", "ShG6kISrHoU", "Melanie Whitney", "10 min", "104K"],
      ["Thich Nhat Hanh on Walking Meditation", "90Pzn6NK4VQ", "Plum Village App", "5 min", "81K"],
    ],
  },
  "trataka": {
    videos: [
      ["Trataka for Focus & Clear Vision", "ssCk4aQhtxg", "Satvic Yoga", "10 min", "1.4M"],
      ["10-Minute Guided Candle Gazing", "yp58DGsNUWE", "Bharti Yoga", "9 min", "133K"],
      ["5-Minute Candle Gazing Meditation", "4eHsIhb0vZQ", "Peace of Mind", "5 min", "93K"],
    ],
  },
  "nada": {
    videos: [
      ["10-Minute Crystal Singing Bowl Meditation", "unCya_-8ECs", "Jess Yoga", "10 min", "4.5M"],
      ["Bee Breath (Bhramari)", "jHAa1B0XctU", "Yoga With Adriene", "11 min", "390K"],
      ["Guided Om Healing Meditation", "ZMmhNJl3aak", "Jason Stephenson", "14 min", "285K"],
    ],
  },
  "tonglen": {
    videos: [
      ["Pema Chödrön: Tonglen", "QwqlurCvXuM", "Omega Institute", "5 min", "325K"],
      ["Tonglen Meditation with Pema Chödrön", "-x95ltQP8qQ", "Sounds True", "12 min", "228K"],
      ["Guided Tonglen Practice with Pema Chödrön", "SAV1RCnuAaE", "Belfast Buddhist", "11 min", "154K"],
    ],
  },
  "chakra": {
    videos: [
      ["7 Chakra Cleansing with Seed Mantras", "NmAHY_tg9Es", "Meditative Mind", "22 min", "22M"],
      ["Beginner’s Guided Chakra Meditation for Sleep", "y8LIbeKQ60U", "Jason Stephenson", "29 min", "21M"],
      ["15-Minute Chakra Balance Meditation", "I6jP5oLdKpY", "Great Meditation", "16 min", "2.7M"],
    ],
  },
  "qigong": {
    videos: [
      ["Daily Qigong Routine", "Y88zYo0YlOo", "Qigong For Vitality", "10 min", "3.1M"],
      ["Beginner Qigong: Feel Great in 10 Minutes", "onA4pogScVg", "QiYoga With LuChin", "13 min", "1.7M"],
      ["7-Minute Beginner Qigong", "jMuHgj3FF_k", "Qigong For Vitality", "8 min", "1.1M"],
    ],
  },
};

// Historical images (Wikimedia Commons) and key dates for each practice.
const HISTORY = {
  "vipassana": {
    "images": [
      {
        "src": "assets/history/Ledi_Sayadaw_portrait.jpg",
        "focus": "50% 18%",
        "page": "https://commons.wikimedia.org/wiki/File:Ledi_Sayadaw_portrait.jpg",
        "caption": "Ledi Sayadaw (1846–1923), the Burmese monk who first taught insight meditation widely to laypeople",
        "credit": "Unknown artist · Public domain"
      },
      {
        "src": "assets/history/Mahasi_Sayadaw.jpg",
        "focus": "50% 20%",
        "page": "https://commons.wikimedia.org/wiki/File:Mahasi_Sayadaw.jpg",
        "caption": "Mahasi Sayadaw (1904–1982), whose 'noting' method spread from Yangon around the world",
        "credit": "Unknown artist · Public domain"
      }
    ],
    "milestones": [
      [
        "c. 500 BCE",
        "The Buddha teaches the Satipaṭṭhāna Sutta, the founding discourse on the four foundations of mindfulness."
      ],
      [
        "c. 29 BCE",
        "The Pali Canon, including its meditation teachings, is written down on palm leaves in Sri Lanka."
      ],
      [
        "5th c. CE",
        "Buddhaghosa writes the Visuddhimagga, a detailed manual of meditation."
      ],
      [
        "Late 1800s",
        "Ledi Sayadaw begins teaching insight meditation to laypeople in Burma."
      ],
      [
        "1950s",
        "Mahasi Sayadaw's noting method spreads from Yangon to students worldwide."
      ],
      [
        "1969",
        "S.N. Goenka begins teaching ten-day vipassana courses in India."
      ],
      [
        "1979",
        "Jon Kabat-Zinn founds Mindfulness-Based Stress Reduction at UMass Medical School."
      ]
    ]
  },
  "metta": {
    "images": [
      {
        "src": "assets/history/Gandhara_Buddha_-tnm.jpeg",
        "focus": "50% 22%",
        "page": "https://commons.wikimedia.org/wiki/File:Gandhara_Buddha_(tnm).jpeg",
        "caption": "Standing Buddha, Gandhara, 1st–2nd century CE. Tokyo National Museum",
        "credit": "World Imaging · Public domain"
      },
      {
        "src": "assets/history/Seated_Buddha-_Gandhara-_Pakistan-_Kushan_dynasty-_100s-200s_AD-_schist_-_Tokyo_.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Seated_Buddha,_Gandhara,_Pakistan,_Kushan_dynasty,_100s-200s_AD,_schist_-_Tokyo_National_Museum_-_Tokyo,_Japan_-_DSC08664.jpg",
        "caption": "Seated Buddha in meditation, Gandhara, Kushan dynasty, 2nd–3rd century CE",
        "credit": "Daderot · Public domain"
      }
    ],
    "milestones": [
      [
        "c. 500 BCE",
        "The Karaniya Metta Sutta is preserved in the early Buddhist canon."
      ],
      [
        "5th c. CE",
        "The Visuddhimagga sets the classic order: self, a friend, a neutral person, a difficult person."
      ],
      [
        "1995",
        "Sharon Salzberg's book Lovingkindness brings the practice to Western readers."
      ],
      [
        "2008",
        "A study led by Barbara Fredrickson links loving-kindness practice to lasting gains in positive emotion."
      ]
    ]
  },
  "body-scan": {
    "images": [
      {
        "src": "assets/history/Global_Vipassana_Pagoda-_Mumbai-_India.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Global_Vipassana_Pagoda,_Mumbai,_India.jpg",
        "caption": "Global Vipassana Pagoda near Mumbai, opened in 2009 by the U Ba Khin–Goenka lineage",
        "credit": "Editorq35 · CC BY-SA 4.0"
      },
      {
        "src": "assets/history/Buddha_in_Dhyana-_Wellcome_L0027858_-cropped.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Buddha_in_Dhyana,_Wellcome_L0027858_(cropped).jpg",
        "caption": "The Buddha in dhyana (meditative absorption). Wellcome Collection",
        "credit": "Wikimedia Commons contributor · CC BY 4.0"
      }
    ],
    "milestones": [
      [
        "c. 500 BCE",
        "The Satipaṭṭhāna Sutta includes mindfulness of the body as its first foundation."
      ],
      [
        "1952",
        "Sayagyi U Ba Khin opens the International Meditation Centre in Yangon, teaching attention swept through the body."
      ],
      [
        "1969",
        "S.N. Goenka brings the method from Burma to India."
      ],
      [
        "1979",
        "Jon Kabat-Zinn makes the body scan the first formal practice of MBSR."
      ],
      [
        "2009",
        "The Global Vipassana Pagoda opens near Mumbai."
      ]
    ]
  },
  "mantra": {
    "images": [
      {
        "src": "assets/history/Rigveda_MS2097.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Rigveda_MS2097.jpg",
        "caption": "Rigveda manuscript, Sanskrit on paper, early 19th century. The hymns themselves are over 3,000 years old",
        "credit": "Unknown artist · Public domain"
      },
      {
        "src": "assets/history/Maharishi_Mahesh_Yogi_during_a_1979_visit_to_MUM.jpg",
        "focus": "50% 20%",
        "page": "https://commons.wikimedia.org/wiki/File:Maharishi_Mahesh_Yogi_during_a_1979_visit_to_MUM.jpg",
        "caption": "Maharishi Mahesh Yogi, founder of Transcendental Meditation, in 1979",
        "credit": "Keithbob at English Wikipedia · Public domain"
      }
    ],
    "milestones": [
      [
        "c. 1500–1200 BCE",
        "The hymns of the Rigveda are composed and passed down orally as mantras."
      ],
      [
        "c. 800–500 BCE",
        "The Upanishads describe Om as the sound of ultimate reality."
      ],
      [
        "c. 2nd c. BCE–5th c. CE",
        "Patanjali's Yoga Sutras recommend repeating Om (japa) to steady the mind."
      ],
      [
        "1955",
        "Maharishi Mahesh Yogi begins teaching what becomes Transcendental Meditation."
      ],
      [
        "1968",
        "The Beatles study at his ashram in Rishikesh."
      ],
      [
        "1975",
        "Herbert Benson's The Relaxation Response, drawing on studies of TM practitioners, brings mantra meditation into medicine."
      ]
    ]
  },
  "zazen": {
    "images": [
      {
        "src": "assets/history/Soto-Zen-Master-Dogen-Zenji-Portrait.jpg",
        "focus": "50% 80%",
        "page": "https://commons.wikimedia.org/wiki/File:Soto-Zen-Master-Dogen-Zenji-Portrait.jpg",
        "caption": "Dōgen Zenji (1200–1253), founder of Sōtō Zen. Portrait, 13th century",
        "credit": "Unknown artist · Public domain"
      },
      {
        "src": "assets/history/BodhidharmaYoshitoshi1887.jpg",
        "focus": "50% 45%",
        "page": "https://commons.wikimedia.org/wiki/File:BodhidharmaYoshitoshi1887.jpg",
        "caption": "Bodhidharma, legendary founder of Chan/Zen, by Tsukioka Yoshitoshi, 1887",
        "credit": "Yoshitoshi · Public domain"
      }
    ],
    "milestones": [
      [
        "c. 6th c.",
        "Bodhidharma is said to bring Chan to China, sitting facing a wall for nine years."
      ],
      [
        "7th–9th c.",
        "Chan flourishes in Tang-dynasty China."
      ],
      [
        "1227",
        "Dōgen returns to Japan and writes the Fukanzazengi, his instructions for zazen."
      ],
      [
        "1244",
        "Dōgen founds Eihei-ji, still a head temple of Sōtō Zen."
      ],
      [
        "1962",
        "Shunryu Suzuki founds the San Francisco Zen Center."
      ]
    ]
  },
  "pranayama": {
    "images": [
      {
        "src": "assets/history/Mahamudra_in_Jogapradipika.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Mahamudra_in_Jogapradipika.jpg",
        "caption": "Mahamudra, a breath-and-posture practice, from an 1830 illustrated Jogapradipika manuscript",
        "credit": "Ramanandi Jayatarama in the Joga Pradīpikā · Public domain"
      },
      {
        "src": "assets/history/19th_century_manuscript_copy-_15th_century_Hatha_yoga_pradipika-_Schoyen_Collect.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:19th_century_manuscript_copy,_15th_century_Hatha_yoga_pradipika,_Schoyen_Collection_Norway.jpg",
        "caption": "19th-century copy of the 15th-century Hatha Yoga Pradipika, which details pranayama",
        "credit": "Ms Sarah Welch · CC BY-SA 4.0"
      }
    ],
    "milestones": [
      [
        "c. 800–500 BCE",
        "The Upanishads describe prana, the breath, as the life force."
      ],
      [
        "c. 2nd c. BCE–5th c. CE",
        "Patanjali names pranayama the fourth of yoga's eight limbs."
      ],
      [
        "15th c.",
        "Svatmarama's Hatha Yoga Pradipika details eight breath-retention practices."
      ],
      [
        "1830",
        "An illustrated Jogapradipika manuscript depicts breath and posture practices."
      ],
      [
        "1924",
        "Swami Kuvalayananda founds Kaivalyadhama and begins scientific study of pranayama."
      ]
    ]
  },
  "yoga-nidra": {
    "images": [
      {
        "src": "assets/history/1801_sketch_of_Vishnu_Anantashayana_in_Meenakshi_Shaivism_Temple_at_Madurai_Tami.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:1801_sketch_of_Vishnu_Anantashayana_in_Meenakshi_Shaivism_Temple_at_Madurai_Tamil_Nadu_02.jpg",
        "caption": "Vishnu in yoga nidra, cosmic sleep, on the serpent Ananta. Sketch, Madurai, 1801",
        "credit": "Unknown (1801) · Public domain"
      },
      {
        "src": "assets/history/Mattancherry_Palace-16-17th_Century_mural_paintings-Vishnu_Anantashayana-WUS0932.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Mattancherry_Palace-16-17th_Century_mural_paintings-Vishnu_Anantashayana-WUS09329.jpg",
        "caption": "Vishnu Anantashayana, 16th–17th century mural, Mattancherry Palace, Kerala",
        "credit": "Rainer Halama · CC BY-SA 4.0"
      }
    ],
    "milestones": [
      [
        "Ancient",
        "In the epics and Puranas, Vishnu's cosmic sleep on the serpent Ananta between cycles of creation is called yoganidra."
      ],
      [
        "Medieval",
        "Yoga texts such as the Yoga Taravali use yoga nidra for a state of deep, aware stillness."
      ],
      [
        "1960s",
        "Swami Satyananda Saraswati develops modern Yoga Nidra at the Bihar School of Yoga; his book follows in 1976."
      ],
      [
        "2000s",
        "Richard Miller's iRest version is used with US military veterans."
      ]
    ]
  },
  "visualization": {
    "images": [
      {
        "src": "assets/history/Vajrabhairava_Mandala_MET_DT841.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:%E5%85%83_%E7%B7%99%E7%B5%B2%E5%A4%A7%E5%A8%81%E5%BE%B7%E9%87%91%E5%89%9B%E6%9B%BC%E9%99%80%E7%BE%85-Vajrabhairava_Mandala_MET_DT841.jpg",
        "caption": "Vajrabhairava mandala, silk tapestry, China (Yuan dynasty), c. 1330. A support for visualization. The Met",
        "credit": "Wikimedia Commons contributor · CC0"
      },
      {
        "src": "assets/history/Yamantaka-_Destroyer_of_the_God_of_Death.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Yamantaka,_Destroyer_of_the_God_of_Death.jpg",
        "caption": "Yamantaka, Tibet, early 18th century. Practitioners visualize such deities in detail",
        "credit": "Unknown artist · Public domain"
      }
    ],
    "milestones": [
      [
        "8th c.",
        "Vajrayana Buddhism takes root in Tibet; deity yoga, visualizing oneself as an enlightened being, becomes central."
      ],
      [
        "c. 1330",
        "Mandalas like the Vajrabhairava tapestry are made as maps for visualization."
      ],
      [
        "1970s",
        "Doctors begin using guided imagery with patients, including for cancer care."
      ],
      [
        "1980s",
        "Mental rehearsal becomes standard in sports psychology."
      ]
    ]
  },
  "walking": {
    "images": [
      {
        "src": "assets/history/Chankramana_-_North_of_Mahabodhi_Temple_-1.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Chankramana_-_North_of_Mahabodhi_Temple_(1).jpg",
        "caption": "The Chankramana or 'jewel walk' at Bodh Gaya, where tradition says the Buddha practiced walking meditation",
        "credit": "Sumitsurai · CC BY-SA 4.0"
      },
      {
        "src": "assets/history/Thich_Nhat_Hanh_12_-cropped.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Thich_Nhat_Hanh_12_(cropped).jpg",
        "caption": "Thich Nhat Hanh in Paris, 2006",
        "credit": "Duc (pixiduc) from Paris, France. · CC BY-SA 2.0"
      }
    ],
    "milestones": [
      [
        "c. 500 BCE",
        "Tradition holds the Buddha practiced walking meditation at Bodh Gaya, marked today by the Chankramana."
      ],
      [
        "Early canon",
        "The Caṅkama Sutta lists five benefits of walking meditation, including endurance and good digestion."
      ],
      [
        "Medieval Japan",
        "Zen monasteries practice kinhin, slow walking between periods of zazen."
      ],
      [
        "1982",
        "Thich Nhat Hanh founds Plum Village in France and teaches walking meditation worldwide."
      ]
    ]
  },
  "trataka": {
    "images": [
      {
        "src": "assets/history/Hatha_Yoga_Pradipika_Bhasya-_page_1-_Raghunath_temple_library-_Sanskrit-_Devanag.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Hatha_Yoga_Pradipika_Bhasya,_page_1,_Raghunath_temple_library,_Sanskrit,_Devanagari.jpg",
        "caption": "Sanskrit commentary on the Hatha Yoga Pradipika, which lists trataka among its six cleansing practices",
        "credit": "Ms Sarah Welch · CC BY-SA 4.0"
      },
      {
        "src": "assets/history/Jogapradipika_84_Siddhasana.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Jogapradipika_84_Siddhasana.jpg",
        "caption": "Siddhasana, a classic meditation seat, from the 1830 Jogapradipika manuscript",
        "credit": "Jogapradipika manuscript illustrator, probably from the Punjab, India, 1830 · Public domain"
      }
    ],
    "milestones": [
      [
        "15th c.",
        "The Hatha Yoga Pradipika lists trataka among the six shatkarmas, cleansing practices for body and mind."
      ],
      [
        "17th c.",
        "The Gheranda Samhita also teaches trataka as a purification."
      ],
      [
        "Today",
        "Candle gazing is used as a simple concentration practice and a wind-down before sleep."
      ]
    ]
  },
  "nada": {
    "images": [
      {
        "src": "assets/history/Mandukya_Upanisad_verses_1-3-_Atharvaveda-_Sanskrit-_Devanagari.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Mandukya_Upanisad_verses_1-3,_Atharvaveda,_Sanskrit,_Devanagari.jpg",
        "caption": "The Mandukya Upanishad, devoted entirely to the syllable Om",
        "credit": "Ms Sarah Welch · CC BY-SA 4.0"
      },
      {
        "src": "assets/history/Chandogya_Upanishad_verses_1.1.1-1.1.9-_Samaveda-_Sanskrit-_Devanagari_script-_1.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Chandogya_Upanishad_verses_1.1.1-1.1.9,_Samaveda,_Sanskrit,_Devanagari_script,_1849_CE_manuscript.jpg",
        "caption": "The Chandogya Upanishad opens with a meditation on Om as the essence of chant",
        "credit": "Ms Sarah Welch · CC BY-SA 4.0"
      }
    ],
    "milestones": [
      [
        "c. 800–500 BCE",
        "The Chandogya Upanishad opens with a meditation on Om."
      ],
      [
        "Upanishadic period",
        "The Mandukya Upanishad explains Om as A-U-M plus the silence after it, the four states of consciousness."
      ],
      [
        "15th c.",
        "The Hatha Yoga Pradipika describes nadanusandhana, listening for the inner sound."
      ],
      [
        "1970s",
        "Himalayan singing bowls become popular in Western sound meditation."
      ]
    ]
  },
  "tonglen": {
    "images": [
      {
        "src": "assets/history/Portrait_of_the_Indian_Monk_Atisha.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Portrait_of_the_Indian_Monk_Atisha.jpg",
        "caption": "Atisha (982–1054), who brought mind-training (lojong) teachings to Tibet. Tibet, 12th century",
        "credit": "Unknown artist · Public domain"
      },
      {
        "src": "assets/history/Pema_chodron_2007_cropped.jpg",
        "focus": "50% 30%",
        "page": "https://commons.wikimedia.org/wiki/File:Pema_chodron_2007_cropped.jpg",
        "caption": "Pema Chödrön, who brought tonglen to Western readers, in 2007",
        "credit": "Wikimedia Commons contributor · CC BY-SA 2.0"
      }
    ],
    "milestones": [
      [
        "1042",
        "Atisha arrives in Tibet, bringing the lojong mind-training teachings."
      ],
      [
        "12th c.",
        "Geshe Chekawa writes the Seven-Point Mind Training, which includes tonglen."
      ],
      [
        "1970s",
        "Chögyam Trungpa teaches tonglen to Western students."
      ],
      [
        "1997",
        "Pema Chödrön's When Things Fall Apart brings tonglen to a wide audience."
      ]
    ]
  },
  "chakra": {
    "images": [
      {
        "src": "assets/history/Sapta_Chakra-_1899.jpg",
        "focus": "50% 40%",
        "page": "https://commons.wikimedia.org/wiki/File:Sapta_Chakra,_1899.jpg",
        "caption": "Sapta Chakra, the seven chakras, from an 1899 yoga manuscript in Braj Bhasha",
        "credit": "Anonymous · Public domain"
      },
      {
        "src": "assets/history/Kundalini_Tantra_painting_-Rajasthan-_18th_century.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Kundalini_Tantra_painting_(Rajasthan,_18th_century).png",
        "caption": "Kundalini and the chakras along the spine. Rajasthan, 18th century",
        "credit": "Unknown 18th century Indian painter · Public domain"
      }
    ],
    "milestones": [
      [
        "c. 8th c. onward",
        "Buddhist and Hindu tantras describe energy centers along the body, varying in number."
      ],
      [
        "1577",
        "Purnananda's Sat-Chakra-Nirupana describes six chakras plus the crown."
      ],
      [
        "18th c.",
        "Rajasthani painters illustrate kundalini rising through the chakras."
      ],
      [
        "1919",
        "Sir John Woodroffe translates it in The Serpent Power, introducing chakras to the West."
      ],
      [
        "1970s onward",
        "Western authors add the rainbow colors and psychological meanings used today."
      ]
    ]
  },
  "qigong": {
    "images": [
      {
        "src": "assets/history/Daoyin_tu_-_chart_for_leading_and_guiding_people_in_exercise_Wellcome_L0036007.jpg",
        "page": "https://commons.wikimedia.org/wiki/File:Daoyin_tu_-_chart_for_leading_and_guiding_people_in_exercise_Wellcome_L0036007.jpg",
        "caption": "Daoyin tu, a 'chart for guiding and pulling' exercises: a reproduction of the silk chart buried at Mawangdui c. 168 BCE. Wellcome Collection",
        "credit": "Wikimedia Commons contributor · CC BY 4.0"
      }
    ],
    "milestones": [
      [
        "c. 168 BCE",
        "The Daoyin tu, a silk chart of 44 figures doing health exercises, is buried in a tomb at Mawangdui."
      ],
      [
        "2nd c. CE",
        "The physician Hua Tuo creates the Five Animals exercises."
      ],
      [
        "1950s",
        "The name qigong is standardized and taught in Chinese clinics."
      ],
      [
        "1980s",
        "A 'qigong fever' sweeps China, with millions practicing in parks."
      ]
    ]
  }
};

// Words that point straight at a meditation, typed into the Find search.
// Edit freely: each word or phrase (lowercase) adds that meditation to the
// results. Plurals ("candles", "breaths") match automatically.
const MEDITATION_WORDS = {
  vipassana: ["mindfulness", "mindful", "vipassana", "insight", "present moment", "be present", "awareness", "observe", "goenka", "kabat-zinn"],
  metta: ["metta", "loving kindness", "loving-kindness", "compassion", "kindness", "self love", "self-love", "love myself", "warmth"],
  "body-scan": ["body scan", "scan", "relax", "relaxation", "mbsr", "lie down", "lying down"],
  mantra: ["mantra", "japa", "mala", "transcendental", "tm", "repeat a word", "repetition"],
  zazen: ["zen", "zazen", "just sit", "sit still", "sitting still", "shikantaza", "dogen", "buddhist"],
  pranayama: ["breath", "breathe", "breathing", "breathwork", "pranayama", "box breathing", "4-7-8", "inhale", "exhale"],
  "yoga-nidra": ["yoga nidra", "nidra", "sleep meditation", "deep rest", "nap", "rest"],
  visualization: ["visualize", "visualise", "visualization", "visualisation", "imagine", "imagery", "guided imagery", "manifest", "manifesting"],
  walking: ["walk", "walking", "outside", "outdoors", "nature", "hike", "steps"],
  trataka: ["candle", "flame", "gaze", "gazing", "stare", "trataka", "eyes open"],
  nada: ["sound", "music", "hum", "humming", "chant", "chanting", "singing bowl", "bowl", "bell", "gong", "vibration", "om"],
  tonglen: ["tonglen", "giving and taking", "caregiver", "caring for", "someone suffering", "empathy", "empath"],
  chakra: ["chakra", "energy center", "energy centre", "kundalini", "align", "alignment", "balance my energy"],
  qigong: ["qigong", "qi gong", "tai chi", "movement", "move my body", "stretch", "stretching", "gentle exercise", "flow"],
};

// Four-week starter plans for the Guide, by experience level.
const GUIDE = {
  beginner: {
    label: "Beginner",
    blurb: "New to meditation, or starting again after a long break.",
    daily: "5–12 minutes a day",
    intro: "Short, gentle sits that build a habit before anything else. Missing a day is fine; simply begin again.",
    weeks: [
      {
        title: "Arrive",
        time: "5 minutes a day",
        intro: "The goal this week is simply to show up. Same time, same place, every day.",
        practices: [
          ["pranayama", "3 minutes of box breathing to settle"],
          ["vipassana", "2 minutes resting attention on the breath"],
        ],
        tip: "Attach it to something you already do, like right after your morning coffee.",
      },
      {
        title: "Notice",
        time: "8 minutes a day",
        intro: "Start noticing the body and the wandering mind, without trying to fix anything.",
        practices: [
          ["body-scan", "A short body scan on alternate days"],
          ["vipassana", "Mindful breathing on the other days"],
        ],
        tip: "A wandering mind isn't failure. Each time you come back is one repetition of the practice.",
      },
      {
        title: "Soften",
        time: "10 minutes a day",
        intro: "Bring some warmth in, and take the practice outside once.",
        practices: [
          ["metta", "Loving-kindness three times this week"],
          ["walking", "One slow walking meditation outdoors"],
          ["vipassana", "Mindful breathing on the remaining days"],
        ],
        tip: "Be as kind to yourself about missed days as you would be to a friend.",
      },
      {
        title: "Settle",
        time: "10–12 minutes a day",
        intro: "Choose the practice that felt best and make it yours. Add one for sleep.",
        practices: [
          ["vipassana", "Your favourite practice so far, daily"],
          ["yoga-nidra", "Yoga nidra in bed on two evenings"],
        ],
        tip: "At the end of the week, write one line about what has changed, however small.",
      },
    ],
  },
  intermediate: {
    label: "Intermediate",
    blurb: "You sit a few times a week and want more depth and range.",
    daily: "15–20 minutes a day",
    intro: "Longer sits, steadier attention, and new practices for the breath, the heart and the body.",
    weeks: [
      {
        title: "Steady attention",
        time: "15 minutes a day",
        intro: "Strengthen concentration so longer sits feel easier.",
        practices: [
          ["vipassana", "15 minutes of mindfulness daily"],
          ["trataka", "5 minutes of candle gazing, twice this week"],
        ],
        tip: "Count breaths from 1 to 10 when the mind is busy, then let the counting go.",
      },
      {
        title: "Breath & sound",
        time: "15–20 minutes a day",
        intro: "Use the breath to prepare and sound to anchor.",
        practices: [
          ["pranayama", "5 minutes of alternate-nostril breathing before each sit"],
          ["mantra", "15 minutes of mantra meditation"],
        ],
        tip: "Keep the mantra soft and unforced, more like listening than repeating.",
      },
      {
        title: "Open the heart",
        time: "20 minutes a day",
        intro: "Extend kindness further, including to people you find difficult.",
        practices: [
          ["metta", "The full loving-kindness sequence, including a difficult person"],
          ["tonglen", "Tonglen twice this week"],
        ],
        tip: "If a difficult person feels like too much, return to someone easy. That's part of it.",
      },
      {
        title: "Body & movement",
        time: "20 minutes a day",
        intro: "Bring the practice into movement and into longer stretches of the day.",
        practices: [
          ["qigong", "10 minutes of qigong in the mornings"],
          ["body-scan", "A 20-minute body scan at the weekend"],
          ["walking", "One half-morning of mindful walking"],
        ],
        tip: "Notice how the practice spills into ordinary moments: washing up, waiting in line.",
      },
    ],
  },
  advanced: {
    label: "Advanced",
    blurb: "A daily practice already, and ready to go deeper.",
    daily: "30–60 minutes a day",
    intro: "Longer sits, silence and retreat-style days at home. Go at your own pace.",
    weeks: [
      {
        title: "Longer sits",
        time: "30–40 minutes a day",
        intro: "Stretch your sitting time and sit twice on weekend days.",
        practices: [
          ["zazen", "30–40 minutes of zazen daily"],
          ["walking", "10 minutes of slow walking between weekend sits"],
        ],
        tip: "Keep the posture alive: upright and relaxed, not rigid.",
      },
      {
        title: "Insight",
        time: "45 minutes a day",
        intro: "Turn towards the changing nature of experience.",
        practices: [
          ["vipassana", "45 minutes of noting practice"],
          ["body-scan", "Slow, detailed sweeps through the body"],
        ],
        tip: "Try one silent morning this week: no phone, no talking until noon.",
      },
      {
        title: "Deep rest & energy",
        time: "40 minutes a day",
        intro: "Balance effort with deep rest, and explore the subtle body.",
        practices: [
          ["yoga-nidra", "30 minutes of yoga nidra"],
          ["chakra", "Chakra meditation, root to crown"],
          ["pranayama", "Breathwork before sitting; go gently with breath retention"],
        ],
        tip: "If energy feels too intense, return to grounding: feet on the floor, slow exhales.",
      },
      {
        title: "Integration",
        time: "A home retreat day",
        intro: "Bring it together with one full day of practice at home.",
        practices: [
          ["zazen", "Alternate sitting and walking for a full day"],
          ["tonglen", "Close the day with tonglen for the wider world"],
        ],
        tip: "If you feel ready, look into a residential retreat, such as a 10-day vipassana course.",
      },
    ],
  },
};
