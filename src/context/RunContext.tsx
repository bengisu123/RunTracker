import React, {createContext, useContext, useEffect, useState, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';

type RunContextType = {
    isRunning: boolean;
    seconds: number;
    distance: number;
    locations: LocationPoint[];
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    setDistance: React.Dispatch<React.SetStateAction<number>>;
    setLocations: React.Dispatch<React.SetStateAction<LocationPoint[]>>;

    handleRunButton: () => Promise<void>;
    resetRun: () => void;
};

export type LocationPoint = {
  latitude: number,
  longitude: number,
};

const RunContext = createContext<RunContextType | undefined>(undefined);

export function RunProvider({children}: {children: React.ReactNode}) {
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [distance, setDistance] = useState(0);
    const [locations,setLocations] = useState<LocationPoint[]>([]); 

    const watchIdRef = useRef<number | null>(null);  

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;

        if (isRunning) {
            timer = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRunning]);

    const calculateDistance = (
        point1: LocationPoint,
        point2: LocationPoint
    ) => {
        const earthRadius = 6371;

        const lat1 = point1.latitude * (Math.PI / 180);
        const lat2 = point2.latitude * (Math.PI / 180);

        const deltaLat =
        (point2.latitude - point1.latitude) * (Math.PI / 180);

        const deltaLon =
        (point2.longitude - point1.longitude) * (Math.PI / 180);

        const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
        );

        return earthRadius * c;
    };


    const requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Konum izni verildi');
        return true;
        }

        else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Konum izni reddedildi');
        return false;
        }

        else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Konum izni kalıcı olarak reddedildi');
        return false;
        }

        return false;
    };


    const handleRunButton = async () => {
        if (isRunning) {
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        setIsRunning(false);
        return;
        }

        const hasPermission = await requestLocationPermission();

        if(hasPermission) {
        const watchId = Geolocation.watchPosition(
            (position) => {
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            setLocations((prevLocations) => {
                if(prevLocations.length > 0) {
                const lastLocation =
                    prevLocations[prevLocations.length - 1];

                const newDistance = calculateDistance(
                    lastLocation,
                    newLocation
                );

                setDistance((prevDistance) =>
                    prevDistance + newDistance
                );
                }

                return [
                ...prevLocations,
                newLocation,
                ];
            });

            console.log('Yeni konum:', newLocation);
            },

            (error) => {
            console.log('Konum hatası:',error);
            },
            
            {
            enableHighAccuracy: true,
            distanceFilter: 1,
            interval: 2000,
            fastestInterval: 1000,
            }

        );

        watchIdRef.current = watchId;
        setIsRunning(true);     
        }
    };

      const resetRun = () => {
        if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        }

        setIsRunning(false);
        setSeconds(0);
        setDistance(0);
        setLocations([]);
    };

    return (
        <RunContext.Provider
            value={{
                isRunning,
                seconds,             
                distance,
                locations,

                setIsRunning,
                setSeconds,
                setDistance,
                setLocations,

                handleRunButton,
                resetRun,
            }}
        >
            {children}
        </RunContext.Provider>
    );
}

export function useRun() {
    const context = useContext(RunContext);

    if (!context) {
        throw new Error('useRun, RunProvider içinde kullanılmalıdır.');
    }

    return context;
}