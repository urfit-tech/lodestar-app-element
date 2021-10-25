import { Accordion } from '@chakra-ui/accordion'
import Button from '../buttons/Button'
import Card from '../cards/Card'
import RichCard from '../cards/RichCard'
import ActivityCollection from '../collections/ActivityCollection'
import ProgramCollection from '../collections/ProgramCollection'
import ProgramContentCollection from '../collections/ProgramContentCollection'
import ProgramPackageCollection from '../collections/ProgramPackageCollection'
import Carousel from './Carousel'
import Craftize from './Craftize'
import Embedded from './Embedded'
import Image from './Image'
import Layout from './Layout'
import Paragraph from './Paragraph'
import Section from './Section'
import Statistics from './Statistics'
import Text from './Text'
import Title from './Title'

// basic catalog
export const CraftLayout = Craftize(Layout)
export type CraftLayoutProps = typeof CraftLayout.defaultProps

export const CraftSection = Craftize(Section)
export type CraftSectionProps = typeof CraftSection.defaultProps

export const CraftText = Craftize(Text)
export type CraftTextProps = typeof CraftText.defaultProps

export const CraftTitle = Craftize(Title)
export type CraftTitleProps = typeof CraftTitle.defaultProps

export const CraftParagraph = Craftize(Paragraph)
export type CraftParagraphProps = typeof CraftParagraph.defaultProps

export const CraftButton = Craftize(Button)
export type CraftButtonProps = typeof CraftButton.defaultProps

export const CraftImage = Craftize(Image)
export type CraftImageProps = typeof CraftImage.defaultProps

export const CraftCard = Craftize(Card)
export type CraftCardProps = typeof CraftCard.defaultProps

export const CraftRichCard = Craftize(RichCard)
export type CraftRichCardProps = typeof CraftRichCard.defaultProps

export const CraftCarousel = Craftize(Carousel)
export type CraftCarouselProps = typeof CraftCarousel.defaultProps

export const CraftCollapse = Craftize(Accordion)
export type CraftCollapseProps = typeof CraftCollapse.defaultProps

export const CraftStatistics = Craftize(Statistics)
export type CraftStatisticsProps = typeof CraftStatistics.defaultProps

export const CraftEmbedded = Craftize(Embedded)
export type CraftEmbeddedProps = typeof CraftEmbedded.defaultProps

// product catalog
export const CraftProgramCollection = Craftize(ProgramCollection)
export type CraftProgramCollectionProps = typeof CraftProgramCollection.defaultProps

export const CraftProgramContentCollection = Craftize(ProgramContentCollection)
export type CraftProgramContentCollectionProps = typeof CraftProgramContentCollection.defaultProps

export const CraftProgramPackageCollection = Craftize(ProgramPackageCollection)
export type CraftProgramPackageCollectionProps = typeof CraftProgramPackageCollection.defaultProps

export const CraftActivityCollection = Craftize(ActivityCollection)
export type CraftActivityCollectionProps = typeof CraftActivityCollection.defaultProps
