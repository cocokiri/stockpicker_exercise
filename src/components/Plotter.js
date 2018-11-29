//trying something new here.
import React, {useState, useEffect} from 'react'
import {toUniformApiData} from "../utils";
import Plot from '../../node_modules/react-plotly.js/react-plotly'

export default function Plotter({data, title}) {
    const [trace, setTrace] = useState([{}])

    useEffect(() => {
        mapToTrace(data)
    }, [data])

    const mapToTrace = (data) => {
        console.log(data, 'data')
        const info = toUniformApiData(data)
        let trace = {}
        for (let key in info[0]) {
            trace[key] = info.map(d => {
                // console.log(key, d)
                return d[key]
            })
        }
        trace.x = trace.date;
        setTrace(trace)
    }
    /*
        let relativeVolToPrice;
        if (trace.volume > 1) {
            const maxVol = Math.max(...trace.volume)
            const maxPrice = Math.max(...trace.high)
            relativeVolToPrice = trace.volume.map(v => v * maxVol).map(relVol => relVol * maxPrice);
            console.log('relative Vol')
        }*/
    return (
        <Plot
            data={[{...trace, ...{type: 'candlestick', name: 'prices'}},
                {type: 'bar', x: trace.x, y: trace.volume, name: 'volume'}
            ]}
            layout={{
                height: 0.8 * window.innerHeight,
                title
            }}
        />
    )
}