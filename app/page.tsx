import { Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { PastEvents } from "@/components/past-events"
import { SectionDivider } from "@/components/section-divider"
import { Organizers } from "@/components/organizers"
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
