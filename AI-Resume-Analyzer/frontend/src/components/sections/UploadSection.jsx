import { useCallback, useRef, useState } from 'react'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'
import AnalysisResults from './AnalysisResults'
import { ANALYZE_URL } from '../../config/api'
import { hasAnalysisContent, mapAnalysis } from '../../utils/mapAnalysis'

function UploadIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

// Human-readable file size
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadSection() {
  const inputRef = useRef(null)
  // abortControllerRef holds the AbortController for the in-flight fetch.
  // This lets us cancel the request if the user clears the file mid-analysis.
  const abortControllerRef = useRef(null)

  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [analysis, setAnalysis] = useState(null)

  const handleFile = useCallback((selected) => {
    if (!selected) return

    // Client-side PDF check — catches obvious mistakes before hitting the server
    const isPdf =
      selected.type === 'application/pdf' ||
      selected.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      setMessage('Please upload a PDF file.')
      setMessageType('error')
      return
    }

    // 5 MB client-side guard (matches backend limit)
    const MAX_SIZE = 5 * 1024 * 1024
    if (selected.size > MAX_SIZE) {
      setMessage('File is too large. Maximum size is 5MB.')
      setMessageType('error')
      return
    }

    setFile(selected)
    setMessage('')
    setAnalysis(null)
  }, [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      handleFile(e.dataTransfer.files?.[0])
    },
    [handleFile],
  )

  const onAnalyze = async () => {
    if (!file || isAnalyzing) return

    // Create a new AbortController for this request.
    // We also set a 70-second timeout to handle Render's free-tier cold start
    // (the server sleeps after inactivity and takes ~30-50s to wake up).
    const controller = new AbortController()
    abortControllerRef.current = controller

    const timeoutId = setTimeout(() => controller.abort('timeout'), 70_000)

    setIsAnalyzing(true)
    setMessage('Analyzing your resume…')
    setMessageType('info')
    setAnalysis(null)

    // Show a "waking up" hint after 5 seconds so users don't think it's broken
    const slowHintId = setTimeout(() => {
      setMessage('Still working… the server may be waking up from sleep (this can take ~30s on first use).')
    }, 5000)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Analysis failed. Please try again.')
      }

      const mapped = mapAnalysis(result.data)

      if (!hasAnalysisContent(mapped)) {
        throw new Error(
          'Analysis returned empty data. Please check your GEMINI_API_KEY and restart the backend.',
        )
      }

      setAnalysis(mapped)
      setMessage('Analysis complete!')
      setMessageType('success')
    } catch (error) {
      // User clicked Cancel
      if (error.name === 'AbortError' && error.message !== 'timeout') return

      let msg
      if (error.message === 'timeout' || error.name === 'AbortError') {
        msg = 'Request timed out. The server may still be waking up — please try again in a moment.'
      } else if (error.message === 'Failed to fetch') {
        msg = 'Cannot reach the backend. Please try again — the server may be starting up.'
      } else {
        msg = error.message || 'Something went wrong. Please try again.'
      }

      setMessage(msg)
      setMessageType('error')
    } finally {
      clearTimeout(timeoutId)
      clearTimeout(slowHintId)
      setIsAnalyzing(false)
      abortControllerRef.current = null
    }
  }

  const onClear = () => {
    // Cancel any in-flight request before clearing state
    abortControllerRef.current?.abort()
    setFile(null)
    setMessage('')
    setAnalysis(null)
    setIsAnalyzing(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const messageColor =
    messageType === 'success'
      ? 'text-emerald-400'
      : messageType === 'error'
        ? 'text-amber-400'
        : 'text-zinc-400'

  return (
    <section id="upload" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get started"
          title="Upload your resume"
          description="Drop your PDF below and get AI-powered feedback in seconds."
          className="mb-12"
        />

        <div className="mx-auto max-w-2xl space-y-6">
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload resume PDF"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={[
              'group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ease-out backdrop-blur-sm',
              isDragging
                ? 'scale-[1.01] border-violet-400 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.25)] ring-2 ring-violet-500/20'
                : 'border-white/10 bg-zinc-900/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.005] hover:border-violet-500/30 hover:bg-zinc-900/50 hover:shadow-[0_10px_40px_rgba(139,92,246,0.06)]',
            ].join(' ')}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              aria-hidden="true"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {file ? (
              <>
                <div className="text-violet-400 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                  <FileIcon />
                </div>
                <p className="mt-4 font-medium text-white transition-colors duration-300 group-hover:text-violet-300">
                  {file.name}
                </p>
                <p className="mt-1.5 text-sm text-zinc-500">
                  {formatSize(file.size)} · Click or drop to replace
                </p>
              </>
            ) : (
              <>
                <div className="mb-4 text-zinc-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-violet-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                  <UploadIcon />
                </div>
                <p className="font-medium text-white transition-colors duration-300 group-hover:text-zinc-200">
                  Drag & drop your resume here
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  or click to browse · PDF only, up to 5MB
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              disabled={!file || isAnalyzing}
              onClick={onAnalyze}
              className="w-full min-w-[200px] sm:w-auto"
              aria-busy={isAnalyzing}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  Analyzing…
                </span>
              ) : (
                'Analyze resume'
              )}
            </Button>

            {file && (
              <Button
                variant="ghost"
                size="lg"
                onClick={onClear}
                disabled={false}
              >
                {isAnalyzing ? 'Cancel' : 'Clear file'}
              </Button>
            )}
          </div>

          {message && (
            <p
              role={messageType === 'error' ? 'alert' : 'status'}
              className={`text-center text-sm ${messageColor}`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Results use full section width — upload stays narrow above */}
        {analysis && (
          <div className="mt-12 w-full">
            <AnalysisResults data={analysis} />
          </div>
        )}
      </div>
    </section>
  )
}
