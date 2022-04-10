import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';


function Colors({ colors, colorIndex, setColorIndex }) {

    function handleClick(index) {
        setColorIndex(index);
    }

    const styles = {
        colorBox: {
            height: '3rem',
            width: '3rem',
            // transform: 'translateY(1rem)'
        }
    }

    const renderColorBox = (color, index) => {
        const selectedStyle = {
            border: 2,
            // borderColor: 'white',
            borderColor: '#b3ffb7',
            transform: 'translateY(-0.5rem)'
        }
        const style = index === colorIndex ? selectedStyle : {};
        return (
            <Box
                key={index}
                sx={{
                    ...styles.colorBox,
                    ...style,
                    backgroundColor: color,
                }}
                onClick={() => handleClick(index)}>

            </Box>
        )
    }

    return (
        <Container sx={{ display: 'flex', flexdirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexdirection: 'row', backgroundColor: '#4f9c53', p: '1rem', borderRadius: '1rem' }}>
                {colors.map((color, index) => {
                    return renderColorBox(color, index);
                })}
            </Box>
            
            {/* <Box sx={{ height: '3rem', width: '3rem', backgroundColor: 'red' }} ></Box> */}
        </Container>
    );
}
export default Colors;
