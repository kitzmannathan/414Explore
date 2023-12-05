import './Communities.css';
import { React, useState } from 'react'
import data from "./Communites.json"
import TextField from "@mui/material/TextField";

function Communities() {
    const [inputText, setInputText] = useState("");
    let inputHandler = (e) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };
    // TEXT FIELD TBD
    return (
        <div className="main">
            <h1>Communities</h1>
            <div className="search">
                <TextField
                    id="outlined-basic"
                    onChange={inputHandler}
                    variant="outlined"
                    fullWidth
                    label="Search"
                />
            </div>
            <Communities input={inputText} />
            <div className="card-container">
                {data.map((item) => (
                    <div key={item.name} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">Number of Members: {item.numberOfMembers}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// CURRENTLY UNUSED
function Search(props) {
    //create a new array by filtering the original array
    const filteredData = data.filter((el) => {
        if (props.input === '') {
            return el.name !== undefined && el.name !== null;
        } else {
            return el.name.toLowerCase().includes(props.input.toLowerCase());
        }
    })
    return (
        <div className="card-container">
            {filteredData.map((item) => (
                <div key={item.name} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">Number of Members: {item.numberOfMembers}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
