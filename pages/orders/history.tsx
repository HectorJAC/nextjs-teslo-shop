import { ShopLayout } from "@/components/layouts";
import { Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next'
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { getToken } from "next-auth/jwt";

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullname', headerName: 'Nombre Completo', width: 300},

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Si la orden esta pagada o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label='Pagada' variant="outlined" />
                    : <Chip color="error" label='No Pagada' variant="outlined" />
            )
        }
    },

    {
        field: 'orden',
        headerName: 'Ver Orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref style={{color: 'black'}}>
                    Ver Orden
                </NextLink>
            )
        }
    },
];

interface Props {
    orders: IOrder[];
};

const HistoryPage:NextPage<Props> = ({orders}) => {
    
    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }));

    return (
        <ShopLayout 
            title='Historial de compras' 
            pageDescription='Historial de las ordenes del cliente'
        >
            <Typography variant="h1" component='h1'>Historial de Ordenes</Typography>

            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {paginationModel: {pageSize: 5}},
                        }}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default HistoryPage;

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const token:any = await getToken({req});
    if (!token) {
        return {
            redirect: {
                destination: '/auth/login?=p/orders/history',
                permanent: false
            }
        }
    };

    const orders = await dbOrders.getOrdersByUser(token.user._id);

    return {
        props: {
            orders
        }
    }
}
