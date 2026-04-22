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
  {
    id: "eve-psalti",
    name: "Eve Psalti",
    title: "Senior Executive @ Microsoft AI · Board Member & Startup Advisor",
    photo: "/images/speakers/eve_psalti.webp",
    bio: `In today's rapidly evolving digital landscape, businesses must innovate to stay ahead. AI is no longer just an advantage—it's a necessity for optimizing operations, enhancing decision-making, and driving growth.

Eve's presentation explores how AI transforms business operations through AI in Business Operations, Model Catalog, Finetuning Tools, and Responsible AI Tools — ensuring ethical AI usage with bias detection, transparency, and regulatory compliance.

By leveraging AI's full potential, businesses can streamline workflows, enhance customer experiences, and drive innovation at scale. This presentation will showcase real-world applications and strategies to effectively integrate AI into your organization, paving the way for a smarter and more competitive future.`,
    links: [],
  },
  {
    id: "elena-kallona",
    name: "Elena Kallona",
    title: "VP Automation & Warehouse Equipment EMEA & Managing Director Greece, Jungheinrich",
    photo: "/images/speakers/elena_kalona.webp",
    bio: `Η τεχνητή νοημοσύνη δεν αλλάζει απλώς τα επαγγέλματα — επαναπροσδιορίζει το τι σημαίνει να αποφασίζεις, να δημιουργείς και τελικά να ηγείσαι. Σε αυτή τη συζήτηση με την Ρηνέτα Μήτση, δεν μιλούν για το αν το AI θα επηρεάσει το μέλλον της εργασίας, αλλά για το ποιός διαμορφώνει αυτό το μέλλον και με ποιούς κανόνες.

Όταν οι αλγόριθμοι γίνονται συνεργάτες, όταν η αυτοματοποίηση αλλάζει τη βιομηχανία και όταν η βιωσιμότητα γίνεται στρατηγική ανάγκη, οι νέοι μηχανικοί και επιστήμονες καλούνται να απαντήσουν: ποια είναι η ευθύνη του ανθρώπου μέσα σε ευφυή συστήματα; Πώς σχεδιάζουμε τεχνολογία που δεν είναι μόνο αποδοτική αλλά και δίκαιη;`,
    links: [],
  },
  {
    id: "rineta-mitsi",
    name: "Rineta Mitsi",
    title: "Corporate Affairs & Sustainability Director, Goody's-everest Group · General Secretary of CAPA",
    photo: "/images/speakers/rineta_mitsi.webp",
    bio: `Στο πνεύμα του Robotalk, η συζήτηση με την Έλενα Καλλονά λειτουργεί ως ανοιχτό debate για τη σχέση ανθρώπου και μηχανής — όχι ως τεχνολογική πρόβλεψη, αλλά ως πρόσκληση για επανασχεδιασμό του ίδιου του μέλλοντος.

Who Leads When Machines Think? Η τεχνητή νοημοσύνη δεν αλλάζει απλώς τα επαγγέλματα — επαναπροσδιορίζει το τι σημαίνει να αποφασίζεις, να δημιουργείς και τελικά να ηγείσαι.`,
    links: [],
  },
  {
    id: "athanasios-manouilidis",
    name: "Athanasios Manouilidis",
    title: "Automations Manager, Asso.subsea",
    photo: "/images/speakers/athanasios_manouilidis.webp",
    bio: `Ο Θανάσης Μανουηλίδης είναι Διπλωματούχος Ηλεκτρολόγος και Ηλεκτρονικός Μηχανικός, απόφοιτος του University of Bradford (Ηνωμένο Βασίλειο), και κάτοχος Μεταπτυχιακού Τίτλου (MSc) στα Συστήματα Ηλεκτρικής Ενέργειας από το University of Bath.

Από το 2018 αποτελεί μέλος του δυναμικού της Asso.subsea, όπου ξεκίνησε την επαγγελματική του πορεία ως Electrical Engineer. Από το 2021 έως σήμερα κατέχει θέση Manager στην ομάδα Αυτοματισμών (Automations), με κύριο αντικείμενο τον συντονισμό των ομάδων που είναι υπεύθυνες για τον σχεδιασμό και την ανάπτυξη του ηλεκτρολογικού εξοπλισμού και των συστημάτων αυτοματισμού στα υποβρύχια σκαπτικά μηχανήματα της εταιρείας.

Κατά το παρελθόν έχει αποκτήσει σημαντική εμπειρία σε διαφορετικούς τομείς της βιομηχανίας, έχοντας εργαστεί σε εταιρεία επισκευών πλοίων, σε βιομηχανία κατασκευής ηλεκτρικών πινάκων, καθώς και σε εταιρεία εκπόνησης τεχνοοικονομικών μελετών για απομονωμένα μικροδίκτυα ηλεκτρικής ενέργειας.

Θέμα ομιλίας: Γενική παρουσίαση της δραστηριότητας της Asso.subsea & Παρουσίαση & Ανάλυση των Ρομποτικών Μηχανημάτων που κατασκευάζουμε.`,
    links: [],
  },
  {
    id: "elena-stergiopoulou",
    name: "Elena Stergiopoulou",
    title: "Training & Development Specialist, Asso.subsea",
    photo: "/images/speakers/elena_stergiopoulou.webp",
    bio: `Η Έλενα Στεργιοπούλου είναι Πολιτικός Μηχανικός, απόφοιτη του Πανεπιστημίου Πατρών, και κάτοχος μεταπτυχιακού τίτλου MSc in Geotechnical Engineering από το University of Dundee. Ως φοιτήτρια, έκανε πρακτική άσκηση σε γεωτεχνικά εργαστήρια, ενώ από το 2016 εντάχθηκε στο δυναμικό της Asso.subsea.

Ξεκίνησε στην ομάδα Proposals ως Project Engineer, συμμετέχοντας στην προετοιμασία διαγωνισμών (tenders). Έπειτα μετακινήθηκε στο Project Management Office, όπου εργάστηκε ως Project Manager και αργότερα ως Project Planner.

Τον τελευταίο χρόνο ανήκει στην ομάδα Training & Development, έχοντας την ευθύνη για το onboarding και την εκπαίδευση νέων και παλαιότερων εργαζομένων.`,
    links: [],
  },
  {
    id: "giorgos-hadjipavlis",
    name: "Giorgos Hadjipavlis",
    title: "Researcher, i-SENSE Group ICCS · CCAM Team",
    photo: "/images/speakers/giorgos_hadjipavlis.webp",
    bio: `Ο Χατζηπαυλής Γιώργος είναι ηλεκτρονικός μηχανικός και μηχανικός Η/Υ απόφοιτος του Πολυτεχνείου Κρήτης. Εργάστηκε στην Ελλάδα στις oxygenbroadband, ekt-digital ως kernel, system and firmware engineer αναλαμβάνοντας ρόλους σχεδιάσης, συγγραφής και συντήρησης λογισμικού για τα λειτουργικά συστήματα και τις εφαρμογές προϊόντων διαδικτυακού εξοπλισμού και ψηφιακής τηλεόρασης (modem/router, set top boxes). Από το 2018 είναι μέλος του εργαστηρίου i-sense του ΕΠΙΣΕΥ στην ομάδα CCAM (Connected Cooperative Automated Mobility) αρχικά με συμμετοχή σε έργα βιομηχανικού χαρακτήρα (BMW SmartAccess 2020) και εν συνεχεία σε ερευνητικά ευρωπαϊκά. Tο 2021 ανέλαβε την ενσωμάτωση του CARLA driving simulator για την εξυπηρέτηση των ερευνητικών εργασιών της ομάδας CCAM ενώ από το 2022 ασχολείται και με την ανάπτυξη και συντήρηση δικτύων Distributed Ledger Technologies (DLT) και χρήσης τους σε mobility και health data spaces. Είναι ο υπεύθυνος συντήρησης των ερευνητικών οχημάτων τις ομάδας τόσο σε επίπεδο hardware (sensors, in-vehicle network, zonal architecture) όσο και software (ros2, autoware, automotive grade linux, covesa vss). Στα ερευνητικά του ενδιαφέροντα βρίσκονται τα operating systems, build systems, risc-v αρχιτεκτονικές, ασύρματες ad hoc επικοινωνίες και driving simulators. Επίσης τα τελευταία χρόνια και βασισμένος στα πλαίσια της συνεργασίας της ομάδας CCAM με καθηγητές της σχολής ΗΜΜΥ του ΕΜΠ, συμμετέχει στις ακαδημαϊκές υποχρεώσεις της σχολής εκδίδοντας διπλωματικές που άπτονται των ερευνητικών θεμάτων της ομάδας CCAM (συστήματα υποβοήθησης οδηγού, αυτοματοποιημένη οδήγηση).`,
    links: [],
  },
]
