import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';

const useDriverLocation = (onLocationUpdate) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const onLocationUpdateRef = useRef(onLocationUpdate);
  
  // Atualiza a ref sempre que a callback mudar
  useEffect(() => {
    onLocationUpdateRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  useEffect(() => {
    let isMounted = true;
    let watcher = null;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;
        
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          return;
        }

        // Primeiro, obtenha a localização atual uma vez
        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });
          
          if (!isMounted) return;
          
          if (currentLocation) {
            const { latitude, longitude } = currentLocation.coords;
            onLocationUpdateRef.current({ lat: latitude, lng: longitude });
          }
        } catch (error) {
          console.error("Erro ao obter localização inicial:", error);
        }

        // Em seguida, configure o monitoramento contínuo
        watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 5,
          },
          (loc) => {
            if (!isMounted) return;
            const { latitude, longitude } = loc.coords;
            onLocationUpdateRef.current({ lat: latitude, lng: longitude });
          }
        );
      } catch (err) {
        console.error("Erro ao iniciar monitoramento:", err);
      }
    };

    startWatching();

    return () => {
      isMounted = false;
      if (watcher) watcher.remove();
    };
  }, []);

  return { errorMsg };
};

export default useDriverLocation;