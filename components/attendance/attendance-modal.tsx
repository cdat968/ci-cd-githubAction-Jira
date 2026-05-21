'use client'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { upsertAttendance } from '@/app/actions/attendance'
import type { AttendanceRow, Employee } from '@/lib/types'
import { todayVN } from '@/lib/utils'

interface AttendanceModalProps {
  open: boolean
  onClose: () => void
  editRow: AttendanceRow | null
  employees: Pick<Employee, 'id' | 'code' | 'full_name'>[]
}

export default function AttendanceModal({
  open,
  onClose,
  editRow,
  employees,
}: AttendanceModalProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [workDate, setWorkDate] = useState(todayVN())
  const [checkIn, setCheckIn] = useState('08:00')
  const [checkOut, setCheckOut] = useState('')
  const [isLate, setIsLate] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (editRow) {
      setEmployeeId(editRow.employee_id)
      setWorkDate(editRow.work_date)
      setCheckIn(
        editRow.check_in_at
          ? new Date(editRow.check_in_at).toLocaleTimeString('sv-SE', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Ho_Chi_Minh',
            })
          : '08:00'
      )
      setCheckOut(
        editRow.check_out_at
          ? new Date(editRow.check_out_at).toLocaleTimeString('sv-SE', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Ho_Chi_Minh',
            })
          : ''
      )
      setIsLate(editRow.is_late)
      setNote(editRow.note ?? '')
    } else {
      setEmployeeId('')
      setWorkDate(todayVN())
      setCheckIn('08:00')
      setCheckOut('')
      setIsLate(false)
      setNote('')
    }
    setError(null)
  }, [editRow, open])

  async function handleSave() {
    if (!employeeId) { setError('Vui lòng chọn nhân viên.'); return }
    if (!workDate) { setError('Vui lòng chọn ngày.'); return }
    if (!checkIn) { setError('Vui lòng nhập giờ vào.'); return }
    if (!note.trim()) { setError('Ghi chú bắt buộc cho chấm công thủ công.'); return }

    setSaving(true)
    setError(null)

    const result = await upsertAttendance({
      id: editRow?.id,
      employee_id: employeeId,
      work_date: workDate,
      check_in_at: checkIn,
      check_out_at: checkOut || undefined,
      is_late: isLate,
      note: note.trim(),
    })

    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editRow ? 'Sửa chấm công' : 'Thêm chấm công thủ công'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Nhân viên</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(e => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.full_name} ({e.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Ngày</Label>
            <Input
              type="date"
              value={workDate}
              onChange={e => setWorkDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Giờ vào</Label>
              <Input
                type="time"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Giờ ra (tùy chọn)</Label>
              <Input
                type="time"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLate"
              checked={isLate}
              onChange={e => setIsLate(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="isLate" className="cursor-pointer">Đánh dấu trễ</Label>
          </div>

          <div className="space-y-1">
            <Label>
              Ghi chú <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Lý do chấm công thủ công..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button
            className="bg-[#1d4ed8] hover:bg-[#1e3a8a]"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
