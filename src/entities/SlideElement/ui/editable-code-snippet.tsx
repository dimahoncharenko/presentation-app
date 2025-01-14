type Props = {
  children: React.ReactNode
  highlightNumber?: string
  numberOffset?: number
}

export const EditableCodeSnippet = ({
  children,
  highlightNumber,
  numberOffset,
}: Props) => {
  return (
    <pre>
      <code
        data-trim
        data-noescape
        data-line-numbers={highlightNumber}
        data-ln-start-from={`${numberOffset}`}
      >
        <script type='text/template'>{children}</script>
      </code>
    </pre>
  )
}
