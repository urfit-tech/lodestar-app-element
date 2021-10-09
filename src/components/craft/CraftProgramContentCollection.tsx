import { useQuery } from '@apollo/react-hooks'
import { SimpleGrid } from '@chakra-ui/react'
import { useEditor, useNode } from '@craftjs/core'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { createElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeepPick } from 'ts-deep-pick/lib'
import { useAuth } from '../../contexts/AuthContext'
import { getProgramContentCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { CraftCollectionBaseOptions } from '../../types/craft'
import { ProgramContent } from '../../types/program'
import { CraftRefBlock } from '../common'
import { BREAK_POINT } from '../common/Responsive'
import ProgramContentCard from '../program/ProgramContentCard'

const StyledWelcome = styled.h3`
  font-weight: 500;
  font-size: 20px;
  color: #585858;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 28px;
  }
`

export type CraftProgramContentCollectionProps = CraftCollectionBaseOptions & {
  options: {
    source: 'custom'
    idList: string[]
  }
}
const CraftProgramContentCollection: React.FC<CraftProgramContentCollectionProps> = ({
  options,
  children,
  ...collectionProps
}) => {
  const { currentMemberId, currentMember } = useAuth()
  const { loading, programContents } = useProgramContentCollection(options)
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  return (
    <SimpleGrid spacingX={collectionProps.gutter} spacingY={collectionProps.gap} columns={collectionProps.columns}>
      {programContents.map(programContent => (
        <CraftRefBlock
          key={programContent.id}
          className="mb-3"
          ref={ref => ref && connect(ref)}
          events={{ hovered, selected }}
          options={{ enabled }}
        >
          <Link
            to={enabled ? `#!` : `/programs/${programContent.contentSection.program.id}/contents/${programContent.id}`}
          >
            <ProgramContentCard
              title={programContent.title}
              coverUrl={programContent.contentSection.program.coverUrl}
              type={programContent.videos.length > 0 ? 'video' : 'text'}
              duration={programContent.duration}
              progress={programContent.progress}
            />
          </Link>
        </CraftRefBlock>
      ))}
    </SimpleGrid>
  )
}

const useProgramContentCollection = (options: CraftProgramContentCollectionProps['options']) => {
  const programContentFields = gql`
    fragment programContentFields on program_content {
      id
      title
      duration
      program_content_section {
        program {
          id
          cover_url
        }
      }
      program_content_progress {
        id
        progress
        last_progress
      }
      program_content_videos {
        attachment_id
      }
    }
  `
  const variables: hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables = {
    limit: undefined,
    orderByClause: [],
    whereClause: { published_at: { _is_null: false } },
  }
  switch (options.source) {
    case 'custom':
      variables.whereClause = {
        ...variables.whereClause,
        id: { _in: options.idList },
      }
      break
  }
  const { data: queryResult, loading } = useQuery<
    hasura.GET_PROGRAM_CONTENT_COLLECTION,
    hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables
  >(getProgramContentCollectionQuery(programContentFields), { variables })

  const programContents: DeepPick<
    ProgramContent,
    | 'id'
    | 'title'
    | 'duration'
    | 'progress'
    | 'lastProgress'
    | 'videos.[].id'
    | 'contentSection.program.id'
    | 'contentSection.program.coverUrl'
  >[] =
    queryResult?.program_content.map(pc => ({
      id: pc.id,
      title: pc.title,
      duration: pc.duration,
      progress: sum(pc.program_content_progress.map(pcp => pcp.progress)),
      lastProgress: sum(pc.program_content_progress.map(pcp => pcp.last_progress)),
      contentSection: {
        program: {
          id: pc.program_content_section.program.id,
          coverUrl: pc.program_content_section.program.cover_url,
        },
      },
      videos: pc.program_content_videos.map(pcv => ({ id: pcv.attachment_id })),
    })) || []
  return { loading, programContents }
}

const withRecentProgramContentIdList = (WrappedComponent: React.VFC<CraftProgramContentCollectionProps>) => {
  const Component: React.VFC<Omit<CraftProgramContentCollectionProps, 'options'> & { limit?: number }> = props => {
    const { data } = useQuery<hasura.GET_RECENT_PROGRAM_PROGRESS, hasura.GET_RECENT_PROGRAM_PROGRESSVariables>(
      gql`
        query GET_RECENT_PROGRAM_PROGRESS($limit: Int) {
          program_content_progress(order_by: { updated_at: desc }, limit: $limit) {
            program_content_id
          }
        }
      `,
      { variables: { limit: props.limit } },
    )
    const idList: string[] = data?.program_content_progress.map(pcp => pcp.program_content_id) || []
    return createElement(WrappedComponent, { ...props, options: { source: 'custom', idList } })
  }
  return Component
}
export const CraftRecentProgramContentCollection = withRecentProgramContentIdList(CraftProgramContentCollection)

export default CraftProgramContentCollection
