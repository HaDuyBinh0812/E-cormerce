import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../utils/api";

type ReviewState = {
    isLoading: boolean;
    error: string | null;
    success: boolean;

    reviews: Review[];

    createReview: (
        orderItemId: string,
        rating: number,
        comment?: string,
    ) => Promise<boolean>;

    getReviewsByProduct: (productId: string) => Promise<void>;

    resetReviewState: () => void;
};

type Review = {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
    };
};

export const useReviewStore = create<ReviewState>((set) => ({
    isLoading: false,
    error: null,
    success: false,
    reviews: [],
    createReview: async (orderItemId, rating, comment) => {
        try {
            set({ isLoading: true, error: null, success: false });

            await axios.post(
                `${API_ROUTES.REVIEW}`,
                {
                    orderItemId,
                    rating,
                    comment,
                },
                {
                    withCredentials: true,
                },
            );

            set({ success: true });
            return true;
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Failed to submit review";

            set({ error: message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    getReviewsByProduct: async (productId: string) => {
        try {
            set({ isLoading: true, error: null, success: false });
            const res = await axios.get(
                `${API_ROUTES.REVIEW}/product/${productId}`,
            );

            set({ reviews: res.data.data });
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Failed to fetch reviews";
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    resetReviewState: () =>
        set({
            isLoading: false,
            error: null,
            success: false,
        }),
}));
