async function fetchUserTimeline() {
    const timelineUrl = "https://www.google.com/maps/timeline/_rpc/ma";
    const minDate = new Date('2020-01-01').getTime();

    let data;
    try {
        const res = await fetch(timelineUrl);
        data = await res.text();
    } catch (err) {
        console.error('Error fetching timeline from Google', err);
        throw new Error("Error fetching positions from google\n" + err.message + "\n" + err.stack);
    };

    const dataRecords = [];
    const dataLineRegex = /^,\[(\d+),\[.*,.*,([\d.]+),([\d.]+)\]$/;
    data.split("\n").forEach(line => {
        const match = dataLineRegex.exec(line);
        if (!match) return;
        const ts = parseInt(match[1], 10);
        if (ts > minDate) {
            dataRecords.push({
                time: new Date(ts),
                position: {
                    lat: parseFloat(match[2], 10),
                    lon: parseFloat(match[3], 10),
                },
            });
        }
    });

    return dataRecords;
}

async function fetchCoronaLocations(language = "he") {
    const coronaUrl = `https://israelcoronamap.co.il/data/data-${language}.json`;

    let json;
    try {
        const res = await fetch(coronaUrl);
        json = await res.json(); //JSON.parse(res.body);
    } catch (err) {
        console.error("Error fetching positions", err);
        throw new Error("Error fetching positions from israelcoronamap\n" + err.message + "\n" + err.stack);
    }

    return json.map(({ lat, lon, t_start, t_end, ...otherInfo }) => ({
        ...otherInfo,
        position: { lat, lon },
        startTime: new Date(t_start),
        endTime: new Date(t_end),
    }))
}