import React, {useState} from 'react'
import './App.css';
import Plot from 'react-plotly.js';

//TODO api calls pipeline
//TODO seamless util mapping functions ==> consumable prop obj
//TODO special Wrapper around <Plot/> for our obj struct
//TODO flexbox wrap multiple plots


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