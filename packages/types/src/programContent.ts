export type ProgramContentCollectionVideo = {
  id: string
}

export type ProgramContentCollectionProgram = {
  id: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
}

export type ProgramContentCollectionContentSection = {
  program: ProgramContentCollectionProgram
}

export type ProgramContentCollectionItem = {
  id: string
  title: string
  duration: number
  progress: number
  lastProgress: number
  contentSection: ProgramContentCollectionContentSection
  videos: ProgramContentCollectionVideo[]
}
