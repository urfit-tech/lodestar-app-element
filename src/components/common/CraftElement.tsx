import Accordion from '../accordions/Accordion'
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
export const CraftCard = Craftize(Card)
export const CraftRichCard = Craftize(RichCard)
export const CraftCarousel = Craftize(Carousel)
export const CraftCollapse = Craftize(Accordion)
export const CraftEmbedded = Craftize(Embedded)

// product catalog
export const CraftProgramCollection = Craftize(ProgramCollection)
export const CraftProgramContentCollection = Craftize(ProgramContentCollection)
export const CraftProgramPackageCollection = Craftize(ProgramPackageCollection)
export const CraftActivityCollection = Craftize(ActivityCollection)
