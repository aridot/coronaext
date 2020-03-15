const riskDistanceMeters = 1000;
const timeMarginsHours = 4;

function findRiskPoints(userPositions, coronaPositions) {
  return coronaPositions.filter(coronaPosition => {
    return userPositions.some(userPosition => {
      return moment(userPosition.time).isBetween(
        moment(coronaPosition.startTime).subtract(timeMarginsHours, "hours"),
        moment(coronaPosition.endTime).add(timeMarginsHours, "hours"),
      ) && calculateDistance(
        userPosition.position,
        coronaPosition.position,
      ) < riskDistanceMeters;
    });
  });
}

function calculateDistance({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
