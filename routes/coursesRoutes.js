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

const router = Router({ mergeParams: true })

router
    .route("/")
    .get(advancedResults(Course, {
            path: "bootcamp",
            select: "name description",
        }), getCourses)
    .post(addCourse)

router.route("/:id")
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

export { router as coursesRouter }
