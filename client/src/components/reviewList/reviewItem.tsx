import { StarRating } from "../startRating/startRating";

type ReviewItemProps = {
    review: {
        id: string;
        rating: number;
        comment?: string;
        createdAt: string;
        user: {
            name: string;
        };
    };
};

function ReviewItem({ review }: ReviewItemProps) {
    return (
        <div className="border-b py-4">
            <div className="flex items-center">
                <p className="font-medium mr-1">{review.user.name}</p>
                <StarRating rating={review.rating} />
            </div>
            {review.comment && (
                <p className="mt-0.5 text-sm text-gray-600">{review.comment}</p>
            )}

            <p className="mt-1 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </p>
        </div>
    );
}

export default ReviewItem;
