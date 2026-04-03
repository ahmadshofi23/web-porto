import { supabase } from './supabaseClient'

export const projectService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
    if (error) throw error
    return data[0]
  },

  async update(id, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
