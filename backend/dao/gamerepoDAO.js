import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let gamerepo

export default class gamerepoDAO {
    static async injectDB(conn) {
        if (gamerepo) {
            return
        }
        try {
            gamerepo = await conn.db(process.env.GAMEREPO_NS).collection("gamerepo")
        } catch (e) {
            console.error (
                `Unable to establish a collection handle in gamerepoDAO: ${e}`,
            )
        }
    }

    static async getGames({
        filters = null,
        page = 0,
        gamerepoPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters["title"] } }
            } else if ("publisher" in filters) {
                query = { "publisher": { $eq: filters["publisher"] } }
            } else if ("platform" in filters) {
                query = {"platform": { $eq: filters["platform"] } }
            }
        }

        let cursor

        try {
            cursor = await gamerepo
                .find(query)
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`)
            return { gameList: [], totalNumGames: 0 }
        }

        const displayCursor = cursor.limit(gamerepoPerPage).skip(gamerepoPerPage * page)

        try {
            const gameList = await displayCursor.toArray()
            const totalNumGames = await gamerepo.countDocuments(query)

            return { gameList, totalNumGames }
        } catch(e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { gameList: [], totalNumGames: 0 }
        }
    }

    static async getGameById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                        {
                            $lookup: {
                                from: "comments",
                                let: {
                                    id: "$_id",
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$game_id", "$$id"],
                                            },
                                        },
                                    },
                                    {
                                        $sort: {
                                            date: -1,
                                        },
                                    },
                                ],
                                as: "comments",
                            },
                        },
                        {
                            $addFields: {
                                comments: "$comments",
                            },
                        },
            ]
            return await gamerepo.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something went wrong in getGameById: ${e}`)
            throw e
        }
    }

    static async getPublisher() {
        let publishers = []
        try {
            publishers = await gamerepo.distinct("publisher")
            return publishers
        } catch (e) {
            console.error(`Unable to get publisher ${e}`)
            return publishers
        }
    }
}