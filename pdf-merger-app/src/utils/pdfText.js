// Utility to extract text (and page mapping) from a PDF using PDF.js loaded via public/pdf.min.js
// Assumes PDF.js is already configured by ./utils/pdfSetup.js

export async function extractPdfTextWithPages(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // Wait for PDF.js to load if not ready
    let attempts = 0
    while (!window.pdfjsLib && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    
    if (!window.pdfjsLib) {
      // Try to load PDF.js if not available
      await loadPDFJS()
    }
    
    const loadingTask = window.pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0
    })
    
    const pdf = await loadingTask.promise
    
    if (!pdf || pdf.numPages === 0) {
      throw new Error('Invalid PDF or no pages found')
    }

    let fullText = ''
    const pages = []

    for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
      try {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .filter(item => item.str && item.str.trim())
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (pageText) {
          pages.push({ pageNumber: pageNum, text: pageText })
          fullText += `${pageText} `
        }
      } catch (pageError) {
        console.warn(`Error extracting text from page ${pageNum}:`, pageError)
        continue
      }
    }

    if (!fullText.trim()) {
      throw new Error('No readable text found in PDF')
    }

    return { fullText: fullText.trim(), pages }
  } catch (error) {
    console.error('PDF text extraction error:', error)
    throw new Error(`Failed to extract text: ${error.message}`)
  }
}

// Helper function to load PDF.js
function loadPDFJS() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        resolve()
      } else {
        reject(new Error('PDF.js failed to load'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load PDF.js script'))
    document.head.appendChild(script)
  })
}

export function simpleSummarize(text, sentenceCount = 3) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input for summarization')
  }
  
  // Clean and split text into sentences
  const cleanText = text.replace(/\s+/g, ' ').trim()
  if (cleanText.length < 50) {
    throw new Error('Text too short to summarize')
  }
  
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .filter(s => s && s.trim().length > 10)
    .map(s => s.trim())

  if (sentences.length === 0) {
    throw new Error('No valid sentences found for summarization')
  }
  
  if (sentences.length <= sentenceCount) {
    return sentences.join(' ')
  }

  // Simple extractive summarization
  const stopwords = new Set([
    'the', 'is', 'at', 'of', 'on', 'and', 'a', 'to', 'in', 'for', 'with', 'as', 'by', 'an', 'be', 'are', 'or', 'from', 'that', 'this', 'it', 'we', 'you', 'but', 'not', 'or', 'as', 'what', 'go', 'their'
  ])
  
  const wordFreq = new Map()
  const sentenceTokens = sentences.map(s => {
    const tokens = s.toLowerCase().match(/[a-z0-9]+/g) || []
    return tokens.filter(w => w.length > 2 && !stopwords.has(w))
  })
  
  // Count word frequencies
  sentenceTokens.forEach(tokens => {
    tokens.forEach(w => {
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1)
    })
  })
  
  // Score sentences based on word frequencies
  const scores = sentenceTokens.map(tokens => {
    if (tokens.length === 0) return 0
    const score = tokens.reduce((acc, w) => acc + (wordFreq.get(w) || 0), 0)
    return score / tokens.length // Normalize by sentence length
  })
  
  // Select top sentences
  const indexed = scores.map((score, idx) => ({ idx, score }))
  indexed.sort((a, b) => b.score - a.score)
  const top = indexed.slice(0, sentenceCount).sort((a, b) => a.idx - b.idx)
  
  const summary = top.map(x => sentences[x.idx]).join(' ')
  return summary || sentences.slice(0, sentenceCount).join(' ')
}

export function chunkTextByPages(pages, maxCharsPerChunk = 1200) {
  const chunks = []
  pages.forEach(({ pageNumber, text }) => {
    if (!text) return
    let start = 0
    while (start < text.length) {
      const end = Math.min(start + maxCharsPerChunk, text.length)
      const slice = text.slice(start, end)
      chunks.push({ page: pageNumber, text: slice })
      start = end
    }
  })
  return chunks
}

export function retrieveRelevantChunks(query, chunks, k = 3) {
  const qTokens = (query.toLowerCase().match(/[a-z0-9]+/g) || [])
  const scores = chunks.map((c, i) => {
    const tTokens = (c.text.toLowerCase().match(/[a-z0-9]+/g) || [])
    const set = new Set(tTokens)
    let score = 0
    qTokens.forEach(q => { if (set.has(q)) score++ })
    return { i, score }
  })
  scores.sort((a, b) => b.score - a.score)
  return scores.slice(0, k).map(s => chunks[s.i])
}


