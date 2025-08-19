import { Router } from "express"
import {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} from "../controllers/bootcampController.js"
import advancedResults from "../middleware/advancedResults.js"
import Bootcamp from "../models/Bootcamp.js"

// Include other resource routers
import { coursesRouter } from "./coursesRoutes.js"

const router = Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', coursesRouter)


router.route("/")
    .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
    .post(createBootcamp)

router.route("/radius")
    .get(getBootcampsInRadius)

router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

router.route("/:id/photo").put(bootcampPhotoUpload)

export { router as bootcampsRouter }
