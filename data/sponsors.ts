export type SponsorTier = "platinum" | "gold" | "silver" | "bronze"

export interface Sponsor {
  id: string
  name: string
  tier: SponsorTier
  logo: string            // path to logo image
  shortDescription: string
  longDescription: string
  website: string
  contactEmail?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  /** If a speaker from this sponsor is presenting, link to their anchor/section */
  speakerSlug?: string
}

export const TIER_CONFIG: Record<SponsorTier, {
  label: string
  color: string
  textClass: string
  borderClass: string
  bgClass: string
  metalGradient: string
  metalOverlay: string
  metalRing: string
}> = {
  platinum: {
    label: "Platinum",
    color: "#8cbed6",
    textClass: "text-[#8cbed6]",
    borderClass: "border-[#8cbed6]/60",
    bgClass: "bg-[#8cbed6]/10",
    metalGradient: `linear-gradient(135deg,
      #4a8aaa 0%, #a8d8ea 10%, #ddf0f7 22%, #8cbed6 34%,
      #5e9eb8 46%, #c2e4f0 58%, #ffffff 70%, #9acde0 82%, #3a7a9a 100%)`,
    metalOverlay: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
    metalRing: "ring-2 ring-[#8cbed6]/60",
  },
  gold: {
    label: "Gold",
    color: "#FFD700",
    textClass: "text-[#FFD700]",
    borderClass: "border-[#FFD700]/30",
    bgClass: "bg-[#FFD700]/10",
    metalGradient: `linear-gradient(135deg,
      #7a5210 0%, #c9951a 10%, #f4c430 22%, #fff2a8 34%,
      #e6b422 46%, #b8860b 58%, #f1c40f 70%, #fff2a8 82%, #7a5210 100%)`,
    metalOverlay: "radial-gradient(ellipse at 30% 20%, rgba(255,240,180,0.55) 0%, rgba(255,240,180,0) 55%)",
    metalRing: "ring-2 ring-yellow-300/60",
  },
  silver: {
    label: "Silver",
    color: "#C0C0C0",
    textClass: "text-[#C0C0C0]",
    borderClass: "border-[#C0C0C0]/30",
    bgClass: "bg-[#C0C0C0]/10",
    metalGradient: `linear-gradient(135deg,
      #6b6b6b 0%, #cfcfcf 10%, #ffffff 22%, #b8b8b8 34%,
      #8a8a8a 46%, #e8e8e8 58%, #ffffff 70%, #bdbdbd 82%, #5a5a5a 100%)`,
    metalOverlay: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 55%)",
    metalRing: "ring-2 ring-gray-200/60",
  },
  bronze: {
    label: "Bronze",
    color: "#CD7F32",
    textClass: "text-[#CD7F32]",
    borderClass: "border-[#CD7F32]/30",
    bgClass: "bg-[#CD7F32]/10",
    metalGradient: `linear-gradient(135deg,
      #5c3000 0%, #a0522d 10%, #cd7f32 22%, #e8a857 34%,
      #c68642 46%, #8b4513 58%, #cd8b4a 70%, #e8c080 82%, #5c3000 100%)`,
    metalOverlay: "radial-gradient(ellipse at 30% 20%, rgba(232,192,128,0.5) 0%, rgba(232,192,128,0) 55%)",
    metalRing: "ring-2 ring-amber-600/60",
  },
}

export const sponsors: Sponsor[] = [
  {
    id: "isense-iccs",
    name: "ISENSE Group -ICCS",
    tier: "platinum",
    logo: "/images/sponsors/isense-logo.png",
    shortDescription: "Advancing research and inovation in the fields of electrical, electronic and computer engineering & technologies",
    longDescription: `Since its establishment in 2002, I-SENSE has evolved into a leading European hub for basic and applied research in electrical, electronic, and computer engineering—combining academic excellence, technological innovation, and a strong collaborative spirit.

Today, the Group brings together 10 cutting-edge research divisions and a global network of more than 300 partners, driving advancements in intelligent transport systems, smart and sustainable technologies, virtual and immersive environments, AI applications, robotics and industry 5.0 applications and beyond.

With a track record of 200+ successful EU and national projects, a highly skilled team of over 100 researchers and engineers, and two active spin-offs, I-SENSE stands at the intersection of science, innovation, and industry, turning research into real-world impact and shaping the technologies of tomorrow.`,
    website: "https://i-sense.iccs.gr/",
    contactEmail: "sponsors@example.com",
    socialLinks: { linkedin: "#", twitter: "#" },
    speakerSlug: "dr-jane-smith",
  },
  {
    id: "sabo",
    name: "SABO S.A.",
    tier: "gold",
    logo: "/images/sponsors/SABO-logo.avif",
    shortDescription: "Greek industry leader since 1984, providing turnkey automation, robotics, and heavy clay solutions across 64+ countries.",
    longDescription: `SABO S.A., a Greek company founded in 1984, operates in more than 64 countries worldwide, exporting 90% of its annual turnover. The company is a member of SABO GROUP with headquarters located in Vassiliko of Evia in Greece and subsidiaries in Brazil, Romania and Italy.

SABO S.A. is one of the leading companies worldwide specialized in providing turnkey solutions for the Heavy Clay Industry. It also stands out in other areas of industrial sectors by providing Automation and Robotic Systems for material handling and packaging, turnkey electrical solutions and industrial automation, equipment and services for heavy industrial units, as well as customized equipment and integrated solutions for the management of Solid Waste.

Technical know-how and innovation, high-quality standards, qualified and experienced personnel along with strong after-sales support services, are the key competitive advantages of the company.`,
    website: "https://el.sabo.gr/",
  },
  {
    id: "strategis",
    name: "STRATEGIS Maritime ICT Cluster",
    tier: "silver",
    logo: "/images/sponsors/strategis-logo.png",
    shortDescription: "A Piraeus-based maritime cluster connecting companies, research institutions, and stakeholders to drive Digital Shipping, Smart Ports, and Blue Economy growth.",
    longDescription: `The Strategis Maritime ICT Cluster (SMICT) located in Piraeus with a global perspective, includes a network of companies, public and private organizations, research & academic institutions, and other stakeholders from the Greek Shipping Hub that focuses on emerging technologies enabling the Digital Shipping, Smart Ports, and sustainable growth in the Blue Economy.

With the vision to become a world-class maritime cluster & technology flagship of the Greek Shipping industry in the Shipping 4.0 era, Strategis offers 21st century maritime services and synergies for growth enabling Smart Sea – sustainable business opportunities.

The mission of Strategis is to create effective business ecosystems in Digital Shipping and the Blue Economy; expand the competitive advantage of Greek Shipping; and contribute to the sustainable development of the Marine & Maritime sector in the Southeastern Europe (SEE) region and the Mediterranean.

Strategis also supports mechanisms facilitating cooperation between local research, SMEs, the public sector, and social organizations to stimulate innovation & entrepreneurship, leading the way to 4-helix clustering.

To achieve the strategic objective of consolidating shipping and Blue Economy as a key factor of regional development, Strategis focuses on: Research and Development in frontier Maritime & Smart-Sea ICT technologies; strategy and innovative business models for the Blue Economy; raising the creative human capital of the region; infrastructure development supporting smart, sustainable growth (smart sea, smart ship, smart port, and smart city technologies); and international standardization activities, policies and regulations facilitating efficient collaboration of stakeholders in the innovation ecosystem.`,
    website: "https://strategis.gr/",
  },
]
