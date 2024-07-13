import { ShopLayout } from "@/components/layouts";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import NextLink from 'next/link';

const EmptyPage = () => {
    return (
        <ShopLayout 
            title='Carrito Vacio'
            pageDescription='No hay articulos en tu carrito de compras.'
        >
            <Box 
                display="flex" 
                justifyContent='center' 
                alignItems='center' 
                height='calc(100vh - 200px)'
                sx={{ flexDirection: {xs: 'column', sm: 'row'} }}
            >   
                <RemoveShoppingCartOutlined sx={{fontSize: 100}} />
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography>Su carrito esta vacio</Typography>
                    <NextLink href='/' passHref style={{textDecoration: 'none'}}>
                        <Typography variant="h4" color='secondary'>
                            Regresar
                        </Typography>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage