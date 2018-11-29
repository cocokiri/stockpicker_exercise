//trying something new here.
import React, {useState, useEffect} from 'react'
import {route, simpleGet} from "../utils";

export default function FetchStocks({stock, viewOption, render}) {
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