export const siteConfig = {
  name: "Lifecare Options",
  tagline: "Home Health",
  phone: "(281) 646-9546",
  phoneHref: "tel:+12816469546",
  fax: "(281) 646-9757",
  intakeEmail: "intake@mylifecareoptions.com",
  jobsEmail: "jobs@mylifecareoptions.com",
  address: {
    street: "434 Park Grove Dr",
    city: "Katy",
    state: "TX",
    zip: "77450",
  },
  hours: [
    { days: "Mon–Thu", time: "8:00 AM – 5:00 PM" },
    { days: "Fri", time: "8:00 AM – 4:00 PM" },
  ],
  onCall: "24/7 on-call nursing",
  foundedYear: 2008,
  accreditation: "CHAP-accredited",
  medicareCcn: "747061" as string | null, // verify before launch
  stateLicense: "011908" as string | null, // verify before launch
  serviceArea: {
    counties: [
      { name: "Harris County", color: "#5a8bb8" },
      { name: "Fort Bend County", color: "#0f2b47" },
    ],
    cities: [
      "Katy",
      "Cypress",
      "Fulshear",
      "Richmond",
      "Rosenberg",
      "Sugar Land",
      "Missouri City",
      "Brookshire",
      "West Houston",
    ],
  },
  specialties: [
    "Wound care",
    "Congestive heart failure",
    "COPD & respiratory",
    "Diabetes management",
    "Post-surgical recovery",
    "Stroke recovery",
    "Fall prevention",
    "Medication management",
  ],
  insurancePlans: [
    "Medicare",
    "Medicare Advantage",
    "Medicaid",
    "Most private / commercial plans",
    "Private pay",
  ],
  positions: [] as readonly { title: string; type?: string }[],
  testimonials: [] as readonly { quote: string; attribution: string }[],
} as const;

export const services = [
  {
    name: "Skilled Nursing",
    description:
      "Wound care, medication management, chronic disease support.",
    iconName: "Stethoscope",
  },
  {
    name: "Physical Therapy",
    description: "Mobility, strength, and balance after surgery or progressive conditions.",
    iconName: "PersonSimpleWalk",
  },
  {
    name: "Occupational Therapy",
    description:
      "Recovery and rehab, cognitive and physical, after stroke or injury.",
    iconName: "HandHeart",
  },
  {
    name: "Speech Therapy",
    description:
      "Communication and swallowing recovery, post-stroke and neurological.",
    iconName: "ChatCircleDots",
  },
  {
    name: "Medical Social Work",
    description: "Benefits navigation, community resources, and family support.",
    iconName: "UsersThree",
  },
  {
    name: "Home Health Aide",
    description:
      "Personal care, bathing, grooming, meal prep, and companionship.",
    iconName: "House",
  },
  {
    name: "Remote Patient Monitoring",
    description:
      "Daily vital signs via connected home devices, for early intervention and peace of mind.",
    iconName: "Heartbeat",
  },
] as const;

export type ServiceIconName = (typeof services)[number]["iconName"];
