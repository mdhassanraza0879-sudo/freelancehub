/**
 * FreelanceHub — 5,000 Indian & International Companies Seeder
 * Run: node seedCompanies.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');

const INDIAN_TOP_COMPANIES = [
  'Tata Consultancy Services (TCS)', 'Infosys Global', 'Wipro Technologies', 'HCLTech India',
  'Tech Mahindra', 'Razorpay', 'Swiggy', 'Zomato', 'Flipkart', 'Paytm', 'PhonePe', 'CRED',
  'Zerodha', 'Nykaa', 'Ola Cabs', 'Urban Company', 'Unacademy', 'BYJU’S', 'Meesho', 'Groww',
  'InMobi', 'Postman', 'Hasura', 'Freshworks India', 'Zoho Corporation', 'Pine Labs', 'BharatPe',
  'PolicyBazaar', 'Cars24', 'Licious', 'Zepto', 'Blinkit', 'Spinny', 'Lead School', 'Delhivery',
  'Myntra', 'BigBasket', 'ShareChat', 'Fractal Analytics', 'Mu Sigma', 'Persistent Systems',
  'L&T Technology Services', 'Mphasis', 'Mindtree', 'KPIT Technologies', 'Happiest Minds'
];

const INTERNATIONAL_TOP_COMPANIES = [
  'Google LLC (USA)', 'Microsoft Corporation (USA)', 'Amazon Web Services (Global)',
  'Meta Platforms (USA)', 'Apple Inc. (USA)', 'Adobe Systems (USA)', 'Salesforce (USA)',
  'NVIDIA AI (Global)', 'OpenAI Enterprise (USA)', 'Snowflake Inc. (USA)', 'Databricks (USA)',
  'Stripe Payments (USA)', 'Spotify Technology (Europe)', 'Netflix Tech (USA)', 'Airbnb Inc. (USA)',
  'Uber Technologies (USA)', 'Atlassian (Australia)', 'GitLab (Global Remote)', 'Cloudflare (USA)',
  'DigitalOcean (USA)', 'Vercel Inc. (USA)', 'Supabase (Global Remote)', 'Shopify (Canada)',
  'Canva (Australia)', 'Revolut (UK)', 'Wise Payments (UK)', 'Siemens Digital (Germany)',
  'SAP SE (Germany)', 'Grab Tech (Singapore)', 'Shopee (Singapore)', 'Booking.com (Netherlands)'
];

const INDUSTRIES = [
  'Information Technology & Software', 'FinTech & Digital Payments', 'E-Commerce & Retail Tech',
  'Artificial Intelligence & ML', 'Cloud Computing & DevOps', 'Cybersecurity & Defense',
  'EdTech & Learning', 'HealthTech & Pharmaceuticals', 'Media, Gaming & Entertainment',
  'Logistics & Supply Chain', 'Consulting & Financial Services', 'Web3 & Blockchain Technology'
];

const INDIAN_LOCATIONS = [
  'Bangalore, Karnataka (WFH)', 'Mumbai, Maharashtra (WFH)', 'Delhi NCR / Gurgaon (WFH)',
  'Hyderabad, Telangana (WFH)', 'Pune, Maharashtra (WFH)', 'Chennai, Tamil Nadu (WFH)',
  'Kolkata, West Bengal (WFH)', 'Ahmedabad, Gujarat (WFH)', 'Pan-India Work from Home'
];

const INTERNATIONAL_LOCATIONS = [
  'San Francisco, CA (Remote WFH)', 'New York, NY (Remote WFH)', 'London, UK (Remote WFH)',
  'Berlin, Germany (Remote WFH)', 'Toronto, Canada (Remote WFH)', 'Singapore (Remote WFH)',
  'Sydney, Australia (Remote WFH)', 'Dubai, UAE (Remote WFH)', 'Worldwide Remote (100% WFH)'
];

const SIZES = ['50-200 employees', '200-500 employees', '500-2,000 employees', '2,000-10,000+ employees', '10,000+ Enterprise Tech'];

const ROLE_TEMPLATES = [
  { title: 'Senior React / Next.js Developer', category: 'Web Development', salary: '₹12,00,000 - ₹25,00,000/yr' },
  { title: 'Full Stack MERN Engineer', category: 'Full Stack Development', salary: '₹10,00,000 - ₹22,00,000/yr' },
  { title: 'Lead UI/UX Product Designer', category: 'UI/UX Design', salary: '₹9,00,000 - ₹18,00,000/yr' },
  { title: 'Python Machine Learning Engineer', category: 'Data Science & AI', salary: '₹15,00,000 - ₹30,00,000/yr' },
  { title: 'DevOps & AWS Cloud Architect', category: 'DevOps & Cloud', salary: '₹16,00,000 - ₹32,00,000/yr' },
  { title: 'Mobile App Developer (React Native / Flutter)', category: 'Mobile Development', salary: '₹11,00,000 - ₹21,00,000/yr' },
  { title: 'Growth Marketing Manager & SEO Specialist', category: 'Digital Marketing', salary: '₹8,00,000 - ₹16,00,000/yr' },
  { title: 'Senior Technical Content Writer', category: 'Content Writing', salary: '₹6,00,000 - ₹14,00,000/yr' }
];

const PREFIXES = [
  'Apex', 'Nexus', 'Vertex', 'Starlight', 'Cyber', 'Quantum', 'Kinetix', 'Vanguard', 'Omni', 'Hyperion',
  'Aura', 'Titan', 'Synergy', 'Zenith', 'Orion', 'Pulse', 'Stratum', 'Velocity', 'Prism', 'Elysium',
  'Nova', 'Echo', 'Fusion', 'Solstice', 'Beacon', 'Ignite', 'Cobalt', 'Astral', 'Helios', 'Vector',
  'Aegis', 'Catalyst', 'Genesis', 'Spectra', 'Fortress', 'Vortex', 'Synapse', 'Crest', 'Radiant', 'Infinity'
];

const SUFFIXES = [
  'Labs', 'Technologies', 'Solutions', 'Global', 'Networks', 'Digital', 'Systems', 'Ventures',
  'Interactive', 'Media', 'Cloud', 'AI', 'Analytics', 'Capital', 'Studio', 'Dynamics', 'Software',
  'Enterprise', 'Innovations', 'Core'
];

function generate5kCompaniesList() {
  const companies = [];
  const namesSet = new Set();

  // 1. Add Indian Top Companies
  for (const name of INDIAN_TOP_COMPANIES) namesSet.add(name);
  // 2. Add International Top Companies
  for (const name of INTERNATIONAL_TOP_COMPANIES) namesSet.add(name);

  // 3. Generate 5,000 Unique Indian & International Companies
  let prefixIdx = 0;
  let suffixIdx = 0;
  while (namesSet.size < 5000) {
    const p = PREFIXES[prefixIdx % PREFIXES.length];
    const s = SUFFIXES[suffixIdx % SUFFIXES.length];
    const tier = Math.floor(prefixIdx / PREFIXES.length) + 1;
    const isGlobal = (namesSet.size % 2 === 0);
    const suffixText = isGlobal ? 'Global' : 'India';
    const name = tier > 1 ? `${p} ${s} ${suffixText} ${tier}` : `${p} ${s} ${suffixText}`;
    namesSet.add(name);

    prefixIdx++;
    if (prefixIdx % PREFIXES.length === 0) suffixIdx++;
  }

  const namesArray = Array.from(namesSet);

  for (let i = 0; i < namesArray.length; i++) {
    const name = namesArray[i];
    const isIntl = i % 2 === 0 || name.includes('(USA)') || name.includes('(UK)') || name.includes('Global');
    const industry = INDUSTRIES[i % INDUSTRIES.length];
    const location = isIntl
      ? INTERNATIONAL_LOCATIONS[i % INTERNATIONAL_LOCATIONS.length]
      : INDIAN_LOCATIONS[i % INDIAN_LOCATIONS.length];
    const size = SIZES[i % SIZES.length];
    const isFeatured = i < 60;
    const rating = +(4.2 + (i % 8) * 0.1).toFixed(1);
    const reviewsCount = 60 + (i * 17) % 950;
    const openRolesCount = 2 + (i % 10);

    const roles = [];
    const roleCount = 2 + (i % 3);
    for (let r = 0; r < roleCount; r++) {
      const template = ROLE_TEMPLATES[(i + r) % ROLE_TEMPLATES.length];
      roles.push({
        title: template.title,
        category: template.category,
        salary: template.salary,
        type: r % 2 === 0 ? 'Full-time WFH' : 'Remote Contract',
        location
      });
    }

    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const website = `https://www.${cleanSlug}.com`;
    const logoBg = isIntl ? '4f46e5' : '059669';
    const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${logoBg}&color=fff&bold=true`;

    companies.push({
      name,
      industry,
      location,
      employeeCount: size,
      website,
      logo,
      rating,
      reviewsCount,
      openRolesCount,
      isFeatured,
      description: `${name} is a premier ${isIntl ? 'International Global' : 'Indian Enterprise'} pioneer in ${industry}. We offer 100% remote Work from Home (WFH) career opportunities and direct hiring privileges on FreelanceHub.`,
      openPositions: roles
    });
  }

  return companies;
}

async function seed5kCompanies() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('Clearing old companies collection...');
    await Company.deleteMany({});

    console.log('Generating 5,000 Indian & International Companies...');
    const companies = generate5kCompaniesList();

    console.log(`Inserting ${companies.length} companies into MongoDB Atlas in batches...`);
    const batchSize = 1000;
    for (let i = 0; i < companies.length; i += batchSize) {
      const batch = companies.slice(i, i + batchSize);
      await Company.insertMany(batch);
      console.log(`Inserted ${i + batch.length} / ${companies.length} companies...`);
    }

    console.log(`\n🎉 SUCCESS! ${companies.length} Indian & International companies active in MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed5kCompanies();
