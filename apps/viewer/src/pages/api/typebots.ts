import { authenticateUser } from '@/features/auth/api'
import prisma from '@/lib/prisma'
import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodNotAllowed } from 'utils/api'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const user = await authenticateUser(req)
    if (!user) return res.status(401).json({ message: 'Not authenticated' })
    const typebots = await prisma.typebot.findMany({
      where: { workspace: { members: { some: { userId: user.id } } } },
      select: { name: true, publishedTypebotId: true, id: true },
    })
    return res.send({ typebots })
  }
  return methodNotAllowed(res)
}

export default withSentry(handler)
