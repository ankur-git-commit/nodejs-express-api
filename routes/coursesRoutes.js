import { Router } from "express"
import {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/courseController.js"
import Course from "../models/Course.js"
import advancedResults from "../middleware/advancedResults.js"
import { protect, authorize } from "../middleware/auth.js"

const router = Router({ mergeParams: true })

router
    .route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description",
        }),
        getCourses
    )
    .post(protect, authorize('publisher', 'admin'), addCourse)

router
    .route("/:id")
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)

export { router as coursesRouter }
