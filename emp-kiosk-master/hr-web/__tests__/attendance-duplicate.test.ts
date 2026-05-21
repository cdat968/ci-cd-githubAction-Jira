import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TEST_DATE = '2000-01-01'

async function seedEmployee() {
  const { data, error } = await supabase
    .from('employees')
    .insert({ code: 'TEST-JEST', full_name: 'Jest Test Employee' })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

async function cleanup(employeeId: string) {
  await supabase.from('attendance').delete().eq('employee_id', employeeId)
  await supabase.from('employees').delete().eq('id', employeeId)
}

describe('attendance duplicate check (integration)', () => {
  let employeeId: string

  beforeAll(async () => {
    employeeId = await seedEmployee()
  })

  afterAll(async () => {
    await cleanup(employeeId)
  })

  test('insert lần 1 → thành công', async () => {
    const { error } = await supabase.from('attendance').insert({
      employee_id: employeeId,
      work_date: TEST_DATE,
      check_in_at: `${TEST_DATE}T09:00:00+07:00`,
      is_late: false,
      source: 'admin_manual',
      note: 'jest test - first',
    })
    expect(error).toBeNull()
  })

  test('insert lần 2 cùng employee + ngày → DB chặn duplicate', async () => {
    const { error } = await supabase.from('attendance').insert({
      employee_id: employeeId,
      work_date: TEST_DATE,
      check_in_at: `${TEST_DATE}T10:00:00+07:00`,
      is_late: false,
      source: 'admin_manual',
      note: 'jest test - second (duplicate)',
    })
    expect(error).not.toBeNull()
  })
})
