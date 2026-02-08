import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { PastEvents } from "@/components/past-events"
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
        <Sponsors />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
