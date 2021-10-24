import Button from '../buttons/Button'
import RichCard from '../cards/RichCard'
import ProgramCollection from '../collections/ProgramCollection'
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
export const CraftSection = Craftize(Section)
export const CraftText = Craftize(Text)
export const CraftTitle = Craftize(Title)
export const CraftParagraph = Craftize(Paragraph)
export const CraftButton = Craftize(Button)
export const CraftImage = Craftize(Image)
export const CraftRichCard = Craftize(RichCard)
export const CraftCarousel = Craftize(Carousel)
export const CraftStatistics = Craftize(Statistics)
export const CraftEmbedded = Craftize(Embedded)
// product catalog
export const CraftProgramCollection = Craftize(ProgramCollection)
