import {
  CredentialsType,
  defaultSettings,
  defaultTheme,
  PublicTypebot,
  Block,
  Typebot,
  Webhook,
} from 'models'
import {
  CollaborationType,
  DashboardFolder,
  GraphNavigation,
  Plan,
  PrismaClient,
  User,
  WorkspaceRole,
} from 'db'
import { readFileSync } from 'fs'
import { encrypt } from 'utils'

const prisma = new PrismaClient()

const proWorkspaceId = 'proWorkspace'
export const freeWorkspaceId = 'freeWorkspace'
export const sharedWorkspaceId = 'sharedWorkspace'
export const guestWorkspaceId = 'guestWorkspace'

export const teardownDatabase = async () => {
  const ownerFilter = {
    where: {
      workspace: {
        members: { some: { userId: { in: ['freeUser', 'proUser'] } } },
      },
    },
  }
  await prisma.workspace.deleteMany({
    where: {
      members: {
        some: { userId: { in: ['freeUser', 'proUser'] } },
      },
    },
  })
  await prisma.user.deleteMany({
    where: { id: { in: ['freeUser', 'proUser'] } },
  })
  await prisma.webhook.deleteMany()
  await prisma.credentials.deleteMany(ownerFilter)
  await prisma.dashboardFolder.deleteMany(ownerFilter)
  return prisma.typebot.deleteMany(ownerFilter)
}

export const setupDatabase = async () => {
  await createUsers()
  return createCredentials()
}

export const createUsers = async () => {
  await prisma.user.create({
    data: {
      id: 'proUser',
      email: 'pro-user@email.com',
      name: 'Pro user',
      graphNavigation: GraphNavigation.TRACKPAD,
      apiTokens: {
        createMany: {
          data: [
            {
              name: 'Token 1',
              token: 'jirowjgrwGREHEtoken1',
              createdAt: new Date(2022, 1, 1),
            },
            {
              name: 'Github',
              token: 'jirowjgrwGREHEgdrgithub',
              createdAt: new Date(2022, 1, 2),
            },
            {
              name: 'N8n',
              token: 'jirowjgrwGREHrgwhrwn8n',
              createdAt: new Date(2022, 1, 3),
            },
          ],
        },
      },
      workspaces: {
        create: {
          role: WorkspaceRole.ADMIN,
          workspace: {
            create: {
              id: proWorkspaceId,
              name: "Pro user's workspace",
              plan: Plan.TEAM,
            },
          },
        },
      },
    },
  })
  await prisma.user.create({
    data: {
      id: 'freeUser',
      email: 'free-user@email.com',
      name: 'Free user',
      graphNavigation: GraphNavigation.TRACKPAD,
      workspaces: {
        create: {
          role: WorkspaceRole.ADMIN,
          workspace: {
            create: {
              id: 'free',
              name: "Free user's workspace",
              plan: Plan.FREE,
            },
          },
        },
      },
    },
  })
  await prisma.workspace.create({
    data: {
      id: freeWorkspaceId,
      name: 'Free Shared workspace',
      plan: Plan.FREE,
      members: {
        createMany: {
          data: [
            { role: WorkspaceRole.MEMBER, userId: 'proUser' },
            { role: WorkspaceRole.ADMIN, userId: 'freeUser' },
          ],
        },
      },
    },
  })
  return prisma.workspace.create({
    data: {
      id: sharedWorkspaceId,
      name: 'Shared workspace',
      plan: Plan.TEAM,
      members: {
        createMany: {
          data: [
            { role: WorkspaceRole.MEMBER, userId: 'proUser' },
            { role: WorkspaceRole.ADMIN, userId: 'freeUser' },
          ],
        },
      },
    },
  })
}

export const createWebhook = async (
  typebotId: string,
  webhookProps?: Partial<Webhook>
) => {
  try {
    await prisma.webhook.delete({ where: { id: 'webhook1' } })
  } catch {}
  return prisma.webhook.create({
    data: { method: 'GET', typebotId, id: 'webhook1', ...webhookProps },
  })
}

export const createCollaboration = (
  userId: string,
  typebotId: string,
  type: CollaborationType
) =>
  prisma.collaboratorsOnTypebots.create({ data: { userId, typebotId, type } })

export const getSignedInUser = (email: string) =>
  prisma.user.findFirst({ where: { email } })

export const createTypebots = async (partialTypebots: Partial<Typebot>[]) => {
  await prisma.typebot.createMany({
    data: partialTypebots.map(parseTestTypebot) as any[],
  })
  return prisma.publicTypebot.createMany({
    data: partialTypebots.map((t) =>
      parseTypebotToPublicTypebot(t.id + '-public', parseTestTypebot(t))
    ) as any[],
  })
}

export const createFolders = (partialFolders: Partial<DashboardFolder>[]) =>
  prisma.dashboardFolder.createMany({
    data: partialFolders.map((folder) => ({
      workspaceId: proWorkspaceId,
      name: 'Folder #1',
      ...folder,
    })),
  })

const createCredentials = () => {
  const { encryptedData, iv } = encrypt({
    expiry_date: 1642441058842,
    access_token:
      'ya29.A0ARrdaM--PV_87ebjywDJpXKb77NBFJl16meVUapYdfNv6W6ZzqqC47fNaPaRjbDbOIIcp6f49cMaX5ndK9TAFnKwlVqz3nrK9nLKqgyDIhYsIq47smcAIZkK56SWPx3X3DwAFqRu2UPojpd2upWwo-3uJrod',
    // This token is linked to a test Google account (typebot.test.user@gmail.com)
    refresh_token:
      '1//039xWRt8YaYa3CgYIARAAGAMSNwF-L9Iru9FyuTrDSa7lkSceggPho83kJt2J29G69iEhT1C6XV1vmo6bQS9puL_R2t8FIwR3gek',
  })
  return prisma.credentials.createMany({
    data: [
      {
        name: 'pro-user@email.com',
        type: CredentialsType.GOOGLE_SHEETS,
        data: encryptedData,
        workspaceId: proWorkspaceId,
        iv,
      },
    ],
  })
}

export const updateUser = (data: Partial<User>) =>
  prisma.user.update({
    data,
    where: {
      id: 'proUser',
    },
  })

export const createResults = async ({ typebotId }: { typebotId: string }) => {
  await prisma.result.deleteMany()
  await prisma.result.createMany({
    data: [
      ...Array.from(Array(200)).map((_, idx) => {
        const today = new Date()
        const rand = Math.random()
        return {
          id: `result${idx}`,
          typebotId,
          createdAt: new Date(
            today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * idx)
          ),
          isCompleted: rand > 0.5,
        }
      }),
    ],
  })
  return createAnswers()
}

const createAnswers = () => {
  return prisma.answer.createMany({
    data: [
      ...Array.from(Array(200)).map((_, idx) => ({
        resultId: `result${idx}`,
        content: `content${idx}`,
        blockId: 'block1',
        groupId: 'block1',
      })),
    ],
  })
}

export const createFolder = (workspaceId: string, name: string) =>
  prisma.dashboardFolder.create({
    data: {
      workspaceId,
      name,
    },
  })

const parseTypebotToPublicTypebot = (
  id: string,
  typebot: Typebot
): Omit<PublicTypebot, 'createdAt' | 'updatedAt'> => ({
  id,
  groups: typebot.groups,
  typebotId: typebot.id,
  theme: typebot.theme,
  settings: typebot.settings,
  variables: typebot.variables,
  edges: typebot.edges,
})

const parseTestTypebot = (partialTypebot: Partial<Typebot>): Typebot => ({
  id: partialTypebot.id ?? 'typebot',
  workspaceId: proWorkspaceId,
  folderId: null,
  name: 'My typebot',
  theme: defaultTheme,
  settings: defaultSettings,
  publicId: null,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  publishedTypebotId: null,
  customDomain: null,
  icon: null,
  variables: [{ id: 'var1', name: 'var1' }],
  ...partialTypebot,
  edges: [
    {
      id: 'edge1',
      from: { groupId: 'block0', blockId: 'block0' },
      to: { groupId: 'block1' },
    },
  ],
  groups: [
    {
      id: 'block0',
      title: 'Group #0',
      blocks: [
        {
          id: 'block0',
          type: 'start',
          groupId: 'block0',
          label: 'Start',
          outgoingEdgeId: 'edge1',
        },
      ],
      graphCoordinates: { x: 0, y: 0 },
    },
    ...(partialTypebot.groups ?? []),
  ],
})

export const parseDefaultGroupWithBlock = (
  block: Partial<Block>
): Pick<Typebot, 'groups'> => ({
  groups: [
    {
      graphCoordinates: { x: 200, y: 200 },
      id: 'block1',
      blocks: [
        {
          id: 'block1',
          groupId: 'block1',
          ...block,
        } as Block,
      ],
      title: 'Group #1',
    },
  ],
})

export const importTypebotInDatabase = async (
  path: string,
  updates?: Partial<Typebot>
) => {
  const typebot: Typebot = {
    ...JSON.parse(readFileSync(path).toString()),
    workspaceId: proWorkspaceId,
    ...updates,
  }
  await prisma.typebot.create({
    data: typebot,
  })
  return prisma.publicTypebot.create({
    data: parseTypebotToPublicTypebot(
      updates?.id ? `${updates?.id}-public` : 'publicBot',
      typebot
    ) as any,
  })
}
