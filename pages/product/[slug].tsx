import { ShopLayout } from "../../components/layouts";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { dbProducts } from "../../database";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { CartContext } from "@/context";

interface Props {
    product: IProduct
}

const ProductPage:NextPage<Props> = ({product}) => {

    const router = useRouter();
    const { addProductToCart } = useContext(CartContext)

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    });

    const onSelectSize = (size: ISize) => {
        setTempCartProduct({...tempCartProduct, size});
    };

    const updateQuantity = (value: number) => {
        setTempCartProduct({...tempCartProduct, quantity: value});
    };

    const onAddProduct = () => {
        if (!tempCartProduct.size) return;
        addProductToCart(tempCartProduct);
        router.push('/cart');
    };

    return (
        <ShopLayout
            title={product.title}
            pageDescription={product.description}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideShow 
                        images={product.images}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='subtitle1' component='sub'>${product.price}</Typography>

                        <Box sx={{my: 2}}>
                            <Typography variant='subtitle2'>Cantidad</Typography>
                            <ItemCounter 
                                currentValue={tempCartProduct.quantity}
                                updateQuantity={updateQuantity}
                                maxValue={product.inStock}
                            />
                            <SizeSelector 
                                selectdSize={tempCartProduct.size} 
                                sizes={product.sizes}  
                                onSelectSize={onSelectSize}                              
                            />
                        </Box>  

                        {
                            product.inStock > 0 ? (
                                <Button color="secondary" className="circular-btn" onClick={onAddProduct}>
                                    {
                                        tempCartProduct.size 
                                            ? 'Agregar al carrito' 
                                            : 'Selecciona una talla'
                                    }
                                </Button>
                            ) : (
                                <Chip label='No hay disponibles' color="error" variant="outlined" />
                            )
                        }

                        <Box sx={{mt: 3}}>
                            <Typography variant="subtitle2">Descripcion</Typography>
                            <Typography variant="body2">{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const productSlugs = await dbProducts.getAllProductSlugs();

    return {
        paths: productSlugs.map(({slug}) => ({
            params: { slug }
        })),
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const { slug } = params as { slug: string };  
    const product = await dbProducts.getProductBySlug(slug);

        if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    };

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}

// export const getServerSideProps: GetServerSideProps = async ({params}) => {
//     const { slug = '' } = params as { slug: string };
//     const product = await dbProducts.getProductBySlug(slug);

//     if (!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     };

//     return {
//         props: {
//             product
//         }
//     }
// }

export default ProductPage;