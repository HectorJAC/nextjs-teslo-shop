import { useContext, useEffect, useState } from "react";
import { CardList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import NextLink from "next/link";
import { CartContext } from "../../context";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SummaryPage = () => {
    
    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }   
    }, [router])

    const onCreateOrder = async() => {
        setIsPosting(true);
        const { hasError, message } = await createOrder();

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`);
    }

    if (!shippingAddress) {
        return <></>;
    };

    const {
        firstName,
        lastName,
        address,
        address2 = '',
        zip,
        city,
        country,
        phone
    } = shippingAddress;

    return (
        <ShopLayout 
            title='Resumen de compra'
            pageDescription='Resumen de la orden de compra'
        >
            <Typography variant="h1" component='h1'>Resumen</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CardList 
                        editable
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography 
                                variant="h2"
                            >
                                Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})
                            </Typography>

                            <Divider sx={{my: 1}} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant="subtitle1">Direccion de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    Editar
                                </NextLink>
                            </Box>

                            <Typography>{firstName} {lastName}</Typography>
                            <Typography>{address}{address2 ? `, address2` : ''}</Typography>
                            <Typography>{city}, {zip}</Typography>
                            {/* <Typography>{countries.countries.find((c) => c.code === country)?.name}</Typography> */}
                            <Typography>{country}</Typography>
                            <Typography>{phone}</Typography>

                            <Divider sx={{my: 1}} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    Editar
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{mt: 3}} display='flex' flexDirection='column'>
                                <Button 
                                    color="secondary" 
                                    className="circular-btn" 
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirmar Orden
                                </Button>

                                <Chip
                                    color="error"
                                    label={errorMessage}
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2}}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default SummaryPage;