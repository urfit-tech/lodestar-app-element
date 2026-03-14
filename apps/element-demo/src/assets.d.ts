declare module '*.svg' {
  import React from 'react'
  const content: string
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}
