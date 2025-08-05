import { Router } from "express"
import {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
} from "../controllers/bootcampController.js"

// Include other resource routers
import { coursesRouter } from "./coursesRoutes.js"

const router = Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', coursesRouter)

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
