// Seedable 32-bit PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple string hash function to generate a seed
function hashString(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return (h ^= h >>> 5) >>> 0;
}

export const BIHAR_CITIES = [
  "motihari",
  "bettiah",
  "raxaul",
  "dhaka",
  "sugauli",
  "chakia",
  "piprakothi",
  "chhapra",
  "muzaffarpur",
  "patna",
  "gopalganj",
  "siwan",
  "darbhanga",
  "harsidhi",
  "kesariya",
  "areraj",
  "pakridayal",
  "mehsi",
  "turkaulia",
];

export interface SEOContent {
  cityName: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  whyChooseUs: string;
  features: string[];
  faqs: { question: string; answer: string }[];
}

export function getCityDisplayName(city: string): string {
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
}

export function generateLocalSEOContent(citySlug: string): SEOContent {
  const cityName = getCityDisplayName(citySlug);
  const seed = hashString(citySlug.toLowerCase());
  const rand = mulberry32(seed);

  // Helper to pick randomly from array using PRNG
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  // Helper to shuffle array using PRNG
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const titleTemplates = [
    `Best Computer Course in ${cityName} | DCA, ADCA & Tally Classes`,
    `Top Computer Coaching in ${cityName}, Bihar | DCA, ADCA & Typing`,
    `Computer Training Center in ${cityName} | DCA, ADCA, Tally Prime`,
    `Learn Coding & Tally in ${cityName} | Best Computer Institute`,
  ];

  const descTemplates = [
    `Looking for the best computer class in ${cityName}? Royal Computer Institute offers DCA, ADCA, Tally Prime with GST, Python, Web Development, and Typing courses in ${cityName}, Bihar. Enroll today for expert training!`,
    `Join the leading computer training center in ${cityName}. We offer ADCA, DCA, Python programming, GST Tally Prime, and typing classes with certification. Get career-ready in ${cityName}, East Champaran.`,
    `Learn professional computer courses in ${cityName}, Bihar. Best coaching for DCA, ADCA, Tally ERP/Prime, and software development with 100% practical lab sessions in ${cityName}. Register now!`,
  ];

  const h1Templates = [
    `Leading Computer Training Institute in ${cityName}, Bihar`,
    `Best Computer Coaching & IT Center in ${cityName}`,
    `Unlock Your IT Career in ${cityName} with Royal Computer Institute`,
    `Advanced DCA, ADCA & Tally Coaching classes in ${cityName}`,
  ];

  const intros = [
    `Royal Computer Institute is proud to extend its premium educational programs to students in ${cityName}. If you are looking to build a career in software development, digital accounting, or general office administration, our specialized curriculum in DCA, ADCA, and Tally Prime with GST offers the perfect foundation. Our courses are structured with 100% practical lab practice to ensure you excel in your chosen field.`,
    `Students in ${cityName} can now master essential digital skills and programming languages at Royal Computer Institute. Located in the heart of Motihari, we serve Champaran students from ${cityName} and surrounding areas. Whether you are interested in joining typing classes, mastering Microsoft Excel, learning Tally Prime for accounting, or diving into software engineering with Python and Java, we provide comprehensive training programs.`,
    `As digital literacy becomes a mandate for governmental and corporate jobs, Royal Computer Institute is helping Champaran youth from ${cityName} get certified. Our accredited computer coaching classes provide deep hands-on learning on fundamentals, database design, web technologies, and GST invoicing. We offer flexible batches and high-tech lab systems for students commuting from ${cityName}.`,
  ];

  const whyChooseUsPool = [
    `Our state-of-the-art computers and personalized attention make us the preferred destination for students from ${cityName}. We ensure that every candidate gains standard IT skills, with free doubt-clearing sessions and career guidance.`,
    `We provide industry-recognized certificates that are widely accepted for government job verifications and private sector applications. For students in ${cityName}, we provide regular mock tests to verify learning outcomes.`,
    `Our labs are open for extended practice hours, allowing students from ${cityName} to sit and complete their assignments and project work in a highly supportive learning environment.`,
  ];

  const featurePool = [
    "AC Classrooms with High-Speed WiFi and individual desktops",
    "Comprehensive study materials and step-by-step notes",
    "ISO Certified Institute offering Govt.-recognized certificates",
    "Affordable fee structure with monthly installment choices",
    "Dedicated typing lab for Hindi & English typing speed improvement",
    "100% hands-on training sessions with real-world case studies",
    "Professional instructors with years of industry experience",
    "Free career counseling and placement assistance program",
  ];

  // Pick unique items
  const features = shuffle(featurePool).slice(0, 5);

  const faqPool = [
    {
      q: `Which is the best computer coaching institute in ${cityName} region?`,
      a: `Royal Computer Institute is highly recommended for students in the ${cityName} area. Although our main campus is located in Motihari, East Champaran, we cater to all nearby locations including ${cityName} with flexible batch timings and highly practical, project-based courses like DCA, ADCA, Tally Prime, and Web Development.`,
    },
    {
      q: `Are the computer certificates from your center valid in ${cityName} for government jobs?`,
      a: `Yes, Royal Computer Institute is an ISO-certified educational organization. The certificates issued for ADCA, DCA, Tally, and Typing courses are valid nationwide and can be used for private and government job applications in ${cityName} and across Bihar.`,
    },
    {
      q: `What is the duration and fee structure for the Tally Prime course for students from ${cityName}?`,
      a: `Our Tally Prime with GST course typically lasts 3 to 4 months. We offer an affordable fee structure with installment payment options for students coming from ${cityName}. Please contact us or check our courses section for absolute fee details.`,
    },
    {
      q: `Does the institute provide practical computer labs for students from ${cityName}?`,
      a: `Absolutely! We believe in 100% practical-oriented learning. Every student from ${cityName} gets their own computer system during the lab hours with unlimited practice time under developer supervision.`,
    },
    {
      q: `Can I learn web development or Python coding online or offline from ${cityName}?`,
      a: `Yes, we offer web development and coding training. Our classes cover HTML, CSS, JavaScript, React, and Python programming with flexible options for students commuting from ${cityName}.`,
    },
  ];

  const selectedFaqs = shuffle(faqPool)
    .slice(0, 3)
    .map((item) => ({
      question: item.q,
      answer: item.a,
    }));

  return {
    cityName,
    title: pick(titleTemplates),
    description: pick(descTemplates),
    h1: pick(h1Templates),
    intro: pick(intros),
    whyChooseUs: pick(whyChooseUsPool),
    features,
    faqs: selectedFaqs,
  };
}
