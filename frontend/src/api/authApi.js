import apiClient from './axiosClient'

export const registerUser = async ({ username, email, password }) => {
  const { data } = await apiClient.post('/auth/register', { username, email, password })
  return data // { token, user: { id, username, email } }
}

export const loginUser = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data // { token, user: { id, username, email } }
}
