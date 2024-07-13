import { 
    AccessTimeOutlined, 
    AttachMoneyOutlined, 
    CancelPresentationOutlined, 
    CategoryOutlined, 
    CreditCardOffOutlined, 
    CreditCardOutlined, 
    DashboardOutlined, 
    GroupOutlined, 
    ProductionQuantityLimitsOutlined 
} from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";
import { Grid, Typography } from "@mui/material";
import { SummaryTile } from "@/components/admin";
import useSWR from "swr";
import { DashboardSummaryResponse } from "@/interfaces";
import { useEffect, useState } from "react";

const DashboardPage = () => {
    
    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000, // 30 segundos
    });

    const [refreshIn, setRefresIn] = useState<number>(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresIn((refreshIn) => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    if (!error && !data) {
        return <></>
    };

    if (error) {
        console.log(error);
        return <Typography>Error al cargar los datos</Typography>
    };

    const { 
        numberOfOrders, 
        paidOrders, 
        notPaidOrdes, 
        numberOfClients, 
        numberOfProducts, 
        productsWithNoInventory, 
        lowInventory 
    } = data!;

    return (
        <AdminLayout
            title="Dashboard"
            subTitle="Estadisticas generales"
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>
                <SummaryTile 
                    title={numberOfOrders}
                    subtitle="Ordenes Totales"
                    icon={<CreditCardOutlined color="secondary" sx={{fontSize: 40}} />}
                />

                <SummaryTile 
                    title={paidOrders}
                    subtitle="Ordenes Pagadas"
                    icon={<AttachMoneyOutlined color="success" sx={{fontSize: 40}} />}
                />
                
                <SummaryTile 
                    title={notPaidOrdes}
                    subtitle="Ordenes Pendientes"
                    icon={<CreditCardOffOutlined color="error" sx={{fontSize: 40}} />}
                />

                <SummaryTile 
                    title={numberOfClients}
                    subtitle="Clientes"
                    icon={<GroupOutlined color="primary" sx={{fontSize: 40}} />}
                />

                <SummaryTile 
                    title={numberOfProducts}
                    subtitle="Productos"
                    icon={<CategoryOutlined color="warning" sx={{fontSize: 40}} />}
                />

                <SummaryTile 
                    title={productsWithNoInventory}
                    subtitle="Sin Existencias"
                    icon={<CancelPresentationOutlined color="error" sx={{fontSize: 40}} />}
                />

                <SummaryTile 
                    title={lowInventory}
                    subtitle="Bajo Inventario"
                    icon={<ProductionQuantityLimitsOutlined color="warning" sx={{fontSize: 40}} />}
                />

                <SummaryTile 
                    title={refreshIn}
                    subtitle="Actualizacion en"
                    icon={<AccessTimeOutlined color="secondary" sx={{fontSize: 40}} />}
                />
            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage;