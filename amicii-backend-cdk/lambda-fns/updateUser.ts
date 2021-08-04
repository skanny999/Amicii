import { User } from './types'
import { getDB } from './db'

async function updateUser(user: User) {

    const db = await getDB()
    
    const disconnectPreviouslyConnectedFeatures =  db.user.update({
        where: {id: user.id},
        data: {
            features: {
                set: []  // disconnecting all previous features
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
                            emoji: user.features[0]
                        }, create: {
                            emoji: user.features[0]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[1]
                        }, create: {
                            emoji: user.features[1]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[2]
                        }, create: {
                            emoji: user.features[2]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[3]
                        }, create: {
                            emoji: user.features[3]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[4]
                        }, create: {
                            emoji: user.features[4]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[5]
                        }, create: {
                            emoji: user.features[5]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[6]
                        }, create: {
                            emoji: user.features[6]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[7]
                        }, create: {
                            emoji: user.features[7]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[8]
                        }, create: {
                            emoji: user.features[8]
                        }
                    },
                    {
                        where: {
                            emoji: user.features[9]
                        }, create: {
                            emoji: user.features[9]
                        }
                    }
                ]
            }
        }
    })
    
    // transaction to ensure either BOTH operations happen or NONE of them happen.
    await db.$transaction([disconnectPreviouslyConnectedFeatures, connectOrCreateNewFeatures ])
}

export default updateUser