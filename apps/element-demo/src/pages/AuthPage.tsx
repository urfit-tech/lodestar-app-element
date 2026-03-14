import { Button, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useAuth } from '@lodestar/contexts/AuthContext'

const AnyButton = Button as any
const AnyInput = Input as any

const AuthPage = () => {
  const { currentMember, login, logout } = useAuth()
  const [loginData, setLoginData] = useState({ account: '', password: '' })
  return (
    <div>
      {currentMember ? (
        <AnyButton onClick={() => logout?.()}>Logout</AnyButton>
      ) : (
        <div>
          <AnyInput
            placeholder="Account"
            value={loginData.account}
            onChange={(e: any) => setLoginData({ ...loginData, account: e.target.value })}
          />
          <AnyInput
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <AnyButton onClick={() => login?.(loginData)}>Login</AnyButton>
        </div>
      )}
    </div>
  )
}

export default AuthPage
