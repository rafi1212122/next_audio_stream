// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '../../helpers/prismaConnect'
import { NextApiRequest, NextApiResponse } from "next";
import { faker } from '@faker-js/faker'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  // for (let index = 0; index < 100; index++) {
  //   await prisma.artist.create({
  //       data: {
  //           name: faker.name.middleName(),
  //           altName: faker.name.lastName(),
  //       }
  //   })
  // }
  res.status(200).json({ name: 'Done!' })
}
