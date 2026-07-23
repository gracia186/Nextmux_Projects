export interface GeoResult {
  latitude: number;
  longitude: number;
  appareil: string;
}

/**
 * Demande la position GPS du navigateur. Rejette avec un message clair et
 * en français si l'utilisateur refuse, si le navigateur ne supporte pas la
 * géolocalisation, ou si la position met trop de temps à arriver.
 */
export function obtenirPosition(): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Votre navigateur ne supporte pas la géolocalisation. Le pointage est impossible."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          appareil: navigator.userAgent,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Vous devez autoriser la géolocalisation dans votre navigateur pour pointer votre présence."));
        } else if (error.code === error.TIMEOUT) {
          reject(new Error("La localisation a mis trop de temps à répondre. Réessayez."));
        } else {
          reject(new Error("Impossible d'obtenir votre position. Vérifiez que le GPS est activé."));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}
