import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { LogOut, Plus, Trash2, BookOpen, Folder, FolderOpen, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('categories')
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [stats, setStats] = useState({ categories: 0, subcategories: 0, courses: 0, files: 0 })

  // Forms
  const [newCatName, setNewCatName] = useState('')
  const [newSubName, setNewSubName] = useState('')
  const [newSubCatId, setNewSubCatId] = useState('')
  const [newCourseName, setNewCourseName] = useState('')
  const [newCourseSubId, setNewCourseSubId] = useState('')
const [newFile, setNewFile] = useState({ title: '', section: 'cours', course_id: '', file_url_preview: '', file_url_server1: '', file_url_server2: '', file_url_server3: '', tuto_url_server1: '', tuto_url_server2: '', tuto_url_server3: '', file_type: 'PDF', file_size: '', order_index: 0 })

  useEffect(() => {
    checkAuth()
    loadAll()
  }, [])

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) navigate('/admin')
  }

  const loadAll = async () => {
    const [c, s, co, f] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('subcategories').select('*, categories(name)').order('name'),
      supabase.from('courses').select('*, subcategories(name)').order('name'),
      supabase.from('files').select('*, courses(name)').order('created_at', { ascending: false })
    ])
    setCategories(c.data || [])
    setSubcategories(s.data || [])
    setCourses(co.data || [])
    setFiles(f.data || [])
    setStats({ categories: c.data?.length || 0, subcategories: s.data?.length || 0, courses: co.data?.length || 0, files: f.data?.length || 0 })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const slug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const addCategory = async () => {
    if (!newCatName.trim()) return
    await supabase.from('categories').insert({ name: newCatName.trim(), slug: slug(newCatName) })
    setNewCatName('')
    loadAll()
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Supprimer cette catégorie et tout son contenu ?')) return
    await supabase.from('categories').delete().eq('id', id)
    loadAll()
  }

  const addSubcategory = async () => {
    if (!newSubName.trim() || !newSubCatId) return
    await supabase.from('subcategories').insert({ name: newSubName.trim(), slug: slug(newSubName), category_id: newSubCatId })
    setNewSubName('')
    loadAll()
  }

  const deleteSubcategory = async (id: string) => {
    if (!confirm('Supprimer cette sous-catégorie et tout son contenu ?')) return
    await supabase.from('subcategories').delete().eq('id', id)
    loadAll()
  }

  const addCourse = async () => {
    if (!newCourseName.trim() || !newCourseSubId) return
    await supabase.from('courses').insert({ name: newCourseName.trim(), slug: slug(newCourseName), subcategory_id: newCourseSubId })
    setNewCourseName('')
    loadAll()
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Supprimer ce cours et tous ses fichiers ?')) return
    await supabase.from('courses').delete().eq('id', id)
    loadAll()
  }

  const addFile = async () => {
    if (!newFile.title.trim() || !newFile.course_id) return
    await supabase.from('files').insert(newFile)
    setNewFile({ title: '', section: 'cours', course_id: '', file_url_server1: '', file_url_server2: '', file_url_server3: '', file_type: 'PDF', file_size: '', order_index: 0 })
    loadAll()
  }

  const deleteFile = async (id: string) => {
    if (!confirm('Supprimer ce fichier ?')) return
    await supabase.from('files').delete().eq('id', id)
    loadAll()
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
  const btnAdd = "flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
  const btnDel = "text-red-400 hover:text-red-600 transition"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">Panel Admin — StudyDocs</h1>
        <button onClick={logout} className="flex items-center gap-2 text-indigo-200 hover:text-white text-sm">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Catégories', value: stats.categories, icon: <FolderOpen size={20} className="text-indigo-400" /> },
            { label: 'Sous-catégories', value: stats.subcategories, icon: <Folder size={20} className="text-indigo-400" /> },
            { label: 'Cours', value: stats.courses, icon: <BookOpen size={20} className="text-indigo-400" /> },
            { label: 'Fichiers', value: stats.files, icon: <FileText size={20} className="text-indigo-400" /> },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              {s.icon}
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['categories', 'subcategories', 'courses', 'files'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-indigo-50'}`}>
              {t === 'categories' ? 'Catégories' : t === 'subcategories' ? 'Sous-catégories' : t === 'courses' ? 'Cours' : 'Fichiers'}
            </button>
          ))}
        </div>

        {/* CATEGORIES */}
        {tab === 'categories' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Ajouter une catégorie</h2>
            <div className="flex gap-3 mb-6">
              <input className={inputClass} placeholder="Nom de la catégorie" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <button className={btnAdd} onClick={addCategory}><Plus size={16} /> Ajouter</button>
            </div>
            <div className="flex flex-col gap-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-800">{c.name}</span>
                  <button className={btnDel} onClick={() => deleteCategory(c.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBCATEGORIES */}
        {tab === 'subcategories' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Ajouter une sous-catégorie</h2>
            <div className="flex gap-3 mb-6 flex-wrap">
              <select className={inputClass} value={newSubCatId} onChange={e => setNewSubCatId(e.target.value)}>
                <option value="">Choisir une catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input className={inputClass} placeholder="Nom de la sous-catégorie" value={newSubName} onChange={e => setNewSubName(e.target.value)} />
              <button className={btnAdd} onClick={addSubcategory}><Plus size={16} /> Ajouter</button>
            </div>
            <div className="flex flex-col gap-2">
              {subcategories.map(s => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-800">{s.name} <span className="text-gray-400">— {s.categories?.name}</span></span>
                  <button className={btnDel} onClick={() => deleteSubcategory(s.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES */}
        {tab === 'courses' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Ajouter un cours</h2>
            <div className="flex gap-3 mb-6 flex-wrap">
              <select className={inputClass} value={newCourseSubId} onChange={e => setNewCourseSubId(e.target.value)}>
                <option value="">Choisir une sous-catégorie</option>
                {subcategories.map(s => <option key={s.id} value={s.id}>{s.name} — {s.categories?.name}</option>)}
              </select>
              <input className={inputClass} placeholder="Nom du cours" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} />
              <button className={btnAdd} onClick={addCourse}><Plus size={16} /> Ajouter</button>
            </div>
            <div className="flex flex-col gap-2">
              {courses.map(c => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-800">{c.name} <span className="text-gray-400">— {c.subcategories?.name}</span></span>
                  <button className={btnDel} onClick={() => deleteCourse(c.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILES */}
        {tab === 'files' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Ajouter un fichier</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <select className={inputClass} value={newFile.course_id} onChange={e => setNewFile({ ...newFile, course_id: e.target.value })}>
                <option value="">Choisir un cours</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input className={inputClass} placeholder="Titre du fichier" value={newFile.title} onChange={e => setNewFile({ ...newFile, title: e.target.value })} />
              <select className={inputClass} value={newFile.section} onChange={e => setNewFile({ ...newFile, section: e.target.value })}>
                <option value="cours">Cours</option>
                <option value="exercices">Exercices / TD / TP / Examens</option>
                <option value="cas">Études de cas & Traitement</option>
                <option value="autres">Autres fichiers</option>
              </select>
              <input className={inputClass} placeholder="Type (PDF, DOCX...)" value={newFile.file_type} onChange={e => setNewFile({ ...newFile, file_type: e.target.value })} />
<input className={inputClass} placeholder="Lien Aperçu (pour visionner)" value={newFile.file_url_preview} onChange={e => setNewFile({ ...newFile, file_url_preview: e.target.value })} />
<input className={inputClass} placeholder="Lien Téléchargement Serveur 1" value={newFile.file_url_server1} onChange={e => setNewFile({ ...newFile, file_url_server1: e.target.value })} />
<input className={inputClass} placeholder="Lien Téléchargement Serveur 2 (optionnel)" value={newFile.file_url_server2} onChange={e => setNewFile({ ...newFile, file_url_server2: e.target.value })} />
<input className={inputClass} placeholder="Lien Téléchargement Serveur 3 (optionnel)" value={newFile.file_url_server3} onChange={e => setNewFile({ ...newFile, file_url_server3: e.target.value })} />
<input className={inputClass} placeholder="Vidéo tutoriel Serveur 1 (optionnel)" value={newFile.tuto_url_server1} onChange={e => setNewFile({ ...newFile, tuto_url_server1: e.target.value })} />
<input className={inputClass} placeholder="Vidéo tutoriel Serveur 2 (optionnel)" value={newFile.tuto_url_server2} onChange={e => setNewFile({ ...newFile, tuto_url_server2: e.target.value })} />
<input className={inputClass} placeholder="Vidéo tutoriel Serveur 3 (optionnel)" value={newFile.tuto_url_server3} onChange={e => setNewFile({ ...newFile, tuto_url_server3: e.target.value })} />
<input className={inputClass} placeholder="Type (PDF, DOCX...)" value={newFile.file_type} onChange={e => setNewFile({ ...newFile, file_type: e.target.value })} />
<input className={inputClass} placeholder="Taille (ex: 2.5 MB)" value={newFile.file_size} onChange={e => setNewFile({ ...newFile, file_size: e.target.value })} />
              <input className={inputClass} placeholder="Lien Serveur 2 (optionnel)" value={newFile.file_url_server2} onChange={e => setNewFile({ ...newFile, file_url_server2: e.target.value })} />
              <input className={inputClass} placeholder="Lien Serveur 3 (optionnel)" value={newFile.file_url_server3} onChange={e => setNewFile({ ...newFile, file_url_server3: e.target.value })} />
              <input className={inputClass} placeholder="Taille (ex: 2.5 MB)" value={newFile.file_size} onChange={e => setNewFile({ ...newFile, file_size: e.target.value })} />
            </div>
            <button className={btnAdd} onClick={addFile}><Plus size={16} /> Ajouter le fichier</button>

            <div className="flex flex-col gap-2 mt-6">
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-800">{f.title}</p>
                    <p className="text-xs text-gray-400">{f.courses?.name} — {f.section}</p>
                  </div>
                  <button className={btnDel} onClick={() => deleteFile(f.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
