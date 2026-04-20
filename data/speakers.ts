export interface Speaker {
  id: string
  name: string
  title: string
  photo: string
  bio: string
  links: { label: string; url: string }[]
}

export const speakers: Speaker[] = [
  {
    id: "haris-ioannou",
    name: "Haris Ioannou",
    title: "AI Product Lead at Google · Tech Entrepreneur | Inventor",
    photo: "/images/speakers/harris_ioannou.webp",
    bio: `Haris is an engineer, inventor and a tech entrepreneur. Leading the Gemini Audio portfolio at Google Cloud, driving 0-to-1 frontier model research into scaled enterprise solutions. He holds a MSc in Machine Learning from Columbia University in New York and a MSc and BSc in Electrical and Computer Engineering from National Technical University of Athens.

Haris brings deep early-stage experience as a founder and technologist for multiple startups in HealthTech, Cybersecurity, and EdTech. He holds patents in robotics, is author of publications in machine learning and a founding member of ReGeneration, the largest internship program in Greece.

As a keynote speaker, Haris has delivered talks in more than 45 conferences in 20+ countries, communicating his passion about inventions, startups and multiple state of the art technologies. These include: talks in the European Commission and the European Parliament, universities such as the London School of Economics, and companies such as Google and Novartis, as well as 3 TEDx Talks.

His thinking is regularly appearing on various global printed, online and tv mediums and he has been named both by Forbes Magazine and Kathimerini Newspaper on their respective 30 under 30 lists.`,
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/charalamposioannou/" },
    ],
  },
  // {
  //   id: "giorgos-hatjipavlis",
  //   name: "Γιώργος Χατζηπαύλης",
  //   title: "",
  //   photo: "/images/speakers/giorgos_hatjipavlis.jpg",
  //   bio: "",
  //   links: [],
  // },
]
