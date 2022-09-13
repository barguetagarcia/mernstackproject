import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import gamerepoDAO from "./dao/gamerepoDAO.js"
import commentsDAO from "./dao/commentsDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.GAMEREPO_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    })
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await gamerepoDAO.injectDB(client)
        await commentsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })
