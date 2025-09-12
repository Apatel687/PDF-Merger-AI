import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Summarize from './pages/Summarize'
import AskPDF from './pages/AskPDF'
import ImageTools from './pages/ImageTools'
import OfficeTools from './pages/OfficeTools'
import AnnotateTools from './pages/AnnotateTools'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import './App.css'

function App() {

  return (
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
      </Routes>
    </Router>
  )
}

export default App