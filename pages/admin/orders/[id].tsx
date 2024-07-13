import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { CardList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from 'next';
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

interface Props {
    order: IOrder;
};

const OrderPage:NextPage<Props> = ({ order }) => {
    
    const { shippingAddress } = order;

    return (
        <AdminLayout 
            title='Resumen de la orden'
            subTitle={`Orden: ${order._id}`}
            icon={<AirplaneTicketOutlined />}
        >
            {
                order.isPaid
                ? (
                    <Chip 
                        sx={{my: 2}}
                        label='Orden ya fue pagada'
                        variant="outlined"
                        color="success"
                        icon={<CreditScoreOutlined />}
                    />
                )
                : (
                    <Chip 
                        sx={{my: 2}}
                        label='Pendiente de Pago'
                        variant="outlined"
                        color="error"
                        icon={<CreditCardOffOutlined />}
                    />
                )
            }

            <Grid container className="fadeIn">
                <Grid item xs={12} sm={7}>
                    <CardList 
                        products={order.orderItems}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography 
                                variant="h2"
                            >
                                Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})
                            </Typography>

                            <Divider sx={{my: 1}} />

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography>
                                {shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}
                            </Typography>
                            <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                            <Typography>{shippingAddress.country}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>

                            <Divider sx={{my: 1}} />

                            <OrderSummary 
                                orderValues={{
                                    numberOfItems: order.numberOfItems,
                                    subTotal: order.subTotal,
                                    total: order.total,
                                    tax: order.tax
                                }}
                            />

                            <Box sx={{mt: 3}} display='flex' flexDirection='column'>
                                <Box display='flex' flexDirection='column'>
                                    {
                                        order.isPaid
                                        ? (
                                            <Chip 
                                                sx={{my: 2, flex: 1}}
                                                label='Orden ya fue pagada'
                                                variant="outlined"
                                                color="success"
                                                icon={<CreditScoreOutlined />}
                                            />
                                        )
                                        : (
                                            <Chip 
                                                sx={{my: 2}}
                                                label='Pendiente de Pago'
                                                variant="outlined"
                                                color="error"
                                                icon={<CreditCardOffOutlined />}
                                            />
                                        )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const { id = '' } = query;

    const order = await dbOrders.getOrderById(id.toString());   

    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false
            }
        }
    };

    return {
        props: {
            order
        }
    }
}
