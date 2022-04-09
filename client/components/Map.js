import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";


const render = (status) => {
    if (status === Status.LOADING) return "Loading...";
    if (status === Status.FAILURE) return "Error";
    return null;
};

const Map = ()) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "600px",
            }}
        >
            <Wrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={render}>
                <MyMapComponent squares={squares} selectedColor={selectedColor} />
            </Wrapper>
        </div>
    );
};

function MyMapComponent() {
    const ref = useRef(null);
    const [map, setMap] = useState();
    const [curLocMarker, setCurLocMarker] = useState();
    const [position, setPosition] = useState(null);

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
        if (map && position) {
            setCurLocMarker(new window.google.maps.Marker({
                position: { lat: position?.latitude, lng: position?.longitude },
                map
            }));
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
