import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let comments

export default class CommentsDAO {
    static async injectDB(conn) {
        if (comments) {
            return
        }
        try {
            comments = await conn.db(process.env.GAMEREPO_NS).collection("comments")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    static async addComment(gameId, user, comment, date) {
        try {
            const commentDoc = { name: user.name,
            user_id: user._id,
            date: date,
            text: comment,
            game_id: ObjectId(gameId), }

            return await comments.insertOne(commentDoc)
        } catch (e) {
            console.error(`Unable to post comment: ${e}`)
            return { error: e }
        }
    }

    static async updateComment(commentId, userId, text, date){
        try {
            const updateResponse = await comments.updateOne(
                { user_id: userId, _id: ObjectId(commentId)},
                { $set: { text: text, date: date } },
                )
            
            return updateResponse
        } catch (e) {
            console.error(`Unable to update comment: ${e}`)
            return { error: e }
        }
    }

    static async deleteComment(commentId, userId) {
        try {
            const deleteResponse = await comments.deleteOne({
                _id: ObjectId(commentId),
                user_id: userId,
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }
}