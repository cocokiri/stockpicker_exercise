import React, {useState, useEffect} from 'react'
import './App.css';
import {toUniformApiData, stockViewOptions, listOptions} from "./utils";
import FetchStocks from './components/FetchStocks'
import ToolBar from './components/ToolBar'
import Plotter from './components/Plotter'


const ErrorCase = ({error}) => (
    <section style={{color: "red", fontWeight: 'bold'}}>{error && `Stock doesn't exists or List was empty: ${error}`}</section>)


export default function App({defaultStock = 'aapl'}) {
    const [viewOption, setViewOption] = useState('1d')
    const [stock, setStock] = useState(defaultStock)
    const [temp, setTemp] = useState('')
    const [list, setList] = useState(listOptions[0])

    return (
        <div className={'column-flex'}>
            <ToolBar handleSelect={setList} options={listOptions} preSelected={list}/>
            <ToolBar handleSelect={setViewOption} options={stockViewOptions} preSelected={viewOption}/>
            <FetchStocks viewOption={list} render={(topStocks, error = null) => (
                <>
                    <ErrorCase error={error || !topStocks.length ? "List empty" : null}/>
                    <ToolBar handleSelect={setStock}
                             options={topStocks.map(stock => stock.symbol)}
                    />
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
                    <Plotter data={toUniformApiData(apiData)} title={viewOption + " " + stock}/>
                </>
            )}/>

        </div>
    );
}