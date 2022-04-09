import React from 'react';

import {
    Container,
    Typography,
} from '@mui/material';


function App() {

    const styles = {
        mainContainer: {
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            pb: '2rem',
        }
    }

    return (
        <Container sx={styles.mainContainer}>
            <Typography variant='h2' sx={styles.header}>Welcome to GeoPlacer</Typography>
        </Container>
    );
};
export default App;