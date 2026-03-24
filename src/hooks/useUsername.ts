import { useState } from 'react'

const USERNAME_KEY = 'miri-camara-username'

export function useUsername() {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem(USERNAME_KEY) ?? ''
  })

  const saveUsername = (name: string) => {
    const trimmed = name.trim()
    localStorage.setItem(USERNAME_KEY, trimmed)
    setUsername(trimmed)
  }

  const isMiri = username.toLowerCase() === 'miri'

  return { username, saveUsername, isMiri }
}
