import React, {Component} from "react"
import Grid from "f-grid"
import mustache from "./mustache.png"
import hat from "./hat.png"


export default class Title extends Component {
    constructor() {
        super() 
    }
    render() {
        return <Grid style={{marginBottom: 30}}>
            <img src={hat} style={{width: 300, height: 200}}/> 
            <div className="title"><span className="one">One</span>Fiesta</div>
            <img src={mustache} alt="mustache" style={{width: 300, height: 80}} />
        </Grid>
    }
}


