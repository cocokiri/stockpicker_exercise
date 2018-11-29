import React, {useState, useEffect} from 'react'
import './App.css';
import Plot from 'react-plotly.js';

//TODO api calls pipeline
//TODO seamless util mapping functions ==> consumable prop obj
//TODO special Wrapper around <Plot/> for our obj struct
//TODO flexbox wrap multiple plots


//TODO for 1d and lists, use own Datetime format. Rest is "2018-10-29"

const apiBase = 'https://api.iextrading.com/1.0/';

const stockRoute = (stockSymbol = 'aapl', resolution = '1d') => apiBase + `stock/${stockSymbol}/chart/${resolution}`;

const listRoute = (type = 'losers') => apiBase + `stock/market/list/${type}`;


/*
const minuteStringToDateTime = (atMinute) => {
    const [min, sec] = atMinute.split(":").map(el => parseInt(el))
    const totalSeconds = min * 60 + sec;

    const date = new Date(null);
    date.setSeconds(totalSeconds);
    return date.toISOString().substr(11, 8);
}
*/

const formatDate = (atHour= "00:00", date = new Date()) => date.toISOString().split('T')[0] + " " + atHour;

//because fetch API wasn't friendly with iex api ...
function simpleGet(theUrl) {
    return new Promise(function (resolve, reject) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                resolve(xmlHttp.responseText)
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
        xmlHttp.onerror = (error) => reject(error)
        //default, so components don't need .catch each time
    })

}


//1d vs 1m+ vs lists
//could've named it stockToPlotMap
const formatIEXsInconsistentShemas = (data, shemaToPort='1d') => {
    //props needed date, volume, high, low and average
    if (shemaToPort === '1d') {
        JSON.parse(data).map(d => {
            return {
                x: new Date(formatDate(d.minute)),
                y: d.close
            }
        })
    }
}

//trying something new here.
const FetchStocks = ({stock, viewOption, render}) => {
    const [stockData, setStockData] = useState([{}])
    const [requestError, setRequestError] = useState(null)

    const handleChange = (stock = stock, viewOption = viewOption) => {
        setRequestError(null)
        simpleGet(stockRoute(stock, viewOption))
            .then(stockData => setStockData(JSON.parse(stockData)))
            .catch(err => setRequestError(err.message))
    }

    useEffect(() => {
        handleChange()
    }, [])
    //[] as 2nd argument => componentDidMount -- who knew...

    return render(stockData)

}


export default function App() {
    const [stockData, setStockData] = useState([{}])
    const [requestError, setRequestError] = useState(null)
    
    return (
        <div>
            <FetchStocks stock={stock} viewOption={viewOption} render={data => (
                <Plot data={[
                    {
                        x: data.map(d => new Date(formatDate(d.minute))),
                        y: data.map(d => d.close),
                        type: 'scatter',
                        mode: 'lines',
                        // marker: {color: 'red'},
                    },
                    // {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
                ]}
                      layout={{width: window.innerWidth * 0.8, height: window.innerHeight * 0.8, title: 'A Fancy Plot'}}
                />
            )}/>
        </div>
    );
}

