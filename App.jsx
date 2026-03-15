import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS - Off-white + Dark Navy
   ═══════════════════════════════════════════════════════════════ */
const C = {
  bg0:"#F5F5F0",bg1:"#FAFAF7",bg2:"#FFFFFF",bg3:"#EEEEE8",bg4:"#E2E2DA",
  tx:"#1B2541",tx2:"#3D4A66",tx3:"#6B7694",tx4:"#97A0B5",
  bd:"#D6D9E0",bd2:"#C2C7D1",bd3:"#A8AFBD",
  navy:"#1B2541",navyMed:"#2C3A5C",navyLight:"#3D4F78",navyBg:"rgba(27,37,65,0.04)",navyBd:"rgba(27,37,65,0.12)",
  accent:"#1B2541",accentHover:"#2C3A5C",
  amber:"#B8860B",amberBg:"rgba(184,134,11,0.06)",
  red:"#C0392B",redBg:"rgba(192,57,43,0.05)",
  green:"#1A7A4C",greenBg:"rgba(26,122,76,0.05)",
  blue:"#2563EB",blueBg:"rgba(37,99,235,0.05)",
  violet:"#6D28D9",violetBg:"rgba(109,40,217,0.05)",
  orange:"#C2410C",orangeBg:"rgba(194,65,12,0.05)",
  teal:"#0F766E",tealBg:"rgba(15,118,110,0.05)",
};

const BATCH_C={
  "Federal":["#4338CA","rgba(67,56,202,0.06)"],
  "AI Company":["#7C3AED","rgba(124,58,237,0.06)"],
  "PE/PD":["#0F766E","rgba(15,118,110,0.06)"],
  "IB":["#1D4ED8","rgba(29,78,216,0.06)"],
  "Mgmt Consulting":["#B45309","rgba(180,83,9,0.06)"],
  "Tech Consulting":["#BE185D","rgba(190,24,93,0.06)"],
  "F500":["#A16207","rgba(161,98,7,0.06)"],
};

const STATUS=["Not Started","Researching","Networking","Applied","Screen","Interview","Offer","Rejected","Withdrawn"];
const STAT_C={
  "Not Started":[C.tx4,C.bg3],
  "Researching":[C.amber,C.amberBg],
  "Networking":[C.blue,C.blueBg],
  "Applied":[C.violet,C.violetBg],
  "Screen":[C.orange,C.orangeBg],
  "Interview":[C.teal,C.tealBg],
  "Offer":[C.green,C.greenBg],
  "Rejected":[C.red,C.redBg],
  "Withdrawn":[C.tx4,C.bg3],
};
const NXT={"Not Started":"Research company. Identify referral path.","Researching":"Find contacts on LinkedIn. Send 2-3 connection requests.","Networking":"Follow up contacts. Request referral or internal submission.","Applied":"Follow up with recruiter in 5 business days.","Screen":"Send thank-you within 24 hrs. Prep next round.","Interview":"Thank-you emails to all interviewers within 24 hrs.","Offer":"Evaluate comp. Negotiate. Respond by deadline.","Rejected":"Send thank-you. Ask for feedback. Maintain relationship.","Withdrawn":"Log reason. Maintain relationship."};
const FU_DAYS={"Not Started":3,"Researching":5,"Networking":7,"Applied":7,"Screen":3,"Interview":5,"Offer":2,"Rejected":999,"Withdrawn":999};

/* ═══════════════════════════════════════════════════════════════
   COMPANY LOGO DOMAINS
   ═══════════════════════════════════════════════════════════════ */
const LOGO_MAP={
  "CIA":"cia.gov","DIA":"dia.mil","U.S. Treasury":"treasury.gov","DLA":"dla.mil","NSA":"nsa.gov","NASA":"nasa.gov","NGA":"nga.mil",
  "Anthropic":"anthropic.com","OpenAI":"openai.com","Palantir":"palantir.com","Scale AI":"scale.com","Anduril":"anduril.com","Cohere":"cohere.com","Databricks":"databricks.com",
  "LLR Partners":"llrpartners.com","Ares Management":"aresmgmt.com","BlackRock":"blackrock.com","CW Partners":"cwpartners.com","Octus":"octus.com","ABS Capital":"abscapital.com",
  "Citizens Capital Mkts":"citizensbank.com","Deloitte Corp Finance":"deloitte.com","Oppenheimer":"oppenheimer.com","Intrepid IB":"intrepidib.com","Alantra":"alantra.com","Cantor Fitzgerald":"cantor.com","KeyBanc Capital Mkts":"key.com","PKF Investment Banking":"pkfib.com","TD Securities":"td.com","Mizuho Americas":"mizuhoamericas.com",
  "Alvarez & Marsal":"alvarezandmarsal.com","Huron Consulting":"huronconsultinggroup.com","Guidehouse":"guidehouse.com","Deloitte Consulting":"deloitte.com","EY-Parthenon":"ey.com","KPMG":"kpmg.com","Accenture Strategy":"accenture.com","Accenture":"accenture.com","FTI Consulting":"fticonsulting.com","McKinsey":"mckinsey.com",
  "Booz Allen Hamilton":"boozallen.com","West Monroe":"westmonroe.com","Slalom Consulting":"slalom.com","Cognizant":"cognizant.com","Capgemini Invent":"capgemini.com","Chartis Group":"chartis.com","IBM Consulting":"ibm.com","Infosys Consulting":"infosys.com",
  "Elevance Health":"elevancehealth.com","UHG / Optum":"unitedhealthgroup.com","Amazon":"amazon.com","NVIDIA":"nvidia.com","CVS Health":"cvshealth.com","Microsoft":"microsoft.com","Capital One":"capitalone.com","Cigna / Evernorth":"thecignagroup.com","Johnson & Johnson":"jnj.com","Google / Alphabet":"google.com",
  "Various LMM PE":"selbyjennings.com","Certify Health":"certifyhealth.com","Deloitte Consulting":"deloitte.com",
};
function logoUrl(co){const d=LOGO_MAP[co];return d?`https://logo.clearbit.com/${d}?size=80`:null}

/* ═══════════════════════════════════════════════════════════════
   72 ROLES
   ═══════════════════════════════════════════════════════════════ */
const ALL=[
  {id:1,co:"CIA",role:"Resource Analyst",batch:"Federal",score:52,warm:false,link:"https://www.cia.gov/careers/jobs/resource-analyst/",loc:"Washington, DC",sal:"$70K-$86K",posted:"2025-06-18",deadline:"2026-05-18",notes:"MyLINK (up to 4 positions). TS/SCI + poly. 12-18 mo process."},
  {id:2,co:"CIA",role:"Technical Careers - Data Science",batch:"Federal",score:50,warm:false,link:"https://www.cia.gov/careers",loc:"Washington, DC",sal:"$70K-$185K",posted:"2025-06-18",deadline:"2026-05-18",notes:"40+ tech tracks. Same MyLINK covers 4 roles."},
  {id:3,co:"CIA",role:"Finance Resource Officer",batch:"Federal",score:49,warm:false,link:"https://www.cia.gov/careers/jobs/finance-resource-officer/",loc:"Washington, DC",sal:"$70K-$86K",posted:"2025-06-18",deadline:"2026-05-18",notes:"GAAP, budget analysis. Developmental first 4-6 yrs."},
  {id:4,co:"CIA",role:"IG Auditor / Program Analyst",batch:"Federal",score:46,warm:false,link:"https://www.cia.gov/careers/jobs/ig-auditor-program-analyst/",loc:"Washington, DC",sal:"$70K-$86K",posted:"2025-06-18",deadline:"2026-05-18",notes:"Performance and financial audits."},
  {id:5,co:"DIA",role:"Finance & Acquisition Analyst",batch:"Federal",score:44,warm:false,link:"https://www.intelligencecareers.gov/dia",loc:"Washington, DC",sal:"$70K-$86K",posted:null,deadline:null,notes:"Programming, budgeting for defense intel."},
  {id:6,co:"U.S. Treasury",role:"IT Specialist (AI)",batch:"Federal",score:43,warm:false,link:"https://www.usajobs.gov/job/858700600",loc:"Negotiable",sal:"$86K-$158K",posted:"2025-12-01",deadline:"2026-04-20",notes:"Open continuous, weekly cutoffs. Secret clearance."},
  {id:7,co:"DLA",role:"Data Scientist (AI)",batch:"Federal",score:40,warm:false,link:"https://www.usajobs.gov/job/860242800",loc:"Multiple",sal:"$106K-$158K",posted:"2026-03-06",deadline:"2026-03-13",notes:"GS-13. Closes at 100 apps. Likely expired."},
  {id:8,co:"NSA",role:"Business Management Analyst",batch:"Federal",score:38,warm:false,link:"https://www.intelligencecareers.gov/nsa",loc:"Fort Meade, MD",sal:"$70K-$86K",posted:null,deadline:null,notes:"TS/SCI + full-scope polygraph."},
  {id:9,co:"NASA",role:"Financial Management Analyst",batch:"Federal",score:37,warm:false,link:"https://www.usajobs.gov",loc:"Various",sal:"$70K-$86K",posted:null,deadline:null,notes:"Workforce reductions ongoing."},
  {id:10,co:"NGA",role:"Source Analyst / Data Scientist",batch:"Federal",score:35,warm:false,link:"https://www.intelligencecareers.gov/nga",loc:"Springfield, VA",sal:"$70K-$86K",posted:null,deadline:null,notes:"No GIS experience = friction."},
  {id:11,co:"Anthropic",role:"Finance & Strategy, Product Intel",batch:"AI Company",score:62,warm:false,link:"https://job-boards.greenhouse.io/anthropic/jobs/5115051008",loc:"San Francisco / New York",sal:"$200K-$300K+",posted:"2026-03-10",deadline:null,notes:"Wants PE + strategic finance. Your exact profile."},
  {id:12,co:"Anthropic",role:"Account Coord, HC & Life Sci",batch:"AI Company",score:58,warm:false,link:"https://www.anthropic.com/careers/jobs",loc:"New York",sal:"$120K-$180K+",posted:"2026-03-01",deadline:null,notes:"70% deal support + 30% sales. HC depth."},
  {id:13,co:"Anthropic",role:"Analyst, The Anthropic Institute",batch:"AI Company",score:55,warm:false,link:"https://www.anthropic.com/careers/jobs",loc:"San Francisco",sal:"$140K-$200K+",posted:"2026-03-11",deadline:null,notes:"Junior analyst. AI policy/research."},
  {id:14,co:"OpenAI",role:"Strategic Finance, Compute",batch:"AI Company",score:48,warm:false,link:"https://openai.com/careers/strategic-finance-compute-san-francisco/",loc:"San Francisco",sal:"$250K-$400K+",posted:null,deadline:null,notes:"Likely wants 5+ yrs."},
  {id:15,co:"Palantir",role:"Forward Deployed AI Engineer",batch:"AI Company",score:46,warm:false,link:"https://jobs.lever.co/palantir/636fc05c",loc:"New York / Washington, DC / Palo Alto",sal:"$135K-$200K+",posted:null,deadline:null,notes:"Karat coding screen. CS preferred."},
  {id:16,co:"OpenAI",role:"AI Adoption Mgr, Gov",batch:"AI Company",score:44,warm:false,link:"https://openai.com/careers/search/",loc:"Washington, DC",sal:"$180K-$280K+",posted:null,deadline:null,notes:"Gov AI adoption content."},
  {id:17,co:"Scale AI",role:"Business Ops / Strategy Analyst",batch:"AI Company",score:43,warm:false,link:"https://scale.com/careers",loc:"San Francisco",sal:"$130K-$200K+",posted:null,deadline:null,notes:"Rotates frequently. Check for current openings."},
  {id:18,co:"Anduril",role:"Financial Analyst, Defense AI",batch:"AI Company",score:39,warm:false,link:"https://www.anduril.com/careers",loc:"Costa Mesa / Washington, DC",sal:"$120K-$200K+",posted:null,deadline:null,notes:"Defense background preferred."},
  {id:19,co:"Cohere",role:"Solutions Architect",batch:"AI Company",score:37,warm:false,link:"https://cohere.com/careers",loc:"San Francisco / New York / Toronto",sal:"$130K-$180K+",posted:null,deadline:null,notes:"3-5 yrs SE experience preferred."},
  {id:20,co:"Databricks",role:"SWE (New Grad 2026)",batch:"AI Company",score:34,warm:false,link:"https://www.databricks.com/company/careers",loc:"San Francisco / Seattle / New York",sal:"$150K-$220K+",posted:"2025-09-01",deadline:null,notes:"CS degree required. LeetCode-heavy."},
  {id:21,co:"LLR Partners",role:"Analyst, Investment Team",batch:"PE/PD",score:68,warm:false,link:"https://job-boards.greenhouse.io/llrpartnersjobs/jobs/4038451009",loc:"Philadelphia",sal:"$100K-$140K",posted:"2026-01-15",deadline:null,notes:"LMM PE, tech + HC. Summer 2026 start."},
  {id:22,co:"Ares Management",role:"Analyst/Assoc, Portfolio Mgmt (DL)",batch:"PE/PD",score:64,warm:false,link:"https://aresmgmt.wd1.myworkdayjobs.com/en-US/External",loc:"New York",sal:"$120K-$180K",posted:"2026-02-15",deadline:null,notes:"$623B AUM. MM direct loan monitoring."},
  {id:23,co:"Ares Management",role:"2026 Analyst, Commercial Finance",batch:"PE/PD",score:61,warm:false,link:"https://aresmgmt.wd1.myworkdayjobs.com/External",loc:"New York / Chicago",sal:"$85K-$120K",posted:"2025-09-11",deadline:null,notes:"New grad ABL analyst. Aug 2026 start."},
  {id:24,co:"LLR Partners",role:"Market Development Associate",batch:"PE/PD",score:59,warm:false,link:"https://www.llrpartners.com/jobs/",loc:"Philadelphia",sal:"$75K-$110K",posted:null,deadline:null,notes:"Deal sourcing BD."},
  {id:25,co:"BlackRock",role:"Associate, Private Credit (DL)",batch:"PE/PD",score:56,warm:false,link:"https://careers.blackrock.com",loc:"New York / Los Angeles",sal:"$135K-$180K",posted:null,deadline:null,notes:"2-5 yrs IB/DL."},
  {id:26,co:"CW Partners",role:"Healthcare PE Analyst (Placement)",batch:"PE/PD",score:55,warm:false,link:"https://cwpartners.com/jobs/",loc:"Varies",sal:"$100K-$160K",posted:null,deadline:null,notes:"Recruiter-placed at HC PE firms."},
  {id:27,co:"Ares Management",role:"Analyst/Assoc, Product Mgmt & IR",batch:"PE/PD",score:53,warm:false,link:"https://aresmgmt.wd1.myworkdayjobs.com/External",loc:"New York",sal:"$100K-$150K",posted:null,deadline:null,notes:"IR/marketing-facing."},
  {id:28,co:"Ares Management",role:"Associate, Corporate Strategy",batch:"PE/PD",score:51,warm:false,link:"https://aresmgmt.wd1.myworkdayjobs.com/External",loc:"New York",sal:"$120K-$170K",posted:null,deadline:null,notes:"Platform-level strategy."},
  {id:29,co:"Octus",role:"Private Credit Analyst (BDC)",batch:"PE/PD",score:48,warm:false,link:"",loc:"New York",sal:"$90K-$130K",posted:null,deadline:null,notes:"Research BDCs/DL funds. Writing focus."},
  {id:30,co:"Various LMM PE",role:"Analyst, HC Diligence (Headhunters)",batch:"PE/PD",score:45,warm:false,link:"https://www.selbyjennings.com/jobs/private-credit",loc:"Varies",sal:"$90K-$150K",posted:null,deadline:null,notes:"Via SG Partners, CPI, Oxbridge."},
  {id:31,co:"Citizens Capital Mkts",role:"IB Analyst II, HC/Tech",batch:"IB",score:63,warm:false,link:"https://www.citizensbank.com/careers",loc:"New York",sal:"$110K-$190K",posted:null,deadline:null,notes:"Top-15 MM bank. HC/tech preference."},
  {id:32,co:"Deloitte Corp Finance",role:"IB Analyst, HC & Life Sciences",batch:"IB",score:61,warm:true,link:"https://apply.deloitte.com",loc:"New York / Charlotte / Chicago",sal:"$100K-$170K",posted:null,deadline:null,notes:"Warm via Summer Clinics network."},
  {id:33,co:"Oppenheimer",role:"Healthcare M&A Associate",batch:"IB",score:59,warm:false,link:"https://www.oppenheimer.com/careers",loc:"New York",sal:"$150K-$250K",posted:null,deadline:null,notes:"Leading MM IB. 2+ yrs HC IB required."},
  {id:34,co:"Intrepid IB",role:"IB Analyst, Tech/HC Coverage",batch:"IB",score:57,warm:false,link:"https://intrepidib.com/careers/",loc:"Los Angeles / New York",sal:"$100K-$170K",posted:null,deadline:null,notes:"Boutique. Values entrepreneurial."},
  {id:35,co:"Alantra",role:"IB Analyst, M&A",batch:"IB",score:55,warm:false,link:"https://www.alantra.com/careers/",loc:"New York",sal:"$100K-$160K",posted:null,deadline:null,notes:"European MM. Cross-border."},
  {id:36,co:"Cantor Fitzgerald",role:"IB Analyst/Assoc, HC Services",batch:"IB",score:53,warm:false,link:"https://www.cantor.com/careers/",loc:"New York",sal:"$120K-$200K",posted:null,deadline:null,notes:"Growing HC group."},
  {id:37,co:"KeyBanc Capital Mkts",role:"IB Associate, Healthcare",batch:"IB",score:51,warm:false,link:"https://www.key.com/about/careers",loc:"New York / Cleveland",sal:"$150K-$250K",posted:null,deadline:null,notes:"MSF qualifies for associate track."},
  {id:38,co:"PKF Investment Banking",role:"IB Summer Analyst, M&A",batch:"IB",score:49,warm:false,link:"https://www.pkfib.com/careers",loc:"New York",sal:"$50K-$60K",posted:null,deadline:null,notes:"Summer only. Dec 2026/Spring 2027 grads."},
  {id:39,co:"TD Securities",role:"IB Associate, Healthcare",batch:"IB",score:47,warm:false,link:"https://jobs.td.com",loc:"New York",sal:"$150K-$250K",posted:null,deadline:null,notes:"Canadian bank. 1+ yr IB required."},
  {id:40,co:"Mizuho Americas",role:"IB Analyst, Healthcare",batch:"IB",score:44,warm:false,link:"https://www.mizuhoamericas.com/careers",loc:"New York",sal:"$130K-$220K",posted:null,deadline:null,notes:"Japanese BB. Open to non-BB backgrounds."},
  {id:41,co:"Alvarez & Marsal",role:"Associate, TAG",batch:"Mgmt Consulting",score:66,warm:false,link:"https://careers.alvarezandmarsal.com/",loc:"New York",sal:"$120K-$200K",posted:null,deadline:null,notes:"QofE/EBITDA bridges. Your Vinea job."},
  {id:42,co:"Huron Consulting",role:"Associate, HC Consulting",batch:"Mgmt Consulting",score:64,warm:false,link:"https://www.huronconsultinggroup.com/company/careers",loc:"Chicago / New York / Remote",sal:"$90K-$140K",posted:null,deadline:null,notes:"Pure-play HC consulting."},
  {id:43,co:"Guidehouse",role:"Consultant, HC Strategy",batch:"Mgmt Consulting",score:62,warm:false,link:"https://guidehouse.wd1.myworkdayjobs.com/External",loc:"Washington, DC / New York",sal:"$89K-$148K",posted:null,deadline:null,notes:"PwC spinoff. HC + national security."},
  {id:44,co:"Alvarez & Marsal",role:"Associate, PEPI",batch:"Mgmt Consulting",score:60,warm:false,link:"https://careers.alvarezandmarsal.com/",loc:"New York / All US",sal:"$110K-$180K",posted:null,deadline:null,notes:"Ops DD for PE sponsors. 80%+ travel."},
  {id:45,co:"Deloitte Consulting",role:"Analyst, Strategy & Ops",batch:"Mgmt Consulting",score:58,warm:true,link:"https://apply.deloitte.com",loc:"New York / Multiple",sal:"$105K-$155K",posted:null,deadline:null,notes:"Warm via Summer Clinics."},
  {id:46,co:"EY-Parthenon",role:"Associate, Txn Strategy",batch:"Mgmt Consulting",score:56,warm:false,link:"https://www.ey.com/en_us/careers",loc:"New York / Multiple",sal:"$110K-$175K",posted:null,deadline:null,notes:"Commercial DD for PE sponsors."},
  {id:47,co:"KPMG",role:"Consultant, Deal Advisory",batch:"Mgmt Consulting",score:55,warm:false,link:"https://www.kpmg.us/careers.html",loc:"New York / Multiple",sal:"$100K-$160K",posted:null,deadline:null,notes:"Financial DD, QofE. Identical to Vinea."},
  {id:48,co:"Accenture Strategy",role:"Consultant, HC & Public Svcs",batch:"Mgmt Consulting",score:53,warm:false,link:"https://www.accenture.com/us-en/careers",loc:"New York / Washington, DC",sal:"$100K-$165K",posted:null,deadline:null,notes:"Strategy + tech overlap."},
  {id:49,co:"FTI Consulting",role:"Associate, Restructuring",batch:"Mgmt Consulting",score:50,warm:false,link:"https://www.fticonsulting.com/careers",loc:"New York / Multiple",sal:"$100K-$170K",posted:null,deadline:null,notes:"Restructuring. Modeling-heavy."},
  {id:50,co:"McKinsey",role:"BA (Experienced Hire)",batch:"Mgmt Consulting",score:42,warm:false,link:"https://www.mckinsey.com/careers/search-jobs",loc:"New York / Multiple",sal:"$112K-$190K",posted:null,deadline:null,notes:"<1% acceptance. Rolling. Long shot."},
  {id:51,co:"Deloitte Consulting",role:"Consultant, AI & Data Eng (HC)",batch:"Tech Consulting",score:70,warm:true,link:"https://apply.deloitte.com",loc:"New York / Multiple",sal:"$105K-$165K",posted:null,deadline:null,notes:"HIGHEST PROBABILITY. Warm via Summer Clinics."},
  {id:52,co:"Booz Allen Hamilton",role:"Consultant, Health & Science AI",batch:"Tech Consulting",score:67,warm:false,link:"https://careers.boozallen.com/",loc:"McLean, VA / Washington, DC",sal:"$80K-$140K",posted:null,deadline:null,notes:"#1 Georgetown employer in DC."},
  {id:53,co:"West Monroe",role:"Consultant, AI & Analytics",batch:"Tech Consulting",score:65,warm:false,link:"https://www.westmonroe.com/careers",loc:"New York / Chicago",sal:"$90K-$140K",posted:null,deadline:null,notes:"Builder culture. Less travel."},
  {id:54,co:"Slalom Consulting",role:"Technology Consultant, Data & AI",batch:"Tech Consulting",score:63,warm:false,link:"https://www.slalom.com/us/en/careers",loc:"New York",sal:"$85K-$130K",posted:null,deadline:null,notes:"Local market. Best culture."},
  {id:55,co:"Accenture",role:"Consultant, Agentic AI & Data",batch:"Tech Consulting",score:61,warm:false,link:"https://www.accenture.com/us-en/careers",loc:"New York / Multiple",sal:"$95K-$165K",posted:null,deadline:null,notes:"30K+ AI hires globally."},
  {id:56,co:"Cognizant",role:"Associate, Digital Health & AI",batch:"Tech Consulting",score:58,warm:false,link:"https://careers.cognizant.com",loc:"New York / Multiple",sal:"$80K-$125K",posted:null,deadline:null,notes:"Deep HC via TriZetto."},
  {id:57,co:"Capgemini Invent",role:"Consultant, Tech Strategy",batch:"Tech Consulting",score:56,warm:false,link:"https://www.capgemini.com/us-en/careers/",loc:"New York / Multiple",sal:"$90K-$150K",posted:null,deadline:null,notes:"European origin. Growing US AI."},
  {id:58,co:"Chartis Group",role:"Sr Analyst, HC IT Consulting",batch:"Tech Consulting",score:55,warm:false,link:"https://www.chartis.com/careers",loc:"New York / Chicago",sal:"$85K-$120K",posted:null,deadline:null,notes:"Premier pure-play HC consulting."},
  {id:59,co:"IBM Consulting",role:"Data Engineer / AI Solutions",batch:"Tech Consulting",score:53,warm:false,link:"https://www.ibm.com/careers",loc:"New York / Multiple",sal:"$90K-$145K",posted:null,deadline:null,notes:"WatsonX. Cloud + AI."},
  {id:60,co:"Infosys Consulting",role:"Associate, AI & Digital",batch:"Tech Consulting",score:50,warm:false,link:"https://www.infosys.com/careers/",loc:"New York / Multiple",sal:"$75K-$120K",posted:null,deadline:null,notes:"Growing US AI. Lower bar."},
  {id:61,co:"Elevance Health",role:"Corp Dev Analyst/Associate",batch:"F500",score:66,warm:false,link:"https://careers.elevancehealth.com/jobs",loc:"Indianapolis / New York / Remote",sal:"$90K-$150K",posted:null,deadline:null,notes:"F20, $177B rev. HC M&A."},
  {id:62,co:"UHG / Optum",role:"Strategy & BD Analyst",batch:"F500",score:64,warm:false,link:"https://www.unitedhealthgroup.com/careers.html",loc:"Minneapolis / New York / Remote",sal:"$85K-$140K",posted:null,deadline:null,notes:"F3, $400B+."},
  {id:63,co:"Amazon",role:"Financial Analyst, AWS FP&A",batch:"F500",score:62,warm:false,link:"https://amazon.jobs/en/teams/fgbs/corporate-fpa",loc:"Seattle / Arlington, VA",sal:"$95K-$160K+",posted:null,deadline:null,notes:"LP interview. Python/SQL + modeling."},
  {id:64,co:"NVIDIA",role:"Sr Financial Analyst, IT FP&A",batch:"F500",score:60,warm:false,link:"https://www.nvidia.com/en-us/about-nvidia/careers/",loc:"Santa Clara, CA",sal:"$104K-$201K",posted:"2025-10-01",deadline:null,notes:"MSF new grad 2026."},
  {id:65,co:"CVS Health",role:"Corp Dev Analyst/Associate",batch:"F500",score:59,warm:false,link:"https://jobs.cvshealth.com",loc:"Woonsocket, RI / New York / Hartford, CT",sal:"$85K-$140K",posted:null,deadline:null,notes:"F5, $373B. Active acquirer."},
  {id:66,co:"Microsoft",role:"Finance Manager, Cloud & AI",batch:"F500",score:58,warm:false,link:"https://careers.microsoft.com",loc:"Redmond, WA",sal:"$120K-$180K+",posted:null,deadline:null,notes:"MSF qualifies FM level."},
  {id:67,co:"Capital One",role:"BA, Strategy & Analytics",batch:"F500",score:57,warm:false,link:"https://www.capitalonecareers.com/full-time-programs",loc:"McLean, VA / New York / Richmond, VA",sal:"$90K-$130K",posted:null,deadline:null,notes:"Data-driven. SQL/Python. Case interview."},
  {id:68,co:"Cigna / Evernorth",role:"HC Data Analytics Analyst",batch:"F500",score:55,warm:false,link:"https://jobs.thecignagroup.com",loc:"Bloomfield, CT / New York / Remote",sal:"$75K-$120K",posted:null,deadline:null,notes:"$247B. Python/SQL + HC domain."},
  {id:69,co:"Johnson & Johnson",role:"Associate, M&A Integration",batch:"F500",score:53,warm:false,link:"https://www.careers.jnj.com",loc:"New Brunswick, NJ / New York",sal:"$90K-$140K",posted:null,deadline:null,notes:"F42, $87B. MedTech/Pharma M&A."},
  {id:70,co:"Google / Alphabet",role:"Financial Analyst, HC&LS",batch:"F500",score:50,warm:false,link:"https://www.google.com/about/careers/",loc:"New York / Mountain View, CA",sal:"$120K-$180K+",posted:null,deadline:null,notes:"<2% callback. Long shot."},
  {id:71,co:"ABS Capital",role:"Investment Team Associate",batch:"PE/PD",score:72,warm:true,link:"https://abscapital.com/careers/",loc:"Baltimore / New York",sal:"$100K-$160K",posted:null,deadline:null,notes:"John Evans in network. Presented Certify Intel to partners."},
  {id:72,co:"Certify Health",role:"Product Strategy / CI (Internal)",batch:"Tech Consulting",score:75,warm:true,link:"",loc:"Gaithersburg, MD / Remote",sal:"$90K-$140K",posted:null,deadline:null,notes:"You built their platform. Propose FT role to CEO."},
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function td(){return new Date().toISOString().split("T")[0]}
function daysSince(d){return d?Math.floor((new Date()-new Date(d))/864e5):null}
function daysUntil(d){return d?Math.ceil((new Date(d)-new Date())/864e5):null}
function fmtD(d){if(!d)return null;return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function fmtDFull(d){if(!d)return null;return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
function urg(a){if(["Offer","Rejected","Withdrawn"].includes(a.status))return 0;const d=daysSince(a.lastTouch);if(d===null)return a.warm?10:5;const t=FU_DAYS[a.status]||7;return d>=t+3?10:d>=t?8:d>=t-2?5:2}
function urgLabel(u){return u>=8?{t:"Overdue",c:C.red,b:C.redBg}:u>=5?{t:"Due Soon",c:C.amber,b:C.amberBg}:{t:"On Track",c:C.green,b:C.greenBg}}
function parseLocs(loc){if(!loc)return[];const p=loc.split(/\s*\/\s*/).map(s=>s.trim()).filter(Boolean);return p.length>1?p:[]}
function scoreColor(s){return s>=70?C.green:s>=60?C.teal:s>=50?C.amber:C.tx4}

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:${C.bg0}}
::-webkit-scrollbar-thumb{background:${C.bd2};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .3s ease both}
.slide-down{animation:slideDown .25s ease both}
`;

/* ═══════════════════════════════════════════════════════════════
   LOGO COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function Logo({co,size=28}){
  const [ok,setOk]=useState(true);
  const url=logoUrl(co);
  if(!url||!ok)return <div style={{width:size,height:size,borderRadius:6,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:size*0.4,fontWeight:700,color:"#fff",fontFamily:'"Outfit",sans-serif'}}>{co.charAt(0)}</span></div>;
  return <img src={url} alt="" width={size} height={size} style={{borderRadius:6,objectFit:"contain",flexShrink:0,background:"#fff",border:`1px solid ${C.bd}`}} onError={()=>setOk(false)}/>;
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App(){
  const [apps,setApps]=useState(ALL.map(a=>({...a,status:"Not Started",appliedDate:null,lastTouch:null,appliedLoc:null,log:[]})));
  const [loaded,setLoaded]=useState(false);
  const [view,setView]=useState("dashboard");
  const [editId,setEditId]=useState(null);
  const [sort,setSort]=useState("score");
  const [fB,setFB]=useState("All");
  const [fS,setFS]=useState("All");
  const [search,setSrch]=useState("");
  const [sel,setSel]=useState(new Set());
  const [toast,setToast]=useState(null);
  const [locPick,setLocPick]=useState(null);
  const tm=useRef(null);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("hickey-v7");if(r?.value){const d=JSON.parse(r.value);if(d.length>=70)setApps(d)}}catch(e){}setLoaded(true)})()},[]);
  const save=useCallback(async(d)=>{setApps(d);try{await window.storage.set("hickey-v7",JSON.stringify(d))}catch(e){}},[]);
  const flash=msg=>{setToast(msg);clearTimeout(tm.current);tm.current=setTimeout(()=>setToast(null),2200)};

  const upd=(id,u)=>{save(apps.map(a=>{if(a.id!==id)return a;const up={...a,...u};up.log=[...(a.log||[]),{d:td(),a:u.status?`Status -> ${u.status}`:u.appliedLoc?`Loc: ${u.appliedLoc}`:"Touch",p:a.status}];return up}))};
  const confirmApply=(id,loc)=>{const a=apps.find(x=>x.id===id);save(apps.map(x=>{if(x.id!==id)return x;return{...x,status:"Applied",appliedDate:td(),lastTouch:td(),appliedLoc:loc||x.loc,log:[...(x.log||[]),{d:td(),a:`Applied${loc?" - "+loc:""}`,p:x.status}]}}));setLocPick(null);flash(`${a.co} marked Applied${loc?" at "+loc:""}`)};
  const markApplied=id=>{const a=apps.find(x=>x.id===id);const locs=parseLocs(a.loc);locs.length>1?setLocPick({id,co:a.co,role:a.role,locs,cb:loc=>confirmApply(id,loc)}):confirmApply(id,a.loc)};
  const openTrack=a=>{if(a.link)window.open(a.link,"_blank");const locs=parseLocs(a.loc);locs.length>1?setLocPick({id:a.id,co:a.co,role:a.role,locs,cb:loc=>confirmApply(a.id,loc),hasSkip:true}):setToast({type:"confirm",id:a.id,co:a.co,loc:a.loc})};
  const adv=id=>{const a=apps.find(x=>x.id===id);const i=STATUS.indexOf(a.status);if(i<STATUS.length-3){const ns=STATUS[i+1];if(ns==="Applied"){markApplied(id);return}upd(id,{status:ns,lastTouch:td()});flash(`${a.co} -> ${ns}`)}};
  const touch=id=>{upd(id,{lastTouch:td()});flash("Touch logged")};
  const rej=id=>{upd(id,{status:"Rejected",lastTouch:td()});flash("Rejected")};
  const reset=()=>{if(confirm("Reset all 72 applications?")){save(ALL.map(a=>({...a,status:"Not Started",appliedDate:null,lastTouch:null,appliedLoc:null,log:[]})))}};
  const toggleSel=id=>{const n=new Set(sel);n.has(id)?n.delete(id):n.add(id);setSel(n)};
  const batchAct=act=>{const ids=[...sel];save(apps.map(a=>{if(!ids.includes(a.id))return a;const u={lastTouch:td()};if(act==="applied"){u.status="Applied";if(!a.appliedDate)u.appliedDate=td()}else if(act==="rejected")u.status="Rejected";u.log=[...(a.log||[]),{d:td(),a:`Bulk ${act}`,p:a.status}];return{...a,...u}}));setSel(new Set());flash(`${ids.length} updated`)};

  const batches=["All",...Object.keys(BATCH_C)];
  const filtered=apps.filter(a=>(fB==="All"||a.batch===fB)&&(fS==="All"||a.status===fS)&&(!search||(a.co+a.role).toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>sort==="urgency"?urg(b)-urg(a):sort==="score"?b.score-a.score:sort==="deadline"?((a.deadline||"9")<(b.deadline||"9")?-1:1):a.co.localeCompare(b.co));
  const active=apps.filter(a=>!["Rejected","Withdrawn","Offer"].includes(a.status));
  const deadlineSoon=apps.filter(a=>a.deadline&&daysUntil(a.deadline)>=0&&daysUntil(a.deadline)<=14&&!["Rejected","Withdrawn","Offer"].includes(a.status)&&STATUS.indexOf(a.status)<3).sort((a,b)=>daysUntil(a.deadline)-daysUntil(b.deadline));

  const metrics=[
    {l:"Total",v:apps.length,c:C.navy},
    {l:"Active",v:active.length,c:C.blue},
    {l:"Applied",v:apps.filter(a=>STATUS.indexOf(a.status)>=3&&!["Rejected","Withdrawn"].includes(a.status)).length,c:C.violet},
    {l:"Interviews",v:apps.filter(a=>["Screen","Interview"].includes(a.status)).length,c:C.teal},
    {l:"Overdue",v:apps.filter(a=>urg(a)>=8).length,c:C.red},
    {l:"Offers",v:apps.filter(a=>a.status==="Offer").length,c:C.green},
    {l:"Warm",v:apps.filter(a=>a.warm).length,c:C.teal},
    {l:"Rejected",v:apps.filter(a=>a.status==="Rejected").length,c:C.tx4},
  ];

  if(!loaded)return(<div style={{background:C.bg0,color:C.tx3,fontFamily:'"Outfit",sans-serif',height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>Loading...</div>);

  /* ── Sub-components ── */
  const Pill=({text,color:cl,bg,mono})=><span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:4,background:bg||C.bg3,color:cl||C.tx2,fontFamily:mono?'"JetBrains Mono",monospace':'"Outfit",sans-serif',letterSpacing:mono?"0.03em":"0.01em",whiteSpace:"nowrap",lineHeight:"18px",display:"inline-block"}}>{text}</span>;

  const Btn=({children,onClick,primary,danger,ghost,small})=>{
    const base={fontSize:small?10:11,fontWeight:600,padding:small?"4px 10px":"6px 16px",borderRadius:6,cursor:"pointer",border:"none",fontFamily:'"Outfit",sans-serif',transition:"all 0.15s",letterSpacing:"0.01em"};
    const theme=primary?{background:C.navy,color:"#fff"}:danger?{background:C.redBg,color:C.red,border:`1px solid rgba(192,57,43,0.12)`}:ghost?{background:"transparent",color:C.tx3,border:`1px solid ${C.bd}`}:{background:C.bg3,color:C.tx2,border:`1px solid ${C.bd}`};
    return <button onClick={onClick} style={{...base,...theme}} onMouseEnter={e=>{if(primary){e.target.style.background=C.navyLight}else{e.target.style.borderColor=C.navy;e.target.style.color=C.navy}}} onMouseLeave={e=>{if(primary){e.target.style.background=C.navy}else{e.target.style.borderColor=theme.border?C.bd:"";e.target.style.color=theme.color}}}>{children}</button>};

  const DeadlineTag=({a})=>{
    const dl=daysUntil(a.deadline);
    if(!a.deadline)return <span style={{fontSize:10,color:C.tx4,fontFamily:'"JetBrains Mono",monospace'}}>--</span>;
    if(dl<0)return <Pill text="Expired" color={C.red} bg={C.redBg} mono/>;
    if(dl<=3)return <Pill text={`${dl}d left`} color={C.red} bg={C.redBg} mono/>;
    if(dl<=14)return <Pill text={`${dl}d left`} color={C.amber} bg={C.amberBg} mono/>;
    return <Pill text={`${dl}d`} color={C.green} bg={C.greenBg} mono/>;
  };
  const PostedTag=({d})=>{
    if(!d)return <span style={{fontSize:10,color:C.tx4,fontFamily:'"JetBrains Mono",monospace'}}>--</span>;
    const ago=daysSince(d);
    const label=ago<=1?"Today":ago<=7?`${ago}d ago`:ago<=30?`${Math.floor(ago/7)}w ago`:ago<=365?`${Math.floor(ago/30)}mo ago`:`${Math.floor(ago/365)}y ago`;
    return <span style={{fontSize:10,color:ago>90?C.tx4:C.tx3,fontFamily:'"JetBrains Mono",monospace'}} title={fmtDFull(d)}>{label}</span>;
  };
  const ScoreBar=({score})=>{const cl=scoreColor(score);
    return <div style={{display:"flex",alignItems:"center",gap:5}}>
      <span style={{fontSize:12,fontWeight:700,fontFamily:'"JetBrains Mono",monospace',color:cl,minWidth:22,textAlign:"right"}}>{score}</span>
      <div style={{width:44,height:4,background:C.bg4,borderRadius:2}}><div style={{height:4,borderRadius:2,background:cl,width:`${score}%`,transition:"width 0.4s ease"}}/></div>
    </div>};

  /* ═══════ CARD ═══════ */
  const Card=({a})=>{const u=urgLabel(urg(a));const bc=(BATCH_C[a.batch]||[C.navy])[0];const isOpen=editId===a.id;
    return(<div className="fade-up" style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"16px 20px",marginBottom:8,borderLeft:`3px solid ${bc}`,transition:"all 0.2s",boxShadow:"0 1px 3px rgba(27,37,65,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.boxShadow="0 4px 16px rgba(27,37,65,0.08)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.boxShadow="0 1px 3px rgba(27,37,65,0.04)";e.currentTarget.style.borderLeftColor=bc}}>
      {/* Row 1 */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1,minWidth:0,display:"flex",gap:12,alignItems:"flex-start"}}>
          <input type="checkbox" checked={sel.has(a.id)} onChange={()=>toggleSel(a.id)} style={{accentColor:C.navy,marginTop:6}}/>
          <Logo co={a.co} size={32}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:15,fontWeight:700,color:C.navy,letterSpacing:"-0.02em"}}>{a.co}</span>
              {a.warm&&<span style={{fontSize:8,fontWeight:800,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em",padding:"2px 6px",background:C.tealBg,borderRadius:3,border:`1px solid rgba(15,118,110,0.15)`}}>Warm</span>}
              <Pill text={a.batch} color={(BATCH_C[a.batch]||[C.navy])[0]} bg={(BATCH_C[a.batch]||[C.navy,C.navyBg])[1]}/>
            </div>
            <div style={{fontSize:13,color:C.tx2,marginTop:2,fontWeight:500}}>{a.role}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <ScoreBar score={a.score}/>
          <select value={a.status} onChange={e=>{const v=e.target.value;if(v==="Applied"&&STATUS.indexOf(a.status)<3){markApplied(a.id);return}upd(a.id,{status:v,lastTouch:td(),...(v==="Applied"&&!a.appliedDate?{appliedDate:td()}:{})});flash(`${a.co}: ${v}`)}} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:6,background:STAT_C[a.status]?.[1]||C.bg3,color:STAT_C[a.status]?.[0]||C.tx3,border:`1px solid ${C.bd}`,cursor:"pointer",fontFamily:'"Outfit",sans-serif',outline:"none"}}>
            {STATUS.map(st=><option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>
      {/* Row 2: Meta */}
      <div style={{display:"flex",gap:16,marginTop:12,alignItems:"center",flexWrap:"wrap",paddingLeft:76}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:9,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Loc</span>
          <span style={{fontSize:11,color:a.appliedLoc?C.teal:C.tx2,fontWeight:a.appliedLoc?600:400}}>{a.appliedLoc||a.loc}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:9,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Comp</span>
          <span style={{fontSize:11,color:C.tx2,fontFamily:'"JetBrains Mono",monospace'}}>{a.sal}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:9,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Posted</span>
          <PostedTag d={a.posted}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:9,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Deadline</span>
          <DeadlineTag a={a}/>
        </div>
        <Pill text={u.t} color={u.c} bg={u.b}/>
      </div>
      {/* Row 3: Action + controls */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,gap:10,flexWrap:"wrap",paddingLeft:76}}>
        <div style={{fontSize:11,color:C.tx3,fontStyle:"italic",flex:1,minWidth:0}}>{NXT[a.status]}</div>
        <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap"}}>
          {STATUS.indexOf(a.status)<3&&<Btn primary small onClick={()=>markApplied(a.id)}>I Applied</Btn>}
          {a.link&&<Btn small onClick={()=>openTrack(a)}>Open + Track</Btn>}
          <Btn small ghost onClick={()=>adv(a.id)}>Advance</Btn>
          <Btn small ghost onClick={()=>touch(a.id)}>Touch</Btn>
          <Btn small danger onClick={()=>rej(a.id)}>Reject</Btn>
          <Btn small ghost onClick={()=>setEditId(isOpen?null:a.id)}>{isOpen?"Close":"Log"}</Btn>
        </div>
      </div>
      {/* Expandable */}
      {isOpen&&<div style={{marginTop:14,borderTop:`1px solid ${C.bd}`,paddingTop:14,marginLeft:76}}>
        <div style={{display:"flex",gap:10,marginBottom:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Notes</span>
          {a.appliedDate&&<span style={{fontSize:10,color:C.violet,fontFamily:'"JetBrains Mono",monospace'}}>Applied {fmtDFull(a.appliedDate)}</span>}
          {a.lastTouch&&<span style={{fontSize:10,color:C.tx4,fontFamily:'"JetBrains Mono",monospace'}}>Last touch {daysSince(a.lastTouch)}d ago</span>}
        </div>
        <textarea value={a.notes} onChange={e=>upd(a.id,{notes:e.target.value})} rows={2} style={{width:"100%",fontSize:11,padding:"8px 12px",borderRadius:6,background:C.bg0,border:`1px solid ${C.bd}`,color:C.tx2,fontFamily:'"Outfit",sans-serif',outline:"none",resize:"vertical"}}/>
        {a.log?.length>0&&<div style={{marginTop:10}}>
          <span style={{fontSize:9,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Activity</span>
          <div style={{marginTop:4,maxHeight:100,overflowY:"auto"}}>
            {[...a.log].reverse().slice(0,8).map((l,i)=><div key={i} style={{fontSize:10,color:C.tx4,padding:"2px 0",fontFamily:'"JetBrains Mono",monospace',display:"flex",gap:10}}><span style={{color:C.tx3,minWidth:70}}>{l.d}</span><span>{l.a}</span></div>)}
          </div>
        </div>}
      </div>}
    </div>)};

  /* ═══════ KANBAN CARD ═══════ */
  const KCard=({a})=>{const u=urgLabel(urg(a));const bc=(BATCH_C[a.batch]||[C.navy])[0];
    return <div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:8,padding:"10px 12px",marginBottom:6,borderLeft:`3px solid ${bc}`,transition:"all 0.15s",boxShadow:"0 1px 2px rgba(27,37,65,0.03)"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 3px 12px rgba(27,37,65,0.08)";e.currentTarget.style.borderColor=C.navy}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 2px rgba(27,37,65,0.03)";e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.borderLeftColor=bc}}>
      <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
        <Logo co={a.co} size={22}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:12,fontWeight:700,color:C.navy}}>{a.co}</span>
            <span style={{fontSize:10,fontWeight:700,fontFamily:'"JetBrains Mono",monospace',color:scoreColor(a.score)}}>{a.score}</span>
          </div>
          <div style={{fontSize:10,color:C.tx3,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.role}</div>
        </div>
      </div>
      {a.appliedLoc&&<div style={{fontSize:9,color:C.teal,fontWeight:600,marginTop:3,marginLeft:30}}>{a.appliedLoc}</div>}
      <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap",alignItems:"center",marginLeft:30}}>
        {a.posted&&<PostedTag d={a.posted}/>}
        {a.deadline&&<DeadlineTag a={a}/>}
      </div>
      <div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap",marginLeft:30}}>
        <Pill text={u.t} color={u.c} bg={u.b}/>
        {a.warm&&<Pill text="W" color={C.teal} bg={C.tealBg}/>}
      </div>
      <div style={{display:"flex",gap:3,marginTop:7,marginLeft:30}}>
        {STATUS.indexOf(a.status)<3&&<Btn primary small onClick={()=>markApplied(a.id)}>Applied</Btn>}
        <Btn small ghost onClick={()=>adv(a.id)}>Adv</Btn>
        <Btn small ghost onClick={()=>touch(a.id)}>Touch</Btn>
      </div>
    </div>};

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return(<div style={{background:C.bg0,minHeight:"100vh",color:C.tx,fontFamily:'"Outfit",sans-serif'}}>
    <style>{css}</style>

    {/* Toasts */}
    {toast&&typeof toast==="string"&&<div className="slide-down" style={{position:"sticky",top:0,zIndex:99,background:C.navy,color:"#fff",padding:"9px 20px",fontSize:12,fontWeight:600,textAlign:"center",letterSpacing:"0.01em"}}>{toast}</div>}
    {toast?.type==="confirm"&&<div className="slide-down" style={{position:"sticky",top:0,zIndex:99,background:C.bg2,borderBottom:`2px solid ${C.navy}`,padding:"10px 20px",fontSize:12,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 12px rgba(27,37,65,0.08)"}}>
      <span style={{color:C.tx2}}>Did you submit to <strong style={{color:C.navy}}>{toast.co}</strong>?</span>
      <div style={{display:"flex",gap:6}}>
        <Btn primary small onClick={()=>{confirmApply(toast.id,toast.loc);setToast(null)}}>Yes, Applied</Btn>
        <Btn small ghost onClick={()=>{touch(toast.id);setToast(null)}}>Not yet</Btn>
      </div>
    </div>}
    {locPick&&<div className="slide-down" style={{position:"sticky",top:0,zIndex:100,background:C.bg2,borderBottom:`2px solid ${C.navy}`,padding:"16px 20px",boxShadow:"0 4px 16px rgba(27,37,65,0.1)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Logo co={locPick.co} size={28}/>
        <div><div style={{fontSize:14,fontWeight:700,color:C.navy}}>Select office for {locPick.co}</div><div style={{fontSize:11,color:C.tx3}}>{locPick.role}</div></div>
      </div>
      <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
        {locPick.locs.map(loc=><Btn primary key={loc} onClick={()=>locPick.cb(loc)}>{loc}</Btn>)}
        {locPick.hasSkip&&<Btn ghost onClick={()=>{touch(locPick.id);setLocPick(null)}}>Not yet</Btn>}
        <Btn ghost onClick={()=>setLocPick(null)}>Cancel</Btn>
      </div>
    </div>}

    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px 14px",borderBottom:"none",background:"#1A6B4A"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:"#fff",boxShadow:"0 0 0 3px rgba(255,255,255,0.2)"}}/>
        <span style={{fontSize:18,fontWeight:800,letterSpacing:"-0.03em",color:"#fff"}}>Job Tracker</span>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.65)",fontFamily:'"JetBrains Mono",monospace',marginLeft:4}}>72 roles / 7 verticals</span>
      </div>
      <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.12)",borderRadius:8,padding:3,border:"1px solid rgba(255,255,255,0.15)"}}>
        {["dashboard","pipeline","kanban"].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:"8px 20px",borderRadius:6,fontSize:11,fontWeight:view===v?700:500,cursor:"pointer",border:"none",background:view===v?C.navy:"transparent",color:view===v?"#fff":view===v?"#fff":"rgba(255,255,255,0.7)",transition:"all 0.12s",fontFamily:'"Outfit",sans-serif',letterSpacing:"0.01em"}}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
      </div>
    </div>

    <div style={{padding:"20px 24px 60px"}}>
      {/* Metrics */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:8,marginBottom:24}}>
        {metrics.map((m,i)=><div key={m.l} className="fade-up" style={{background:C.bg2,borderRadius:10,padding:"16px 18px",border:`1px solid ${C.bd}`,animationDelay:`${i*40}ms`,boxShadow:"0 1px 3px rgba(27,37,65,0.03)"}}>
          <div style={{fontSize:9,fontWeight:700,color:C.tx4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{m.l}</div>
          <div style={{fontSize:26,fontWeight:800,color:m.c,marginTop:4,fontFamily:'"JetBrains Mono",monospace',letterSpacing:"-0.03em"}}>{m.v}</div>
        </div>)}
      </div>

      {/* ══════════ DASHBOARD ══════════ */}
      {view==="dashboard"&&<div>
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {Object.entries(BATCH_C).map(([b,[cl,bg]])=>{const n=apps.filter(a=>a.batch===b&&!["Rejected","Withdrawn"].includes(a.status)).length;
            return <div key={b} onClick={()=>{setFB(b);setView("pipeline")}} style={{flex:1,background:bg,border:`1px solid ${cl}18`,borderRadius:10,padding:"14px 12px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=cl;e.currentTarget.style.boxShadow=`0 2px 12px ${cl}15`}} onMouseLeave={e=>{e.currentTarget.style.borderColor=cl+"18";e.currentTarget.style.boxShadow="none"}}>
              <div style={{fontSize:24,fontWeight:800,color:cl,fontFamily:'"JetBrains Mono",monospace'}}>{n}</div>
              <div style={{fontSize:9,color:C.tx3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{b}</div>
            </div>})}
        </div>
        {deadlineSoon.length>0&&<div style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.red}}/>
            <span style={{fontSize:12,fontWeight:800,color:C.red,textTransform:"uppercase",letterSpacing:"0.06em"}}>Deadlines Closing</span>
          </div>
          {deadlineSoon.map(a=><Card key={a.id} a={a}/>)}
        </div>}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.amber}}/>
          <span style={{fontSize:12,fontWeight:800,color:C.amber,textTransform:"uppercase",letterSpacing:"0.06em"}}>Requires Action ({apps.filter(a=>urg(a)>=5).length})</span>
        </div>
        {apps.filter(a=>urg(a)>=5).sort((a,b)=>urg(b)-urg(a)).slice(0,12).map(a=><Card key={a.id} a={a}/>)}
        {apps.filter(a=>urg(a)>=5).length>12&&<div onClick={()=>setView("pipeline")} style={{textAlign:"center",padding:14,fontSize:12,color:C.navy,cursor:"pointer",fontWeight:600}}>View all in Pipeline</div>}
      </div>}

      {/* ══════════ PIPELINE ══════════ */}
      {view==="pipeline"&&<div>
        <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSrch(e.target.value)} placeholder="Search company or role..." style={{fontSize:12,padding:"7px 14px",borderRadius:8,background:C.bg2,border:`1px solid ${C.bd}`,color:C.tx,outline:"none",fontFamily:'"Outfit",sans-serif',width:200}} onFocus={e=>e.target.style.borderColor=C.navy} onBlur={e=>e.target.style.borderColor=C.bd}/>
          <div style={{display:"flex",gap:2,background:C.bg2,borderRadius:6,padding:2,border:`1px solid ${C.bd}`}}>
            {["score","urgency","deadline","company"].map(x=><button key={x} onClick={()=>setSort(x)} style={{padding:"5px 12px",borderRadius:4,fontSize:10,fontWeight:sort===x?700:500,cursor:"pointer",border:"none",background:sort===x?C.navy:"transparent",color:sort===x?"#fff":C.tx4,fontFamily:'"Outfit",sans-serif',transition:"all 0.1s"}}>{x}</button>)}
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
          {batches.map(b=>{const [cl]=BATCH_C[b]||[C.navy];return <button key={b} onClick={()=>setFB(b)} style={{padding:"4px 12px",borderRadius:5,fontSize:10,fontWeight:fB===b?700:500,cursor:"pointer",border:`1px solid ${fB===b?cl:C.bd}`,background:fB===b?cl+"0C":"transparent",color:fB===b?cl:C.tx4,fontFamily:'"Outfit",sans-serif',transition:"all 0.1s"}}>{b}</button>})}
        </div>
        <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
          {["All",...STATUS.filter(x=>apps.some(a=>a.status===x))].map(x=>{const [cl]=STAT_C[x]||[C.tx3];return <button key={x} onClick={()=>setFS(x)} style={{padding:"4px 12px",borderRadius:5,fontSize:10,fontWeight:fS===x?700:500,cursor:"pointer",border:`1px solid ${fS===x?cl+"50":C.bd}`,background:fS===x?cl+"08":"transparent",color:fS===x?cl:C.tx4,fontFamily:'"Outfit",sans-serif',transition:"all 0.1s"}}>{x}{x!=="All"?` (${apps.filter(a=>a.status===x).length})`:""}</button>})}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center"}}>
          <Btn small ghost onClick={()=>setSel(new Set(filtered.map(a=>a.id)))}>Select all</Btn>
          {sel.size>0&&<><Btn small ghost onClick={()=>setSel(new Set())}>Deselect</Btn>
            <span style={{fontSize:10,color:C.tx3,fontFamily:'"JetBrains Mono",monospace'}}>{sel.size} selected</span>
            <Btn small primary onClick={()=>batchAct("applied")}>Bulk Applied</Btn>
            <Btn small ghost onClick={()=>batchAct("touch")}>Bulk Touch</Btn>
            <Btn small danger onClick={()=>batchAct("rejected")}>Bulk Reject</Btn>
          </>}
          <div style={{marginLeft:"auto"}}><Btn small ghost onClick={reset}>Reset All</Btn></div>
        </div>
        <div style={{fontSize:10,color:C.tx4,marginBottom:8,fontFamily:'"JetBrains Mono",monospace'}}>{filtered.length} of {apps.length}</div>
        {filtered.map(a=><Card key={a.id} a={a}/>)}
      </div>}

      {/* ══════════ KANBAN ══════════ */}
      {view==="kanban"&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,alignItems:"start"}}>
        {[{l:"Backlog",s:["Not Started","Researching"],c:C.tx4},{l:"In Progress",s:["Networking","Applied"],c:C.blue},{l:"Interviewing",s:["Screen","Interview"],c:C.teal},{l:"Closed",s:["Offer","Rejected","Withdrawn"],c:C.tx4}].map(col=><div key={col.l}>
          <div style={{fontSize:10,fontWeight:800,color:col.c,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,textAlign:"center",paddingBottom:8,borderBottom:`2px solid ${col.c}20`}}>{col.l} <span style={{fontFamily:'"JetBrains Mono",monospace',fontWeight:600,color:C.tx4}}>({apps.filter(a=>col.s.includes(a.status)).length})</span></div>
          {apps.filter(a=>col.s.includes(a.status)).sort((a,b)=>urg(b)-urg(a)).map(a=><KCard key={a.id} a={a}/>)}
        </div>)}
      </div>}
    </div>
  </div>)
}
