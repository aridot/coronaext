async function fetchUserTimeline() {
  const timelineUrl = "https://www.google.com/maps/timeline/_rpc/ma";

  let data;
  try {
    const res = await fetch(timelineUrl);
    data = await res.text();
  } catch(err) {
    console.error('Error fetching timeline from Google', err);
    return;
  };

  const dataRecords = [];
  const dataLineRegex = /^,\[(\d+),\[.*,.*,([\d.]+),([\d.]+)\]$/;
  data.split("\n").forEach(line => {
    const match = dataLineRegex.exec(line);
    if (!match) return;
    dataRecords.push({
      time: new Date(parseInt(match[1], 10)),
      position: {
        lat: parseFloat(match[2], 10),
        lon: parseFloat(match[3], 10),
      },
    });
  });

  return dataRecords;
}

async function fetchCoronaLocations(language="He") {
  const coronaUrl = `https://israelcoronamap.co.il/data/data${language}.json`;

  let json;
  try {
    const res = await fetch(coronaUrl);
    json = await res.json(); //JSON.parse(res.body);
  } catch (err) {
    console.error("Error fetching coronavirus positions", err);
    return;
  }

  return json.map(({ lat, lon, t_start, t_end, ...otherInfo }) => ({
    ...otherInfo,
    position: { lat, lon },
    startTime: new Date(t_start),
    endTime: new Date(t_end),
  }))
}
