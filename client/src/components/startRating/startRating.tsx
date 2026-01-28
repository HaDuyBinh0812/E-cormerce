import { Star } from "lucide-react";

type StarRatingProps = {
    rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={
                        star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }
                />
            ))}
        </div>
    );
}
