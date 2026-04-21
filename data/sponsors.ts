export type SponsorTier = "platinum" | "gold" | "silver" | "bronze"

export interface Sponsor {
  id: string
  name: string
  tier: SponsorTier
  logo: string            // path to logo image
  logoBg?: string         // logo area background color (defaults to white)
  shortDescription: string
  longDescription: string
  longDescriptionEl?: string
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
    color: "#a0b2c6",
    textClass: "text-[#a0b2c6]",
    borderClass: "border-[#a0b2c6]/60",
    bgClass: "bg-[#a0b2c6]/10",
    metalGradient: `linear-gradient(135deg,
      #6b7d91 0%, #c8d6e4 10%, #f0f5f9 22%, #a0b2c6 34%,
      #7a8c9e 46%, #dde6ef 58%, #ffffff 70%, #b8c8d8 82%, #5a6b7d 100%)`,
    metalOverlay: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
    metalRing: "ring-2 ring-[#a0b2c6]/60",
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
    id: "gekterna",
    name: "GEK TERNA",
    tier: "platinum",
    logo: "/images/sponsors/gekterna-logo.svg",
    shortDescription: "One of Greece's largest business groups, active in construction, energy, concessions, and real estate across 4 continents.",
    longDescription: `GEK TERNA is one of the largest and most dynamic business groups in Greece, listed on the Athens Stock Exchange. Through its subsidiaries, the Group operates across four major pillars: Construction, Energy, Concessions, and Real Estate.

TERNA S.A., the Group's flagship construction company founded in 1972, is the largest construction firm in Greece and one of the most active in Southeast Europe — delivering major infrastructure projects including road and railway networks, ports, airports, hospitals, museums, dams, and industrial facilities across more than 35 countries.

In the energy sector, GEK TERNA operates through TERNA ENERGY, a leading renewables company with a portfolio spanning wind, solar, hydro, and energy storage, as well as through Heron, which supplies electricity and natural gas to consumers and businesses throughout Greece.

The Group is also the largest investor in the concessions sector in Greece, managing a diversified and low-risk portfolio of motorway and infrastructure concessions that serve millions of travelers annually.

With a presence on four continents and a commitment to sustainable development, innovation, and social responsibility, GEK TERNA continues to shape the infrastructure and energy landscape of Greece and beyond.`,
    website: "https://www.gekterna.com/el/",
    socialLinks: { linkedin: "https://gr.linkedin.com/company/gek-terna" },
  },
  {
    id: "asso-subsea",
    name: "ASSO Subsea",
    tier: "platinum",
    logo: "/images/sponsors/asso-subsea-logo.png",
    shortDescription: "A Group of Companies founded in 1976, specializing in the installation and protection of submarine cables for energy infrastructure worldwide.",
    longDescription: `Asso.subsea is a Group of Companies founded in 1976, specializing in the installation and protection of submarine cables. The company owns and operates its own fleet of specialized vessels, on which cables are loaded and used to connect two points — such as countries, islands, or offshore platforms for wind farms. In addition to its fleet, the Group designs, builds, and maintains the subsea robotic equipment used in its projects at its own technical base.

Asso has participated in 207 submarine cable installation and protection projects worldwide. The duration of each project can reach up to three years, depending on its size and complexity.

Asso employs more than 1,000 people, including both onshore staff and seafarers.

In a rapidly evolving energy market, with increasing demand for innovative, safe, and reliable solutions, Asso has earned its place among the leading players in the global submarine utilities installation market. Our goal is to continuously meet future market challenges by delivering safe and smart solutions.`,
    longDescriptionEl: `Η Asso.subsea είναι Όμιλος Εταιρειών, ιδρύθηκε το 1976 και το αντικείμενό της είναι η πόντιση και προστασία υποβρύχιων καλωδίων. Η Asso διαθέτει το δικό της στόλο, ένα στόλο με ειδικού τύπου πλοία, όπου φορτώνεται πάνω το καλώδιο και ενώνουν δύο σημεία μεταξύ τους με το καλώδιο αυτό π.χ. χώρες, νησιά ή πλατφόρμες για θαλάσσια αιολικά πάρκα. Εκτός από το στόλο, για τις ανάγκες των έργων, στην τεχνική βάση του Ομίλου κατασκευάζονται και συντηρούνται τα υποβρύχια ρομποτικά μηχανήματα που χρησιμοποιούνται στα έργα.

Κατά τη διάρκεια της πολυετούς εμπειρία της, η Asso έχει συμμετάσχει σε 207 έργα εγκατάστασης & προστασίας υποβρύχιων καλωδίων σε όλο τον κόσμο. Η διάρκεια κάθε έργου μπορεί να φτάσει και τα 3 χρόνια ανάλογα με το μέγεθος και την πολυπλοκότητα.

Η Asso απασχολεί περισσότερους από 1000 ανθρώπους και αυτό περιλαμβάνει όσους εργάζονται στη στεριά αλλά και τους ναυτικούς.

Σε μια ταχέως μεταβαλλόμενη αγορά ενέργειας και μια αυξανόμενη ζήτηση για καινοτόμες, ασφαλείς και αξιόπιστες λύσεις, η Asso έχει κερδίσει μια θέση μεταξύ των σημαντικότερων παικτών στην παγκόσμια αγορά εγκατάστασης υποβρύχιων υπηρεσιών κοινής ωφελείας. Στόχος μας είναι να ανταποκρινόμαστε πάντα στις μελλοντικές προκλήσεις της αγοράς, παρέχοντας ασφαλείς και έξυπνες λύσεις.`,
    website: "https://www.assogroup.com/",
  },
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
    longDescriptionEl: `Η SABO S.A., ελληνική εταιρεία ιδρυθείσα το 1984, δραστηριοποιείται σε περισσότερες από 64 χώρες παγκοσμίως, εξάγοντας το 90% του ετήσιου κύκλου εργασιών της. Η εταιρεία είναι μέλος του Ομίλου SABO με έδρα το Βασιλικό της Εύβοιας στην Ελλάδα και με θυγατρικές στη Βραζιλία, τη Ρουμανία και την Ιταλία.

Η SABO είναι μια από τις ηγέτιδες επιχειρήσεις παγκοσμίως, με ειδίκευση στην παροχή ολοκληρωμένων λύσεων για την κεραμοποιία. Ξεχωρίζει επίσης και σε άλλους βιομηχανικούς τομείς, παρέχοντας συστήματα αυτοματοποίησης και ρομποτικές εφαρμογές για τη διακίνηση και τη συσκευασία προϊόντων, ολοκληρωμένες ηλεκτρολογικές λύσεις και βιομηχανικούς αυτοματισμούς, εξοπλισμό και υπηρεσίες για μονάδες βαριάς βιομηχανίας, καθώς και εξατομικευμένες λύσεις σε εξοπλισμό και ολοκληρωμένες γραμμές για τη διαχείριση στερεών αποβλήτων.

Η τεχνογνωσία και καινοτομία, τα πρότυπα υψηλής ποιότητας, το ειδικευμένο και έμπειρο προσωπικό, καθώς και οι ισχυρές υπηρεσίες υποστήριξης μετά την πώληση, αποτελούν τα βασικά ανταγωνιστικά πλεονεκτήματα της εταιρείας.`,
    website: "https://el.sabo.gr/",
  },
  {
    id: "heron",
    name: "HERON",
    tier: "silver",
    logo: "/images/sponsors/heron-logo.webp",
    shortDescription: "The Hellenic Robotics Center of Excellence — advancing robotics science and technology in the AI era.",
    longDescription: `HERON is a visionary project that aims to create the first Robotics Center of Excellence in Greece for advancing the science and technology of robotics in the AI era, coupled with industrial innovation. Its main goals include pursuing world-class research in diverse areas that reflect current and emerging challenges of national and EU value, including agriculture, marine, safety, transportation, and healthcare, founding Makerspaces, establishing and mobilizing the Hellenic Robotics Ecosystem, collaborating with the Diaspora, supporting education and training, and creating an AI-powered robotics center in Southeast Europe. The envisioned transformations are expected to result in major benefits to the economy, the technology, and the social well-being.`,
    website: "https://heron-coe.gr/",
  },
  {
    id: "alphamotion",
    name: "Alpha Motion",
    tier: "silver",
    logo: "/images/sponsors/alphamotion-logo.webp",
    shortDescription: "32 χρόνια συνέπεια στον αυτοματισμό — βιομηχανικός αυτοματισμός και ρομποτική.",
    longDescription: `Συγκεντρώνει τα 32 χρόνια αναπτυξιακής παρουσίας στην βιομηχανική αυτοματοποίηση και ρομποτική στην εγκατάσταση εφαρμογών αυτοματισμού στην Ελληνική βιομηχανία και στην καθημερινότητά των βιομηχανικών τεχνολογιών, προβάλλοντας δυναμικά ένα πλήρες φάσμα εξειδικευμένων λύσεων σε βιομηχανικό αυτοματισμό και ρομποτικές εφαρμογές, βασισμένες σε μηχανικούς, ρομποτικούς βραχίονες και προγραμματιζόμενους λογικούς ελεγκτές, τεχνητή νοημοσύνη, δίκτυα αυτοματισμού και βιομηχανικό λογισμικό.`,
    website: "https://www.alphamotion.gr/",
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
