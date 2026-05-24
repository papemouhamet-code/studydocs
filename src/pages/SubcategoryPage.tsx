import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { BookOpen, ChevronRight } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4">
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Accueil</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-white" onClick={() => navigate(`/category/${categoryId}`)}>{category?.name}</span>
            <ChevronRight size={14} />
            <span className="text-white">{subcategory?.name}</span>
          </div>
          <h1 className="text-2xl font-bold">{subcategory?.name}</h1>
          <p className="text-indigo-200">{courses.length} cours</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p>Aucun cours disponible pour le moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map(course => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)}
                className="bg-white rounded-xl px-5 py-4 shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:bg-indigo-50 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-indigo-400" />
                  <p className="font-medium text-gray-800">{course.name}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
