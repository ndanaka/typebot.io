import { fetcher } from '@/utils/helpers'
import { DashboardFolder } from 'db'
import { stringify } from 'qs'
import useSWR from 'swr'
import { env } from 'utils'

export const useFolders = ({
  parentId,
  workspaceId,
  onError,
}: {
  workspaceId?: string
  parentId?: string
  onError: (error: Error) => void
}) => {
  const params = stringify({ parentId, workspaceId })
  const { data, error, mutate } = useSWR<{ folders: DashboardFolder[] }, Error>(
    workspaceId ? `/api/folders?${params}` : null,
    fetcher,
    {
      dedupingInterval: env('E2E_TEST') === 'true' ? 0 : undefined,
    }
  )
  if (error) onError(error)
  return {
    folders: data?.folders,
    isLoading: !error && !data,
    mutate,
  }
}
