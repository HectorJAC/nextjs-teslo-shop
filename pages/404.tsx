import { ShopLayout } from "@/components/layouts"
import { Box, Typography } from "@mui/material"

const Custom404 = () => {
    return (
        <ShopLayout
            title="Pagina no encontrada"
            pageDescription="La pagina buscada no existe o no se encuentra disponible."
        >
            <Box 
                display="flex" 
                justifyContent='center' 
                alignItems='center' 
                height='calc(100vh - 200px)'
                sx={{ flexDirection: {xs: 'column', sm: 'row'} }}
            >
                <Typography 
                    variant="h1" 
                    component="h1" 
                    fontSize={70}
                    fontWeight={100}
                >
                    Error 404 |
                </Typography>

                <Typography marginLeft={2}>
                    Pagina no encontrada
                </Typography>
            </Box>
        </ShopLayout>
    )
}

export default Custom404