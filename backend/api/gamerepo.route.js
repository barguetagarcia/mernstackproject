import express from "express"
import gamerepoCtrl from "./gamerepo.controller.js"
import CommentsCtrl from "./comments.controller.js"

const router = express.Router()

router.route("/").get(gamerepoCtrl.apiGetGames)
router.route("/id/:id").get(gamerepoCtrl.apiGetGameById)
router.route("/publishers").get(gamerepoCtrl.apiGetGameByPublisher)

router
    .route("/comment")
    .post(CommentsCtrl.apiPostComment)
    .put(CommentsCtrl.apiUpdateComment)
    .delete(CommentsCtrl.apiDeleteComment)

export default router