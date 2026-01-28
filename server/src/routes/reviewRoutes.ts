import { Router } from "express";
import { authenticateJwt } from "../middleware/authMiddleware";
import {
    createReview,
    getReviewsByProduct,
} from "../controllers/reviewController";

const router = Router();

router.post("/", authenticateJwt, createReview);
router.get("/product/:productId", getReviewsByProduct);

export default router;
