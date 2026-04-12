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
    id: "speaker-1",
    name: "[Όνομα Ομιλητή]",
    title: "[Τίτλος / Εταιρεία]",
    photo: "/images/speakers/speaker-1.jpg",
    bio: "Σύντομη βιογραφία του ομιλητή. Περιγράψτε την εμπειρία, τα ερευνητικά ενδιαφέροντα και τα επιτεύγματά του.",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com" },
      { label: "Personal Website", url: "https://example.com" },
    ],
  },
  {
    id: "speaker-2",
    name: "[Όνομα Ομιλητή]",
    title: "[Τίτλος / Εταιρεία]",
    photo: "/images/speakers/speaker-2.jpg",
    bio: "Σύντομη βιογραφία του ομιλητή. Περιγράψτε την εμπειρία, τα ερευνητικά ενδιαφέροντα και τα επιτεύγματά του.",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
  {
    id: "speaker-3",
    name: "[Όνομα Ομιλητή]",
    title: "[Τίτλος / Εταιρεία]",
    photo: "/images/speakers/speaker-3.jpg",
    bio: "Σύντομη βιογραφία του ομιλητή. Περιγράψτε την εμπειρία, τα ερευνητικά ενδιαφέροντα και τα επιτεύγματά του.",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com" },
      { label: "Research", url: "https://example.com" },
    ],
  },
]
