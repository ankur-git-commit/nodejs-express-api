import { Router } from "express"
import {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} from "../controllers/bootcampController.js"
import { protect, authorize } from "../middleware/auth.js"
import advancedResults from "../middleware/advancedResults.js"
import Bootcamp from "../models/Bootcamp.js"

// Include other resource routers
import { coursesRouter } from "./coursesRoutes.js"

const router = Router()

// Re-route into other resource routers
router.use("/:bootcampId/courses", coursesRouter)

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getAllBootcamps)
    .post(protect, authorize("publisher", "admin"), createBootcamp)

router.route("/radius").get(getBootcampsInRadius)

router
    .route("/:id")
    .get(getBootcamp)
    .put(protect, authorize("publisher", "admin"), updateBootcamp)
    .delete(protect, authorize("publisher", "admin"), deleteBootcamp)

router
    .route("/:id/photo")
    .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload)

export { router as bootcampsRouter }
