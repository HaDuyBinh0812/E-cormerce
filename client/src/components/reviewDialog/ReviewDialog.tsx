"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

type Props = {
    productName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { rating: number; comment: string }) => void;
};

export default function ReviewDialog({
    productName,
    onSubmit,
    open,
    onOpenChange,
}: Props) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (rating === 0) return;

        onSubmit?.({ rating, comment });

        // reset
        setRating(0);
        setComment("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="mt-2 flex items-center gap-1">
                    <Star size={16} />
                    Review
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Review product: {productName}</DialogTitle>
                </DialogHeader>

                {/* STAR RATING */}
                <div className="flex justify-center gap-1 my-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={28}
                            className={`cursor-pointer ${
                                (hoverRating || rating) >= star
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>

                {/* COMMENT */}
                <Textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                {/* ACTION */}
                <div className="flex justify-end mt-4">
                    <Button disabled={rating === 0} onClick={handleSubmit}>
                        Submit Review
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
