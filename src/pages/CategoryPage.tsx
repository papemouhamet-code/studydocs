import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { ChevronRight, Folder, ArrowLeft } from 'lucide-react'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState<any>(null)
  const [subcategories, setSubcategories] = useState<any[]>([])

  useEffect(() => {
    supabase.from('categories').select('*').eq('id', categoryId).single().then(({ data }) => {
      if (data) setCategory(data)
    })
    supabase.from('subcategories').select('*, courses(id)').eq('category_id', categoryId).order('name').then(({ data }) => {
      if (data) setSubcategories(data)
    })
  }, [categoryId])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-indigo-200 hover:text-white mb-4">
            <ArrowLeft size={18} /> Accueil
          </button>
          <h1 className="text-2xl font-bold">{category?.name}</h1>
          <p className="text-indigo-200">{subcategories.length} sous-catégories</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subcategories.map(sub => (
            <div key={sub.id} onClick={() => navigate(`/category/${categoryId}/${sub.id}`)}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:bg-indigo-50 transition">
              <div className="flex items-center gap-3 mb-2">
                <Folder size={24} className="text-indigo-400" />
                <p className="font-medium text-gray-800">{sub.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{sub.courses?.length || 0} cours</p>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
