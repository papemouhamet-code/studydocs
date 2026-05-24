import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { Download, ChevronRight, FileText } from 'lucide-react'

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
        // Save to recently viewed
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-2 flex-wrap">
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Accueil</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-white" onClick={() => navigate(`/course/${courseId}`)}>{course?.name}</span>
            <ChevronRight size={14} />
            <span className="text-white">{file?.title}</span>
          </div>
          <h1 className="text-xl font-bold">{file?.title}</h1>
          <p className="text-indigo-200 text-sm mt-1">{file?.file_type || 'PDF'} {file?.file_size ? `· ${file.file_size}` : ''} · Ajouté le {file?.created_at ? new Date(file.created_at).toLocaleDateString('fr-FR') : ''}</p>
        </div>
      </div>

      {/* Ad top */}
      <div id="ad-top" className="max-w-6xl mx-auto px-4 py-2">{/* AdSense placement */}</div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <div className="hidden md:block w-56 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Fichiers de la section</p>
          <div className="flex flex-col gap-2">
            {sectionFiles.map(f => (
              <div key={f.id} onClick={() => navigate(`/course/${courseId}/${section}/${f.id}`)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition ${f.id === fileId ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-100'}`}>
                <FileText size={14} />
                <span className="line-clamp-2">{f.title}</span>
              </div>
            ))}
          </div>

          {/* Ad sidebar */}
          <div id="ad-sidebar" className="mt-4">{/* AdSense placement */}</div>
        </div>

        {/* Viewer */}
        <div className="flex-1">
          {file?.file_url_server1 ? (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.file_url_server1)}&embedded=true`}
              className="w-full rounded-xl border border-gray-200 bg-white"
              style={{ height: '70vh' }}
              title={file?.title}
            />
          ) : (
            <div className="w-full rounded-xl border border-gray-200 bg-white flex items-center justify-center" style={{ height: '70vh' }}>
              <div className="text-center text-gray-400">
                <FileText size={48} className="mx-auto mb-3 opacity-30" />
                <p>Aperçu non disponible</p>
              </div>
            </div>
          )}

          {/* Download buttons */}
          <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">Télécharger le document</p>
            <div className="flex flex-wrap gap-3">
              {file?.file_url_server1 && (
                <a href={file.file_url_server1} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
                  <Download size={16} /> Télécharger (Serveur 1)
                </a>
              )}
              {file?.file_url_server2 && (
                <a href={file.file_url_server2} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition">
                  <Download size={16} /> Télécharger (Serveur 2)
                </a>
              )}
              {file?.file_url_server3 && (
                <a href={file.file_url_server3} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-indigo-400 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition">
                  <Download size={16} /> Télécharger (Serveur 3)
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ad bottom */}
      <div id="ad-bottom" className="max-w-6xl mx-auto px-4 py-2 mb-6">{/* AdSense placement */}</div>
    </div>
  )
}
