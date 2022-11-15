import { WorkspaceInvitation } from 'db'
import { fetcher } from '@/utils/helpers'
import useSWR from 'swr'
import { env } from 'utils'
import { Member } from '../types'

export const useMembers = ({ workspaceId }: { workspaceId?: string }) => {
  const { data, error, mutate } = useSWR<
    { members: Member[]; invitations: WorkspaceInvitation[] },
    Error
  >(workspaceId ? `/api/workspaces/${workspaceId}/members` : null, fetcher, {
    dedupingInterval: env('E2E_TEST') === 'true' ? 0 : undefined,
  })
  return {
    members: data?.members ?? [],
    invitations: data?.invitations ?? [],
    isLoading: !error && !data,
    mutate,
  }
}
