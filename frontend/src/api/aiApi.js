import apiClient from './axiosClient'

export const getCoachingTips = async () => {
  const { data } = await apiClient.post('/ai/coach')
  return data.tips
}
