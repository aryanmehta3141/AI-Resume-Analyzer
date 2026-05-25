import { useCallback, useRef, useState } from 'react'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

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

export default function UploadSection() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [message, setMessage] = useState('')

  const handleFile = useCallback((selected) => {
    if (!selected) return
    const isValid =
      ACCEPTED_TYPES.includes(selected.type) ||
      /\.(pdf|doc|docx)$/i.test(selected.name)
    if (!isValid) {
      setMessage('Please upload a PDF or Word document.')
      return
    }
    setFile(selected)
    setMessage('')
  }, [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files?.[0]
      handleFile(dropped)
    },
    [handleFile],
  )

  const onAnalyze = () => {
    if (!file || isAnalyzing) return
    setIsAnalyzing(true)
    setMessage('')
    setTimeout(() => {
      setIsAnalyzing(false)
      setMessage(`Analysis complete for "${file.name}". Full results coming soon.`)
    }, 2000)
  }

  return (
    <section id="upload" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get started"
          title="Upload your resume"
          description="Drop your file below and get AI-powered feedback in seconds."
          className="mb-12"
        />

        <div className="mx-auto max-w-2xl space-y-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={[
              'flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors duration-200',
              isDragging
                ? 'border-violet-400/60 bg-violet-500/5'
                : 'border-white/20 bg-zinc-900/30 hover:border-white/30 hover:bg-zinc-900/50',
            ].join(' ')}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {file ? (
              <>
                <FileIcon />
                <p className="mt-4 font-medium text-white">{file.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {(file.size / 1024).toFixed(1)} KB · Click or drop to replace
                </p>
              </>
            ) : (
              <>
                <div className="mb-4 text-zinc-500">
                  <UploadIcon />
                </div>
                <p className="font-medium text-white">
                  Drag & drop your resume here
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  or click to browse · PDF, DOC, DOCX up to 10MB
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              disabled={!file || isAnalyzing}
              onClick={onAnalyze}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </span>
              ) : (
                'Analyze resume'
              )}
            </Button>
            {file && !isAnalyzing && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setFile(null)
                  setMessage('')
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                Clear file
              </Button>
            )}
          </div>

          {message && (
            <p
              className={`text-center text-sm ${
                message.startsWith('Analysis complete')
                  ? 'text-emerald-400'
                  : message.startsWith('Please')
                    ? 'text-amber-400'
                    : 'text-zinc-400'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
