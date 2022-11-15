import { ResultHeaderCell, ResultWithAnswers } from 'models'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { KeyedMutator } from 'swr'
import { parseResultHeader } from 'utils'
import { useTypebot } from '../editor/providers/TypebotProvider'
import { useResultsQuery } from './hooks/useResultsQuery'
import { TableData } from './types'
import { convertResultsToTableData } from './utils'

const resultsContext = createContext<{
  resultsList: { results: ResultWithAnswers[] }[] | undefined
  flatResults: ResultWithAnswers[]
  hasMore: boolean
  resultHeader: ResultHeaderCell[]
  totalResults: number
  tableData: TableData[]
  onDeleteResults: (totalResultsDeleted: number) => void
  fetchMore: () => void
  mutate: KeyedMutator<
    {
      results: ResultWithAnswers[]
    }[]
  >
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
}>({})

export const ResultsProvider = ({
  children,
  workspaceId,
  typebotId,
  totalResults,
  onDeleteResults,
}: {
  children: ReactNode
  workspaceId: string
  typebotId: string
  totalResults: number
  onDeleteResults: (totalResultsDeleted: number) => void
}) => {
  const { publishedTypebot, linkedTypebots } = useTypebot()
  const { data, mutate, setSize, hasMore } = useResultsQuery({
    workspaceId,
    typebotId,
  })

  const fetchMore = () => setSize((state) => state + 1)

  const resultHeader = useMemo(
    () =>
      publishedTypebot
        ? parseResultHeader(publishedTypebot, linkedTypebots)
        : [],
    [linkedTypebots, publishedTypebot]
  )

  const tableData = useMemo(
    () =>
      publishedTypebot
        ? convertResultsToTableData(
            data?.flatMap((d) => d.results) ?? [],
            resultHeader
          )
        : [],
    [publishedTypebot, data, resultHeader]
  )

  return (
    <resultsContext.Provider
      value={{
        resultsList: data,
        flatResults: data?.flatMap((d) => d.results) ?? [],
        hasMore: hasMore ?? true,
        tableData,
        resultHeader,
        totalResults,
        onDeleteResults,
        fetchMore,
        mutate,
      }}
    >
      {children}
    </resultsContext.Provider>
  )
}

export const useResults = () => useContext(resultsContext)
