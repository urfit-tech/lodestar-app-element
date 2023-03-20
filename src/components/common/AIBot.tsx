import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { ElementComponent } from '../../types/element'

export type AIBotProps = {
  system: string
  assistants: { label?: string; placeholder?: string; content: string; required?: boolean }[]
  submitText: string
  temperature: number
}
const AIBot: ElementComponent<AIBotProps> = props => {
  const { authToken } = useAuth()
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(props.assistants?.map(assistant => false) || [])
  const [userMessages, setUserMessages] = useState(props.assistants?.map(assistant => '') || [])
  if (props.loading || props.errors) {
    return null
  }
  const invalids = props.assistants.map((assistant, idx) => assistant.required === true && userMessages[idx] === '')
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = e => {
    if (props.editing) {
      return
    }
    setIsInvalid(invalids)
    if (!invalids.some(v => v)) {
      const messages = [{ role: 'system', content: props.system }]
      for (let index = 0; index < props.assistants.length; index++) {
        messages.push({ role: 'assistant', content: props.assistants[index].content })
        messages.push({ role: 'user', content: userMessages[index] })
      }
      setIsLoading(true)
      axios
        .post<{
          code: string
          message: string
          result: {
            message: {
              role: 'assistant'
              content: string
            }
            finish_reason: 'stop' | 'length' | 'content_filter' | 'null'
          }
        }>(
          `${process.env.REACT_APP_API_BASE_ROOT}/sys/openai/chat`,
          { messages, temperature: props.temperature },
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        .then(({ data: { code, message, result } }) => {
          if (code === 'SUCCESS') {
            setResult(result.message.content)
          } else {
            setResult(`failed: ${message}`)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }
  return (
    <form className="ai-form">
      {props.assistants.map((assistant, idx) => (
        <FormControl
          key={idx}
          className="ai-form-control mb-3"
          isRequired={assistant.required}
          isInvalid={isInvalid[idx]}
        >
          {assistant.label && <FormLabel>{assistant.label}</FormLabel>}
          <Input
            placeholder={assistant.placeholder}
            value={userMessages[idx]}
            onChange={e =>
              setUserMessages([...userMessages.slice(0, idx), e.target.value, ...userMessages.slice(idx + 1)])
            }
          />
        </FormControl>
      ))}
      <Button
        className="mb-5"
        type="submit"
        variant="primary"
        width="100%"
        isLoading={isLoading}
        onClick={handleSubmit}
        disabled={invalids.some(v => v)}
      >
        {props.submitText}
      </Button>
      <p className="ai-form-result" dangerouslySetInnerHTML={{ __html: result.replaceAll('\n', '<br/>') }} />
    </form>
  )
}

export default AIBot
