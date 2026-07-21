<?php

namespace App\Services;

class GeolocationService
{
    public function isWithinAllowedRadius(float $latitude, float $longitude): bool
    {
        return $this->distanceInMeters($latitude, $longitude) <= config('attendance.location.radius_meters');
    }

    public function distanceInMeters(float $latitude, float $longitude): float
    {
        $earthRadius = 6371000;

        $originLat = config('attendance.location.latitude');
        $originLng = config('attendance.location.longitude');

        $latDelta = deg2rad($latitude - $originLat);
        $lngDelta = deg2rad($longitude - $originLng);

        $a = sin($latDelta / 2) ** 2
            + cos(deg2rad($originLat)) * cos(deg2rad($latitude)) * sin($lngDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}