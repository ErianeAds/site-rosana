import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Methodology from './components/Methodology'
import Success from './components/Success'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import AdminDashboard from './components/Admin/AdminDashboard'
import StudentArea from './components/Student/StudentArea'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [view, setView] = useState('landing') // 'landing', 'admin', 'student'
  const { user, loginWithGoogle, logout } = useAuth()

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg)
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePayment = (pkgId) => {
    console.log(`Iniciando pagamento para o pacote: ${pkgId}`)
    alert('Redirecionando para o checkout seguro...')
  }

  // Effect to handle URL hash for testing
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#admin') setView('admin')
    else if (hash === '#student') setView('student')
    else setView('landing')
  }, [])

  if (view === 'admin') return <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
  if (view === 'student') return <ProtectedRoute><StudentArea /></ProtectedRoute>

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services onSelectPackage={handleSelectPackage} />
        <Methodology />
        <Success />
        <Contact selectedPackage={selectedPackage} onPayment={handlePayment} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App
