'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDreamContext } from '@/lib/dream-context'

interface DreamJournalEntryProps {
  className?: string
  onSave?: (entry: {
    title: string
    content: string
    dreamDate: string
    lucidityLevel: number
    dreamSigns: string[]
    techniquesUsed: string[]
    tags: string[]
  }) => void
  initialValues?: {
    title?: string
    content?: string
    dreamDate?: string
    lucidityLevel?: number
    dreamSigns?: string[]
    techniquesUsed?: string[]
    tags?: string[]
  }
}

export default function DreamJournalEntry({
  className = '',
  onSave,
  initialValues = {}
}: DreamJournalEntryProps) {
  const [title, setTitle] = useState(initialValues.title || '')
  const [content, setContent] = useState(initialValues.content || '')
  const [dreamDate, setDreamDate] = useState(initialValues.dreamDate || new Date().toISOString().split('T')[0])
  const [lucidityLevel, setLucidityLevel] = useState(initialValues.lucidityLevel || 0)
  const [dreamSigns, setDreamSigns] = useState<string[]>(initialValues.dreamSigns || [])
  const [techniquesUsed, setTechniquesUsed] = useState<string[]>(initialValues.techniquesUsed || [])
  const [tags, setTags] = useState<string[]>(initialValues.tags || [])

  const [newDreamSign, setNewDreamSign] = useState('')
  const [newTechnique, setNewTechnique] = useState('')
  const [newTag, setNewTag] = useState('')

  // Common dream techniques
  const commonTechniques = [
    'Reality Check',
    'MILD',
    'WILD',
    'WBTB',
    'Dream Journaling',
    'Meditation',
    'Intention Setting',
    'Visualization',
    'Affirmations'
  ]

  // Handle saving the journal entry
  const handleSave = () => {
    if (!title || !content) return
