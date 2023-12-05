import './Communities.css';
import { React, useState } from 'react'
import data from "./Communites.json"

function Communities() {
    const tags = ["music","food","festival","fair","pop","metal","rock","country","alternative","r&b","rap","show","theatre"]

    return null;
}

function Search(props) {
    //create a new array by filtering the original array
    const filteredData = data.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the items which contain the user input
        else {
            return el.name.toLowerCase().includes(props.input)
        }
    })
    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    )
}
