import { Router } from "express"
import {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
} from "../controllers/bootcampController.js"

const router = Router()

router.route("/").get(getBootcamps).post(createBootcamp)
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

export { router as bootcampsRouter }
