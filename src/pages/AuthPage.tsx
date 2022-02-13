import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const AuthPage = () => {
  const { currentMember, login, logout } = useAuth()
  const [loginData, setLoginData] = useState({ account: '', password: '' })
  return (
    <div>
      {currentMember ? (
        <Button onClick={() => logout?.()}>Logout</Button>
      ) : (
        <div>
          <Input
            placeholder="Account"
            value={loginData.account}
            onChange={e => setLoginData({ ...loginData, account: e.target.value })}
          />
          <Input
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
          />
          <Button onClick={() => login?.(loginData)}>Login</Button>
        </div>
      )}
    </div>
  )
}

export default AuthPage
