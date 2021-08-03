import React, { useRef } from 'react'
import styled from 'styled-components'

const StyledButtonWrapper = styled.div`
  margin-bottom: 10px;
`

const FileUploader: React.FC<{
  fileList: File[]
  accept?: string
  multiple?: boolean
  showUploadList?: boolean
  failedUploadFiles?: File[]
  uploadProgress?: { [fileName: string]: number }
  downloadableLink?: string | ((file: File) => string)
  renderTrigger?: React.FC<{
    onClick: () => void
  }>
  onChange?: (files: File[]) => void
}> = ({ fileList, multiple, accept, renderTrigger, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <StyledButtonWrapper>{renderTrigger?.({ onClick: () => inputRef.current?.click() })}</StyledButtonWrapper>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={e => {
          if (!e.target.files || !e.target.files.length || !onChange) {
            return
          }

          // append new file into input value
          const files: File[] = fileList?.slice() || []
          for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i]
            if (file && !files.some(v => v.name === file.name && v.lastModified === file.lastModified)) {
              files.push(file)
            }
          }
          e.target.value = ''
          e.target.files = null
          if (multiple) {
            return onChange(files)
          }
          onChange([...files.slice(-1)])
        }}
      />
    </>
  )
}

export default FileUploader
