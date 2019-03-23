import ReactDom from "react-dom"
import React, { Component } from "react"
import Grid from "f-grid"
import MediaQuery from "f-mediaquery"
import Music from "./music.mp3"

import { Button } from "antd"
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

import duix from "duix"

import MemberApp from "./member.jsx"
import MasterApp from "./master.jsx"

import Title from "./title"



class App extends Component {
    constructor() {
        super()
        this.state = {
            choice: null
        }
    }
    onChooseMember() {
     
        duix.set('choice', "member");
        this.setState({ choice: "member" }) //
    }
    onChooseMaster() {
   
        duix.set('choice', "master");
        this.setState({ choice: "master" })
    }
    componentDidMount() {
        var a = new Audio(Music);
        a.play()
    }
    render() {
        console.log(this.state.choice)
        if (this.state.choice == null) {
            let btnStyle = {
                fontSize: 25,
                padding: 5,
                paddingTop: 10,
                borderRadius: 5,
                height: 60,
            }
            return <Grid canvas>
                <Grid row center h v background="gray">
                    <Title />
                    <Grid row background="lightgray" width={300} height={160} style={{ borderRadius: 10, padding: 15 }}>
                        <Grid style={{ textAlign: "center" }} height={70} onClick={this.onChooseMaster.bind(this)}>
                            <div className="f-button" style={btnStyle}>
                                <p> Create Game </p>
                            </div>
                        </Grid>
                        <Grid style={{ textAlign: "center" }} height={70}>
                            <div className="f-button" style={btnStyle} onClick={this.onChooseMember.bind(this)}>
                                <p>Join Game</p>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        }
        else {
            return <Grid canvas>
                <MemberApp choice={this.state.choice} />
                <MasterApp choice={this.state.choice} />
            </Grid>
        }
    }
}




ReactDom.render(<App />, document.querySelector("#app"))
