//trying something new here.
import React, {useState, useEffect} from 'react'


const style = {
    selected: {
        background: "cyan",
        color: "white",
        fontWeight: "bold"
    }
}
export default function ToolBar({handleSelect, options, preSelected=null}) {
    const [selected, setSelected] = useState(preSelected)


    return (<div>
        {options
            .map(option => <button style={selected === option ? style.selected : null} onClick={() => {
                setSelected(option)
                handleSelect(option)
            }}>{option}</button>)}
    </div>)
}
