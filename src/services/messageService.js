import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const messageService = {
  async sendMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getAllMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async markAsRead(id) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async deleteMessage(id) {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
