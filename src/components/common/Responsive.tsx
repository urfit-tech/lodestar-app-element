import MediaQuery, { MediaQueryProps } from 'react-responsive'

const Responsive = {
  Default: (props: MediaQueryProps) => <MediaQuery {...props} maxWidth={TABLET_BREAK_POINT - 1} />,
  Tablet: (props: MediaQueryProps) => <MediaQuery {...props} minWidth={TABLET_BREAK_POINT} />,
  Desktop: (props: MediaQueryProps) => <MediaQuery {...props} minWidth={DESKTOP_BREAK_POINT} />,
}

export type ResponsiveValue<V> = { default: V; responsive: { tablet: V; desktop: V } }

export const TABLET_BREAK_POINT = 576
export const DESKTOP_BREAK_POINT = 992
export const BREAK_POINT = 992
export default Responsive
