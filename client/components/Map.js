import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";


const render = (status) => {
    if (status === Status.LOADING) return "Loading...";
    if (status === Status.FAILURE) return "Error";
    return null;
};

const Map = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "600px",
            }}
        >
            <Wrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={render}>
                <MyMapComponent />
            </Wrapper>
        </div>
    );
};

function MyMapComponent() {
    const ref = useRef(null);
    const [map, setMap] = useState();
    const [curLocMarker, setCurLocMarker] = useState();
    const [position, setPosition] = useState(null);
    const [positionDisabled, setPositionDisabled] = useState(false);
    const [renderedRects, setRenderedRects] = useState(false);
    const [squaresArr, setSquaresArr] = useState(generateSquareArray(15));

    function generateSquareArray(dim) {
        return JSON.parse(JSON.stringify(Array(dim).fill(Array(dim).fill(0))));
    }

    function showPosition(pos) {
        setPosition(pos.coords);
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
            for (var y = 0; y < 15; y++) {
                for (var x = 0; x < 15; x++) {
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

    curLocMarker?.setPosition({ lat: position?.latitude, lng: position?.longitude })

    return (
        <>
            <div ref={ref} style={{ width: "100%", height: "100%" }} />
        </>
    );

}

export default Map;
