
const apiBase = 'https://api.iextrading.com/1.0/';


export const stockRoute = (stockSymbol = 'aapl', resolution = '1d') => apiBase + `stock/${stockSymbol}/chart/${resolution}`;

export const listRoute = (type = 'mostactive') => apiBase + `stock/market/list/${type}`;

/*
const minuteStringToDateTime = (atMinute) => {
    const [min, sec] = atMinute.split(":").map(el => parseInt(el))
    const totalSeconds = min * 60 + sec;

    const date = new Date(null);
    date.setSeconds(totalSeconds);
    return date.toISOString().substr(11, 8);
}
*/

export const formatDate = (atHour = "00:00", date = new Date()) => date.toISOString().split('T')[0] + " " + atHour;

//because fetch API wasn't friendly with iex api ...
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