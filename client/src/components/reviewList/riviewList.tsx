import { useEffect } from "react";
import { useReviewStore } from "../../../store/useReviewStore";
import ReviewItem from "./reviewItem";

type Props = {
    productId: string;
};

function ReviewList({ productId }: Props) {
    const { reviews, getReviewsByProduct, isLoading } = useReviewStore();

    useEffect(() => {
        getReviewsByProduct(productId);
    }, [productId]);
    if (isLoading) {
        return <p className="text-sm text-gray-500">Loading reviews...</p>;
    }

    if (reviews.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                There are no reviews for this product yet.
            </p>
        );
    }
    return (
        <div>
            {reviews.map((review) => (
                <ReviewItem review={review} key={review.id} />
            ))}
        </div>
    );
}

export default ReviewList;
