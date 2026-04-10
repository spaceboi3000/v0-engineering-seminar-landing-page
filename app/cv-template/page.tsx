"use client"

export default function CvTemplatePage() {
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .cv-page { box-shadow: none; margin: 0; padding: 32px; max-width: 100%; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between bg-[#081229] px-6 py-3 border-b border-white/10">
        <span className="text-sm font-medium text-white/70">
          RoboTalk 2026 — CV Template
        </span>
        <div className="flex gap-3">
          <a href="/dashboard" className="rounded-lg px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">
            ← Dashboard
          </a>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white hover:scale-105 transition-all"
          >
            Save as PDF
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="no-print bg-blue-950/40 border-b border-blue-500/20 px-6 py-4">
        <p className="text-sm text-blue-200/80 max-w-3xl mx-auto text-center">
          Fill in the sections below, then click <strong>Save as PDF</strong> to download your CV. Upload it to your dashboard profile.
          Fields in <span className="text-blue-400">blue brackets</span> are placeholders — replace them with your own information.
        </p>
      </div>

      {/* CV Content */}
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <div className="cv-page bg-white max-w-[210mm] mx-auto shadow-lg p-[40px] text-[#1a1a1a] font-sans text-sm leading-relaxed"
          style={{ fontFamily: "'Arial', sans-serif" }}
        >

          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">[Όνομα Επώνυμο]</h1>
            <p className="text-blue-600 font-medium mt-1">[Τίτλος π.χ. Φοιτητής Ηλεκτρολόγος Μηχανικός]</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
              <span>📧 [email@example.com]</span>
              <span>📞 [+30 69xxxxxxxx]</span>
              <span>🔗 [linkedin.com/in/username]</span>
              <span>💻 [github.com/username]</span>
              <span>📍 [Πόλη, Ελλάδα]</span>
            </div>
          </div>

          {/* Education */}
          <Section title="Εκπαίδευση">
            <Entry
              title="[Πανεπιστήμιο / Σχολή / Τμήμα]"
              subtitle="[Πτυχίο/Δίπλωμα] — [Ειδίκευση]"
              date="[Έτος εισαγωγής] – [Αναμενόμενο έτος αποφοίτησης]"
            >
              <li>Τρέχον έτος σπουδών: [1ο / 2ο / 3ο / 4ο / 5ο]</li>
              <li>Μέσος Όρος: [π.χ. 8.5 / 10] <span className="text-gray-400">(προαιρετικό)</span></li>
              <li>Σχετικά μαθήματα: [π.χ. Ρομποτική, Ενσωματωμένα Συστήματα, Τεχνητή Νοημοσύνη]</li>
            </Entry>
          </Section>

          {/* Technical Skills */}
          <Section title="Τεχνικές Δεξιότητες">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <SkillRow label="Γλώσσες προγρ." value="[π.χ. Python, C++, MATLAB]" />
              <SkillRow label="Ρομποτικές πλατφόρμες" value="[π.χ. ROS/ROS2, Arduino, Raspberry Pi]" />
              <SkillRow label="Εργαλεία CAD/Sim" value="[π.χ. SolidWorks, Gazebo, Webots]" />
              <SkillRow label="AI / ML" value="[π.χ. TensorFlow, PyTorch, OpenCV]" />
              <SkillRow label="Ηλεκτρονικά" value="[π.χ. PCB Design, Altium, KiCad]" />
              <SkillRow label="Άλλα εργαλεία" value="[π.χ. Git, Linux, Docker]" />
            </div>
          </Section>

          {/* Projects */}
          <Section title="Έργα / Projects">
            <Entry
              title="[Τίτλος project]"
              subtitle="[Τεχνολογίες που χρησιμοποιήθηκαν]"
              date="[Μήνας Έτος]"
            >
              <li>[Σύντομη περιγραφή του project — τι κάνει, ποιο πρόβλημα λύνει]</li>
              <li>[Τεχνικές προκλήσεις που αντιμετωπίστηκαν]</li>
              <li>[Αποτέλεσμα / επίτευγμα π.χ. "Επίτευξη 95% ακρίβειας σε real-time object detection"]</li>
            </Entry>
            <Entry
              title="[Τίτλος δεύτερου project]"
              subtitle="[Τεχνολογίες]"
              date="[Μήνας Έτος]"
            >
              <li>[Περιγραφή]</li>
              <li>[Αποτέλεσμα]</li>
            </Entry>
          </Section>

          {/* Experience */}
          <Section title="Εμπειρία / Πρακτική Άσκηση">
            <Entry
              title="[Τίτλος θέσης]"
              subtitle="[Εταιρεία / Οργανισμός]"
              date="[Μήνας Έτος] – [Μήνας Έτος]"
            >
              <li>[Κύρια αρμοδιότητα / καθήκον]</li>
              <li>[Συγκεκριμένο επίτευγμα με αριθμούς αν είναι δυνατόν]</li>
            </Entry>
            <p className="text-gray-400 text-xs italic">(Αν δεν έχεις εμπειρία, μπορείς να αφαιρέσεις αυτή την ενότητα)</p>
          </Section>

          {/* Activities */}
          <Section title="Δραστηριότητες / Εθελοντισμός">
            <Entry
              title="[IEEE RAS NTUA / άλλος σύλλογος]"
              subtitle="[Ρόλος π.χ. Μέλος, Επικεφαλής ομάδας]"
              date="[Έτος] – σήμερα"
            >
              <li>[Τι έκανες / πώς συνεισέφερες]</li>
            </Entry>
          </Section>

          {/* Languages */}
          <Section title="Γλώσσες">
            <div className="flex flex-wrap gap-6">
              <LangItem lang="Ελληνικά" level="Μητρική γλώσσα" />
              <LangItem lang="Αγγλικά" level="[π.χ. C2 / Proficiency]" />
              <LangItem lang="[Άλλη γλώσσα]" level="[Επίπεδο]" />
            </div>
          </Section>

          {/* Footer note */}
          <p className="mt-8 text-xs text-gray-400 text-center border-t border-gray-100 pt-4">
            Δημιουργήθηκε για το RoboTalk 2026 — IEEE RAS NTUA
          </p>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 border-b border-blue-100 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Entry({ title, subtitle, date, children }: {
  title: string; subtitle: string; date: string; children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{date}</span>
      </div>
      <ul className="mt-1.5 ml-4 list-disc text-gray-700 space-y-0.5 text-xs">
        {children}
      </ul>
    </div>
  )
}

function SkillRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="font-semibold text-gray-700 w-36 shrink-0">{label}:</span>
      <span className="text-blue-600">{value}</span>
    </div>
  )
}

function LangItem({ lang, level }: { lang: string; level: string }) {
  return (
    <div className="text-xs">
      <span className="font-semibold text-gray-800">{lang}</span>
      <span className="text-gray-400"> — {level}</span>
    </div>
  )
}
