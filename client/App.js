import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import {
    Container,
    Box,
    Typography,
    Button,
    Link
} from '@mui/material';

import { useUser } from './UserProvider';

import Map from './components/Map';
import User from './components/User';
import { getSquares } from './api/square';
import { getLeaderboard } from './api/user';
import Colors from './components/Colors';
import earthImage from './img/earth.png';



function App() {
    const { currentUser, displayChat } = useUser();
    // const [showChat, setShowChat] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    // const [username, setUsername] = useState("");
    // const [room, setRoom] = useState("");

    const [squares, setSquares] = useState([]);
    const [plac, setPlac] = useState(0);
    const colors = [
        '#000000',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFFFF',
        '#FFFF00',
        '#00FFFF',
        '#FF00FF'
    ]
    const [colorIndex, setColorIndex] = useState(0);
    // const [color, setColor] = useState()
    const descriptionRef = useRef(null);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        async function leaderboard() {
            let board = await getLeaderboard();
            setLeaderboard(board);
        }
        leaderboard();
    }, [squares, plac])

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
            <User setOnlineUsers={setOnlineUsers} onlineUsers={onlineUsers} />
        )
    }

    const renderOnlineUsers = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: '#00c403', transform: 'translate(0rem, 0.3rem)', mr: '0.3rem' }} />
                <Typography>{`${onlineUsers} User${onlineUsers === 1 ? '' : 's'} Currently Online`}</Typography>
            </Box>
        );
    }

    const renderLeaderboardItem = (user, index) => {
        return (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', textAlign: 'left' }}>
                <Box sx={{ width: { xs: '5rem', md: '10rem' } }}>
                    <Typography variant='body1' key={index}>
                        {`${index + 1}. ${user.id}`}
                    </Typography>
                </Box>
                <Box sx={{ width: { xs: '5rem', md: '10rem' } }}>
                    <Typography variant='body1' key={index} sx={{ textAlign: 'right' }}>
                        {`${user.placed}`}
                    </Typography>
                </Box>
            </Box>

        );
    }

    const renderLeaderboard = () => {
        return (
            <Box sx={{ width: '100%', mt: '4rem', pb: '5rem' }}>
                <Typography role="img" style={{ fontSize: '2rem', fontWeight: '700' }}>???? Leaderboard </Typography>
                <Typography role="img" style={{ fontSize: '1rem', fontWeight: '600', pb: '2rem', color: 'gray' }}>Total Squares Placed </Typography>
                <Box sx={{ height: '1rem' }}></Box>
                {leaderboard?.map((user, index) => {
                    if (user.placed > 0) {
                        return renderLeaderboardItem(user, index)
                    }
                })}
            </Box>
        );
    }

    const renderBody = () => {
        return (
            <Box sx={{ position: 'relative' }}>
                {/* <Link onClick={executeScroll} sx={{ '&:hover:': { cursor: 'pointer' }, mt: '2rem' }}>
                    <Typography variant='h5' sx={{ mb: '2rem' }}>
                        How to play
                    </Typography>
                </Link> */}
                <Map squares={squares} selectedColor={colors[colorIndex]} handleGetSquares={handleGetSquares} setPlac={setPlac} plac={plac} />
                <Colors colors={colors} colorIndex={colorIndex} setColorIndex={setColorIndex} />
                {renderLeaderboard()}
                <Box sx={{ width: '100%', justifyContent: 'center', textAlign: 'center', display: 'flex' }}>
                    <Typography className='geo' variant='h3' x={{ mb: '1rem', fontSize: '4rem', fontWeight: '800', textAlign: 'center' }}>
                        Geoplacer
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', mt: '8rem' }}>
                    <img alt='world' src={earthImage} style={{ position: 'absolute', width: '80%', height: 'auto', transform: 'translate(-50%, -20%)', opacity: 0.8, zIndex: -5 }} />
                    <Typography variant='h4' ref={descriptionRef} sx={{ mb: '1rem', fontWeight: '700' }}>
                        How to play
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Typography className='bounce' variant='body1' sx={{ fontSize: '1.4rem', mb: '2rem', fontWeight: '500' }}>
                            Walk around and color in squares.
                        </Typography>
                        <Typography className='bouncedelay' variant='body1' sx={{ fontSize: '1.4rem', mb: '2rem', fontWeight: '500' }}>
                            It's that simple!
                        </Typography>
                    </Box>
                    
                    <Typography className='move' variant='body1' sx={{ fontSize: '1.5rem', transform: { xs: 'rotate(-15deg) translateX(0rem)', md: 'rotate(-15deg) translateX(-8rem)' }, mb: { xs: '4rem', md: '2rem' }, color: '#fc9803', fontWeight: '600' }}>
                        Paint a picture with friends!
                    </Typography>
                    <Typography className='move2' variant='body1' sx={{ fontSize: '1.5rem', transform: { xs: 'rotate(10deg) translateX(0rem)', md: 'rotate(10deg) translateX(8rem)' }, mb: '4rem', color: '#00de3b', fontWeight: '600' }}>
                        Collaborate with others!
                    </Typography>
                    <Typography className='move' variant='body1' sx={{ fontSize: '1.5rem', transform: { xs: 'rotate(-10deg) translateX(0rem)', md: 'rotate(-10deg) translateX(-3rem)' }, mb: '2rem', color: '#ff3b29', fontWeight: '600' }}>
                        Just have some fun!
                    </Typography>
                </Box>
                <Box sx={{ mt: { sm: '10rem', md: '25rem' } }}></Box>
                <Typography variant='body2' sx={{ mt: '10rem', fontSize: '1rem', fontWeight: '600' }}>
                    ???? Built for your enjoyment by
                </Typography>
                <Typography variant='body2' sx={{ mt: '0.5rem' }}>
                    Josh Wong, Christian Honenin, Wesley Luu & Wilson Szeto
                </Typography>
                <Typography variant='body2' sx={{ mt: '2rem', fontSize: '1rem', fontWeight: '600' }}>
                    ???? Inspired by
                </Typography>
                <Link onClick={() => window.open('https://www.reddit.com/r/place/')}>
                    <Typography variant='body2' sx={{ mt: '0.5rem' }} >
                        r/Place
                    </Typography>
                </Link>
                {/* {renderLogin()} */}
            </Box>
        );
    }

    return (
        <Container sx={styles.mainContainer}>
            <Typography variant='h2' sx={styles.header}>Welcome to GeoPlacer</Typography>
            {currentUser && <Typography variant='h5' sx={{ mb: '0rem', fontWeight: '700', fontSize: '2rem' }}>{`Hello, ${currentUser.id}!`}</Typography>}
            {currentUser && <Typography variant='h5' sx={{ mb: '1rem' }}>{`Explore around the ${'????'} GeoWorld`}</Typography>}
            {/* {renderBody()} */}
            {displayChat ? renderBody() : null}
            {renderLogin()}
        </Container>
    );
};
export default App;