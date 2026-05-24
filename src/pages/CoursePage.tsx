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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4 flex-wrap">
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Accueil</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-white" onClick={() => navigate(`/category/${category?.id}`)}>{category?.name}</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-white" onClick={() => navigate(`/category/${category?.id}/${subcategory?.id}`)}>{subcategory?.name}</span>
            <ChevronRight size={14} />
            <span className="text-white">{course?.name}</span>
          </div>
          <h1 className="text-2xl font-bold">{course?.name}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeSection === s.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-indigo-50'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Files */}
        {files.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p>Aucun fichier disponible dans cette section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map(f => (
              <div key={f.id} onClick={() => navigate(`/course/${courseId}/${activeSection}/${f.id}`)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:bg-indigo-50 transition text-center">
                <FileText size={32} className="text-indigo-400 mx-auto mb-2" />
                <p className="font-medium text-gray-800 text-sm line-clamp-2">{f.title}</p>
                <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{f.file_type || 'PDF'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
