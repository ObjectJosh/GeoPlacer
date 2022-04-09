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
        }
    }

    const renderColorBox = (color, index) => {
        const selectedStyle = {
            border: 2,
            borderColor: 'white',
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
        <Container sx={{ display: 'flex', flexdirection: 'row' }}>
            {colors.map((color, index) => {
                return renderColorBox(color, index);
            })}
            {/* <Box sx={{ height: '3rem', width: '3rem', backgroundColor: 'red' }} ></Box> */}
        </Container>
    );
}
export default Colors;
