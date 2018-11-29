import React, {useState, useEffect} from 'react'
import './App.css';
import Plot from 'react-plotly.js';
import {stockViewOptions, listsViewOptions, formatDate, route, simpleGet} from "./utils";

const ToolBar = ({handleSelect, options}) => {
    const style = {
        selected: {
            background: "cyan",
            color: "white",
            fontWeight: "bold"
        }
    }
    const [selected, setSelected] = useState(null)

    return (<div>
        {options
            .map(option => <button style={selected === option ? style.selected : null} onClick={() => {
                setSelected(option)
                handleSelect(option)
            }}>{option}</button>)}
    </div>)
}

//trying something new here.
const FetchStocks = ({stock, viewOption, render}) => {
    const [stockData, setStockData] = useState([{}])
    const [requestError, setRequestError] = useState(null)

    const handleChange = (stock, viewOption) => {
        setRequestError(null)
        simpleGet(route(stock, viewOption))
            .then(stockData => setStockData(JSON.parse(stockData)))
            .catch(err => {
                console.log('ERROR');
                setRequestError(err)
            })
    }
    useEffect(() => {
        console.log('ran on stock change', stock)
        handleChange(stock, viewOption)
    }, [stock, viewOption])
    //[stock] is dependent value => rerender if changed

    return render(stockData, requestError)

}


//TODO Yup or Superstruct simple object validation
//I don't like this:
const uniformApiData = (iexData) => {
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


const Plotter = ({data, title}) => {
    const [trace, setTrace] = useState([{}])

    useEffect(() => {
        mapToTrace(data)
    }, [data])

    const mapToTrace = (data, params = {}) => {
        console.log(data, 'data')
        const info = uniformApiData(data)
        let trace = {}
        for (let key in info[0]) {

            trace[key] = info.map(d => {
                // console.log(key, d)
                return d[key]
            })
        }
        trace.x = trace.date;
        setTrace({...trace, ...params})
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

const ErrorCase = ({error}) => (error ?
    <section style={{color: "red", fontWeight: 'bold'}}>{`Stock doesn't exists: ${error}`}</section> : <> </>)


export default function App({defaultStock = 'aapl'}) {
    const [viewOption, setViewOption] = useState('1d')
    const [stock, setStock] = useState(defaultStock)
    const [temp, setTemp] = useState('')
    const [list, setList] = useState(listsViewOptions[0])


    return (
        <div className={'column-flex'}>
            <ToolBar handleSelect={setList} options={listsViewOptions}/>
            <ToolBar handleSelect={setViewOption} options={stockViewOptions}/>
            <FetchStocks viewOption={list} render={(topStocks, error) => (
                <>
                    <ErrorCase error={error}/>
                    <ToolBar handleSelect={setStock} options={topStocks.map(stock => stock.symbol)}/>
                </>

            )}/>
            <div>
                <input placeholder={'stock name'} onChange={(ev) => setTemp(ev.target.value)}/>
                <button onClick={() => setStock(temp)}>Find Stock</button>
            </div>

            <FetchStocks stock={stock} viewOption={viewOption} render={(apiData, error = null) => (
                <>
                    {console.log(apiData, 'apiData')}
                    <ErrorCase error={error}/>
                    {/*TODO performance && caching*/}
                    <Plotter data={uniformApiData(apiData)} title={viewOption + " " + stock}/>
                </>
            )}/>

        </div>
    );
}