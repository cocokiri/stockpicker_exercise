import React, {useState} from 'react'
import './App.css';
import Plot from 'react-plotly.js';

//TODO api calls pipeline
//TODO seamless util mapping functions ==> consumable prop obj
//TODO special Wrapper around <Plot/> for our obj struct
//TODO flexbox wrap multiple plots


const stockAPI = 'https://api.iextrading.com/1.0/';
const test1 = 'stock/aapl/chart/1d';


//because fetch API wasn't friendly with iex api ...
function simpleGet(theUrl, noFail=true) {
    return new Promise(function (resolve, reject) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                resolve(xmlHttp.responseText)
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
        xmlHttp.onerror = (error) => {
            reject(error)
            //default, so components don't need .catch each time
            if (noFail) throw(error)
        }
    })

}


export default function App() {
    const [stockData, setStockData] = useState({})

    return (
        <div>
            <Plot data={[
                {
                    x: [1, 2, 3],
                    y: [2, 6, 3],
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: 'red'},
                },
                {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
                  layout={{width: window.innerWidth * 0.8, height: window.innerHeight * 0.8, title: 'A Fancy Plot'}}
            />
        </div>
    );
}