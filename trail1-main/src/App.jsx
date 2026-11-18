import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  ArrowRight, Bell, BriefcaseBusiness, Check, ChevronDown,
  ChevronRight, Clipboard, ClipboardCheck, Clock3, FileSpreadsheet, FileText, Filter,
  History, LayoutDashboard, LoaderCircle, LogIn, LogOut, Menu, Moon, Plus, Search,
  Settings, ShieldCheck, Sparkles, Sun, Trash2, UserRound, X, Bookmark,
} from 'lucide-react'

const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobsnap-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const SAMPLE_DESCRIPTION = `Software Engineer Intern — Campus & Off-campus

About Northstar Labs
Northstar Labs is a product engineering company building tools for teams around the world. Learn more at https://northstarlabs.example/careers.

Role: Software Engineer Intern
Location: Bengaluru, Karnataka. This is a hybrid internship with three days per week in our Bengaluru office.
Duration: 6 months, with a possible full-time conversion based on performance.
Stipend: INR 35,000 per month.

What you'll do:
• Build and test product features using React, JavaScript and Node.js.
• Work with engineers and designers to turn product requirements into reliable software.
• Write readable code, participate in code reviews and contribute to technical documentation.

What we're looking for:
• Students pursuing a B.E. or B.Tech in Computer Science, Information Technology or a related engineering branch, graduating in 2026 or 2027.
• Minimum 7.0 CGPA and no active backlogs at the time of joining.
• Familiarity with JavaScript, React, Git and basic data structures.
• Clear written and verbal communication, curiosity and collaborative problem-solving.
• Freshers and candidates without prior professional experience are welcome.

Selection process:
1. Online coding assessment (60 minutes)
2. Technical interview
3. Culture and collaboration conversation

Apply by 30 November 2026 using the careers page. Shortlisted candidates will receive an interview invitation by email. Interviews will be conducted online over Google Meet during the week of 7 December 2026; the exact date and time will be shared individually.

Please have a current resume, academic transcripts and a government-issued photo ID ready. Northstar Labs does not charge candidates at any stage of recruitment.`

const EMPTY_FIELDS = [
  { key: 'companyName', label: 'Company name', group: 'Company', required: true },
  { key: 'website', label: 'Company website', group: 'Company' },
  { key: 'jobRole', label: 'Job role', group: 'Role', required: true },
  { key: 'department', label: 'Department', group: 'Role' },
  { key: 'location', label: 'Job location', group: 'Company', required: true },
  { key: 'workMode', label: 'Work mode', group: 'Company', required: true },
  { key: 'jobType', label: 'Job type', group: 'Role' },
  { key: 'summary', label: 'Role summary', group: 'Role' },
  { key: 'responsibilities', label: 'Key responsibilities', group: 'Role', list: true },
  { key: 'technicalSkills', label: 'Technical skills', group: 'Skills', list: true, required: true },
  { key: 'softSkills', label: 'Soft skills', group: 'Skills', list: true },
  { key: 'experienceRequired', label: 'Experience required', group: 'Eligibility', required: true },
  { key: 'eligibility.minimumEducation', label: 'Minimum education', group: 'Eligibility' },
  { key: 'eligibility.degrees', label: 'Eligible degrees', group: 'Eligibility', list: true },
  { key: 'eligibility.branches', label: 'Eligible branches', group: 'Eligibility', list: true },
  { key: 'eligibility.graduationYears', label: 'Graduation years', group: 'Eligibility', list: true },
  { key: 'eligibility.minimumScore', label: 'Minimum CGPA / percentage', group: 'Eligibility' },
  { key: 'eligibility.backlogs', label: 'Backlog criteria', group: 'Eligibility' },
  { key: 'eligibility.experienceEligibility', label: 'Fresher / experience eligibility', group: 'Eligibility' },
  { key: 'eligibility.ageCriteria', label: 'Age criteria', group: 'Eligibility' },
  { key: 'eligibility.otherRequirements', label: 'Other eligibility requirements', group: 'Eligibility', list: true },
  { key: 'salary', label: 'Salary / CTC / stipend', group: 'Compensation', required: true },
  { key: 'recruitmentType', label: 'Recruitment type', group: 'Recruitment', required: true, important: true },
  { key: 'applicationDeadline', label: 'Application deadline', group: 'Recruitment', required: true, important: true },
  { key: 'interviewDates', label: 'Interview date(s)', group: 'Recruitment', list: true, important: true },
  { key: 'interviewTime', label: 'Interview time', group: 'Recruitment', important: true },
  { key: 'interviewPlatform', label: 'Interview platform', group: 'Recruitment', important: true },
  { key: 'walkInDates', label: 'Walk-in date(s)', group: 'Recruitment', list: true, important: true },
  { key: 'walkInReportingTime', label: 'Walk-in reporting time', group: 'Recruitment', important: true },
  { key: 'walkInVenue', label: 'Walk-in venue', group: 'Recruitment', important: true },
  { key: 'assessmentDate', label: 'Assessment date', group: 'Recruitment', important: true },
  { key: 'assessmentTime', label: 'Assessment time', group: 'Recruitment', important: true },
  { key: 'assessmentPlatform', label: 'Assessment platform', group: 'Recruitment', important: true },
  { key: 'testDuration', label: 'Assessment duration', group: 'Recruitment' },
  { key: 'numberOfInterviewRounds', label: 'Number of interview rounds', group: 'Recruitment' },
  { key: 'selectionProcess', label: 'Selection process', group: 'Recruitment', list: true },
  { key: 'requiredDocuments', label: 'Required documents', group: 'Recruitment', list: true },
  { key: 'contactPerson', label: 'Contact person', group: 'Recruitment' },
  { key: 'contactNumber', label: 'Contact number', group: 'Recruitment' },
  { key: 'joiningInstructions', label: 'Joining instructions', group: 'Recruitment', list: true },
  { key: 'bond', label: 'Bond / service agreement', group: 'Additional' },
  { key: 'trainingPeriod', label: 'Training period', group: 'Additional' },
  { key: 'probationPeriod', label: 'Probation period', group: 'Additional' },
  { key: 'noticePeriod', label: 'Notice period', group: 'Additional' },
  { key: 'joiningDate', label: 'Joining date', group: 'Additional' },
  { key: 'benefits', label: 'Benefits and perks', group: 'Additional', list: true },
  { key: 'importantInstructions', label: 'Important instructions', group: 'Additional', list: true },
]

const getValue = (object, path) => path.split('.').reduce((value, part) => value?.[part], object)
const setValue = (object, path, nextValue) => {
  const result = structuredClone(object)
  const parts = path.split('.')
  const key = parts.pop()
  const parent = parts.reduce((value, part) => value[part], result)
  parent[key] = nextValue
  return result
}
const displayValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join('\n') : 'Not Mentioned'
  return typeof value === 'string' && value.trim() ? value : 'Not Mentioned'
}
const fieldsFor = (analysis) => EMPTY_FIELDS
  .map((field) => ({ ...field, value: displayValue(getValue(analysis, field.key)) }))
  .filter((field) => field.required || field.value !== 'Not Mentioned')
const readStoredJobs = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('jobsnap-history') || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}
const safeError = (error) => error?.response?.data?.error || 'Something went wrong. Please try again.'
const formatDate = (date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analyze', label: 'Analyze job', icon: Sparkles },
  { id: 'saved', label: 'Saved jobs', icon: Bookmark },
  { id: 'history', label: 'Job history', icon: History },
]

function App() {
  const [page, setPage] = useState('dashboard')
  const [description, setDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [currentJob, setCurrentJob] = useState(null)
  const [jobs, setJobs] = useState(readStoredJobs)
  const [theme, setTheme] = useState(() => localStorage.getItem('jobsnap-theme') || 'light')
  const [user, setUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeMatch, setResumeMatch] = useState(null)
  const [isComparingResume, setIsComparingResume] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('jobsnap-history', JSON.stringify(jobs))
  }, [jobs])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('jobsnap-theme', theme)
  }, [theme])

  useEffect(() => {
    const token = localStorage.getItem('jobsnap-token')
    if (!token) return
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('jobsnap-token'))
  }, [])

  useEffect(() => {
    if (!user) return
    api.get('/jobs')
      .then(({ data }) => {
        setJobs((current) => {
          const localIds = new Set(current.map((job) => job.id))
      const accountJobs = data.jobs.map((job) => ({ ...job, synced: true }))
      return [...current, ...accountJobs.filter((job) => !localIds.has(job.id))]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        })
      })
      .catch((error) => notify(safeError(error), 'error'))
  }, [user])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (message, type = 'success') => setToast({ message, type })
  const savedCount = jobs.filter((job) => job.saved).length
  const visibleJobs = useMemo(() => jobs
    .filter((job) => page !== 'saved' || job.saved)
    .filter((job) => filter === 'all' || (filter === 'saved' ? job.saved : !job.saved))
    .filter((job) => `${job.company} ${job.role} ${job.location}`.toLowerCase().includes(search.toLowerCase())),
  [jobs, page, filter, search])

  const goTo = (nextPage) => {
    setPage(nextPage)
    setMobileNavOpen(false)
    setIsEditing(false)
  }

  const analyzeJob = async () => {
    if (description.trim().length < 50) {
      notify('Add at least 50 characters so the analyzer has enough context.', 'error')
      return
    }
    setIsAnalyzing(true)
    setPage('analyze')
    setAnalysis(null)
    setCurrentJob(null)
    setResumeFile(null)
    setResumeMatch(null)
    setIsEditing(false)
    try {
      const { data } = await api.post('/analyze', { description: description.trim() })
      const extracted = data.analysis
      const localJob = {
        id: crypto.randomUUID(),
        company: extracted.companyName,
        role: extracted.jobRole,
        location: extracted.location,
        description: description.trim(),
        analysis: extracted,
        saved: false,
        createdAt: new Date().toISOString(),
      }
      let syncError = ''
      if (user) {
        try {
          const saved = await api.post('/jobs', { description: localJob.description, analysis: extracted })
          Object.assign(localJob, saved.data.job, { synced: true })
        } catch (error) {
          syncError = `Analysis complete, but it could not be synced to your account: ${safeError(error)}`
        }
      }
      setJobs((current) => [localJob, ...current])
      setCurrentJob(localJob)
      setAnalysis(extracted)
      notify(syncError || 'Your job description is ready to review.', syncError ? 'error' : 'success')
    } catch (error) {
      notify(safeError(error), 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const openJob = (job) => {
    setCurrentJob(job)
    setDescription(job.description)
    setAnalysis(job.analysis)
    setResumeFile(null)
    setResumeMatch(null)
    setIsEditing(false)
    setPage('analyze')
  }

  const compareResume = async () => {
    if (!resumeFile) {
      notify('Choose your resume first.', 'error')
      return
    }

    const selectResume = (file) => {
      if (!file) {
        setResumeFile(null)
        setResumeMatch(null)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        notify('Resume files must be 5 MB or smaller.', 'error')
        return
      }
      const extension = file.name.toLowerCase().split('.').pop()
      if (!['pdf', 'docx'].includes(extension)) {
        notify('Choose a PDF or DOCX resume.', 'error')
        return
      }
      setResumeFile(file)
      setResumeMatch(null)
    }
    if (description.trim().length < 50) {
      notify('Analyze a job description before comparing your resume.', 'error')
      return
    }
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('jobDescription', description.trim())
    setIsComparingResume(true)
    setResumeMatch(null)
    try {
      const { data } = await api.post('/resume-match', formData)
      setResumeMatch(data.comparison)
      notify('Your resume comparison is ready.')
    } catch (error) {
      notify(safeError(error), 'error')
    } finally {
      setIsComparingResume(false)
    }
  }

  const toggleSaved = async (job = currentJob) => {
    if (!job) return
    if (!user) {
      setAuthOpen(true)
      notify('Sign in to save jobs to your account.', 'error')
      return
    }
    const nextSaved = !job.saved
    try {
      const response = job.synced
        ? await api.patch(`/jobs/${job.id}`, { saved: nextSaved })
        : await api.post('/jobs', { description: job.description, analysis: job.analysis, saved: nextSaved })
      const updated = { ...response.data.job, synced: true }
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, ...updated } : item))
      setCurrentJob((current) => current?.id === job.id ? { ...current, ...updated } : current)
      notify(nextSaved ? 'Job saved to your account.' : 'Job removed from saved jobs.')
    } catch (error) {
      notify(safeError(error), 'error')
    }
  }

  const updateAnalysis = (key, value, isList) => {
    const next = setValue(analysis, key, isList ? value.split('\n').map((item) => item.trim()).filter(Boolean) : value)
    setAnalysis(next)
  }

  const saveEdits = async () => {
    if (!analysis || !currentJob) return
    const updated = {
      ...currentJob,
      company: analysis.companyName,
      role: analysis.jobRole,
      location: analysis.location,
      analysis,
    }
    if (user && currentJob.synced) {
      try {
        const { data } = await api.patch(`/jobs/${currentJob.id}`, { analysis })
        Object.assign(updated, data.job)
      } catch (error) {
        notify(`Your edits could not be synced: ${safeError(error)}`, 'error')
        return
      }
    } else if (user) {
      try {
        const { data } = await api.post('/jobs', { description: currentJob.description, analysis, saved: currentJob.saved })
        Object.assign(updated, data.job, { synced: true })
      } catch (error) {
        notify(`Your edits could not be synced: ${safeError(error)}`, 'error')
        return
      }
    }
    setCurrentJob(updated)
    setJobs((current) => current.map((job) => job.id === currentJob.id ? updated : job))
    setIsEditing(false)
    notify('Your changes have been saved.')
  }

  const deleteJob = async (job) => {
    if (user && job.synced) {
      try {
        await api.delete(`/jobs/${job.id}`)
      } catch (error) {
        notify(safeError(error), 'error')
        return
      }
    }
    setJobs((current) => current.filter((item) => item.id !== job.id))
    if (currentJob?.id === job.id) {
      setCurrentJob(null)
      setAnalysis(null)
    }
    notify('Job removed from your history.')
  }

  const clearAll = () => {
    setDescription('')
    setAnalysis(null)
    setCurrentJob(null)
    setResumeFile(null)
    setResumeMatch(null)
    setIsEditing(false)
  }

  const exportRows = () => fieldsFor(analysis).map(({ label, value }) => ({ Field: label, 'Extracted information': value }))

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(exportRows().map((row) => `${row.Field}: ${row['Extracted information']}`).join('\n\n'))
      notify('Analysis copied to clipboard.')
    } catch {
      notify('Clipboard access is unavailable in this browser.', 'error')
    }
  }

  const downloadExcel = async () => {
    try {
      const { data } = await api.post('/export/excel', {
        company: analysis.companyName,
        rows: exportRows(),
      }, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${(analysis.companyName || 'jobsnap-analysis').replace(/[^\w-]+/g, '-')}-analysis.xlsx`
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      notify('Excel file downloaded.')
    } catch {
      notify('The Excel file could not be created. Please try again.', 'error')
    }
  }

  const downloadPdf = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 44
      let y = 52
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(19)
      pdf.text('JobSnap AI', margin, y)
      y += 24
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(110, 108, 128)
      pdf.text(`Job analysis · ${analysis.companyName || 'Company not mentioned'}`, margin, y)
      y += 24
      exportRows().forEach((row) => {
        const labelLines = pdf.splitTextToSize(row.Field, 140)
        const valueLines = pdf.splitTextToSize(row['Extracted information'].replace(/\n/g, ', '), pageWidth - margin * 2 - 160)
        const height = Math.max(labelLines.length, valueLines.length) * 13 + 13
        if (y + height > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage()
          y = 52
        }
        pdf.setDrawColor(230, 229, 238)
        pdf.line(margin, y - 2, pageWidth - margin, y - 2)
        pdf.setTextColor(75, 72, 96)
        pdf.setFont('helvetica', 'bold')
        pdf.text(labelLines, margin, y + 11)
        pdf.setTextColor(45, 43, 61)
        pdf.setFont('helvetica', 'normal')
        pdf.text(valueLines, margin + 160, y + 11)
        y += height
      })
      pdf.save(`${(analysis.companyName || 'jobsnap-analysis').replace(/[^\w-]+/g, '-')}-analysis.pdf`)
      notify('PDF downloaded.')
    } catch {
      notify('The PDF could not be created. Please try again.', 'error')
    }
  }

  const onAuthSuccess = async (data) => {
    localStorage.setItem('jobsnap-token', data.token)
    setUser(data.user)
    setAuthOpen(false)
    notify(`Welcome, ${data.user.name.split(' ')[0]}!`)
  }

  const signOut = () => {
    localStorage.removeItem('jobsnap-token')
    setUser(null)
    notify('You have signed out.')
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <button className="brand" onClick={() => goTo('dashboard')} aria-label="JobSnap AI dashboard">
          <span className="brand-mark"><BriefcaseBusiness size={19} strokeWidth={2.2} /></span>
          <span>JobSnap <b>AI</b></span>
        </button>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => goTo(id)} className={`nav-item ${page === id ? 'nav-active' : ''}`}>
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {id === 'saved' && savedCount > 0 && <span className="nav-count">{savedCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><Sparkles size={16} /></span>
            <strong>Make your next move</strong>
            <p>Get the details that matter, without the long read.</p>
            <button onClick={() => goTo('analyze')}>Analyze a job <ArrowRight size={14} /></button>
          </div>
          <button className="nav-item settings-link" onClick={() => goTo('settings')}>
            <Settings size={18} /><span>Settings</span>
          </button>
          <div className="profile-mini">
            <div className="avatar">{user ? user.name.slice(0, 1).toUpperCase() : <UserRound size={17} />}</div>
            <div className="profile-copy">
              <strong>{user?.name || 'Guest workspace'}</strong>
              <span>{user?.email || 'Your jobs stay on this device'}</span>
            </div>
            {user ? <button className="icon-button profile-action" title="Sign out" onClick={signOut}><LogOut size={16} /></button> : <button className="icon-button profile-action" title="Sign in" onClick={() => setAuthOpen(true)}><LogIn size={16} /></button>}
          </div>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <span className="privacy-note"><ShieldCheck size={15} /> Private by design</span>
            <button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {user
              ? <button className="user-button" onClick={signOut}><span className="avatar small">{user.name.slice(0, 1).toUpperCase()}</span><span>{user.name.split(' ')[0]}</span><ChevronDown size={14} /></button>
              : <button className="button button-outline button-small" onClick={() => setAuthOpen(true)}>Sign in <ArrowRight size={15} /></button>}
          </div>
        </header>

        <main className="main-content">
          {page === 'dashboard' && (
            <Dashboard jobs={jobs} user={user} onAnalyze={() => goTo('analyze')} onOpen={openJob} onBrowse={() => goTo('history')} />
          )}
          {page === 'analyze' && (
            <section className="page-section analyze-page">
              <div className="page-heading heading-row">
                <div>
                  <div className="eyebrow"><span className="eyebrow-dot" /> YOUR JOB, DECODED</div>
                  <h1>Understand any job<br className="desktop-break" /> description in seconds.</h1>
                  <p>Paste a job post and get every important detail, organized and ready to act on.</p>
                </div>
                {analysis && <button className="button button-outline reanalyze" onClick={analyzeJob} disabled={isAnalyzing}><Sparkles size={16} /> Re-analyze</button>}
              </div>

              <div className={`input-card ${analysis ? 'input-card-compact' : ''}`}>
                <div className="input-card-top">
                  <div><span className="step-number">01</span><strong>Paste the job description</strong></div>
                  <button className="text-button sample-button" onClick={() => { setDescription(SAMPLE_DESCRIPTION); setAnalysis(null); setCurrentJob(null); setResumeFile(null); setResumeMatch(null) }}><Clipboard size={15} /> Try a sample</button>
                </div>
                <textarea
                  aria-label="Job description"
                  placeholder="Paste the full job description, recruitment notice or interview invitation here..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={40000}
                  spellCheck="false"
                />
                <div className="input-footer">
                  <span>{description.length.toLocaleString()} / 40,000 characters</span>
                  <div className="input-actions">
                    <button className="text-button clear-button" onClick={clearAll} disabled={!description && !analysis}>Clear text</button>
                    <button className="button button-primary analyze-button" onClick={analyzeJob} disabled={isAnalyzing || description.trim().length < 50}>
                      {isAnalyzing ? <><LoaderCircle className="spin" size={17} /> Analyzing</> : <><Sparkles size={16} /> Analyze job</>}
                    </button>
                  </div>
                </div>
                <div className="input-note"><ShieldCheck size={14} /> Sent to the configured AI provider; analyses are saved to your account when signed in.</div>
              </div>

              {isAnalyzing && <LoadingState />}
              {!isAnalyzing && analysis && (
                <ResultsPanel
                  analysis={analysis}
                  currentJob={currentJob}
                  editing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onCancelEdit={() => { setAnalysis(currentJob.analysis); setIsEditing(false) }}
                  onSaveEdits={saveEdits}
                  onChange={updateAnalysis}
                  onCopy={copyResults}
                  onPdf={downloadPdf}
                  onExcel={downloadExcel}
                  onSaveJob={() => toggleSaved()}
                  onDelete={() => deleteJob(currentJob)}
                  onClear={clearAll}
                />
              )}
              {!isAnalyzing && analysis && (
                <ResumeMatchPanel
                  file={resumeFile}
                  match={resumeMatch}
                  loading={isComparingResume}
                  onFileChange={selectResume}
                  onCompare={compareResume}
                />
              )}
              {!isAnalyzing && !analysis && <EmptyAnalysis />}
            </section>
          )}
          {(page === 'history' || page === 'saved') && (
            <JobsPage
              page={page}
              jobs={visibleJobs}
              search={search}
              filter={filter}
              onSearch={setSearch}
              onFilter={setFilter}
              onOpen={openJob}
              onDelete={deleteJob}
              onToggleSaved={toggleSaved}
              onAnalyze={() => goTo('analyze')}
            />
          )}
          {page === 'settings' && (
            <SettingsPage
              user={user}
              theme={theme}
              onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              onSignIn={() => setAuthOpen(true)}
              onSignOut={signOut}
              onClearHistory={() => { setJobs([]); clearAll(); notify('Local job history cleared.') }}
            />
          )}
        </main>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={onAuthSuccess} />}
      {toast && <div className={`toast toast-${toast.type}`} role="status"><span className="toast-icon">{toast.type === 'error' ? <X size={15} /> : <Check size={15} />}</span>{toast.message}<button aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button></div>}
    </div>
  )
}

function pageTitle(page) {
  return ({ dashboard: 'Dashboard', analyze: 'Analyze job', saved: 'Saved jobs', history: 'Job history', settings: 'Settings' })[page] || 'Dashboard'
}

function Dashboard({ jobs, user, onAnalyze, onOpen, onBrowse }) {
  const recent = jobs.slice(0, 3)
  return (
    <section className="page-section dashboard-page">
      <div className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CAREER, WITH CLARITY</div>
          <h1>Good to have you{user ? `, ${user.name.split(' ')[0]}` : ' here'}<span className="welcome-period">.</span></h1>
          <p>Make your next opportunity easier to understand.</p>
        </div>
        <button className="button button-primary" onClick={onAnalyze}><Plus size={17} /> Analyze a job</button>
      </div>

      <div className="hero-card">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-content">
          <span className="hero-kicker"><Sparkles size={14} /> THE SHORTCUT TO THE DETAILS</span>
          <h2>Less scrolling.<br />More knowing.</h2>
          <p>Turn lengthy job descriptions into the facts you need to make your move.</p>
          <button className="button button-white" onClick={onAnalyze}>Analyze a job <ArrowRight size={16} /></button>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="illustration-sheet">
            <div className="sheet-top"><span /><span /><span /></div>
            <div className="sheet-label">ROLE SNAPSHOT</div>
            <div className="sheet-title-line" /><div className="sheet-long-line" /><div className="sheet-short-line" />
            <div className="sheet-pill-row"><span>Hybrid</span><span>Full-time</span></div>
            <div className="sheet-divider" />
            <div className="sheet-detail"><span /><i /></div><div className="sheet-detail"><span /><i /></div>
            <div className="sheet-detail highlight"><span /><i /></div>
          </div>
          <div className="floating-spark"><Sparkles size={21} /></div>
          <div className="floating-check"><Check size={16} /></div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={FileText} label="Analyzed jobs" value={jobs.length} foot="Your growing job library" tint="purple" />
        <StatCard icon={Bookmark} label="Saved for later" value={jobs.filter((job) => job.saved).length} foot="Opportunities to revisit" tint="peach" />
        <StatCard icon={Clock3} label="Recent activity" value={jobs.length ? formatDate(jobs[0].createdAt) : '—'} foot={jobs.length ? 'Last job analyzed' : 'Ready when you are'} tint="blue" />
      </div>

      <div className="section-title-row">
        <div><h2>Recently analyzed</h2><p>Pick up where you left off.</p></div>
        <button className="text-button" onClick={onBrowse}>View job history <ArrowRight size={15} /></button>
      </div>
      {recent.length > 0 ? (
        <div className="recent-list">{recent.map((job) => <JobRow key={job.id} job={job} onOpen={onOpen} />)}</div>
      ) : (
        <div className="recent-empty"><span className="empty-icon"><FileText size={19} /></span><div><strong>Your job history starts here</strong><p>Analyze your first description and keep everything in one place.</p></div><button className="button button-outline button-small" onClick={onAnalyze}>Get started <ArrowRight size={14} /></button></div>
      )}
    </section>
  )
}

function StatCard({ icon: Icon, label, value, foot, tint }) {
  return <div className="stat-card"><span className={`stat-icon stat-${tint}`}><Icon size={18} /></span><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-foot">{foot}</span></div>
}

function LoadingState() {
  return (
    <div className="loading-card">
      <div className="loading-icon"><LoaderCircle className="spin" size={23} /></div>
      <h3>Finding the details that matter</h3>
      <p>Reading the description carefully and organizing the key information.</p>
      <div className="loading-track"><span /></div>
      <span className="loading-caption">This usually takes a few seconds</span>
    </div>
  )
}

function EmptyAnalysis() {
  return (
    <div className="empty-analysis">
      <div className="empty-graphic"><span className="graphic-back" /><span className="graphic-page"><i /><i /><i /><i /></span><span className="graphic-magnify"><Search size={20} /></span><span className="graphic-spark"><Sparkles size={15} /></span></div>
      <h3>Your job snapshot will show up here</h3>
      <p>We’ll organize the role, eligibility, dates and everything else worth knowing.</p>
      <div className="empty-steps"><span><i>1</i> Paste a description</span><ChevronRight size={14} /><span><i>2</i> Get the full picture</span></div>
    </div>
  )
}

function ResultsPanel({ analysis, currentJob, editing, onEdit, onCancelEdit, onSaveEdits, onChange, onCopy, onPdf, onExcel, onSaveJob, onDelete, onClear }) {
  const fields = fieldsFor(analysis)
  return (
    <section className="results-section">
      <div className="results-heading">
        <div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR ANALYSIS</div><h2>Job snapshot</h2><p>Key details extracted from the description you provided.</p></div>
        <span className="verified-badge"><ShieldCheck size={14} /> AI extracted · review before applying</span>
      </div>
      {analysis.reviewFlags?.length > 0 && (
        <div className="review-flags"><span><Bell size={16} /></span><div><strong>Worth a second look</strong>{analysis.reviewFlags.map((flag, index) => <p key={index}>{flag}</p>)}</div></div>
      )}
      <div className="result-toolbar">
        <span className="result-count"><span /> {fields.length} details found</span>
        <div className="toolbar-actions">
          {editing ? <>
            <button className="button button-outline button-small" onClick={onCancelEdit}>Cancel</button>
            <button className="button button-primary button-small" onClick={onSaveEdits}><Check size={15} /> Save changes</button>
          </> : <>
            <button className="button button-outline button-small" onClick={onCopy}><ClipboardCheck size={15} /><span>Copy</span></button>
            <button className="button button-outline button-small" onClick={onPdf}><FileText size={15} /><span>PDF</span></button>
            <button className="button button-outline button-small" onClick={onExcel}><FileSpreadsheet size={15} /><span>Excel</span></button>
            <button className={`button button-outline button-small save-result ${currentJob?.saved ? 'is-saved' : ''}`} onClick={onSaveJob}><Bookmark size={15} fill={currentJob?.saved ? 'currentColor' : 'none'} /><span>{currentJob?.saved ? 'Saved' : 'Save job'}</span></button>
            <button className="icon-button subtle-icon" title="Edit results" onClick={onEdit}><Settings size={16} /></button>
            <button className="icon-button subtle-icon delete-icon" title="Delete from history" onClick={onDelete}><Trash2 size={16} /></button>
          </>}
        </div>
      </div>
      <div className="results-card">
        <div className="table-header"><span>DETAIL</span><span>EXTRACTED INFORMATION</span></div>
        {fields.map((field) => (
          <div className={`result-row ${field.important ? 'important-row' : ''}`} key={field.key}>
            <div className="field-name">{field.important && <span className="important-mark" />}<span>{field.label}</span></div>
            <div className={`field-value ${field.value === 'Not Mentioned' ? 'value-missing' : ''}`}>
              {editing
                ? <textarea aria-label={`Edit ${field.label}`} value={field.value === 'Not Mentioned' ? '' : field.value} placeholder="Not Mentioned" rows={Math.min(4, Math.max(1, field.value.split('\n').length))} onChange={(event) => onChange(field.key, event.target.value, field.list)} />
                : field.value === 'Not Mentioned'
                  ? <span>Not mentioned</span>
                  : field.list
                    ? <ul className="value-list">{field.value.split('\n').map((item, index) => <li key={index}>{item}</li>)}</ul>
                    : <span className={field.important ? 'important-value' : ''}>{field.value}</span>}
            </div>
          </div>
        ))}
        <div className="result-footnote"><ShieldCheck size={14} /> Missing details are marked “Not mentioned.” Always verify dates and eligibility in the original listing.</div>
      </div>
      <div className="results-bottom-actions"><span>Found another opportunity?</span><button className="button button-outline button-small" onClick={onClear}><Plus size={15} /> Analyze another job</button></div>
    </section>
  )
}

function ResumeMatchPanel({ file, match, loading, onFileChange, onCompare }) {
  const scoreColor = match?.matchScore >= 75 ? 'strong' : match?.matchScore >= 50 ? 'moderate' : 'low'
  return (
    <section className="resume-section" aria-labelledby="resume-match-title">
      <div className="resume-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT ADVANTAGE</div>
          <h2 id="resume-match-title">How does your resume stack up?</h2>
          <p>Get a recruiter-style read against this exact job description.</p>
        </div>
        <span className="recruiter-tag"><BriefcaseBusiness size={14} /> Recruiter perspective</span>
      </div>
      {!match && (
        <div className="resume-upload-card">
          <label className="resume-dropzone">
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              aria-label="Upload your resume as a PDF or DOCX file"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            />
            <span className="resume-upload-icon"><FileText size={20} /></span>
            <span className="resume-upload-copy">
              <strong>{file ? file.name : 'Choose your resume'}</strong>
              <span>{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to compare` : 'PDF or DOCX · 5 MB max'}</span>
            </span>
            <span className="button button-outline button-small">{file ? 'Change file' : 'Browse files'}</span>
          </label>
          <div className="resume-submit-row">
            <span><ShieldCheck size={14} /> Parsed for this comparison only; not added to job history.</span>
            <button className="button button-primary resume-submit" onClick={onCompare} disabled={!file || loading}>
              {loading ? <><LoaderCircle className="spin" size={16} /> Comparing</> : <><Sparkles size={15} /> Compare my resume</>}
            </button>
          </div>
          {loading && <div className="resume-progress"><span /></div>}
        </div>
      )}
      {match && (
        <div className="resume-results">
          <div className="match-score-card">
            <div className={`score-ring score-${scoreColor}`} style={{ '--score': `${match.matchScore}%` }}>
              <div><strong>{match.matchScore}</strong><span>/100</span></div>
            </div>
            <div className="score-copy">
              <span className={`score-label score-label-${scoreColor}`}>{scoreColor === 'strong' ? 'Strong alignment' : scoreColor === 'moderate' ? 'Some alignment' : 'Needs attention'}</span>
              <h3>Your resume match</h3>
              <p>{match.scoreRationale}</p>
            </div>
            <label className="resume-replace">
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                aria-label="Choose another resume"
                onChange={(event) => onFileChange(event.target.files?.[0] || null)}
              />
              <span>{file?.name || 'Resume compared'}</span><ChevronDown size={14} />
            </label>
          </div>
          <div className="match-detail-grid">
            <div className="match-detail-card">
              <div className="match-detail-title"><span className="keyword-icon"><Search size={15} /></span><div><h3>Keywords to strengthen</h3><p>The most relevant terms missing from your resume.</p></div></div>
              {match.missingKeywords.length
                ? <div className="keyword-list">{match.missingKeywords.map((item, index) => <div className="keyword-item" key={`${item.keyword}-${index}`}><div><strong>{item.keyword}</strong><span>{item.reason}</span></div><i className={`importance importance-${item.importance.toLowerCase()}`}>{item.importance}</i></div>)}</div>
                : <div className="match-empty-note"><Check size={15} /> No major job keywords appear to be missing.</div>}
            </div>
            <div className="match-detail-card">
              <div className="match-detail-title"><span className="flag-icon"><Bell size={15} /></span><div><h3>First 20-second red flags</h3><p>Potential concerns a recruiter may notice at a glance.</p></div></div>
              {match.redFlags.length
                ? <div className="red-flag-list">{match.redFlags.map((item, index) => <div className="red-flag-item" key={`${item.concern}-${index}`}><strong>{item.concern}</strong><span>{item.evidence}</span></div>)}</div>
                : <div className="match-empty-note"><Check size={15} /> No obvious red flags were found in the provided text.</div>}
            </div>
          </div>
          {match.strengths.length > 0 && <div className="match-strengths"><strong><Check size={15} /> What already stands out</strong><ul>{match.strengths.map((strength, index) => <li key={index}>{strength}</li>)}</ul></div>}
          <div className="match-disclaimer"><ShieldCheck size={14} /> AI-generated guidance, not a hiring decision. Resume text was sent to the configured AI provider for this comparison and is not saved by JobSnap AI.</div>
          <div className="resume-actions">
            <span>{file?.name || 'Resume comparison complete'}</span>
            <button className="button button-outline button-small" onClick={onCompare} disabled={loading}><Sparkles size={14} /> Compare again</button>
          </div>
        </div>
      )}
    </section>
  )
}

function JobsPage({ page, jobs, search, filter, onSearch, onFilter, onOpen, onDelete, onToggleSaved, onAnalyze }) {
  const isSavedPage = page === 'saved'
  return (
    <section className="page-section jobs-page">
      <div className="page-heading heading-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR OPPORTUNITIES</div><h1>{isSavedPage ? 'Saved jobs' : 'Job history'}</h1><p>{isSavedPage ? 'Keep track of the roles you want to come back to.' : 'Every description you have analyzed, all in one place.'}</p></div><button className="button button-primary" onClick={onAnalyze}><Plus size={17} /> Analyze a job</button></div>
      <div className="jobs-controls">
        <label className="search-field"><Search size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search company, role or location" /></label>
        <label className="filter-field"><Filter size={15} /><select value={isSavedPage ? 'saved' : filter} onChange={(event) => onFilter(event.target.value)} disabled={isSavedPage}><option value="all">All jobs</option><option value="saved">Saved jobs</option><option value="unsaved">Not saved</option></select><ChevronDown size={14} /></label>
      </div>
      {jobs.length > 0 ? <div className="jobs-list">{jobs.map((job) => <JobRow key={job.id} job={job} onOpen={onOpen} onDelete={onDelete} onToggleSaved={onToggleSaved} showActions />)}</div> : <div className="jobs-empty"><span className="empty-icon"><BriefcaseBusiness size={21} /></span><h3>{isSavedPage ? 'No saved jobs yet' : search ? 'No matching jobs' : 'No analyzed jobs yet'}</h3><p>{isSavedPage ? 'Save a job analysis to keep it close at hand.' : search ? 'Try another company, role or location.' : 'Paste your first job description and get a clear snapshot.'}</p>{!isSavedPage && !search && <button className="button button-primary" onClick={onAnalyze}>Analyze a job <ArrowRight size={15} /></button>}</div>}
      <div className="list-disclaimer"><ShieldCheck size={14} /> {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} · Your history is stored {jobs.some((job) => job.id && !job.id.startsWith('local-')) ? 'in your account and on this device' : 'on this device'}</div>
    </section>
  )
}

function JobRow({ job, onOpen, onDelete, onToggleSaved, showActions = false }) {
  const companyInitial = job.company && job.company !== 'Not Mentioned' ? job.company.slice(0, 1).toUpperCase() : '?'
  return (
    <div className="job-row">
      <button className="company-logo" onClick={() => onOpen(job)} aria-label={`Open ${job.company}`}>{companyInitial}</button>
      <button className="job-main" onClick={() => onOpen(job)}><strong>{job.role === 'Not Mentioned' ? 'Role not mentioned' : job.role}</strong><span>{job.company === 'Not Mentioned' ? 'Company not mentioned' : job.company}<i />{job.location === 'Not Mentioned' ? 'Location not mentioned' : job.location}</span></button>
      <span className="job-date">{formatDate(job.createdAt)}</span>
      {job.saved && <span className="saved-pill"><Bookmark size={12} fill="currentColor" /> Saved</span>}
      {showActions && <div className="job-actions">
        {onToggleSaved && <button className={`icon-button ${job.saved ? 'saved-action' : ''}`} title={job.saved ? 'Remove from saved jobs' : 'Save job'} onClick={() => onToggleSaved(job)}><Bookmark size={16} fill={job.saved ? 'currentColor' : 'none'} /></button>}
        <button className="icon-button job-delete" title="Delete job" onClick={() => onDelete(job)}><Trash2 size={16} /></button>
        <button className="icon-button open-job" title="Open analysis" onClick={() => onOpen(job)}><ArrowRight size={17} /></button>
      </div>}
    </div>
  )
}

function SettingsPage({ user, theme, onThemeChange, onSignIn, onSignOut, onClearHistory }) {
  return (
    <section className="page-section settings-page">
      <div className="page-heading"><div className="eyebrow"><span className="eyebrow-dot" /> PREFERENCES</div><h1>Settings</h1><p>Manage your workspace and how JobSnap AI looks.</p></div>
      <div className="settings-card">
        <div className="settings-section-head"><div className="settings-icon"><UserRound size={18} /></div><div><strong>Account</strong><p>Your sign-in and saved job details.</p></div></div>
        <div className="settings-row"><div><strong>{user ? user.name : 'Guest workspace'}</strong><span>{user ? user.email : 'Sign in to sync saved jobs across sessions.'}</span></div>{user ? <button className="button button-outline button-small" onClick={onSignOut}><LogOut size={14} /> Sign out</button> : <button className="button button-primary button-small" onClick={onSignIn}><LogIn size={14} /> Sign in / Create account</button>}</div>
      </div>
      <div className="settings-card">
        <div className="settings-section-head"><div className="settings-icon"><Sun size={18} /></div><div><strong>Appearance</strong><p>Choose the theme that feels right for you.</p></div></div>
        <div className="settings-row"><div><strong>Color theme</strong><span>Currently using {theme} mode.</span></div><button className="button button-outline button-small" onClick={onThemeChange}>{theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}{theme === 'light' ? 'Switch to dark' : 'Switch to light'}</button></div>
      </div>
      <div className="settings-card danger-card">
        <div className="settings-section-head"><div className="settings-icon"><Trash2 size={18} /></div><div><strong>Clear local data</strong><p>Remove job history stored in this browser. Account-saved jobs are not deleted.</p></div></div>
        <div className="settings-row"><div><strong>Local job history</strong><span>This action cannot be undone.</span></div><button className="button button-danger button-small" onClick={onClearHistory}><Trash2 size={14} /> Clear history</button></div>
      </div>
      <div className="settings-privacy"><ShieldCheck size={16} /><p><strong>Your privacy matters.</strong> Descriptions are sent to the configured AI provider for analysis. Your API key stays on the server and is never exposed in the browser.</p></div>
    </section>
  )
}

function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email, password } : { name, email, password }
      const { data } = await api.post(endpoint, payload)
      await onSuccess(data)
    } catch (requestError) {
      setError(safeError(requestError))
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button modal-close" aria-label="Close dialog" onClick={onClose}><X size={18} /></button>
        <span className="auth-mark"><BriefcaseBusiness size={19} /></span>
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR JOBS, TOGETHER</div>
        <h2 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-subtitle">{mode === 'login' ? 'Sign in to keep your saved jobs close.' : 'Save analyses and revisit opportunities anywhere.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && <label className="form-label">Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" minLength={2} maxLength={80} required /></label>}
          <label className="form-label">Email address<input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
          <label className="form-label">Password<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'} minLength={mode === 'register' ? 8 : 1} maxLength={128} required /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary auth-submit" disabled={loading}>{loading ? <><LoaderCircle size={16} className="spin" /> Please wait</> : <>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></>}</button>
        </form>
        <div className="auth-switch">{mode === 'login' ? 'New to JobSnap?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></div>
        <div className="auth-note"><ShieldCheck size={14} /> Passwords are encrypted before storage.</div>
      </section>
    </div>
  )
}

export default App
