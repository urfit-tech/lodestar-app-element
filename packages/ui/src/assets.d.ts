declare module 'react-router' {
  export function useHistory(): any
  export function useLocation(): any
  export function useParams<T = any>(): T
  export function useRouteMatch(path?: string | string[]): any
}

declare module 'react-style-editor' {
  export function stringify(styles: any): string
  export function parse(css: string): any
}

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

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}
