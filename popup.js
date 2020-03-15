let global_result = undefined;

async function clickLogic() {
    console.log('fetching..');

    const [userPositions, coronaPositions] = await Promise.all([
      fetchUserTimeline(),
      fetchCoronaLocations(),
    ]);

    const risks = findRiskPoints(userPositions, coronaPositions);

    console.log('cross-referencing.. done', risks);

    const risksElement = document.getElementById('risks');
    risksElement.innerText = formatRisks(risks);
}

changeColor.onclick = function(element) {
    clickLogic();
};

function formatRisks(risks) {
  return risks.map(
    ({
      text,
      startTime,
      endTime,
    }) => `On ${moment(startTime).format("YYYY-MM-DD")}: ${text}`
  ).join('\n\n');
}
