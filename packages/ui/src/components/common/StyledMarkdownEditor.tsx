import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'
import React, { HTMLAttributes, useEffect, useRef } from 'react'
import SimpleMdeReact, { SimpleMDEEditorProps } from 'react-simplemde-editor'
import styled from 'styled-components'
import { OutputMixin } from './StyledBraftEditor'

const StyledSimpleMdeReact = styled(SimpleMdeReact)<
  Partial<SimpleMDEEditorProps> & { customizedStyle?: string | undefined }
>(props => OutputMixin(props.customizedStyle))

const StyledMarkdownDiv = styled.div<
  Partial<HTMLAttributes<HTMLDivElement>> & { customizedStyle?: string | undefined }
>(props => OutputMixin(props.customizedStyle))

const MarkdownEditor: React.FC<
  Partial<SimpleMDEEditorProps> & {
    customizedStyle: string | undefined
    options: EasyMDE.Options | undefined
  }
> = ({ customizedStyle, options, ...props }) => {
  const editorRef = useRef<null | EasyMDE>(null)

  useEffect(() => {
    if (editorRef.current) EasyMDE.togglePreview(editorRef.current)
  }, [])

  return (
    <StyledSimpleMdeReact
      {...props}
      customizedStyle={`${customizedStyle}`}
      options={{
        status: false,
        ...options,
      }}
      getMdeInstance={instance => {
        editorRef.current = instance
      }}
    />
  )
}

export { MarkdownEditor, StyledMarkdownDiv }
