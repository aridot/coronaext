const riskDistanceMeters = 1000;
const timeMarginsHours = 4;

function findRiskPoints(userPositions, coronaPositions) {
    const risks = [];

    coronaPositions.forEach(coronaPosition => {
        const matchingUserPosition = userPositions.find(userPosition => {
            return moment(userPosition.time).isBetween(
                moment(coronaPosition.startTime).subtract(timeMarginsHours, "hours"),
                moment(coronaPosition.endTime).add(timeMarginsHours, "hours"),
            ) && calculateDistance(
                userPosition.position,
                coronaPosition.position,
            ) < riskDistanceMeters;
        });

        if (!matchingUserPosition) return;

        risks.push({
          ...coronaPosition,
          distance: calculateDistance(
            matchingUserPosition.position,
            coronaPosition.position,
          ),
        });
    });

    return risks;
}

function calculateDistance({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }) {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const lat1Rads = degreesToRadians(lat1);
    const lat2Rads = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rads) * Math.cos(lat2Rads);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
