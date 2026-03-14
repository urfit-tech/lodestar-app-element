// react-router v5 types workaround for bundler moduleResolution
declare module 'react-router' {
  export function useHistory(): any
  export function useLocation(): any
  export function useParams<T = any>(): T
  export function useRouteMatch(path?: string | string[]): any
  export function generatePath(path: string, params?: Record<string, string>): string
  export const Link: any
}

// react-style-editor has no types
declare module 'react-style-editor' {
  export function stringify(styles: any): string
  export function parse(css: string): any
}

// SVG imports (CRA-style)
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
