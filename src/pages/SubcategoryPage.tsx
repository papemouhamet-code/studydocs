import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react'

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState<any>(null)
  const [subcategory, setSubcategory] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    supabase.from('categories').select('*').eq('id', categoryId).single().then(({ data }) => {
      if (data) setCategory(data)
    })
    supabase.from('subcategories').select('*').eq('id', subcategoryId).single().then(({ data }) => {
      if (data) setSubcategory(data)
    })
    supabase.from('courses').select('*').eq('subcategory_id', subcategoryId).order('name').then(({ data }) => {
      if (data) setCourses(data)
    })
  }, [subcategoryId])

  return (
    <div className="min-h-screen" style={{background: '#0d1117', color: 'white'}}>

      {/* Navbar */}
      <nav style={{background: '#161b22', borderBottom: '1px solid #30363d'}} className="px-6 py-4 flex items-center gap-3 sticky top-0 z-50 flex-wrap">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition flex items-center gap-1">
          <ArrowLeft size={16} /> Accueil
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <button onClick={() => navigate(`/category/${categoryId}`)} className="text-gray-400 hover:text-white transition">
          {category?.name}
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <span className="text-white">{subcategory?.name}</span>
      </nav>

      {/* Header */}
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <p style={{color: '#a78bfa'}} className="text-sm font-medium mb-2 uppercase tracking-wider">{category?.name}</p>
        <h1 className="text-4xl font-bold text-white mb-2">{subcategory?.name}</h1>
        <p className="text-gray-400">{courses.length} cours disponibles</p>
      </div>

      {/* Courses list */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">Aucun cours disponible pour le moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {courses.map(course => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)}
                style={{background: '#161b22', border: '1px solid #30363d'}}
                className="flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer hover:border-purple-500 transition group">
                <div className="flex items-center gap-4">
                  <div style={{background: '#7c3aed22'}} className="p-2 rounded-lg">
                    <BookOpen size={18} style={{color: '#a78bfa'}} />
                  </div>
                  <p className="font-medium text-white">{course.name}</p>
                </div>
                <ChevronRight size={18} className="text-gray-600 group-hover:text-purple-400 transition" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}