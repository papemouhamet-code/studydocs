import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { ChevronRight, FileText, ArrowLeft } from 'lucide-react'

const SECTIONS = [
  { key: 'cours', label: 'Cours' },
  { key: 'exercices', label: 'Exercices / TD / TP / Examens' },
  { key: 'cas', label: 'Études de cas & Traitement' },
  { key: 'autres', label: 'Autres fichiers' },
]

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<any>(null)
  const [subcategory, setSubcategory] = useState<any>(null)
  const [category, setCategory] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('cours')
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    supabase.from('courses').select('*, subcategories(*, categories(*))').eq('id', courseId).single().then(({ data }) => {
      if (data) {
        setCourse(data)
        setSubcategory(data.subcategories)
        setCategory(data.subcategories?.categories)
      }
    })
  }, [courseId])

  useEffect(() => {
    if (!courseId) return
    supabase.from('files').select('*').eq('course_id', courseId).eq('section', activeSection).order('order_index').then(({ data }) => {
      if (data) setFiles(data)
    })
  }, [courseId, activeSection])

  const tags = course?.tags ? course.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []

  return (
    <div className="min-h-screen" style={{background: '#0d1117', color: 'white'}}>

      {/* Navbar */}
      <nav style={{background: '#161b22', borderBottom: '1px solid #30363d'}} className="px-6 py-4 flex items-center gap-3 fixed top-0 left-0 right-0 z-50 flex-wrap">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition flex items-center gap-1">
          <ArrowLeft size={16} /> Accueil
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <button onClick={() => navigate(`/category/${category?.id}`)} className="text-gray-400 hover:text-white transition">
          {category?.name}
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <button onClick={() => navigate(`/category/${category?.id}/${subcategory?.id}`)} className="text-gray-400 hover:text-white transition">
          {subcategory?.name}
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <span className="text-white">{course?.name}</span>
      </nav>
      <div style={{height: '64px'}}></div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8">

        {/* Left */}
        <div className="flex-1">
          <p style={{color: '#a78bfa'}} className="text-sm font-medium mb-2 uppercase tracking-wider">{subcategory?.name}</p>
          <h1 className="text-3xl font-bold text-white mb-6">{course?.name}</h1>

          {course?.description && (
            <div style={{background: '#161b22', border: '1px solid #30363d'}} className="rounded-xl p-5 mb-6">
              <h2 className="font-semibold text-white mb-2">À propos de ce cours</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag: string, i: number) => (
                    <span key={i} style={{background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44'}} className="text-xs px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-wrap mb-6">
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                style={activeSection === s.key
                  ? {background: '#7c3aed', color: 'white'}
                  : {background: '#161b22', color: '#9ca3af', border: '1px solid #30363d'}}
                className="px-4 py-2 rounded-full text-sm font-medium transition hover:border-purple-500">
                {s.label}
              </button>
            ))}
          </div>

          {files.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500">Aucun fichier disponible dans cette section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {files.map(f => (
                <div key={f.id} onClick={() => navigate(`/course/${courseId}/${activeSection}/${f.id}`)}
                  style={{background: '#161b22', border: '1px solid #30363d'}}
                  className="rounded-xl p-4 cursor-pointer hover:border-purple-500 transition text-center group">
                  <div style={{background: '#7c3aed22'}} className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText size={24} style={{color: '#a78bfa'}} />
                  </div>
                  <p className="font-medium text-white text-sm line-clamp-2">{f.title}</p>
                  <span style={{background: '#7c3aed33', color: '#a78bfa'}} className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full">{f.file_type || 'PDF'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block w-56 shrink-0">
          <div style={{background: '#161b22', border: '1px solid #30363d'}} className="rounded-xl p-4 sticky top-20">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Fichiers disponibles</p>
            <div className="flex flex-col gap-2">
              {files.length === 0 ? (
                <p className="text-xs text-gray-600">Aucun fichier</p>
              ) : (
                files.map((f, i) => (
                  <div key={f.id} onClick={() => navigate(`/course/${courseId}/${activeSection}/${f.id}`)}
                    style={{border: '1px solid #30363d'}}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm hover:border-purple-500 hover:text-purple-400 text-gray-400 transition">
                    <span className="text-xs text-gray-600 w-5">{i + 1}</span>
                    <span className="line-clamp-1">{f.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}