import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";

interface ItemCounterProps {
    currentValue: number;
    updateQuantity: (value: number) => void;
    maxValue: number;
}

export const ItemCounter:FC<ItemCounterProps> = ({ currentValue, maxValue, updateQuantity }) => {

    const addOrRemove = (value: number) => {
        if (value === -1) {
            if (currentValue === 1) return;

            return updateQuantity(currentValue - 1);
        }

        if (currentValue >= maxValue) return;

        updateQuantity(currentValue + 1);
    };

    return (
        <Box display='flex' alignItems='center'>
            <IconButton 
                onClick={() => addOrRemove(-1)}
            >
                <RemoveCircleOutline />
            </IconButton>

            <Typography sx={{width: 40, textAlign: 'center'}}> {currentValue} </Typography>

            <IconButton
                onClick={() => addOrRemove(+1)}
            >
                <AddCircleOutline />
            </IconButton>
        </Box>
    );
}
;