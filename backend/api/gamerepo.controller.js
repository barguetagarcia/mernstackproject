import gamerepoDAO from "../dao/gamerepoDAO.js";

export default class gamerepoController {
    static async apiGetGames(req, res, next){
        const gamerepoPerPage = req.query.gamerepoPerPage ? parseInt(req.query.gamerepoPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.platform) {
            filters.platform = req.query.platform
        } else if (req.query.publisher) {
            filters.publisher = req.query.publisher
        } else if (req.query.title) {
            filters.title = req.query.title
        }
    

    const { gameList, totalNumGames } = await gamerepoDAO.getGames({
        filters,
        page,
        gamerepoPerPage,
    })

    let response = {
        games: gameList,
        page: page,
        filters: filters,
        entries_per_page: gamerepoPerPage,
        total_results: totalNumGames,
    }
    res.json(response)
    }

    static async apiGetGameById(req, res, next) {
        try {
            let id = req.params.id || {}
            let game = await gamerepoDAO.getGameById(id)
            if (!game) {
                res.status(404).json({ error: "Not Found" })
                return
            }
            res.json(game)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetGameByPublisher(req, res, next) {
        try {
            let publisher = await gamerepoDAO.getPublisher()
            res.json(publisher)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }


}