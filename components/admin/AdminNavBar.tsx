import NextLink from "next/link";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useContext } from "react";
import { UiContext } from "../../context";

export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext(UiContext);

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

                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    );
};
