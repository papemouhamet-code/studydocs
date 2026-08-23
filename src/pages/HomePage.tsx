import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { BookOpen, Search, Clock, Star, ChevronRight } from 'lucide-react'

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

const BG_COLORS: Record<string, string> = {
  'Informatique': 'from-blue-900 to-blue-700',
  'Mathématiques': 'from-purple-900 to-purple-700',
  'Physique': 'from-cyan-900 to-cyan-700',
  'Chimie': 'from-green-900 to-green-700',
  'Électronique & Électrotechnique': 'from-yellow-900 to-yellow-700',
  'Automatique & Traitement du signal': 'from-orange-900 to-orange-700',
  'Génie mécanique & industriel': 'from-red-900 to-red-700',
  'Science des matériaux': 'from-teal-900 to-teal-700',
  'Génie civil & BTP': 'from-stone-900 to-stone-700',
  'Géologie & Géosciences': 'from-lime-900 to-lime-700',
  'Hydraulique & ressources en eau': 'from-sky-900 to-sky-700',
  'Biologie & Sciences de la vie': 'from-emerald-900 to-emerald-700',
  'Médecine & Sciences de la santé': 'from-rose-900 to-rose-700',
  'Agroalimentaire & nutrition': 'from-amber-900 to-amber-700',
  'Environnement & énergie': 'from-green-900 to-teal-700',
  'Gestion & économie': 'from-indigo-900 to-indigo-700',
  'Télécommunications': 'from-violet-900 to-violet-700',
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
    <div className="min-h-screen" style={{background: '#0d1117', color: 'white'}}>

      {/* 1. NAVBAR */}
      <nav style={{background: '#161b22', borderBottom: '1px solid #30363d'}} className="px-6 py-4 flex items-center gap-6 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div style={{background: '#7c3aed'}} className="p-1.5 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">UnivPDF</span>
          <span style={{background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44'}} className="text-xs px-2 py-0.5 rounded-full">ACADÉMIQUE</span>
        </div>
        <div className="flex-1 relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            style={{background: '#21262d', border: '1px solid #30363d', color: 'white'}}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            placeholder="Rechercher un cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div style={{background: '#161b22', border: '1px solid #30363d'}} className="absolute top-11 left-0 right-0 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
              {searchResults.map(c => (
                <div key={c.id} onClick={() => { navigate(`/course/${c.id}`); setSearch(''); setSearchResults([]) }}
                  className="px-4 py-3 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition">
                  <p className="font-medium text-white text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.subcategories?.categories?.name} — {c.subcategories?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 2. HERO */}
      <div className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">
          Trouvez vos <span style={{color: '#a78bfa'}}>cours universitaires</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">Accédez à des milliers de cours, TD, TP et examens universitaires</p>
      </div>

      {/* 3. AD TOP */}
      <div id="ad-top" className="max-w-6xl mx-auto px-4 py-2">{/* AdSense placement */}</div>

      <div className="max-w-6xl mx-auto px-4 pb-16">

        {/* 4. CATEGORIES */}
        <h2 className="text-xl font-bold text-white mb-6">Catégories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-14">
          {categories.map(cat => (
            <div key={cat.id} onClick={() => navigate(`/category/${cat.id}`)}
              className={`bg-gradient-to-br ${BG_COLORS[cat.name] || 'from-gray-900 to-gray-700'} rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform border border-gray-700 hover:border-purple-500`}>
              <div className="text-4xl mb-3">{ICONS[cat.name] || '📚'}</div>
              <p className="font-semibold text-white text-sm">{cat.name}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-300 text-xs">
                <ChevronRight size={12} /> Voir les cours
              </div>
            </div>
          ))}
        </div>

        {/* 5. AJOUTES RECEMMENT */}
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Star size={20} className="text-purple-400" /> Ajoutés récemment
        </h2>
        <p className="text-gray-400 text-sm mb-4">Les derniers documents ajoutés sur UnivPDF</p>
        {recentFiles.length === 0 ? (
          <p className="text-gray-500 mb-14">Aucun document ajouté pour le moment.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 mb-14">
            {recentFiles.map(f => (
              <div key={f.id} onClick={() => navigate(`/course/${f.course_id}/cours/${f.id}`)}
                style={{background: '#161b22', border: '1px solid #30363d', minWidth: '220px'}}
                className="rounded-xl p-4 cursor-pointer hover:border-purple-500 transition">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-purple-400" />
                  <span style={{background: '#7c3aed33', color: '#a78bfa'}} className="text-xs px-2 py-0.5 rounded-full">{f.file_type || 'PDF'}</span>
                </div>
                <p className="font-medium text-white text-sm mb-1 line-clamp-2">{f.title}</p>
                <p className="text-xs text-gray-400">{f.courses?.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* 6. VUS RECEMMENT */}
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Clock size={20} className="text-purple-400" /> Vus récemment
        </h2>
        <p className="text-gray-400 text-sm mb-4">Les derniers documents que vous avez consultés</p>
        {recentlyViewed.length === 0 ? (
          <p className="text-gray-500">Aucun document consulté pour le moment.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentlyViewed.map((item: any, i: number) => (
              <div key={i} onClick={() => navigate(`/course/${item.courseId}/cours/${item.fileId}`)}
                style={{background: '#161b22', border: '1px solid #30363d', minWidth: '220px'}}
                className="rounded-xl p-4 cursor-pointer hover:border-purple-500 transition">
                <p className="font-medium text-white text-sm mb-1 line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. AD BOTTOM */}
      <div id="ad-bottom" className="max-w-6xl mx-auto px-4 py-2">{/* AdSense placement */}</div>
    </div>
  )
}