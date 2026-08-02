import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { BRAND } from './config/brand'
import PageLoader from './components/common/PageLoader'
import ScrollProgress from './components/common/ScrollProgress'
import ScrollToTop from './components/common/ScrollToTop'
import WhatsAppFloat from './components/common/WhatsAppFloat'
import Footer from './components/layout/Footer/Footer'
import Navbar from './components/layout/Navbar/Navbar'
import AdminLayout from './admin/layouts/AdminLayout'
import adminRoutes from './admin/routes/admin.routes'

const ContentPage    = lazy(() => import('./pages/ContentPage'))
const EventDetails   = lazy(() => import('./pages/EventDetails'))
const Events         = lazy(() => import('./pages/Events'))
const Home           = lazy(() => import('./pages/Home'))
const Login          = lazy(() => import('./pages/Login'))
const NotFound       = lazy(() => import('./pages/NotFound'))
const Registration   = lazy(() => import('./pages/Registration'))
const ResultsPage    = lazy(() => import('./pages/ResultsPage'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'))

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {isLoading ? <PageLoader onComplete={() => setIsLoading(false)} /> : null}
      {!isAdmin && <ScrollProgress />}
      {!isAdmin && <Navbar />}
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
          <Route path="/login"             element={<Login />} />
          <Route path="/results"           element={<ResultsPage />} />
          <Route path="/certificates"      element={<CertificatesPage />} />
          {/* Legacy /dashboard → unified admin dashboard */}
          <Route path="/dashboard"         element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/privacy"           element={<ContentPage type="privacy" />} />
          <Route path="/terms"             element={<ContentPage type="terms" />} />
          <Route path="/admin"             element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {adminRoutes.map((r) => (
              <Route key={r.path} {...r} />
            ))}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <WhatsAppFloat visible={!isLoading} />}
      {!isAdmin && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
