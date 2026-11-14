import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Opportunity from './models/Opportunity.js';

dotenv.config();

const sampleOpportunities = [
  // --- ENVIRONMENTAL ---
  {
    title: "Miramar Beach Cleanup Drive",
    description: "Help us clear plastic waste from Miramar beach to protect local marine life. Trash bags and gloves provided.",
    organization: "Goa Eco Warriors",
    activityType: "Environmental",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-20T07:00:00Z"),
    urgency: "High",
    imageUrl: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Physical Labor", "Teamwork"],
    capacity: { isFlexibleHours: false, requiredHours: 4, isUnlimitedVolunteers: true, volunteersSignedUp: 12 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Rahul Sharma", email: "rahul@ecowarriors.goa" }
  },
  {
    title: "Mangrove Sapling Plantation",
    description: "Wade into the backwaters to plant saplings that prevent soil erosion and rebuild the local ecosystem.",
    organization: "Green Goa Initiative",
    activityType: "Environmental",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-12-05T08:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Outdoor Survival"],
    capacity: { isFlexibleHours: false, requiredHours: 5, isUnlimitedVolunteers: false, volunteersNeeded: 20, volunteersSignedUp: 8 },
    location: { city: "Chorao", pinCode: "403102" },
    contactPerson: { name: "Anita Desai", email: "anita@greengoa.org" }
  },
  {
    title: "Weekend E-Waste Drop-off",
    description: "Manage a weekend booth to collect old cables, phones, and batteries from locals for safe recycling.",
    organization: "TechRecycle",
    activityType: "Environmental",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-22T09:00:00Z"),
    urgency: "High",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Organization"],
    capacity: { isFlexibleHours: true, isUnlimitedVolunteers: false, volunteersNeeded: 6, volunteersSignedUp: 2 },
    location: { city: "Mapusa", pinCode: "403507" },
    contactPerson: { name: "David Lobo", email: "david@techrecycle.in" }
  },

  // --- EDUCATION ---
  {
    title: "Weekend Coding Workshop for Kids",
    description: "Teach basic block-coding to kids aged 8-12. No prior teaching experience required, just basic logic skills.",
    organization: "Tech for Tomorrow",
    activityType: "Education",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-28T10:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Programming", "Teaching"],
    capacity: { isFlexibleHours: false, requiredHours: 6, isUnlimitedVolunteers: false, volunteersNeeded: 10, volunteersSignedUp: 8 },
    location: { city: "Margao", pinCode: "403601" },
    contactPerson: { name: "Priya Naik", email: "priya@techkids.org" }
  },
  {
    title: "Senior Citizen Digital Literacy",
    description: "Help the elderly navigate smartphones, make video calls, and use online banking safely.",
    organization: "Silver Surfers NGO",
    activityType: "Education",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-18T16:00:00Z"),
    urgency: "High",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Patience", "Tech Support"],
    capacity: { isFlexibleHours: true, isUnlimitedVolunteers: false, volunteersNeeded: 15, volunteersSignedUp: 5 },
    location: { city: "Vasco", pinCode: "403802" },
    contactPerson: { name: "Ramesh Iyer", email: "ramesh@silversurfers.org" }
  },
  {
    title: "Community Library Setup",
    description: "Sort, catalog, and arrange donated books to set up a new reading room at the orphanage.",
    organization: "Books for All",
    activityType: "Education",
    status: "Filled",
    passcode: "1234",
    date: new Date("2026-12-10T09:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Organization"],
    capacity: { isFlexibleHours: false, requiredHours: 8, isUnlimitedVolunteers: false, volunteersNeeded: 5, volunteersSignedUp: 5 },
    location: { city: "Ponda", pinCode: "403401" },
    contactPerson: { name: "Sarah Thomas", email: "sarah@booksforall.in" }
  },

  // --- HEALTH ---
  {
    title: "Community Blood Donation Camp",
    description: "Drop in anytime during the day to donate blood. We desperately need O- and A+ types this week.",
    organization: "Red Cross Society",
    activityType: "Health",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-17T09:00:00Z"),
    urgency: "Critical",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["None"],
    capacity: { isFlexibleHours: true, isUnlimitedVolunteers: true, volunteersSignedUp: 45 },
    location: { city: "Vasco da Gama", pinCode: "403802" },
    contactPerson: { name: "Dr. Sarah Dias", email: "sarah@redcross.org" }
  },
  {
    title: "Art Therapy Session Assistant",
    description: "Distribute materials and assist in therapeutic painting sessions for trauma recovery patients.",
    organization: "Mindful Healing Clinic",
    activityType: "Health",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-25T14:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Empathy", "Art Skills"],
    capacity: { isFlexibleHours: false, requiredHours: 3, isUnlimitedVolunteers: false, volunteersNeeded: 4, volunteersSignedUp: 1 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Neha Patil", email: "neha@mindfulhealing.com" }
  },

  // --- ANIMAL WELFARE ---
  {
    title: "Stray Animal Feeding Route",
    description: "Assist in distributing food and fresh water to stray dogs and cats across designated city street routes.",
    organization: "Paws & Claws Goa",
    activityType: "Animal Welfare",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-16T17:00:00Z"),
    urgency: "Critical",
    imageUrl: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Animal Handling", "Driving"],
    capacity: { isFlexibleHours: false, requiredHours: 4, isUnlimitedVolunteers: false, volunteersNeeded: 8, volunteersSignedUp: 2 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Rohan Kadam", email: "rohan@pawsgoa.org" }
  },
  {
    title: "Turtle Nesting Night Patrol",
    description: "Walk the beaches at night to protect vulnerable Olive Ridley turtle nests from poachers and strays.",
    organization: "Marine Conservation Society",
    activityType: "Animal Welfare",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-12-01T22:00:00Z"),
    urgency: "High",
    imageUrl: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Stamina", "Night Vision"],
    capacity: { isFlexibleHours: true, isUnlimitedVolunteers: true, volunteersSignedUp: 14 },
    location: { city: "Morjim", pinCode: "403512" },
    contactPerson: { name: "Capt. Alvares", email: "patrol@marinegoa.in" }
  },

  // --- COMMUNITY ---
  {
    title: "Food Rescue Distribution",
    description: "Collect surplus prepared food from local banquet halls and deliver it immediately to city night shelters.",
    organization: "Robin Hood Army",
    activityType: "Community",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-19T20:00:00Z"),
    urgency: "High",
    imageUrl: "https://images.unsplash.com/photo-1593113580831-b3b3a63dc518?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Driving", "Logistics"],
    capacity: { isFlexibleHours: false, requiredHours: 3, isUnlimitedVolunteers: false, volunteersNeeded: 15, volunteersSignedUp: 10 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Vikram Singh", email: "vikram@rha.org" }
  },
  {
    title: "Fundraising Marathon Marshal",
    description: "Direct runners, hand out water packets at checkpoints, and manage crowd control. (Event concluded)",
    organization: "Goa Sports Authority",
    activityType: "Community",
    status: "Closed",
    passcode: "1234",
    date: new Date("2026-11-10T05:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Crowd Control"],
    capacity: { isFlexibleHours: false, requiredHours: 6, isUnlimitedVolunteers: false, volunteersNeeded: 40, volunteersSignedUp: 40 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Jason Fernandes", email: "jason@sports.goa" }
  },
  {
    title: "Old Age Home Weekend Companion",
    description: "Spend a quiet afternoon playing board games, reading aloud, and chatting with elderly residents.",
    organization: "Care Network",
    activityType: "Community",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-29T15:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Empathy", "Communication"],
    capacity: { isFlexibleHours: true, isUnlimitedVolunteers: false, volunteersNeeded: 12, volunteersSignedUp: 3 },
    location: { city: "Mapusa", pinCode: "403507" },
    contactPerson: { name: "Sonia G", email: "sonia@carenetwork.org" }
  },

  // --- CULTURAL ---
  {
    title: "Saligao Heritage Walk Guide",
    description: "Guide tourists through the historic village of Saligao, sharing stories of its architecture, history, and local culture.",
    organization: "Goa Heritage Action Group",
    activityType: "Cultural",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-25T08:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["History Knowledge", "Public Speaking"],
    capacity: { isFlexibleHours: false, requiredHours: 5, isUnlimitedVolunteers: false, volunteersNeeded: 5, volunteersSignedUp: 4 },
    location: { city: "Saligao", pinCode: "403511" },
    contactPerson: { name: "Fatima D'Souza", email: "fatima@heritage.goa" }
  },
  {
    title: "Folk Arts Festival Stage Helper",
    description: "Manage vendor stalls, assist backstage, and coordinate ticketing for local artisans and musicians.",
    organization: "Kala Academy",
    activityType: "Cultural",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-11-21T16:00:00Z"),
    urgency: "Critical",
    imageUrl: "https://images.unsplash.com/photo-1533174000273-7c8ffbd09623?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Event Management", "High Energy"],
    capacity: { isFlexibleHours: false, requiredHours: 8, isUnlimitedVolunteers: false, volunteersNeeded: 25, volunteersSignedUp: 10 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Rajesh Prabhu", email: "rajesh@kalaacademy.in" }
  },
  {
    title: "Museum Archiving Assistant",
    description: "Help digitize, scan, and neatly catalog old photographs, maps, and historical documents.",
    organization: "State Museum",
    activityType: "Cultural",
    status: "Open",
    passcode: "1234",
    date: new Date("2026-12-15T10:00:00Z"),
    urgency: "Normal",
    imageUrl: "https://images.unsplash.com/photo-1518998053401-878ae44cb111?auto=format&fit=crop&w=900&q=80",
    skillsRequired: ["Attention to Detail", "Computer Skills"],
    capacity: { isFlexibleHours: true, isUnlimitedVolunteers: false, volunteersNeeded: 4, volunteersSignedUp: 1 },
    location: { city: "Panaji", pinCode: "403001" },
    contactPerson: { name: "Dr. Mendes", email: "archive@statemuseum.goa" }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    await Opportunity.deleteMany({});
    console.log('Cleared existing opportunities.');

    await Opportunity.insertMany(sampleOpportunities);
    console.log(`Successfully inserted ${sampleOpportunities.length} fresh sample opportunities!`);

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();