"use client"

function downloadAsDoc() {
  const cvEl = document.getElementById("cv-root")
  if (!cvEl) return

  const clone = cvEl.cloneNode(true) as HTMLElement

  // Strip tip boxes and other screen-only elements
  clone.querySelectorAll(".no-print").forEach((el) => el.remove())

  function swapWithTable(original: Element, tableHtml: string) {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = tableHtml
    original.parentNode?.replaceChild(wrapper.firstElementChild!, original)
  }

  // ── Header flex → 2-cell table ──────────────────────────────────
  const headerRow = clone.querySelector("#cv-header-row") as HTMLElement | null
  if (headerRow) {
    const c = headerRow.children
    swapWithTable(headerRow, `
      <table width="100%" cellpadding="0" cellspacing="0"
             style="border-bottom:2px solid #2563eb;padding-bottom:12px;margin-bottom:16px">
        <tr>
          <td valign="top">${c[0]?.innerHTML ?? ""}</td>
          <td valign="top" align="right" style="text-align:right">${c[1]?.innerHTML ?? ""}</td>
        </tr>
      </table>`)
  }

  // ── Two-column body flex → table ─────────────────────────────────
  const bodyRow = clone.querySelector("#cv-body") as HTMLElement | null
  if (bodyRow) {
    const c = bodyRow.children // [0]=left [1]=divider [2]=right
    swapWithTable(bodyRow, `
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="22%" valign="top"
              style="padding-right:12px;border-right:1px solid #e5e7eb">
            ${c[0]?.innerHTML ?? ""}
          </td>
          <td valign="top" style="padding-left:12px">
            ${c[2]?.innerHTML ?? ""}
          </td>
        </tr>
      </table>`)
  }

  // ── Every grid-cols-2 → 2-column table ───────────────────────────
  clone.querySelectorAll(".grid-cols-2").forEach((grid) => {
    const items = Array.from(grid.children)
    let rows = ""
    for (let i = 0; i < items.length; i += 2) {
      rows += `<tr>
        <td width="50%" valign="top" style="padding-right:8px">
          ${items[i]?.innerHTML ?? ""}
        </td>
        <td width="50%" valign="top">
          ${items[i + 1]?.innerHTML ?? ""}
        </td>
      </tr>`
    }
    swapWithTable(grid, `<table width="100%" cellpadding="2" cellspacing="0">${rows}</table>`)
  })

  // ── Build Word-compatible HTML ────────────────────────────────────
  const doc = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<title>CV - RoboTalk 2026</title>
<!--[if gte mso 9]><xml>
<w:WordDocument><w:View>Print</w:View><w:DoNotOptimizeForBrowser/></w:WordDocument>
</xml><![endif]-->
<style>
body{font-family:Arial,sans-serif;font-size:11pt;color:#1a1a1a;margin:0;padding:0}
h1{font-size:20pt;font-weight:bold;color:#111827;margin:0 0 2px 0;line-height:1.2}
h2{font-size:7pt;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;
   color:#2563eb;border-bottom:1pt solid #dbeafe;padding-bottom:2px;margin:0 0 5px 0}
p{margin:0 0 3px 0;font-size:9pt}
ul{margin:2px 0 5px 0;padding-left:16px}
li{margin-bottom:1px;font-size:8.5pt}
table{border-collapse:collapse;width:100%}
.text-blue-600{color:#2563eb}
.text-gray-900,.text-gray-800{color:#111827}
.text-gray-700{color:#374151}
.text-gray-600{color:#4b5563}
.text-gray-500{color:#6b7280}
.text-gray-400{color:#9ca3af}
.font-bold{font-weight:bold}
.font-semibold{font-weight:600}
.font-normal{font-weight:normal}
.text-right{text-align:right}
.text-center{text-align:center}
.italic{font-style:italic}
.uppercase{text-transform:uppercase}
.leading-relaxed{line-height:1.55}
.leading-snug{line-height:1.35}
.leading-tight{line-height:1.2}
.list-disc{list-style-type:disc}
.border-t{border-top:1pt solid #e5e7eb;margin-top:14px;padding-top:6px}
.mb-4{margin-bottom:12px}
.mb-5{margin-bottom:16px}
.mt-1{margin-top:3px}
.mt-6{margin-top:18px}
.ml-4{margin-left:14px}
</style>
</head>
<body>${clone.innerHTML}</body>
</html>`

  const blob = new Blob(["\ufeff", doc], { type: "application/msword" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "cv-robotalk2026.doc"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function CvTemplatePage() {
  return (
    <>
      <style>{`
        @media print { .no-print { display: none !important; } }
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
            onClick={downloadAsDoc}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white hover:scale-105 transition-all"
          >
            Download .doc
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="no-print border-b border-blue-500/20 bg-blue-950/40 px-6 py-4 space-y-2">
        <p className="text-sm text-blue-200/80 max-w-3xl mx-auto text-center">
          Fill in the sections below, then click <strong>Download .doc</strong> to get an editable Word file. Upload it to your dashboard profile.
          Fields in <span className="text-blue-400">blue brackets</span> are placeholders — replace them with your own information.
        </p>
        <p className="text-xs text-amber-400/80 max-w-3xl mx-auto text-center">
          💡 Orange tip boxes are writing advice — they guide you while editing and <strong>won't appear in your downloaded file</strong>.
        </p>
      </div>

      {/* CV Content */}
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <div
          id="cv-root"
          className="cv-page bg-white max-w-[210mm] mx-auto shadow-lg p-[32px] text-[#1a1a1a] text-sm leading-relaxed"
          style={{ fontFamily: "'Arial', sans-serif" }}
        >

          {/* ── Header ── */}
          <Tip>State your target role or specialization in the title — recruiters decide in under 10 seconds whether to keep reading.</Tip>
          <div id="cv-header-row" className="flex items-start justify-between border-b-2 border-blue-600 pb-4 mb-5">
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
              [Όνομα Επώνυμο]
            </h1>
            <p className="text-base text-gray-500 font-normal text-right leading-snug">
              [Τίτλος π.χ. Ηλεκτρολόγος<br />Μηχανικός &amp; Μηχανικός Η/Υ]
            </p>
          </div>

          {/* ── Two-column body ── */}
          <div id="cv-body" className="flex gap-5">

            {/* ── Left column (~20%) ── */}
            <div className="w-[20%] shrink-0 flex flex-col">

              <SideSection title="Contact">
                <div className="flex flex-col gap-1 text-xs text-gray-600">
                  <span>📞 [+30 69xxxxxxxx]</span>
                  <span>📧 [email@example.com]</span>
                  <span className="text-blue-600">LinkedIn: [username]</span>
                  <span className="text-blue-600">Github: [username]</span>
                </div>
              </SideSection>

              <SideSection title="Skills">
                <Tip>Include keywords from job postings — ATS scanners filter CVs by exact terms before a human ever reads them.</Tip>
                <ul className="list-disc ml-3.5 text-xs text-gray-700 space-y-0.5">
                  <li>[π.χ. C\C++]</li>
                  <li>
                    [π.χ. Python]
                    <ul className="list-[circle] ml-3 space-y-0.5 mt-0.5">
                      <li className="text-blue-600">[lib1, lib2]</li>
                      <li className="text-blue-600">[lib3, lib4]</li>
                    </ul>
                  </li>
                  <li>[π.χ. MATLAB/Simulink]</li>
                  <li>[π.χ. Linux/POSIX]</li>
                  <li>[π.χ. Microcontrollers]</li>
                  <li>[π.χ. ROS]</li>
                  <li>[π.χ. Git]</li>
                  <li>[π.χ. Docker]</li>
                </ul>
              </SideSection>

              <SideSection title="Soft Skills">
                <ul className="list-disc ml-3.5 text-xs text-gray-700 space-y-0.5">
                  <li>[π.χ. Teamwork]</li>
                  <li>[π.χ. Team management]</li>
                  <li>[π.χ. Communication]</li>
                  <li>[π.χ. Critical thinking]</li>
                  <li>[π.χ. Public Speaking]</li>
                  <li>[π.χ. Event Planning]</li>
                </ul>
              </SideSection>

            </div>

            {/* ── Vertical divider ── */}
            <div className="w-px bg-gray-200 shrink-0 self-stretch" />

            {/* ── Right column ── */}
            <div className="flex-1 flex flex-col">

              <MainSection title="About">
                <Tip>2–3 sentences max. What you specialize in, what drives you, what kind of role or project you're looking for. This is your first impression — make it specific.</Tip>
                <p className="text-xs text-gray-700 leading-relaxed">
                  [Σύντομη περιγραφή — τι ειδικεύεσαι και τι ψάχνεις. π.χ. "Ειδικεύομαι στη Ρομποτική, τους Μικροελεγκτές και τον Αποδοτικό Προγραμματισμό. Προτιμώ C\C++ και Python. Αυτή τη στιγμή ερευνώ θέματα διπλωματικής εργασίας."]
                </p>
              </MainSection>

              <MainSection title="Εμπειρία / Experience">
                <Tip>Any experience counts — student team roles, personal projects, hackathons, internships, volunteering. If you built, led, or contributed to something real, it belongs here.</Tip>
                <Tip>Lead every bullet with a strong action verb (Built, Designed, Led, Reduced, Implemented…) and end with the impact — what changed because of your work?</Tip>
                <Tip>More bullets, less prose. One accomplishment per line, 2–4 bullets per entry. Put your most impressive entry first — recruiters rarely read to the bottom.</Tip>

                <Entry
                  title="[Τίτλος θέσης / Project / Ρόλος] | [Μήνας Έτος] – [Μήνας Έτος / σήμερα]"
                  subtitle="[Εταιρεία / Σύλλογος / Προσωπικό project]"
                >
                  <li>[Ρήμα + τι έκανες — π.χ. "Ανέπτυξα αλγόριθμο πλοήγησης για αυτόνομο όχημα κλίμακας 1:10"]</li>
                  <li>[Αντίκτυπος — τι άλλαξε λόγω σου; βάλε αριθμούς αν έχεις — π.χ. "Βελτίωσα την ακρίβεια κατά 20%"]</li>
                  <li>[Εργαλείο / γλώσσα / τεχνολογία που χρησιμοποίησες]</li>
                </Entry>

                <Entry
                  title="[Τίτλος θέσης 2 / Project 2] | [Έτος] – [Έτος]"
                  subtitle="[Εταιρεία / Σύλλογος / Πλατφόρμα]"
                >
                  <li>[Ρήμα + τι έκανες — π.χ. "Σχεδίασα και κατασκεύασα PCB για αισθητήρα θερμοκρασίας"]</li>
                  <li>[Δεξιότητα ή γνώση που απέκτησες μέσα από αυτή τη δουλειά]</li>
                </Entry>

                <Entry
                  title="[Προσωπικό Project / Hackathon / Εθελοντισμός] | [Έτος]"
                  subtitle="[Πλατφόρμα / Οργάνωση — π.χ. GitHub, IEEE, Uni Club]"
                >
                  <li>[Τι έκτισες ή έλυσες — π.χ. "Υλοποίησα web app για οπτικοποίηση δεδομένων αισθητήρων σε Flask"]</li>
                  <li>[Αποτέλεσμα ή αναγνώριση — π.χ. "3η θέση σε πανελλήνιο διαγωνισμό", "150+ GitHub stars"]</li>
                </Entry>
              </MainSection>

              <MainSection title="Education">
                <Entry
                  title="[Πανεπιστήμιο] — [Σχολή / Τμήμα]"
                  subtitle="[Πτυχίο/Δίπλωμα] — grade [π.χ. 8.5/10]"
                >
                  <li>[Έτος εισαγωγής] – [Αναμενόμενο έτος αποφοίτησης]</li>
                  <li>Τρέχον έτος: [1ο / 2ο / 3ο / 4ο / 5ο]</li>
                  <li>Σχετικά μαθήματα: [π.χ. Ρομποτική, Ενσωματωμένα Συστήματα, AI]</li>
                </Entry>
                <Entry
                  title="[Σχολείο], [Πόλη]"
                  subtitle="Απολυτήριο — grade [π.χ. 19.9/20]"
                >
                  <li>[Έτος] – [Έτος]</li>
                </Entry>
              </MainSection>

              <MainSection title="Foreign Languages">
                <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-700">
                  <div>
                    <span className="font-semibold">Ελληνικά</span>
                    <span className="text-gray-400">, Μητρική γλώσσα</span>
                  </div>
                  <div>
                    <span className="font-semibold">Αγγλικά</span>
                    <span className="text-gray-400">, level C2 (Cambridge CPE)</span>
                  </div>
                  <div className="mt-1">
                    <span className="font-semibold text-blue-600">[Γλώσσα 3]</span>
                    <span className="text-gray-400">, level [επίπεδο]</span>
                  </div>
                </div>
              </MainSection>

              <MainSection title="Certificates - Competitions">
                <Tip>Competitions show initiative and measurable skill. Include placement if you placed — even regional results stand out at student level.</Tip>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-700">
                  <CertItem title="[Διαγωνισμός] [βραβείο] | [Έτος]" org="[Διοργανωτής] ([εμβέλεια])" />
                  <CertItem title="[Διαγωνισμός] | [Έτος]" org="[Διοργανωτής]" />
                  <CertItem title="[Διαγωνισμός] [βραβείο] | [Έτος]" org="[Διοργανωτής]" />
                  <CertItem title="[Πιστοποίηση] | [Έτος]" org="[Εκδότης] (Certificate)" />
                  <CertItem title="[Διαγωνισμός] | [Έτη]" org="[Διοργανωτής]" />
                  <CertItem title="[Διαγωνισμός] | [Έτος]" org="[Διοργανωτής]" />
                </div>
              </MainSection>

            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-[10px] text-gray-400 text-center border-t border-gray-100 pt-3">
            Δημιουργήθηκε για το RoboTalk 2026 — IEEE RAS NTUA
          </p>

        </div>
      </div>
    </>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-print mb-2 flex gap-2 rounded bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[10px] text-amber-700 leading-snug">
      <span className="shrink-0 mt-px">💡</span>
      <span>{children}</span>
    </div>
  )
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border-b border-blue-100 pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border-b border-blue-100 pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Entry({ title, subtitle, children }: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-2.5">
      <p className="font-semibold text-gray-900 text-xs">{title}</p>
      <p className="text-gray-500 text-[11px]">{subtitle}</p>
      <ul className="mt-1 ml-4 list-disc text-gray-700 space-y-0.5 text-[11px]">
        {children}
      </ul>
    </div>
  )
}

function CertItem({ title, org }: { title: string; org: string }) {
  return (
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-gray-400">{org}</p>
    </div>
  )
}
