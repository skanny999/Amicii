import { User } from './types'
import { getDB } from './db'

async function updateUser(user: User) {

    const db = await getDB()
    
    const disconnectPreviouslyConnectedFeatures =  db.user.update({
        where: {id: user.id},
        data: {
            features: {
                set: []
            }
        }
    })
    
    const connectOrCreateNewFeatures =  db.user.update({
        where: {id: user.id},
        data: {
            username: user.username,
            age: user.age,
            bio: user.bio,
            genderM: user.genderM,
            genderF: user.genderF,
            profileEmoji: user.profileEmoji,
            features: {
                connectOrCreate: [
                    {
                        where: {
                            emoji: user.features[0].emoji
                        }, create: {
                            emoji: user.features[0].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[1].emoji
                        }, create: {
                            emoji: user.features[1].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[2].emoji
                        }, create: {
                            emoji: user.features[2].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[3].emoji
                        }, create: {
                            emoji: user.features[3].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[4].emoji
                        }, create: {
                            emoji: user.features[4].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[5].emoji
                        }, create: {
                            emoji: user.features[5].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[6].emoji
                        }, create: {
                            emoji: user.features[6].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[7].emoji
                        }, create: {
                            emoji: user.features[7].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[8].emoji
                        }, create: {
                            emoji: user.features[8].emoji
                        }
                    },
                    {
                        where: {
                            emoji: user.features[9].emoji
                        }, create: {
                            emoji: user.features[9].emoji
                        }
                    }
                ]
            }
        }
    })
    
    await db.$transaction([disconnectPreviouslyConnectedFeatures, connectOrCreateNewFeatures ])
}

export default updateUser