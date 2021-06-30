import React from 'react'
import MediaQuery, { MediaQueryProps } from 'react-responsive'

const Responsive = {
  Default: (props: MediaQueryProps) => <MediaQuery {...props} maxWidth={BREAK_POINT - 1} />,
  Desktop: (props: MediaQueryProps) => <MediaQuery {...props} minWidth={BREAK_POINT} />,
}

export const BREAK_POINT = 992
export default Responsive
