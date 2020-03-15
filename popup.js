let global_result = undefined;

const clickLogic = function() {
    console.log('fetching..');

    const api_endpoint = 'https://www.google.com/maps/timeline/_rpc/ma';

    fetch(api_endpoint).then(r => { global_result = r; return r.text() }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });
    console.log('fetching.. done');
}

changeColor.onclick = function(element) {
    clickLogic();
};