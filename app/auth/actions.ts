'use server'

import { redirect } from 'next/navigation'
import { dataMode } from '@/lib/services/result'
import { createClient } from '@/lib/supabase/server'

export async function signOutAction() {
  if (dataMode() === 'demo') redirect('/')

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
