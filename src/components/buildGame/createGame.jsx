import React from "react";
import classes from './createGame.module.css'

const BuildGame = () => {
    return (
  
        <div className={classes.input}>
            <h1>Create Game</h1>
            <form>
                <label >Create Game</label>
                <input
                type="text"
                />
                <label htmlFor="age">No of players</label>
                <input            
                type="number"
                />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default BuildGame