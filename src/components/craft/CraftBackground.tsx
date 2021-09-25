import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import styled, { css } from 'styled-components'
import { CraftMarginProps, CraftPaddingProps } from '../../types/craft'
import BackgroundSection from '../BackgroundSection'
import { CraftHoveredMixin, CraftSelectedMixin } from '../common'

const StyledSection = styled(BackgroundSection)<{
  craftEvents?: { enabled?: boolean; hovered?: boolean; selected?: boolean }
}>`
  && {
    ${props =>
      props.craftEvents?.enabled &&
      css`
        cursor: pointer;
        ${props?.craftEvents?.hovered && CraftHoveredMixin}
        ${props?.craftEvents?.selected && CraftSelectedMixin}
      `}
  }
`

export type CraftBackgroundProps = {
  backgroundType: 'none' | 'solidColor' | 'backgroundImage'
  solidColor?: string
  coverUrl?: string
  margin: CraftMarginProps
  padding: CraftPaddingProps
}

const CraftBackground: UserComponent<CraftBackgroundProps> = ({
  backgroundType,
  solidColor,
  margin,
  padding,
  coverUrl,
  children,
}) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <StyledSection
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        mt: margin.mt,
        mr: margin.mr,
        mb: margin.mb,
        ml: margin.ml,
        pt: padding.pt,
        pr: padding.pr,
        pb: padding.pb,
        pl: padding.pl,
        backgroundImage: backgroundType === 'backgroundImage' ? coverUrl : undefined,
        backgroundColor: backgroundType === 'solidColor' ? solidColor : undefined,
      }}
      craftEvents={{ enabled, hovered, selected }}
    >
      {children}
    </StyledSection>
  )
}

export default CraftBackground
