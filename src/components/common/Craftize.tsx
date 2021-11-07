import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  StarIcon,
} from '@chakra-ui/icons'
import { Node, NodeId, NodeTree, SerializedNodes, useEditor, useNode, UserComponent } from '@craftjs/core'
import { getRandomId } from '@craftjs/utils'
import { clone } from 'ramda'
import { useIntl } from 'react-intl'
import styled, { css, CSSObject } from 'styled-components'
import { ElementBaseProps, ElementComponent, ElementProps } from '../../types/element'
import { DESKTOP_BREAK_POINT, TABLET_BREAK_POINT } from './Responsive'

const CraftRefBlock = styled.div<{
  editing?: boolean
  hovered?: boolean
  selected?: boolean
}>`
  ${props =>
    props?.editing &&
    css`
      position: relative;
      margin: 4px;
      ${props?.hovered && CraftHoveredMixin}
      ${props?.selected && CraftSelectedMixin}
    `}
`

export const CraftHoveredMixin = css`
  border-radius: 2px;
  border: 2px dashed cornflowerblue;
`
export const CraftSelectedMixin = css`
  border-radius: 2px;
  border: 2px solid cornflowerblue;
`

// FIXME: why cannot use <P extends {editing?:boolean}> directly?
// FIXME: only accept for FC and CC, not VFC

export type PropsWithCraft<P> = ElementBaseProps<P> & {
  responsive?: {
    mobile?: P & { customStyle?: CSSObject }
    tablet?: P & { customStyle?: CSSObject }
    desktop?: P & { customStyle?: CSSObject }
  }
  customStyle?: CSSObject
}
export type CraftTemplate = { rootNodeId: NodeId; serializedNodes: SerializedNodes }
const Craftize = <P extends object>(WrappedComponent: ElementComponent<P>) => {
  const StyledCraftElement = styled(WrappedComponent)(
    (props: PropsWithCraft<P>) => props.customStyle,
  ) as ElementComponent<P>
  const Component: UserComponent<PropsWithCraft<P>> = props => {
    const node = useNode(node => node)
    const editor = useEditor(state => ({
      editing: state.options.enabled,
    }))
    const { responsive, ...elementProps } = props
    return (
      <div>
        <CraftRefBlock
          ref={ref => ref && node.connectors.connect(ref)}
          editing={editor.editing}
          hovered={node.events.hovered}
          selected={node.events.selected}
        >
          {editor.editing && node.events.hovered && <CraftController />}
          <StyledCraftElement
            {...(elementProps as ElementProps<P>)}
            customStyle={{
              ...props.customStyle,
              [`@media (max-width: ${TABLET_BREAK_POINT - 1}px)`]: responsive?.mobile?.customStyle,
              [`@media (min-width: ${TABLET_BREAK_POINT}px)`]: responsive?.tablet?.customStyle,
              [`@media (min-width: ${DESKTOP_BREAK_POINT}px)`]: responsive?.desktop?.customStyle,
            }}
            editing={editor.editing}
          />
        </CraftRefBlock>
      </div>
    )
  }
  return Component
}

const StyledController = styled.div`
  display: flex;
  position: absolute;
  z-index: 1;
  text-align: center;
  left: 0;
`
const StyledControllerItem = styled.button`
  margin: 2px;
  padding: 4px 8px;
  color: white;
  border: none;
  width: 32px;
  background-color: rgba(0, 0, 0, 0.2);
`
const CraftController: React.FC = () => {
  const editor = useEditor(state => ({ nodes: state.nodes }))
  const node = useNode(node => node)
  const { formatMessage } = useIntl()

  return (
    <StyledController>
      {editor.query.node(node.id).isDraggable() && (
        <StyledControllerItem ref={ref => ref && node.connectors.drag(ref)}>
          <DragHandleIcon />
        </StyledControllerItem>
      )}
      {!editor.query.node(node.id).isRoot() && (
        <StyledControllerItem
          onClick={() => {
            const nodeIndex = editor.query.node(node.data.parent).get().data.nodes.indexOf(node.id)
            nodeIndex >= 0 && editor.actions.move(node.id, node.data.parent, nodeIndex <= 0 ? 0 : nodeIndex - 1)
          }}
        >
          <ChevronLeftIcon />
        </StyledControllerItem>
      )}
      {!editor.query.node(node.id).isRoot() && (
        <StyledControllerItem
          onClick={() => {
            const siblingNodes = editor.query.node(node.data.parent).get().data.nodes
            const nodeIndex = siblingNodes.indexOf(node.id) + 1
            nodeIndex > 0 &&
              editor.actions.move(
                node.id,
                node.data.parent,
                nodeIndex >= siblingNodes.length ? nodeIndex : nodeIndex + 1,
              )
          }}
        >
          <ChevronRightIcon />
        </StyledControllerItem>
      )}
      <StyledControllerItem
        onClick={() => {
          for (const nodeId in editor.nodes) {
            editor.actions.setCustom(nodeId, custom => {
              custom.editing = nodeId === node.id
            })
          }
        }}
      >
        <EditIcon />
      </StyledControllerItem>
      {!editor.query.node(node.id).isRoot() && (
        <StyledControllerItem
          onClick={() => {
            const parentNodeId = editor.query.node(node.id).get().data.parent
            const indexToAdd = editor.query.node(parentNodeId).get().data.nodes.indexOf(node.id)
            const nodeTree = cloneNodeTree(editor.query.node(node.id).toNodeTree()) // id is the node id
            editor.actions.addNodeTree(nodeTree, parentNodeId, indexToAdd + 1)
          }}
        >
          <CopyIcon />
        </StyledControllerItem>
      )}
      <StyledControllerItem
        onClick={() =>
          node.data.custom?.onSave?.({
            rootNodeId: node.id,
            serializedNodes: JSON.parse(editor.query.serialize()),
          })
        }
      >
        <StarIcon />
      </StyledControllerItem>
      {editor.query.node(node.id).isDeletable() && (
        <StyledControllerItem
          onClick={() => {
            editor.actions.delete(node.id)
          }}
        >
          <DeleteIcon />
        </StyledControllerItem>
      )}
    </StyledController>
  )
}

const cloneNodeTree = (tree: NodeTree): NodeTree => {
  const newNodes: { [nodeId: string]: Node } = {}
  const changeNodeId = (rootNode: Node, newParentId?: string) => {
    const clonedNode = clone(rootNode)
    clonedNode.id = getRandomId()
    clonedNode.data.parent = newParentId || clonedNode.data.parent
    clonedNode.data.nodes = clonedNode.data.nodes.map(childId => changeNodeId(tree.nodes[childId], clonedNode.id))
    clonedNode.data.linkedNodes = Object.keys(clonedNode.data.linkedNodes).reduce((accum, id) => {
      const newLinkedNodeId = changeNodeId(tree.nodes[clonedNode.data.linkedNodes[id]], clonedNode.id)
      return {
        ...accum,
        [id]: newLinkedNodeId,
      }
    }, {})
    clonedNode.events = {
      hovered: false,
      selected: false,
      dragged: false,
    }
    newNodes[clonedNode.id] = clonedNode
    return clonedNode.id
  }
  return {
    rootNodeId: changeNodeId(tree.nodes[tree.rootNodeId]),
    nodes: newNodes,
  }
}
export default Craftize
