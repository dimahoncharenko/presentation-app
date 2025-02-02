import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'

export interface SelectedNode {
  id: string
}

type SelectedNodesContext = {
  selectedNodes: SelectedNode[]
  setSelectedNodes: Dispatch<SetStateAction<SelectedNode[]>>
  handleSelectNode: (node: SelectedNode) => void
  removeSelectedNode: (node: SelectedNode) => void
  toggleSelectNode: (node: SelectedNode) => void
  isSelectedNode: (node: SelectedNode) => boolean
  setSelectDisabled: Dispatch<SetStateAction<boolean>>
  selectDisabled: boolean
}

export const SelectedContext = createContext({} as SelectedNodesContext)

type SelectedNodesProviderProps = {
  children: ReactNode
}

export const SelectedNodesProvider = ({
  children,
}: SelectedNodesProviderProps) => {
  const [selectDisabled, setSelectDisabled] = useState(false)
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([])

  const isSelectedNode = (node: SelectedNode) => {
    return !!selectedNodes.find(el => el.id === node.id)
  }

  const toggleSelectNode = (node: SelectedNode) => {
    if (isSelectedNode(node)) {
      handleSelectNode(node)
    } else {
      removeSelectedNode(node)
    }
  }

  const removeSelectedNode = (node: SelectedNode) => {
    setSelectedNodes(prev => prev.filter(el => el.id !== node.id))
  }

  const handleSelectNode = (node: SelectedNode) => {
    if (selectDisabled) return
    setSelectedNodes(prev => [...prev, node])
  }

  return (
    <SelectedContext.Provider
      value={{
        selectedNodes,
        selectDisabled,
        setSelectDisabled,
        setSelectedNodes,
        toggleSelectNode,
        isSelectedNode,
        removeSelectedNode,
        handleSelectNode,
      }}
    >
      {children}
    </SelectedContext.Provider>
  )
}
