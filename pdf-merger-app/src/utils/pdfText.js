// Utility to extract text (and page mapping) from a PDF using PDF.js loaded via public/pdf.min.js
// Assumes PDF.js is already configured by ./utils/pdfSetup.js

export async function extractPdfTextWithPages(file) {
  const arrayBuffer = await file.arrayBuffer()
  // pdfjsLib is exposed globally by pdf.min.js
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  let fullText = ''
  const pages = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => item.str).join(' ')
    pages.push({ pageNumber: pageNum, text: pageText })
    fullText += `\n\n[Page ${pageNum}]\n${pageText}`
  }

  return { fullText: fullText.trim(), pages }
}

export function simpleSummarize(text, sentenceCount = 5) {
  if (!text) return ''
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(s => s && s.length > 0)

  if (sentences.length <= sentenceCount) return sentences.join(' ')

  // Frequency-based extractive summary
  const stopwords = new Set(['the','is','at','of','on','and','a','to','in','for','with','as','by','an','be','are','or','from','that','this','it','we','you'])
  const wordFreq = new Map()
  const sentenceTokens = sentences.map(s => s.toLowerCase().match(/[a-z0-9]+/g) || [])
  sentenceTokens.forEach(tokens => {
    tokens.forEach(w => {
      if (stopwords.has(w)) return
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1)
    })
  })
  const scores = sentenceTokens.map(tokens => tokens.reduce((acc, w) => acc + (wordFreq.get(w) || 0), 0))
  const indexed = scores.map((score, idx) => ({ idx, score }))
  indexed.sort((a, b) => b.score - a.score)
  const top = indexed.slice(0, sentenceCount).sort((a, b) => a.idx - b.idx)
  return top.map(x => sentences[x.idx]).join(' ')
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


