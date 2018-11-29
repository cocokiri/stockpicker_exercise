const apiBase = 'https://api.iextrading.com/1.0/';

export const listOptions = ['losers', 'gainers', 'iexpercent', 'mostactive', 'iexvolume', 'iexfocus']
export const stockViewOptions = ['1d', '1m', '3m', '6m', '1y', '2y', '5y'];


//TODO split up
export const route = (stock = 'aapl', view = '1d') => (
    listOptions.includes(view)
        ? apiBase + `stock/market/list/${view}`
        : apiBase + `stock/${stock}/chart/${view}`
)

//TODO Yup or Superstruct simple object validation
//I don't like this:
export const toUniformApiData = (iexData) => {
    return iexData.map(d => ({
        date: d.minute ? new Date(formatDate(d.minute)) : d.date,
        high: d.high,
        open: d.open,
        close: d.close,
        low: d.low,
        average: d.average || (d.high + d.low) / 2,
        volume: d.volume || d.latestVolume
        //for volume bar plot
    }))
}
export const formatDate = (atHour = "00:00", date = new Date()) => date.toISOString().split('T')[0] + " " + atHour;

//promisified xml req. because fetch API wasn't friendly with iex api ...
export function simpleGet(theUrl) {
    return new Promise(function (resolve, reject) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                resolve(xmlHttp.responseText)
            }
            if (xmlHttp.status === 404) {
                reject("Sorry, there was an error: " + xmlHttp.status)
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        // xmlHttp.onerror = (error) =>
        xmlHttp.send(null);
        //default, so components don't need .catch each time
    })
}

/*
const minuteStringToDateTime = (atMinute) => {
    const [min, sec] = atMinute.split(":").map(el => parseInt(el))
    const totalSeconds = min * 60 + sec;

    const date = new Date(null);
    date.setSeconds(totalSeconds);
    return date.toISOString().substr(11, 8);
}
*/