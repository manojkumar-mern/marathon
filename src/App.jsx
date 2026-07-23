import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { BRAND } from './config/brand'
import PageLoader from './components/common/PageLoader'
import ScrollProgress from './components/common/ScrollProgress'
import ScrollToTop from './components/common/ScrollToTop'
import WhatsAppFloat from './components/common/WhatsAppFloat'
import Footer from './components/layout/Footer/Footer'
import Navbar from './components/layout/Navbar/Navbar'

const ContentPage  = lazy(() => import('./pages/ContentPage'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const Events       = lazy(() => import('./pages/Events'))
const Home         = lazy(() => import('./pages/Home'))
const NotFound     = lazy(() => import('./pages/NotFound'))
const Registration = lazy(() => import('./pages/Registration'))

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <BrowserRouter>
      <HelmetProvider>
        <ScrollToTop />
        {isLoading ? <PageLoader onComplete={() => setIsLoading(false)} /> : null}
        <ScrollProgress />
        <Navbar />
        <Suspense
          fallback={
            <main className="grid min-h-[65vh] place-items-center bg-obsidian text-sm font-medium text-muted">
              Loading {BRAND.name}…
            </main>
          }
        >
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/events"            element={<Events mode="all" />} />
            <Route path="/events/upcoming"   element={<Events mode="upcoming" />} />
            <Route path="/events/past"       element={<Events mode="past" />} />
            <Route path="/events/:id"        element={<EventDetails />} />
            <Route path="/race-categories"   element={<ContentPage type="categories" />} />
            <Route path="/schedule"          element={<ContentPage type="schedule" />} />
            <Route path="/locations"         element={<ContentPage type="locations" />} />
            <Route path="/gallery"           element={<ContentPage type="gallery" />} />
            <Route path="/sponsors"          element={<ContentPage type="sponsors" />} />
            <Route path="/faq"               element={<ContentPage type="faq" />} />
            <Route path="/contact"           element={<ContentPage type="contact" />} />
            <Route path="/about"             element={<ContentPage type="about" />} />
            <Route path="/register"          element={<Registration />} />
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/privacy"           element={<ContentPage type="privacy" />} />
            <Route path="/terms"             element={<ContentPage type="terms" />} />
            <Route path="*"                  element={<NotFound />} />
          </Routes>
        </Suspense>
        <WhatsAppFloat />
        <Footer />
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
