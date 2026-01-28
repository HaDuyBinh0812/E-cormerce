import { Suspense } from "react";
import ProductDetailSkeleton from "./productSkeleton";
import ProductDetailContent from "./productDetail";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailContent id={id} />
        </Suspense>
    );
}
