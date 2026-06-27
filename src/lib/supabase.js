import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

const SESSION_KEY = 'fleet_authed'

export function checkPassword(input) {
  const correct = import.meta.env.VITE_PASSWORD
  if (input === correct) {
    sessionStorage.setItem(SESSION_KEY, '1')
    return true
  }
  return false
}

export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
