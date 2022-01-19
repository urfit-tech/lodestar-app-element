import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const AuthPage = () => {
  const { currentMember, login, logout } = useAuth()
  return (
    <div>
      {currentMember ? (
        <button onClick={() => logout?.()}>Logout</button>
      ) : (
        <button onClick={() => login?.({ account: 'xxx', password: 'xxx' })}>Login</button>
      )}
    </div>
  )
}

export default AuthPage
