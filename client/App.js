import React, { useEffect, useState, useRef } from 'react';

import {
    Container,
    Box,
    Typography,
    Button,
    Link
} from '@mui/material';

import Map from './components/Map';
import User from './components/User';
import { getSquares } from './api/square';
import Colors from './components/Colors';
import earthImage from './img/earth.png';


function App() {
    const [showChat, setShowChat] = useState(false);
    // const [username, setUsername] = useState("");
    // const [room, setRoom] = useState("");
    // const [showChat, setShowChat] = useState(false);

    const [squares, setSquares] = useState([]);
    const colors = [
        '#000000',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFFFF',
    ]
    const [colorIndex, setColorIndex] = useState(0);
    // const [color, setColor] = useState()
    const descriptionRef = useRef(null);

    async function handleGetSquares() {
        setSquares(await getSquares());
        setTimeout(handleGetSquares, 5000);
    }

    useEffect(() => {
        handleGetSquares();
    }, []);

    const executeScroll = () => descriptionRef.current.scrollIntoView();

    const styles = {
        mainContainer: {
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            pb: '2rem',
        },
        header: {
            textAlign: 'center',
            mt: '2rem',
            mb: '2rem',
        },
        button: {
            width: '15rem',
        },
        redbutton: {
            width: '15rem',
            color: "#FF0000"
        }
    }

    const renderLogin = () => {
        return (
            <User showChat={showChat} setShowChat={setShowChat}/>
        )
    }

    const renderBody = () => {
        return (
            <Box sx={{ position: 'relative' }}>
                <Link onClick={executeScroll} sx={{ '&:hover:': { cursor: 'pointer' }, mt: '2rem' }}>
                    <Typography variant='h5' sx={{ mb: '2rem' }}>
                        How to play
                    </Typography>
                </Link>
                <Map squares={squares} selectedColor={colors[colorIndex]} handleGetSquares={handleGetSquares} />
                <Colors colors={colors} colorIndex={colorIndex} setColorIndex={setColorIndex} />
                <Box sx={{ position: 'relative', mt: '8rem' }}>
                    <img alt='world' src={earthImage} style={{ position: 'absolute', width: '80%', height: 'auto', transform: 'translate(-50%, -20%)', opacity: 0.8, zIndex: -5 }} />
                    <Typography variant='h4' ref={descriptionRef} sx={{ mb: '1rem', fontWeight: '700' }}>
                        How to play
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: '1.4rem', mb: '2rem', fontWeight: '500' }}>
                        Walk around and color in squares. It's that simple!
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: '1.5rem', transform: 'rotate(-15deg) translateX(-8rem)', mb: '2rem', color: '#fc9803', fontWeight: '600' }}>
                        Paint a picture with friends!
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: '1.5rem', transform: 'rotate(15deg) translateX(8rem)', mb: '4rem', color: '#00de3b', fontWeight: '600' }}>
                        Collaborate with others!
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: '1.5rem', transform: 'rotate(-10deg) translateX(-3rem)', mb: '2rem', color: '#ff3b29', fontWeight: '600' }}>
                        Just have some fun!
                    </Typography>
                </Box>
                <Box sx={{ mt: { sm: '10rem', md: '25rem' } }}></Box>
                <Typography variant='body2' sx={{ mt: '10rem', fontSize: '1rem', fontWeight: '600' }}>
                    Built for your enjoyment by
                </Typography>
                <Typography variant='body2' sx={{ mt: '0.5rem' }}>
                    Josh Wong, Christian Honenin, Wesley Luu & Wilson Szeto
                </Typography>
                <Typography variant='body2' sx={{ mt: '2rem', fontSize: '1rem', fontWeight: '600' }}>
                    Inspired by
                </Typography>
                <Link onClick={() => window.open('https://www.reddit.com/r/place/')}>
                    <Typography variant='body2' sx={{ mt: '0.5rem' }} >
                        r/Place
                    </Typography>
                </Link>
                {renderLogin()}
            </Box>
        );
    }

    return (
        <Container sx={styles.mainContainer}>
            <Typography variant='h2' sx={styles.header}>Welcome to GeoPlacer</Typography>
            {showChat ? renderBody() : renderLogin()}
        </Container>
    );
};
export default App;