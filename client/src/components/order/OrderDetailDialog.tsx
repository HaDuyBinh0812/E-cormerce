"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Package, Star } from "lucide-react";
import ReviewDialog from "../reviewDialog/ReviewDialog";
import { useReviewStore } from "../../../store/useReviewStore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Props = {
    order: any;
};

export default function OrderDetailDialog({ order }: Props) {
    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [openReviewDialog, setOpenReviewDialog] = useState<string | null>(
        null,
    );
    const steps = ["PROCESSING", "SHIPPED", "DELIVERED"];

    const getStepIcon = (status: string, step: string) => {
        if (steps.indexOf(status) >= steps.indexOf(step)) {
            return "bg-green-500 text-white";
        }
        return "bg-gray-300 text-gray-500";
    };

    const subTotal = order.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
    );

    const discountAmount = Math.max(subTotal - order.total, 0);

    const { createReview, isLoading } = useReviewStore();
    const { toast } = useToast();

    const handleCreateReview = async (
        orderItemId: string,
        rating: number,
        comment: string,
    ) => {
        const success = await createReview(orderItemId, rating, comment);
        if (success) {
            toast({
                title: "Review submitted",
                description: "Thank you for your feedback",
            });
            setOpenReviewDialog(null);
            setOpenOrderDialog(false);
        } else {
            toast({
                title: "Failed to submit review",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={openOrderDialog} onOpenChange={setOpenOrderDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    View Detail
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Order Details - {order.id}</DialogTitle>
                </DialogHeader>

                {/* STATUS */}
                <div className="space-y-4">
                    <div className="bg-slate-50 p-2 rounded-md mt-4">
                        <h2 className="font-bold mb-4 ml-2">Order status</h2>
                        <div className="flex justify-between items-center">
                            {steps.map((step, index) => (
                                <div key={step} className="flex-1 text-center">
                                    <div
                                        className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full ${getStepIcon(
                                            order.status,
                                            step,
                                        )}`}
                                    >
                                        {step === "PROCESSING" && <Package />}
                                        {step === "SHIPPED" && <Truck />}
                                        {step === "DELIVERED" && (
                                            <CheckCircle />
                                        )}
                                    </div>
                                    <p className="text-sm mt-2 capitalize">
                                        {step.toLowerCase()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div className="bg-slate-50 p-2 rounded-md mt-4">
                        <h2 className="font-bold">Order Items</h2>
                        <div className="space-y-3">
                            {order.items.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center p-3 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.productName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Size: {item.size} | Color:{" "}
                                            {item.color}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qantity: {item.quantity}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center font-semibold text-center">
                                        <div>${item.price.toFixed(2)}</div>

                                        {order.status === "DELIVERED" && (
                                            <ReviewDialog
                                                productName={item.productName}
                                                open={
                                                    openReviewDialog === item.id
                                                }
                                                onOpenChange={(open) =>
                                                    setOpenReviewDialog(
                                                        open ? item.id : null,
                                                    )
                                                }
                                                onSubmit={({
                                                    rating,
                                                    comment,
                                                }) =>
                                                    handleCreateReview(
                                                        item.id,
                                                        rating,
                                                        comment,
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-700">
                                Subtotal
                            </span>
                            <span>${subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-700">
                                Discount
                            </span>
                            <span>${discountAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
