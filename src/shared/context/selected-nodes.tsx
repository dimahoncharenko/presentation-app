import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'

export interface SelectedNode {
  id: string
  position: {
    x: number
    y: number
  }
}

type SelectedNodesContext = {
  selectedNodes: SelectedNode[]
  setSelectedNodes: Dispatch<SetStateAction<SelectedNode[]>>
  handleSelectNode: (node: SelectedNode) => void
  changePosition: (node: SelectedNode) => void
}

export const SelectedContext = createContext({} as SelectedNodesContext)

type SelectedNodesProviderProps = {
  children: ReactNode
}

export const SelectedNodesProvider = ({
  children,
}: SelectedNodesProviderProps) => {
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([])

  const handleSelectNode = (node: SelectedNode) => {
    setSelectedNodes(prev =>
      prev.find(el => el.id === node.id)
        ? prev.filter(el => el.id !== node.id)
        : [...prev, node],
    )
  }

  const changePosition = (node: SelectedNode) => {
    setSelectedNodes(prev =>
      prev.map(el =>
        el.id === node.id ? { ...el, position: node.position } : el,
      ),
    )
  }

  return (
    <SelectedContext.Provider
      value={{
        selectedNodes,
        changePosition,
        setSelectedNodes,
        handleSelectNode,
      }}
    >
      {children}
    </SelectedContext.Provider>
  )
}
