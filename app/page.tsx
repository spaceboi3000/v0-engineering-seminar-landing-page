import { Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ScheduleOverview } from "@/components/schedule-overview"
import { PastEvents } from "@/components/past-events"
import { SectionDivider } from "@/components/section-divider"
import { Organizers } from "@/components/organizers"
import { Speakers } from "@/components/speakers"
import { Sponsors } from "@/components/sponsors"
import { Location } from "@/components/location"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ConfirmationToast } from "@/components/confirmation-toast"

export default function Page() {
  return (
    <>
      <Suspense>
        <ConfirmationToast />
      </Suspense>
      <Header />
      <main>
        <Hero />
        <About />
        <SectionDivider />
        <ScheduleOverview />
        <SectionDivider />
        <Speakers />
        <SectionDivider />
        <Sponsors />
        <SectionDivider />
        <PastEvents />
        <SectionDivider />
        <Organizers />
        <SectionDivider />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
