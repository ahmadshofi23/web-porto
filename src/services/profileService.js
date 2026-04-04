import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const profileService = {
  async getProfile() {
    const { data, error } = await supabase
      .from('profile_info')
      .select('*')
      .maybeSingle()
    if (error) throw error
    return data
  },

  async updateProfile(profileData) {
    const { data: existing } = await supabase.from('profile_info').select('id').maybeSingle()
    
    let result
    if (existing) {
      result = await supabase
        .from('profile_info')
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
    } else {
      result = await supabase
        .from('profile_info')
        .insert([profileData])
        .select()
    }

    if (result.error) throw result.error
    return result.data[0]
  },

  async getExperiences() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },

  async addExperience(expData) {
    const { data, error } = await supabase
      .from('experiences')
      .insert([expData])
      .select()
    if (error) throw error
    return data[0]
  },

  async deleteExperience(id) {
    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
