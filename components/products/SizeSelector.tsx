import { Box, Button } from '@mui/material';
import { ISize } from '../../interfaces';
import React, { FC } from 'react'

interface SizeSelectorProps {
    selectdSize?: ISize;
    sizes: ISize[];
    onSelectSize: (size: ISize) => void;
}

export const SizeSelector:FC<SizeSelectorProps> = ({selectdSize, sizes, onSelectSize}) => {
    return (
        <Box>
            {
                sizes.map((size) => (
                    <Button
                        key={size}
                        size='small'
                        color={selectdSize === size ? 'primary' : 'info'}
                        onClick={() => onSelectSize(size)}
                    >
                        {size}
                    </Button>
                ))
            }
        </Box>
    );
};
