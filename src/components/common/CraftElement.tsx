import Button from '../buttons/Button'
import Card from '../cards/Card'
import RichCard from '../cards/RichCard'
import Collapse from '../collapses/Collapse'
import ActivityCollection from '../collections/ActivityCollection'
import MemberCollection from '../collections/MemberCollection'
import PostCollection from '../collections/PostCollection'
import ProgramCollection from '../collections/ProgramCollection'
import ProgramContentCollection from '../collections/ProgramContentCollection'
import ProgramPackageCollection from '../collections/ProgramPackageCollection'
import ProjectCollection from '../collections/ProjectCollection'
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
export const CraftCollapse = Craftize(Collapse)
export const CraftEmbedded = Craftize(Embedded)

// product catalog
export const CraftMemberCollection = Craftize(MemberCollection)
export const CraftProgramCollection = Craftize(ProgramCollection)
export const CraftProgramContentCollection = Craftize(ProgramContentCollection)
export const CraftProgramPackageCollection = Craftize(ProgramPackageCollection)
export const CraftActivityCollection = Craftize(ActivityCollection)
export const CraftProjectCollection = Craftize(ProjectCollection)
export const CraftPostCollection = Craftize(PostCollection)
