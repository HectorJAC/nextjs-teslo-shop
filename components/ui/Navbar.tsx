import NextLink from "next/link";
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CartContext, UiContext } from "@/context";

export const Navbar = () => {

    const { asPath, push } = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    };

    const navigateTo = (url:string) => {
        toggleSideMenu();
        
    };

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref style={{textDecoration: 'none'}}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                        }}
                    >
                        <Typography variant="h6">Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </div>
                </NextLink>

                <Box flex={1} />

                <Box sx={{ display: isSearchVisible ? 'none' : {xs: 'none', sm: 'block'} }} className='fadeIn'>
                    <NextLink href='/category/men' passHref>
                        <Button color={asPath === '/category/men' ? 'primary' : 'info'}>
                            Hombres
                        </Button>
                    </NextLink>

                    <NextLink href='/category/women' passHref>
                        <Button color={asPath === '/category/women' ? 'primary' : 'info'}>
                            Mujeres
                        </Button>
                    </NextLink>

                    <NextLink href='/category/kid' passHref>
                        <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>
                            Niños
                        </Button>
                    </NextLink>
                </Box>

                <Box flex={1} />

                { /* Pantallas Grandes */}
                {
                    isSearchVisible
                    ? (
                        <Input
                            sx={{ display: {xs: 'none', sm: 'flex'} }}
                            className="fadeIn"
                            autoFocus
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value)}
                            onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsSearchVisible(false)}
                                    >
                                    <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    ) : (
                        <IconButton
                            onClick={() => setIsSearchVisible(true)}
                            className="fadeIn"
                            sx={{ display: {xs: 'flex', sm: 'none'} }}
                        >
                            <SearchOutlined />
                        </IconButton>
                    )
                }
                    
                { /* Pantallas Pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart' passHref>
                    <IconButton>
                        <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </NextLink>

                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    );
};
