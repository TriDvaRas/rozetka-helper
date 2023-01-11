// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getCompProps from '../../puppeteer/getCompProps'
import { RZProduct, RZCharacteristic } from '../../types/RZ'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.link)
    return res.status(400).send('link parameter is required')
  try {
    const [products, options] = await getCompProps(req.query.link as string)
    res.status(200).json({ products, options })
  } catch (error: any) {
    res.status(400).send(error.message)
  }
}
