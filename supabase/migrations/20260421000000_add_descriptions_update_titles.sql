-- Add description column to workshops
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS description text;

-- Update titles
UPDATE public.workshops SET title = 'ISENSE Group Talk' WHERE id = 'isense';
UPDATE public.workshops SET title = 'Panel: Elena Kallona & Rineta Mitsi' WHERE id = 'panel';
UPDATE public.workshops SET title = 'ASSO SUBSEA Talk' WHERE id = 'asso-subsea';
UPDATE public.workshops SET title = 'Eve Psalti Talk' WHERE id = 'eve-psalti';
UPDATE public.workshops SET title = 'Haris Ioannou Talk' WHERE id = 'haris-ioannou';

-- Workshop: iRASional
UPDATE public.workshops SET
  title = 'Pixels to Coordinates: YOLO Sign Detection for Localisation',
  description = 'Πώς μπορεί μια απλή κάμερα να αναγνωρίζει την θέση ενός ρομπότ στον χώρο; Το workshop αυτό απαντά στο προηγούμενο ερώτημα βήμα-βήμα, συνδυάζοντας θεωρία και πράξη. Ξεκινάμε με τα θεμέλια του sign detection και εστιάζουμε στο YOLO, μαθαίνοντας πώς να το εκπαιδεύουμε για τις ανάγκες μας. Στη συνέχεια, περνάμε στο localisation, όπου εισαγόμαστε στους αλγορίθμους που επιτρέπουν σε ένα σύστημα να υπολογίζει τη θέση του μέσα σε έναν χώρο. Εδώ, οι συμμετέχοντες θα κληθούν να υλοποιήσουν έναν αλγόριθμο εντοπισμού θέσης, έχοντας δεδομένα μόνο έναν χάρτη του χώρου και τα αποτελέσματα της κάμερας.'
WHERE id = 'irasional';

-- Workshop: aeRAS
UPDATE public.workshops SET
  title = 'Maintaining Connectivity in UAV Swarms: From Graph Theory to Practice',
  description = 'Πώς μπορεί ένα σμήνος drones να διατηρεί τη συνδεσιμότητά του χωρίς GPS ή κεντρικό έλεγχο;

Σε αυτό το workshop, οι συμμετέχοντες θα έρθουν σε επαφή με τον αποκεντρωμένο έλεγχο συστημάτων πολλαπλών ρομπότ, δουλεύοντας πρακτικά πάνω σε κώδικα Python (Notebooks). Μέσα από στοχευμένα παραδείγματα, θα γνωρίσουν πώς η Θεωρία Γράφων και ο Λαπλασιανός πίνακας χρησιμοποιούνται για τη μοντελοποίηση της επικοινωνίας και την αξιολόγηση της ανθεκτικότητας του δικτύου (μέσω της ιδιοτιμής λ2). Μέσω αυτών των τεχνικών, το σμήνος μπορεί να προσαρμόζεται αυτόματα για να διατηρεί τη σύνδεση με τον αρχηγό του (AGV) και να αποφεύγει εμπόδια, χωρίς να βασίζεται σε προκαθορισμένα σημεία GPS. Στόχος είναι να αποκτήσουν μια ουσιαστική πρώτη εικόνα για τη σχεδίαση αλγορίθμων αναδυόμενης πλοήγησης (emergent navigation) για αυτόνομα σμήνη.'
WHERE id = 'aeras';

-- Workshop: Renesas Embedded
UPDATE public.workshops SET
  title = 'Introduction to Embedded Systems with Renesas FSP',
  description = 'Πώς μπορεί ένας μικροελεγκτής να εκτελεί σύνθετες λειτουργίες χωρίς να επιβαρύνει συνεχώς την CPU;

Σε αυτό το workshop οι συμμετέχοντες θα έρθουν σε επαφή με βασικές έννοιες των embedded systems μέσα από το περιβάλλον του Renesas Flexible Software Package (FSP). Μέσα από πρακτικά παραδείγματα θα γνωρίσουν τη χρήση περιφερειακών μονάδων, τη διαχείριση χρονισμού και αναλογικών μετρήσεων, καθώς και τον τρόπο με τον οποίο το hardware μπορεί να αναλαμβάνει λειτουργίες αυτόματα, μειώνοντας την ανάγκη συνεχούς παρέμβασης από την CPU. Στόχος είναι να αποκτήσουν μια πρώτη ουσιαστική εικόνα για τη σχεδίαση αποδοτικών embedded εφαρμογών.'
WHERE id = 'renesas';

-- Talk: Eve Psalti
UPDATE public.workshops SET
  description = 'Engineering the Future: Harnessing the Power of AI to Drive Business Growth

In today''s rapidly evolving digital landscape, businesses must innovate to stay ahead. AI is no longer just an advantage—it''s a necessity for optimizing operations, enhancing decision-making, and driving growth. This presentation explores how AI transforms business operations through AI in Business Operations, Model Catalog, Finetuning Tools, and Responsible AI Tools.

By leveraging AI''s full potential, businesses can streamline workflows, enhance customer experiences, and drive innovation at scale.'
WHERE id = 'eve-psalti';

-- Talk: Haris Ioannou
UPDATE public.workshops SET
  description = 'Gemini Audio: Designing the Next Generation of AI Interfaces

In this talk, Haris Ioannou shares how the next generation of AI interfaces is being actively shaped through real-world innovation at scale. Leading the Gemini Audio portfolio at Google Cloud, he is driving the transition from cutting-edge research to impactful products, redefining how humans interact with technology through voice and sound.

The session will explore the evolving landscape of AI-powered interfaces and highlight how new capabilities are transforming the way we communicate, create, and build intelligent systems.'
WHERE id = 'haris-ioannou';

-- Panel: Elena Kallona & Rineta Mitsi
UPDATE public.workshops SET
  description = 'Who Leads When Machines Think?

Η τεχνητή νοημοσύνη δεν αλλάζει απλώς τα επαγγέλματα — επαναπροσδιορίζει το τι σημαίνει να αποφασίζεις, να δημιουργείς και τελικά να ηγείσαι. Σε αυτή τη συζήτηση, η Έλενα Καλλονά και η Ρηνέτα Μήτση δεν μιλούν για το αν το AI θα επηρεάσει το μέλλον της εργασίας, αλλά για το ποιός διαμορφώνει αυτό το μέλλον και με ποιούς κανόνες.

Όταν οι αλγόριθμοι γίνονται συνεργάτες, όταν η αυτοματοποίηση αλλάζει τη βιομηχανία και όταν η βιωσιμότητα γίνεται στρατηγική ανάγκη, οι νέοι μηχανικοί και επιστήμονες καλούνται να απαντήσουν σε δύσκολα ερωτήματα: ποια είναι η ευθύνη του ανθρώπου μέσα σε ευφυή συστήματα; Πώς σχεδιάζουμε τεχνολογία που δεν είναι μόνο αποδοτική αλλά και δίκαιη;'
WHERE id = 'panel';
