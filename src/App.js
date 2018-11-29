import React, {useState, useEffect} from 'react'
import './App.css';
import Plot from 'react-plotly.js';
import {formatDate, stockRoute, simpleGet} from "./utils";
//TODO api calls pipeline
//TODO seamless util mapping functions ==> consumable prop obj
//TODO special Wrapper around <Plot/> for our obj struct
//TODO flexbox wrap multiple plots
//TODO for 1d and lists, use own Datetime format. Rest is "2018-10-29"


const defaultStock = 'aapl'


const cases = {
    today: ['1d'],
    resolutions: ['1m', '3m', '6m', '1y', '2y', '5y'],
    lists: ['mostactive']
}

const ToolBar = ({handleSelect, options = [...cases.today, ...cases.resolutions, ...cases.lists]}) => (<>
    {options.map(option => <button onClick={() => handleSelect(option)}>{option}</button>)}
</>)

//trying something new here.
const FetchStocks = ({stock, viewOption, render}) => {
    const [stockData, setStockData] = useState([{}])
    const [requestError, setRequestError] = useState(null)

    const handleChange = (pick = stock, view = viewOption) => {
        setRequestError(null)
        simpleGet(stockRoute(pick, view))
            .then(stockData => setStockData(JSON.parse(stockData)))
            .catch(err => {
                console.log('ERROR');
                setRequestError(err)
            })
    }

    useEffect(() => {
        handleChange(stock, viewOption)
    }, [stock, viewOption])
    //[stock] is dependent value => rerender if changed

    return render(stockData, requestError)

}


//TODO Yup or Superstruct simple object validation
const equalizeAPIData = (iexData) => {
    return iexData.map(d => ({
        date: d.minute ? new Date(formatDate(d.minute)) : new Date(),
        high: d.high,
        open: d.open,
        close: d.close,
        low: d.low,
        average: d.average || (d.high + d.low) / 2,
        volume: d.volume || d.latestVolume
        //for volume bar plot
    }))
}

/*const MakeTrace = ({apiData}) => {
    const [trace, setTrace] = useState({})

    const info = equalizeAPIData(apiData)
    for (key in info[0]) {
        trace[key] = info.map(d => d[key])
    }
    trace.x = trace.date;
    console.log(trace)
    return Object.assign(trace, params)

}*/

export default function App({defaultStock = defaultStock}) {
    const [viewOption, setViewOption] = useState('1d')
    const [stock, setStock] = useState(defaultStock)
    const [temp, setTemp] = useState('')


    const mapToTrace = (apiData, params = {}) => {
        const info = equalizeAPIData(apiData)
        let trace = {}
        for (let key in info[0]) {

            trace[key] = info.map(d => {
                // console.log(key, d)
                return d[key]
            })
        }
        trace.x = trace.date;
        console.log(trace)
        return Object.assign(trace, params)

    }
    return (
        <div>
            <ToolBar handleSelect={setViewOption}/>
            <input placeholder={'stock name'} onChange={(ev) => setTemp(ev.target.value)}/>
            <button onClick={() => setStock(temp)}>Find Stock</button>

            <FetchStocks stock={stock} viewOption={viewOption} render={(apiData, error) => (
                <>
                    {console.log('rerender fetch', apiData[0], stock)}
                    {error && <section>{`Stock doesn't exists: ${error}`}</section>}
                    {/*TODO performance && caching*/}
                    <Plot
                        data={[mapToTrace(apiData, {type: 'candlestick'})]}
                        layout={{
                            width: window.innerWidth * 0.8,
                            height: window.innerHeight * 0.8,
                            title: 'A Fancy Plot'
                        }}
                    />
                </>
            )}/>

        </div>
    );
}
/*
[mapToTrace(apiData, {type: 'candlestick', xaxis: 'x',
    yaxis: 'y'})]}*/
