import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { addSquare, findSquares, updateSquare } from '../api/square';
import {
    Container,
    Typography,
    Button,
    Slider,
    Box
} from '@mui/material';


const TOPLEFT_LAT = parseFloat(process.env.TOPLEFT_LAT)
const TOPLEFT_LONG = parseFloat(process.env.TOPLEFT_LONG)
const SQUARE_DIM = parseFloat(process.env.SQUARE_DIM)
const GRID_DIM = parseInt(process.env.GRID_DIM)


const render = (status) => {
    if (status === Status.LOADING) return "Loading...";
    if (status === Status.FAILURE) return "Error";
    return null;
};

const Map = ({ squares, selectedColor, handleGetSquares }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "600px",
            }}
        >
            <Wrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={render}>
                <MyMapComponent squares={squares} selectedColor={selectedColor}
                    handleGetSquares={handleGetSquares} />
            </Wrapper>
        </div>
    );
};

function MyMapComponent({ squares, selectedColor, handleGetSquares }) {
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
            await handleGetSquares();
        }
        blockingAddSquare()
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
            strokeColor: color,
            strokeOpacity: showBorders ? 1 : 0,
            strokeWeight: 3,
            fillColor: color,
            fillOpacity: opacity,
            map,
            bounds: bounds,
        })
        let arrayCopy = squaresArr;
        arrayCopy[y][x] = rectangle;
        setSquaresArr(arrayCopy)
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
                    squaresArr[square.y][square.x]?.setOptions({ fillColor: square.color, strokeColor: square.color })
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
        redbutton: {
            width: '15rem',
            color: "#FF0000"
        }

    }

    return (
        <>
            <div ref={ref} style={{ width: "100%", height: "100%" }} />
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button variant='outlined' sx={styles.redbutton} onClick={() => handleAddSquare()} disabled={!inRange}>Add Square</Button>
                <Box sx={{ flexGrow: 1 }}/>
                <Slider sx={{ width: '20rem' }} />
            </Box>
            
        </>
    );

}

export default Map;
