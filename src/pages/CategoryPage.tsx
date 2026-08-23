import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { ArrowLeft, ChevronRight } from 'lucide-react'

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
    <div className="min-h-screen" style={{background: '#0d1117', color: 'white'}}>

      {/* Navbar */}
      <nav style={{background: '#161b22', borderBottom: '1px solid #30363d'}} className="px-6 py-4 flex items-center gap-4 fixed top-0 left-0 right-0 z-50">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={18} /> Accueil
        </button>
        <span className="text-gray-600">|</span>
        <span className="text-white font-medium">{category?.name}</span>
      </nav>
      <div style={{height: '64px'}}></div>

      {/* Header */}
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <p style={{color: '#a78bfa'}} className="text-sm font-medium mb-2 uppercase tracking-wider">Catégorie</p>
        <h1 className="text-4xl font-bold text-white mb-2">{category?.name}</h1>
        <p className="text-gray-400">{subcategories.length} sous-catégories disponibles</p>
      </div>

      {/* Subcategories grid - style UQAC */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 border border-gray-800 rounded-xl overflow-hidden">
          {subcategories.map((sub, index) => (
            <div key={sub.id} onClick={() => navigate(`/category/${categoryId}/${sub.id}`)}
              className="relative cursor-pointer group overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}22, #161b22)`,
                borderRight: (index + 1) % 3 !== 0 ? '1px solid #30363d' : 'none',
                borderBottom: index < subcategories.length - 3 ? '1px solid #30363d' : 'none',
                minHeight: '180px'
              }}>
              <div className="absolute inset-0 bg-purple-900 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="p-6 h-full flex flex-col justify-between relative z-10">
                <div>
                  <p style={{color: '#a78bfa'}} className="text-xs font-semibold uppercase tracking-wider mb-2">{category?.name}</p>
                  <h3 className="text-white font-bold text-lg leading-tight">{sub.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{sub.courses?.length || 0} cours</p>
                </div>
                <div className="flex items-center justify-between mt-4"></div>