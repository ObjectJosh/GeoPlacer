import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { addSquare, findSquares, updateSquare } from '../api/square';
import { updateUser, findUser, addUser } from '../api/user';
import {
    Container,
    Typography,
    Button,
    Slider,
    Box,
    Switch,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import { useUser } from '../UserProvider';


// const TOPLEFT_LAT = parseFloat(process.env.REACT_APP_TOPLEFT_LAT)
// const TOPLEFT_LONG = parseFloat(process.env.REACT_APP_TOPLEFT_LONG)
// const SQUARE_DIM = parseFloat(process.env.REACT_APP_SQUARE_DIM)
// const GRID_DIM = parseInt(process.env.REACT_APP_GRID_DIM)
const TOPLEFT_LAT = 35.303545
const TOPLEFT_LONG = -120.666757
const SQUARE_DIM = 0.0004
const GRID_DIM = 15
const API_KEY = "AIzaSyBwgO_6-Gl4DsVQxX-w9UQuYJmCqK4LHpM"


const render = (status) => {
    if (status === Status.LOADING) return "Loading...";
    if (status === Status.FAILURE) return "Error";
    return null;
};

const Map = ({ squares, selectedColor, handleGetSquares, plac, setPlac }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "600px",
            }}
        >
            <Wrapper apiKey={API_KEY} render={render}>
                <MyMapComponent squares={squares} selectedColor={selectedColor}
                    handleGetSquares={handleGetSquares}
                    plac={plac} setPlac={setPlac}/>
            </Wrapper>
        </div>
    );
};

function MyMapComponent({ squares, selectedColor, handleGetSquares, plac, setPlac }) {
    const { currentUser, setCurrentUser } = useUser();
    const ref = useRef(null);
    const [map, setMap] = useState();
    const [curLocMarker, setCurLocMarker] = useState();
    const [position, setPosition] = useState(null);
    const [positionDisabled, setPositionDisabled] = useState(false);
    const [squaresArr, setSquaresArr] = useState(generateSquareArray(15));
    const [inRange, setInRange] = useState(false)

    function generateSquareArray(dim) {
        return JSON.parse(JSON.stringify(Array(dim).fill(Array(dim).fill(0))));
    }

    function showPosition(pos) {
        setPosition(pos.coords);
    }

    function handleAddSquare() {
        async function blockingAddSquare() {
            let x = Math.floor((position.longitude - TOPLEFT_LONG) / SQUARE_DIM);
            let y = Math.floor((TOPLEFT_LAT - position.latitude) / SQUARE_DIM);
            let matches = await findSquares(`${x}-${y}`);
            if (matches.length === 0) {
                await addSquare({
                    x: x,
                    y: y,
                    color: selectedColor,
                    changed: 0
                })
            } else {
                await updateSquare({
                    id: matches[0].id,
                    x: x,
                    y: y,
                    color: selectedColor,
                    changed: matches[0].changed + 1
                })
            }
            setPlac(plac + 1);
            await handleGetSquares();
        }
        async function update() {
            let user = await findUser(currentUser.id);
            /* If no user found, make new user */
            if (!user || (user && user.length === 0)) {
                addUser({
                id: username,
                pin: pin,
                placed: 0
                });
            } else { /* User found. Set user */
                setCurrentUser(user[0]);
            }
            let newPlaced = currentUser?.placed + 1;
            await updateUser({
                id: currentUser?.id,
                placed: newPlaced
            });
        }
        blockingAddSquare();
        update();
    }

    function userInRange() {
        if (position) {
            var x = (position.longitude - TOPLEFT_LONG) / SQUARE_DIM;
            var y = (TOPLEFT_LAT - position.latitude) / SQUARE_DIM
            return x >= 0 && x < GRID_DIM && y >= 0 && y < GRID_DIM;
        }
        return false
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            setPositionDisabled(true);
        }
        setTimeout(getLocation, 5000);
    }

    function addRectangle(map, color, opacity, showBorders, x, y, bounds) {
        const rectangle = new window.google.maps.Rectangle({
            strokeColor: "#FFFFFF",
            strokeOpacity: showBorders ? 1 : 0,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: opacity,
            map,
            bounds: bounds,
        })
        let arrayCopy = squaresArr;
        arrayCopy[y][x] = rectangle;
        setSquaresArr(arrayCopy)
    }

    function changeSquareArrOpacity(opacity) {
        for (var y = 0; y < GRID_DIM; y++) {
            for (var x = 0; x < GRID_DIM; x++) {
                if (squaresArr[y][x] != 0) {
                    squaresArr[y][x].setOptions({ fillOpacity: opacity });
                }
            }
        }
    }

    function showSquareArrBorders(value) {
        for (var y = 0; y < GRID_DIM; y++) {
            for (var x = 0; x < GRID_DIM; x++) {
                if (squaresArr[y][x] != 0) {
                    squaresArr[y][x].setOptions({ strokeOpacity: value });
                }
            }
        }
    }

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        if (ref.current && !map && position) {
            setMap(new window.google.maps.Map(ref.current,
                {
                    center: { lat: position?.latitude, lng: position?.longitude },
                    zoom: 16
                }));
        }
    }, [ref, map, position]);

    useEffect(() => {
        if (map) {
            setCurLocMarker(new window.google.maps.Marker({
                position: { lat: position?.latitude, lng: position?.longitude },
                map
            }));
            for (var y = 0; y < GRID_DIM; y++) {
                for (var x = 0; x < GRID_DIM; x++) {
                    if (squaresArr[y][x] === 0) {
                        var north = TOPLEFT_LAT - y * SQUARE_DIM;
                        var south = north - SQUARE_DIM;
                        var west = TOPLEFT_LONG + x * SQUARE_DIM;
                        var east = west + SQUARE_DIM;
                        addRectangle(map, "#FFFFFF", 0.5, true, x, y, {
                            north: north,
                            south: south,
                            east: east,
                            west: west,
                        });
                    }
                }
            }
        }
    }, [map]);

    useEffect(() => {
        if (map && squaresArr) {
            squares?.forEach((square) => {
                if (squaresArr[square.y][square.x] != 0 && squaresArr[square.y][square.x]) {
                    squaresArr[square.y][square.x]?.setOptions({ fillColor: square.color, strokeColor: "#FFFFFF" })
                    setSquaresArr(squaresArr)
                }
            });
        }
    }, [squares]);

    curLocMarker?.setPosition({ lat: position?.latitude, lng: position?.longitude })

    useEffect(() => {
        setInRange(userInRange())
    }, [position]);

    const styles = {
        btn: {
            mt: '2rem',
            width: '15rem',
            backgroundColor: '#43a047',
            color: 'white',
            borderRadius: '3rem',
            fontSize: '1.2rem',
            textTransform: 'none',
            pt: '1rem',
            pb: '1rem',
            mb: '1.5rem',
            '&:hover': {
                backgroundColor: '#37873b'
            }
            // color: "#FF0000"
        }

    }

    return (
        <>
            <div ref={ref} style={{ width: "100%", height: "100%" }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                 <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Slider sx={{ width: '20rem' }} defaultValue={50} valueLabelDisplay="auto" onChange={(event, value) => { changeSquareArrOpacity(value / 100) }} />
                    <FormControlLabel control={<Switch defaultChecked />} label="Show Borders" onChange={(event, value) => { showSquareArrBorders(value) }} />
                </Box>
                <Button variant='outlined' sx={styles.btn} onClick={() => handleAddSquare()} disabled={!inRange}>{inRange ? 'Add Square' : 'Not in Range'}</Button>
                {/* <Box sx={{ flexGrow: 1 }} /> */}
                
            </Box>
        </>
    );

}

export default Map;
