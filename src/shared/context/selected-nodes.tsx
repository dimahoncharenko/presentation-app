import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'

type SelectedNodesContext = {
  selectedNodes: string[]
  setSelectedNodes: Dispatch<SetStateAction<string[]>>
  handleSelectNode: (id: string) => void
}

export const SelectedContext = createContext({} as SelectedNodesContext)

type SelectedNodesProviderProps = {
  children: ReactNode
}

export const SelectedNodesProvider = ({
  children,
}: SelectedNodesProviderProps) => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])

  const handleSelectNode = (id: string) => {
    setSelectedNodes(prev =>
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id],
    )
  }

  return (
    <SelectedContext.Provider
      value={{ selectedNodes, setSelectedNodes, handleSelectNode }}
    >
      {children}
    </SelectedContext.Provider>
  )
}
