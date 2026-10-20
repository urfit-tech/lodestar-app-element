import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import Craftize from './Craftize'
import { CustomRatioImage } from './Image'
import { ElementComponent } from '../../types/element'

jest.mock('@craftjs/core', () => ({
  useNode: () => ({ data: { custom: {} }, events: { hovered: false, selected: false } }),
  useEditor: () => ({ editing: false }),
}))
jest.mock('react-responsive', () => ({ useMediaQuery: () => false }))

it('forwards component props and responsive styles without adding a DOM wrapper around the element', () => {
  const Element: ElementComponent<{ title: string }> = props => <h2 className={props.className}>{props.title}</h2>
  const CraftElement = Craftize(Element)
  const sheet = new ServerStyleSheet()
  try {
    const html = renderToStaticMarkup(
      sheet.collectStyles(
        <CraftElement
          title="desktop"
          customStyle={{ color: 'red' }}
          responsive={{ mobile: { title: 'mobile', customStyle: { color: 'blue' } } }}
        />,
      ),
    )
    expect(html).toMatch(/<h2 class="[^"]+">mobile<\/h2>/)
    expect(sheet.getStyleTags()).toContain('color:red')
    expect(sheet.getStyleTags()).toContain('color:blue')
    expect(sheet.getStyleTags()).toContain('@media')
  } finally {
    sheet.seal()
  }
})

it('supports both an omitted and a supplied className on ratio images', () => {
  expect(renderToStaticMarkup(<CustomRatioImage width="100px" ratio={0.5} src="cover.png" />)).toContain(
    'height:calc(100px * 0.5)',
  )
  expect(
    renderToStaticMarkup(<CustomRatioImage className="custom" width="100px" ratio={0.5} src="cover.png" />),
  ).toContain('custom')
})
