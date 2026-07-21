<?php

return [
    'location' => [
        'latitude' => (float) env('ATTENDANCE_LAT', 6.4969),
        'longitude' => (float) env('ATTENDANCE_LNG', 2.6289),
        'radius_meters' => (int) env('ATTENDANCE_RADIUS_METERS', 50),
    ],

    'presence_cutoff' => env('ATTENDANCE_PRESENCE_CUTOFF', '09:30'),
];