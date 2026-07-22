import About from '../components/sections/About/About'
import EventHighlights from '../components/sections/EventHighlights/EventHighlights'
import EventLocations from '../components/sections/EventLocations/EventLocations'
import Faq from '../components/sections/Faq/Faq'
import Gallery from '../components/sections/Gallery/Gallery'
import Hero from '../components/sections/Hero/Hero'
import RaceCategories from '../components/sections/RaceCategories/RaceCategories'
import Sponsors from '../components/sections/Sponsors/Sponsors'
import Statistics from '../components/sections/Statistics/Statistics'

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Statistics />
      <EventLocations />
      <RaceCategories />
      <EventHighlights />
      <Gallery />
      <Faq />
      <Sponsors />
    </main>
  )
}

export default Home
