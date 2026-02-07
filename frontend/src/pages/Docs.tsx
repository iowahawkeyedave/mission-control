import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Upload, Search, File, FileCode, FileSpreadsheet,
  Database, HardDrive, Layers
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'

const staticDocs = [
  { id: 'd1', name: 'SOUL.md', type: 'md', size: '4.2 KB', chunks: 12, processed: new Date(Date.now() - 86400000).toISOString() },
  { id: 'd2', name: 'MEMORY.md', type: 'md', size: '8.7 KB', chunks: 24, processed: new Date(Date.now() - 3600000).toISOString() },
  { id: 'd3', name: 'AGENTS.md', type: 'md', size: '6.1 KB', chunks: 18, processed: new Date(Date.now() - 7200000).toISOString() },
  { id: 'd4', name: 'TOOLS.md', type: 'md', size: '5.3 KB', chunks: 15, processed: new Date(Date.now() - 14400000).toISOString() },
  { id: 'd5', name: 'lead-data.csv', type: 'csv', size: '124 KB', chunks: 89, processed: new Date(Date.now() - 28800000).toISOString() },
  { id: 'd6', name: 'server.js', type: 'js', size: '7.8 KB', chunks: 22, processed: new Date(Date.now() - 43200000).toISOString() },
]

const typeIcons: Record<string, any> = {
  md: FileText,
  csv: FileSpreadsheet,
  js: FileCode,
  default: File,
}

const typeColors: Record<string, string> = {
  md: 'from-blue-400/20 to-blue-600/10',
  csv: 'from-emerald-400/20 to-emerald-600/10',
  js: 'from-amber-400/20 to-amber-600/10',
  default: 'from-white/10 to-white/5',
}

export default function Docs() {
  const [search, setSearch] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const filteredDocs = staticDocs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalChunks = staticDocs.reduce((acc, d) => acc + d.chunks, 0)

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-glass tracking-tight flex items-center gap-3">
            <FileText size={24} className="text-indigo-300/60" strokeWidth={1.5} />
            Doc Digest
          </h1>
          <p className="text-sm text-glass-muted mt-1">Document processing & knowledge base</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <GlassCard className="p-5" delay={0.05}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-400/15 border border-blue-400/20 flex items-center justify-center">
                <Layers size={14} className="text-blue-400" />
              </div>
              <span className="text-xs text-glass-muted font-semibold">Documents</span>
            </div>
            <p className="text-3xl font-light text-glass">
              <AnimatedCounter end={staticDocs.length} />
            </p>
          </GlassCard>
          <GlassCard className="p-5" delay={0.1}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-400/15 border border-purple-400/20 flex items-center justify-center">
                <Database size={14} className="text-purple-400" />
              </div>
              <span className="text-xs text-glass-muted font-semibold">Total Chunks</span>
            </div>
            <p className="text-3xl font-light text-glass">
              <AnimatedCounter end={totalChunks} />
            </p>
          </GlassCard>
          <GlassCard className="p-5" delay={0.15}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/15 border border-emerald-400/20 flex items-center justify-center">
                <HardDrive size={14} className="text-emerald-400" />
              </div>
              <span className="text-xs text-glass-muted font-semibold">Index Size</span>
            </div>
            <p className="text-3xl font-light text-glass">156 <span className="text-sm text-glass-muted">KB</span></p>
          </GlassCard>
        </div>

        {/* Upload Zone */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={() => setDragOver(false)}
          className={`${dragOver ? 'glass-dropzone-active' : 'glass-dropzone'} p-10 text-center transition-all duration-300`}
        >
          <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border transition-all duration-300 ${
            dragOver 
              ? 'bg-indigo-400/20 border-indigo-400/30' 
              : 'bg-white/[0.06] border-white/[0.1]'
          }`}>
            <Upload size={24} className={`${dragOver ? 'text-indigo-300' : 'text-white/40'} transition-colors`} />
          </div>
          <p className="text-sm text-glass-secondary font-medium">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-glass-muted mt-1.5">Supports .md, .txt, .csv, .json, .pdf</p>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-11 pr-4 py-3 text-sm"
          />
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, i) => {
            const Icon = typeIcons[doc.type] || typeIcons.default
            const gradient = typeColors[doc.type] || typeColors.default
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="liquid-glass p-5 cursor-pointer"
                style={{ borderRadius: '20px' }}
              >
                <div className="relative z-10 flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} border border-white/10 flex items-center justify-center shrink-0`}>
                    <Icon size={18} className="text-white/60" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-glass truncate">{doc.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-glass-muted">{doc.size}</span>
                      <span className="text-[10px] text-glass-muted">{doc.chunks} chunks</span>
                    </div>
                  </div>
                  <span className="pill-badge text-[10px] px-2 py-0.5 text-glass-muted uppercase font-mono font-semibold">
                    {doc.type}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
