import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useDriverLocation = (onLocationUpdate) => {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let watcher = null;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // a cada 5 segundos
          distanceInterval: 10, // ou a cada 10 metros
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          onLocationUpdate({ lat: latitude, lng: longitude });
        }
      );
    };

    startWatching();

    return () => {
      if (watcher) watcher.remove();
    };
  }, []);

  return { errorMsg };
};

export default useDriverLocation;