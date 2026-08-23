import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { Download, ChevronRight, FileText, PlayCircle, ArrowLeft } from 'lucide-react'

export default function ViewerPage() {
  const { courseId, section, fileId } = useParams()
  const navigate = useNavigate()
  const [file, setFile] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [sectionFiles, setSectionFiles] = useState<any[]>([])

  useEffect(() => {
    supabase.from('files').select('*').eq('id', fileId).single().then(({ data }) => {
      if (data) {
        setFile(data)
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        const newItem = { courseId, fileId, title: data.title, timestamp: new Date().toISOString() }
        const filtered = viewed.filter((v: any) => v.fileId !== fileId)
        const updated = [newItem, ...filtered].slice(0, 10)
        localStorage.setItem('recentlyViewed', JSON.stringify(updated))
      }
    })
    supabase.from('courses').select('*, subcategories(*, categories(*))').eq('id', courseId).single().then(({ data }) => {
      if (data) setCourse(data)
    })
    supabase.from('files').select('*').eq('course_id', courseId).eq('section', section).order('order_index').then(({ data }) => {
      if (data) setSectionFiles(data)
    })
  }, [fileId])

  return (
    <div className="min-h-screen" style={{background: '#0d1117', color: 'white'}}>

      {/* Navbar */}
      <nav style={{background: '#161b22', borderBottom: '1px solid #30363d'}} className="px-6 py-4 flex items-center gap-3 sticky top-0 z-50 flex-wrap">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition flex items-center gap-1">
          <ArrowLeft size={16} /> Accueil
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <button onClick={() => navigate(`/course/${courseId}`)} className="text-gray-400 hover:text-white transition">
          {course?.name}
        </button>
        <ChevronRight size={14} className="text-gray-600" />
        <span className="text-white truncate max-w-xs">{file?.title}</span>
      </nav>

      {/* Ad top */}
      <div id="ad-top" className="max-w-6xl mx-auto px-4 py-2">{/* AdSense placement */}</div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar */}
        <div className="hidden md:block w-56 shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Fichiers de la section</p>
          <div className="flex flex-col gap-2">
            {sectionFiles.map(f => (
              <div key={f.id} onClick={() => navigate(`/course/${courseId}/${section}/${f.id}`)}
                style={f.id === fileId
                  ? {background: '#7c3aed', color: 'white'}
                  : {background: '#161b22', border: '1px solid #30363d', color: '#9ca3af'}}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition hover:border-purple-500">
                <FileText size={14} />
                <span className="line-clamp-2">{f.title}</span>
              </div>
            ))}
          </div>
          {/* Ad sidebar */}
          <div id="ad-sidebar" className="mt-4">{/* AdSense placement */}</div>
        </div>

        {/* Main */}
        <div className="flex-1">

          {/* File info */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-white">{file?.title}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {file?.file_type || 'PDF'} {file?.file_size ? `· ${file.file_size}` : ''} · Ajouté le {file?.created_at ? new Date(file.created_at).toLocaleDateString('fr-FR') : ''}
            </p>
          </div>

          {/* Viewer */}
          {file?.file_url_preview ? (
            <iframe
              src={file.file_url_preview}
              className="w-full rounded-xl"
              style={{height: '70vh', border: '1px solid #30363d'}}
              title={file?.title}
              allow="autoplay"
            />
          ) : (
            <div className="w-full rounded-xl flex items-center justify-center"
              style={{height: '70vh', border: '1px solid #30363d', background: '#161b22'}}>
              <div className="text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Aperçu non disponible</p>
                <p className="text-sm mt-1">Téléchargez le document ci-dessous</p>
              </div>
            </div>
          )}

          {/* Download & Tutorial */}
          <div style={{background: '#161b22', border: '1px solid #30363d'}} className="mt-4 rounded-xl p-5">

            {/* Single download button */}
            {file?.file_url_server1 && (
              <a href={file.file_url_server1} target="_blank" rel="noreferrer"
                style={{background: '#7c3aed'}}
                className="w-full flex items-center justify-center gap-2 hover:opacity-90 text-white px-6 py-3 rounded-xl text-sm font-medium transition mb-4">
                <Download size={18} /> Télécharger le document
              </a>
            )}
            {file?.file_url_server2 && (
              <a href={file.file_url_server2} target="_blank" rel="noreferrer"
                style={{background: '#6d28d9'}}
                className="w-full flex items-center justify-center gap-2 hover:opacity-90 text-white px-6 py-3 rounded-xl text-sm font-medium transition mb-4">
                <Download size={18} /> Télécharger (Serveur 2)
              </a>
            )}

            {/* Single tutorial button */}
            {file?.tuto_url_server1 && (
              <a href={file.tuto_url_server1} target="_blank" rel="noreferrer"
                style={{background: '#21262d', border: '1px solid #30363d'}}
                className="w-full flex items-center justify-center gap-2 hover:border-purple-500 text-gray-300 px-6 py-3 rounded-xl text-sm font-medium transition">
                <PlayCircle size={18} className="text-red-500" /> Comment télécharger ?
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Ad bottom */}
      <div id="ad-bottom" className="max-w-6xl mx-auto px-4 py-2 mb-6">{/* AdSense placement */}</div>
    </div>
  )
}