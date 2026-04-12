// app.jsx - all route definitions for skilltree
import { Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import DashboardLayout   from './layouts/DashboardLayout'
import Navbar            from './components/Navbar'
import Footer            from './components/Footer'
import AuthGuard         from './components/AuthGuard'
import HomePage          from './pages/HomePage'
import AboutPage         from './pages/AboutPage'
import LoginPage         from './pages/LoginPage'
import SignupPage        from './pages/SignupPage'
import DashboardPage     from './pages/DashboardPage'
import CharactersPage    from './pages/CharactersPage'
import DetailPage        from './pages/DetailPage'
import EditCharacterPage from './pages/EditCharacterPage'
import ProfilePage       from './pages/ProfilePage'

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

function PublicLayout({ children }) {
  return (
    <div className="bg-cream dark:bg-[#111111] min-h-screen transition-colors duration-300">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/"      element={<PublicLayout><HomePage  /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/login"  element={<LoginPage  />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route index element={<DashboardPage />} />
          </Route>

          <Route path="/skills" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route index           element={<CharactersPage    />} />
            <Route path="new"      element={<EditCharacterPage />} />
            <Route path=":id"      element={<DetailPage        />} />
            <Route path=":id/edit" element={<EditCharacterPage />} />
          </Route>

          <Route path="/profile" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route index element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}