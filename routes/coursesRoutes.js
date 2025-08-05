import { Router } from "express"
import { getCourses } from "../controllers/courseController.js"

const router = Router({ mergeParams: true })

router.route("/").get(getCourses)

export { router as coursesRouter }
