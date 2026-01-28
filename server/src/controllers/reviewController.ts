import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createReview = async (
    req: AuthenticatedRequest,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { orderItemId, rating, comment } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
            return;
        }

        // 1️⃣ Lấy orderItem + order
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: {
                order: true,
                reviews: true,
            },
        });

        if (!orderItem) {
            res.status(404).json({
                success: false,
                message: "Order item not found",
            });
            return;
        }

        // 2️⃣ Check ownership
        if (orderItem.order.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to review this item",
            });
            return;
        }

        // 3️⃣ Check order delivered
        if (orderItem.order.status !== "DELIVERED") {
            res.status(400).json({
                success: false,
                message: "You can only review delivered orders",
            });
            return;
        }

        // 4️⃣ Check duplicate review
        if (orderItem.reviews) {
            res.status(400).json({
                success: false,
                message: "This product has already been reviewed",
            });
            return;
        }

        // 5️⃣ Create review (transaction)
        const review = await prisma.$transaction(async (tx) => {
            const createdReview = await tx.review.create({
                data: {
                    userId,
                    productId: orderItem.productId,
                    orderItemId,
                    rating,
                    comment,
                },
            });

            // 6️⃣ Update product rating
            const stats = await tx.review.aggregate({
                where: { productId: orderItem.productId },
                _avg: { rating: true },
            });

            await tx.product.update({
                where: { id: orderItem.productId },
                data: {
                    rating: stats._avg.rating || 0,
                },
            });

            return createdReview;
        });

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: review,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to submit review",
        });
    }
};

//Get all review by product

export const getReviewsByProduct = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { productId } = req.params;

        if (!productId) {
            res.status(400).json({
                success: false,
                message: "ProductId is required",
            });
            return;
        }

        const reviews = await prisma.review.findMany({
            where: {
                productId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            total: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
        });
    }
};
