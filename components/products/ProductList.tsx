import { IProduct } from "@/interfaces";
import { Grid } from "@mui/material";
import { FC } from "react";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
    products: IProduct[];
}

export const ProductList: FC<ProductListProps> = ({products}) => {
    return (
        <Grid container spacing={4}>
            {
                products.map((product) => (
                    <ProductCard 
                        key={product.slug}
                        product={product}
                    />
                ))
            }
        </Grid>
    )
}
