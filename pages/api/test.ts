// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getCompProps from '../../puppeteer/getCompProps'
import { RZProduct, RZCharacteristic } from '../../types/RZ'
import solveSmart from '../../util/smart';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(solveSmart(
    [
      [-800, 750, 5],
      [-600, 450, 2],
      [-900, 1200, 6],
      [-850, 450, 3],
      [-500, 300, 2],
    ],
    [100, 20, 70]
  ))
}
