import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('schema vs types validation', () => {
  let insertedId: string | null = null

  afterAll(async () => {
    if (insertedId) {
      await supabase.from('employees').delete().eq('id', insertedId)
    }
  })

  test('employees table có column is_active như định nghĩa trong lib/types.ts', async () => {
    const { data, error } = await supabase
      .from('employees')
      .insert({ code: 'TEST-SCHEMA', full_name: 'Schema Test', is_active: false })
      .select('id')
      .single()

    if (data) insertedId = data.id

    // Nếu error → column is_active không tồn tại trong DB → bug: types.ts sai với schema thật
    expect(error).toBeNull()
  })
})
