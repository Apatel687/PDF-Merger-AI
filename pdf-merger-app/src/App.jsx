import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { LanguageProvider } from './contexts/LanguageContext'
import { DropdownProvider } from './contexts/DropdownContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'
import Summarize from './pages/Summarize'
import AskPDF from './pages/AskPDF'
import ImageTools from './pages/ImageTools'
import OfficeTools from './pages/OfficeTools'
import AnnotateTools from './pages/AnnotateTools'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Backup from './pages/Backup'
import TestPage from './pages/TestPage'
import HowToMergePDF from './pages/HowToMergePDF'
import HowToSummarizePDF from './pages/HowToSummarizePDF'
import HowToChatWithPDF from './pages/HowToChatWithPDF'
import HowToAddWatermark from './pages/HowToAddWatermark'
import HowToConvertImages from './pages/HowToConvertImages'
import HowToConvertOffice from './pages/HowToConvertOffice'
import Contact from './pages/Contact'
import Features from './pages/Features'
import Help from './pages/Help'
import './App.css'

function App() {

  return (
    <ThemeProvider>
      <LanguageProvider>
        <DropdownProvider>
          <ToastProvider>
          <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summarize" element={<Summarize />} />
            <Route path="/ask" element={<AskPDF />} />
            <Route path="/images" element={<ImageTools />} />
            <Route path="/office" element={<OfficeTools />} />
            <Route path="/annotate" element={<AnnotateTools />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/backup" element={<Backup />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/how-to-merge-pdf" element={<HowToMergePDF />} />
            <Route path="/how-to-summarize-pdf" element={<HowToSummarizePDF />} />
            <Route path="/how-to-chat-with-pdf" element={<HowToChatWithPDF />} />
            <Route path="/how-to-add-watermark" element={<HowToAddWatermark />} />
            <Route path="/how-to-convert-images" element={<HowToConvertImages />} />
            <Route path="/how-to-convert-office" element={<HowToConvertOffice />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/help" element={<Help />} />
          </Routes>
          </Router>
          </ToastProvider>
        </DropdownProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App