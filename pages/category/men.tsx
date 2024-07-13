import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "../../components/products";
import { useProducts } from "../../hooks";
import { FullScreenLoading } from "../../components/ui";

const MenPage:NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout 
      title={'Teslo-Shop - Men'}
      pageDescription="Tienda de productos de Teslo para hombres"
    >
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para hombres</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }

      
    </ShopLayout>
  );
}

export default MenPage;
