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

export const TIER_CONFIG: Record<SponsorTier, { label: string; color: string; textClass: string; borderClass: string; bgClass: string }> = {
  platinum: {
    label: "Platinum",
    color: "#E5E4E2",
    textClass: "text-[#E5E4E2]",
    borderClass: "border-[#E5E4E2]/30",
    bgClass: "bg-[#E5E4E2]/10",
  },
  gold: {
    label: "Gold",
    color: "#FFD700",
    textClass: "text-[#FFD700]",
    borderClass: "border-[#FFD700]/30",
    bgClass: "bg-[#FFD700]/10",
  },
  silver: {
    label: "Silver",
    color: "#C0C0C0",
    textClass: "text-[#C0C0C0]",
    borderClass: "border-[#C0C0C0]/30",
    bgClass: "bg-[#C0C0C0]/10",
  },
  bronze: {
    label: "Bronze",
    color: "#CD7F32",
    textClass: "text-[#CD7F32]",
    borderClass: "border-[#CD7F32]/30",
    bgClass: "bg-[#CD7F32]/10",
  },
}

export const sponsors: Sponsor[] = [
  {
    id: "acme-robotics",
    name: "Acme Robotics",
    tier: "platinum",
    logo: "/images/sponsors/acme-robotics.png",
    shortDescription: "Pioneering autonomous systems and next-gen robotic platforms for industry and research.",
    longDescription:
      "Acme Robotics is at the forefront of autonomous systems development, building robotic platforms that bridge the gap between academic research and industrial deployment. With over 15 years of experience, Acme partners with universities worldwide to push the boundaries of what robots can achieve in manufacturing, logistics, and exploration.",
    website: "https://example.com",
    contactEmail: "sponsors@example.com",
    socialLinks: { linkedin: "#", twitter: "#" },
    speakerSlug: "dr-jane-smith",
  },
  {
    id: "neural-dynamics",
    name: "Neural Dynamics",
    tier: "platinum",
    logo: "/images/sponsors/neural-dynamics.png",
    shortDescription: "AI-driven control systems powering the next wave of intelligent machines.",
    longDescription:
      "Neural Dynamics specializes in AI-powered control algorithms for robotics and autonomous vehicles. Their flagship NeuroControl SDK is used by over 200 research labs globally. They are committed to democratizing advanced AI tools for the robotics community.",
    website: "https://example.com",
    socialLinks: { linkedin: "#", github: "#" },
  },
  {
    id: "titan-electronics",
    name: "Titan Electronics",
    tier: "gold",
    logo: "/images/sponsors/titan-electronics.png",
    shortDescription: "High-performance embedded systems and sensor arrays for robotic applications.",
    longDescription:
      "Titan Electronics designs and manufactures cutting-edge embedded computing boards and multi-modal sensor arrays purpose-built for robotics. Their T-Series processors deliver unmatched real-time performance at ultra-low power consumption.",
    website: "https://example.com",
    contactEmail: "info@example.com",
    socialLinks: { linkedin: "#", twitter: "#" },
    speakerSlug: "alex-chen",
  },
  {
    id: "quantum-motors",
    name: "Quantum Motors",
    tier: "gold",
    logo: "/images/sponsors/quantum-motors.png",
    shortDescription: "Precision actuators and motor controllers built for the demands of modern robotics.",
    longDescription:
      "Quantum Motors engineers high-torque, ultra-precise actuators that power everything from surgical robots to industrial manipulators. Their QDrive series has become the industry standard for applications requiring sub-millimeter accuracy.",
    website: "https://example.com",
    socialLinks: { twitter: "#" },
  },
  {
    id: "helios-energy",
    name: "Helios Energy",
    tier: "silver",
    logo: "/images/sponsors/helios-energy.png",
    shortDescription: "Next-generation battery tech enabling longer-lasting autonomous robots.",
    longDescription:
      "Helios Energy is revolutionizing mobile robotics with their solid-state battery technology. Their HE-Cell line offers 3x the energy density of traditional lithium-ion packs, enabling drones and ground robots to operate for hours longer on a single charge.",
    website: "https://example.com",
    contactEmail: "hello@example.com",
  },
  {
    id: "vertex-software",
    name: "Vertex Software",
    tier: "silver",
    logo: "/images/sponsors/vertex-software.png",
    shortDescription: "Simulation and digital twin platforms for rapid robotic prototyping.",
    longDescription:
      "Vertex Software provides cloud-based simulation environments that let robotics teams test and iterate on designs before building physical prototypes. Their digital twin technology accurately replicates real-world physics, reducing development cycles by up to 60%.",
    website: "https://example.com",
    socialLinks: { linkedin: "#", github: "#" },
  },
  {
    id: "aether-labs",
    name: "Aether Labs",
    tier: "bronze",
    logo: "/images/sponsors/aether-labs.png",
    shortDescription: "Open-source SLAM and perception libraries for the robotics community.",
    longDescription:
      "Aether Labs maintains some of the most widely-used open-source libraries for simultaneous localization and mapping (SLAM) and 3D perception. Their tools are used in thousands of robotics projects from hobbyist drones to autonomous vehicles.",
    website: "https://example.com",
    socialLinks: { github: "#" },
  },
  {
    id: "forge-materials",
    name: "Forge Materials",
    tier: "bronze",
    logo: "/images/sponsors/forge-materials.png",
    shortDescription: "Advanced composites and 3D-printing materials engineered for robotics.",
    longDescription:
      "Forge Materials develops lightweight, high-strength composite materials and specialized 3D-printing filaments designed for robotic structural components. Their carbon-fiber reinforced polymers are trusted by competition robotics teams worldwide.",
    website: "https://example.com",
    contactEmail: "contact@example.com",
  },
]
