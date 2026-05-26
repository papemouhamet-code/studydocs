import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { BookOpen, Search, Clock, Star } from 'lucide-react'

const ICONS: Record<string, string> = {
  'Informatique': '💻',
  'Mathématiques': '📐',
  'Physique': '⚛️',
  'Chimie': '🧪',
  'Électronique & Électrotechnique': '⚡',
  'Automatique & Traitement du signal': '📡',
  'Génie mécanique & industriel': '⚙️',
  'Science des matériaux': '🔬',
  'Génie civil & BTP': '🏗️',
  'Géologie & Géosciences': '🌍',
  'Hydraulique & ressources en eau': '💧',
  'Biologie & Sciences de la vie': '🧬',
  'Médecine & Sciences de la santé': '🏥',
  'Agroalimentaire & nutrition': '🌾',
  'Environnement & énergie': '🌱',
  'Gestion & économie': '📊',
  'Télécommunications': '📶',
}

export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])
  const [recentFiles, setRecentFiles] = useState<any[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data)
    })
    supabase.from('files').select('*, courses(name, id)').order('created_at', { ascending: false }).limit(10).then(({ data }) => {
      if (data) setRecentFiles(data)
    })
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    setRecentlyViewed(viewed)
  }, [])

  useEffect(() => {
    if (search.length < 2) { setSearchResults([]); return }
    supabase.from('courses').select('*, subcategories(name, category_id, categories(name, id))').ilike('name', `%${search}%`).limit(10).then(({ data }) => {
      if (data) setSearchResults(data)
    })
  }, [search])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen size={32} />
            <h1 className="text-3xl font-bold">UnivPDF</h1>
          </div>
          <p className="text-indigo-200 mb-6">Votre bibliothèque universitaire en ligne</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-base outline-none"
              placeholder="Rechercher un cours..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                {searchResults.map(c => (
                  <div key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-400">{c.subcategories?.categories?.name} — {c.subcategories?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ad top */}
      <div id="ad-top" className="max-w-5xl mx-auto px-4 py-2">{/* AdSense placement */}</div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Categories */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Catégories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
          {categories.map(cat => (
            <div key={cat.id} onClick={() => navigate(`/category/${cat.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer hover:bg-indigo-50 transition border border-gray-100">
              <div className="text-3xl mb-2">{ICONS[cat.name] || '📚'}</div>
              <p className="font-medium text-gray-800 text-sm">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* Ajoutés récemment */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star size={20} className="text-indigo-500" /> Ajoutés récemment
        </h2>
        {recentFiles.length === 0 ? (
          <p className="text-gray-400 mb-10">Aucun document ajouté pour le moment.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 mb-10">
            {recentFiles.map(f => (
              <div key={f.id} onClick={() => navigate(`/course/${f.course_id}/cours/${f.id}`)}
                className="min-w-[200px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:bg-indigo-50 transition">
                <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{f.title}</p>
                <p className="text-xs text-gray-400">{f.courses?.name}</p>
                <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{f.file_type || 'PDF'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Vus récemment */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-indigo-500" /> Vus récemment
        </h2>
        {recentlyViewed.length === 0 ? (
          <p className="text-gray-400">Aucun document consulté pour le moment.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentlyViewed.map((item: any, i: number) => (
              <div key={i} onClick={() => navigate(`/course/${item.courseId}/cours/${item.fileId}`)}
                className="min-w-[200px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:bg-indigo-50 transition">
                <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ad bottom */}
      <div id="ad-bottom" className="max-w-5xl mx-auto px-4 py-2">{/* AdSense placement */}</div>
    </div>
  )
}
