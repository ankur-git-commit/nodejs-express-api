import { Router } from "express"
import {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
} from "../controllers/bootcampController.js"

const router = Router()

router.route("/")
    .get(getAllBootcamps)
    .post(createBootcamp)

router.route("/radius")
    .get(getBootcampsInRadius)

router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)


export { router as bootcampsRouter }
