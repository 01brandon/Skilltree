// app.jsx - all route definitions for skilltree
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// layouts
import DashboardLayout from './layouts/DashboardLayout'

// components
import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import AuthGuard from './components/AuthGuard'

// pages
import HomePage          from './pages/HomePage'
import AboutPage         from './pages/AboutPage'
import LoginPage         from './pages/LoginPage'
import SignupPage        from './pages/SignupPage'
import DashboardPage     from './pages/DashboardPage'
import CharactersPage    from './pages/CharactersPage'
import DetailPage        from './pages/DetailPage'
import EditCharacterPage from './pages/EditCharacterPage'

// 404 fallback page
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-8xl font-semibold text-ash-dark mb-4">404</p>
        <p className="text-ink-muted mb-6">This page does not exist.</p>
        <a href="/" className="btn btn-primary">Go home</a>
      </div>
    </div>
  )
}

// public layout wrapper - adds navbar and footer around marketing pages
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* public routes - with navbar and footer */}
        <Route path="/"      element={<PublicLayout><HomePage  /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

        {/* auth routes - no navbar or footer */}
        <Route path="/login"  element={<LoginPage  />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* protected dashboard routes */}
        <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route index element={<DashboardPage />} />
        </Route>

        {/* protected skill routes */}
        <Route path="/skills" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route index           element={<CharactersPage    />} />
          <Route path="new"      element={<EditCharacterPage />} />
          <Route path=":id"      element={<DetailPage        />} />
          <Route path=":id/edit" element={<EditCharacterPage />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}