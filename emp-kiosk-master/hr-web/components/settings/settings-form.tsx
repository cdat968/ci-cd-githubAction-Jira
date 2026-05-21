// components/settings/settings-form.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveSettings } from '@/app/actions/settings'
import type { Settings } from '@/lib/types'

interface SettingsFormProps {
  settings: Settings
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [workStart, setWorkStart] = useState(settings.work_start_time)
  const [workEnd, setWorkEnd] = useState(settings.work_end_time)
  const [lateGrace, setLateGrace] = useState(String(settings.late_grace_minutes))
  const [confidence, setConfidence] = useState(String(settings.confidence_threshold))
  const [retention, setRetention] = useState(String(settings.audit_photo_retention_days))
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)
    const result = await saveSettings({
      work_start_time: workStart,
      work_end_time: workEnd,
      late_grace_minutes: Number(lateGrace),
      confidence_threshold: Number(confidence),
      audit_photo_retention_days: Number(retention),
    })
    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-md space-y-5">
      <div className="space-y-1">
        <Label>Giờ bắt đầu làm</Label>
        <Input
          type="time"
          value={workStart}
          onChange={e => setWorkStart(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Giờ kết thúc</Label>
        <Input
          type="time"
          value={workEnd}
          onChange={e => setWorkEnd(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Ngưỡng trễ (phút)</Label>
        <Input
          type="number"
          min={0}
          max={60}
          value={lateGrace}
          onChange={e => setLateGrace(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Ngưỡng confidence nhận diện (0–1)</Label>
        <Input
          type="number"
          min={0}
          max={1}
          step={0.01}
          value={confidence}
          onChange={e => setConfidence(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Lưu ảnh audit (ngày)</Label>
        <Input
          type="number"
          min={1}
          value={retention}
          onChange={e => setRetention(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Đã lưu cài đặt.</p>}

      <Button
        className="bg-[#1d4ed8] hover:bg-[#1e3a8a]"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </Button>
    </div>
  )
}
