async function fetchUserTimeline() {
  const timelineUrl = "https://www.google.com/maps/timeline/_rpc/ma";

  let res;
  try {
    res = await fetch(timelineUrl);
  } catch(err) {
    console.log(err);
    return;
  };

  const dataRecords = [];
  const dataLineRegex = /^,\[(\d+),\[.*,.*,([\d.]+),([\d.]+)\]$/;
  res.split("\n").forEach(line => {
    const match = dataLineRegex.exec(line);
    if (!match) return;
    dataRecords.push({
      time: new Date(match[1]),
      position: { lat: match[2], lon: match[3] },
    });
  });

  return dataRecords;
}

async function fetchCoronaLocations(language="He") {
  const coronaUrl = `https://israelcoronamap.co.il/data/data${language}.json`;

  let json;
  try {
    const resString = await fetch(coronaUrl);
    json = JSON.parse(resString);
  } catch (err) {
    console.error("Error fetching coronavirus positions", err);
    return;
  }

  return json.map(({ lat, lon, t_start, t_end, ...otherInfo }) => ({
    ...otherInfo,
    position: { lat, long },
    startTime: new Date(t_start),
    endTime: new Date(t_end),
  }))
}
