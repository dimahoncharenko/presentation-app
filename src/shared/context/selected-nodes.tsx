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
  size?: {
    width: number
    height: number
  }
}

type SelectedNodesContext = {
  selectedNodes: SelectedNode[]
  setSelectedNodes: Dispatch<SetStateAction<SelectedNode[]>>
  handleSelectNode: (node: SelectedNode) => void
  changePosition: (node: Omit<SelectedNode, 'size'>) => void
  changeSize: (node: Omit<SelectedNode, 'position'>) => void
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

  const changePosition = (node: Omit<SelectedNode, 'size'>) => {
    setSelectedNodes(prev =>
      prev.map(el =>
        el.id === node.id ? { ...el, position: node.position } : el,
      ),
    )
  }

  const changeSize = (node: Omit<SelectedNode, 'position'>) => {
    setSelectedNodes(prev =>
      prev.map(el => (el.id === node.id ? { ...el, size: node.size } : el)),
    )
  }

  return (
    <SelectedContext.Provider
      value={{
        selectedNodes,
        changePosition,
        setSelectedNodes,
        handleSelectNode,
        changeSize,
      }}
    >
      {children}
    </SelectedContext.Provider>
  )
}
