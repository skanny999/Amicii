import { getDB } from './db'

async function setupDefaultFeatures() {
  const db = await getDB()
  await db.features.createMany({
    data: [
      {
        id: 1,
        emoji: `PH0`,
      },
      {
        id: 2,
        emoji: `PH1`,
      },
      {
        id: 3,
        emoji: `PH2`,
      },
      {
        id: 4,
        emoji: `PH3`,
      },
      {
        id: 5,
        emoji: `PH4`,
      },
      {
        id: 6,
        emoji: `PH5`,
      },
      {
        id: 7,
        emoji: `PH6`,
      },
      {
        id: 8,
        emoji: `PH7`,
      },
      {
        id: 9,
        emoji: `PH8`,
      },
      {
        id: 10,
        emoji: `PH9`,
      },
    ],
    skipDuplicates: true,
  })
}

export default setupDefaultFeatures
