import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

/**
 * Indique si Supabase est configuré via les variables d'environnement.
 * Si ce n'est pas le cas, l'application bascule automatiquement sur le
 * stockage JSON local (data/portfolio.json) — voir src/lib/data-store.ts.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
}

// ---------------------------------------------------------------------------
// Clients paresseux (créés au premier accès, pas à l'import)
// ---------------------------------------------------------------------------

let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null

/** Client public (côté client / Server Components) — respecte les RLS. */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase non configuré : SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY requis.')
  }
  supabaseClient ??= createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

/** Client admin (côté serveur / API routes) - bypass RLS. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase non configuré : SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY requis.')
  }
  supabaseAdminClient ??= createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  return supabaseAdminClient
}

// ---------------------------------------------------------------------------
// Helper pour vérifier la connexion
// ---------------------------------------------------------------------------

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await getSupabase().from('profile').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}
