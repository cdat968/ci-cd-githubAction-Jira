// components/attendance/attendance-table-wrapper.tsx
'use client'
import { useState } from 'react'
import AttendanceTable from './attendance-table'
import AttendanceModal from './attendance-modal'
import { exportAttendance } from '@/lib/excel'
import type { AttendanceRow, Employee } from '@/lib/types'

interface Props {
  rows: AttendanceRow[]
  employees: Pick<Employee, 'id' | 'code' | 'full_name'>[]
}

export default function AttendanceTableWrapper({ rows, employees }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editRow, setEditRow] = useState<AttendanceRow | null>(null)

  function openAdd() {
    setEditRow(null)
    setModalOpen(true)
  }

  function openEdit(row: AttendanceRow) {
    setEditRow(row)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditRow(null)
  }

  return (
    <>
      <AttendanceTable
        rows={rows}
        employees={employees}
        onAdd={openAdd}
        onEdit={openEdit}
        onExport={() => exportAttendance(rows)}
      />
      <AttendanceModal
        open={modalOpen}
        onClose={handleClose}
        editRow={editRow}
        employees={employees}
      />
    </>
  )
}
