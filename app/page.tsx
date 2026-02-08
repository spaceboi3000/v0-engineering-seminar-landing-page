import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { PastEvents } from "@/components/past-events"
import { Venue } from "@/components/venue"
import { Sponsors } from "@/components/sponsors"
import { Location } from "@/components/location"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <PastEvents />
        <Venue />
        <Location />
        <Sponsors />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
