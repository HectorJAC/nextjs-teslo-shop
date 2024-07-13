import { IProduct } from "@/interfaces";
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Chip } from "@mui/material";
import { FC, useMemo, useState } from "react";
import NextLink from 'next/link';

interface ProductCardProps {
    product: IProduct;
}

export const ProductCard:FC<ProductCardProps> = ({product}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoader, setIsImageLoader] = useState(false);

    const productImage = useMemo(() => {
        return isHovered ? product.images[1] : product.images[0];
    }, [isHovered, product.images])

    return (
        <Grid item 
            xs={6} 
            sm={4} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                    <CardActionArea>
                        {
                            product.inStock === 0 && (
                                <Chip
                                    color="primary"
                                    label="No hay disponibles"
                                    sx={{position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                                />
                            )
                        }

                        <CardMedia 
                        component={'img'}
                        className="fadeIn"
                        image={ productImage }
                        alt={product.title}
                        onLoad={() => setIsImageLoader(true)}
                    />
                    </CardActionArea>
                </NextLink>
            </Card>

            <Box 
                sx={{mt: 1, display: isImageLoader ? 'block' : 'none'}} 
                className="fadeIn"
            >
                <Typography fontWeight={700}>{ product.title }</Typography>
                <Typography fontWeight={500}>${ product.price }</Typography>
            </Box>
        </Grid>
    )
}
