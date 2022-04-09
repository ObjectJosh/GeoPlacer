import React from 'react';

import {
    Container,
    Typography,
} from '@mui/material';

import Colors from './components/Colors';


function App() {

    const [colorIndex, setColorIndex] = useState(0);

    const [squares, setSquares] = useState([]);
    const colors = [
        '#000000',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFFFF',
    ]
    
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
            <Colors colors={colors} colorIndex={colorIndex} setColorIndex={setColorIndex} />
        </Container>
    );
};
export default App;