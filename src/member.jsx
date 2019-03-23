import React, { Component } from "react"
import duix from "duix"
import Grid from "f-grid"
import io from "socket.io-client"
import { Input, Spin, Icon } from "antd"

import DontPress from "./games/DONTPRESS"
import BottleFlip from "./games/BOTTLEFLIP"
import Dice from "./games/DICE"
import Title from "./title"



import loaderSpinner from "./loader.svg"
let ip = "localhost:35575"

export default class MemberApp extends Component {
    constructor() {
        super()
        this.state = {
            pinValue: null,
            pinInvalid: false,
            nameValue: null,
            state: "CONNECT",
            random: false
        }
    }
    componentDidMount() {
        //Make a local reference of this object
        let _ = this
        //Creat the socket handler
        this.coreSocket = io.connect(`http://${ip}/core/`)
        //Connection of code
        this.coreSocket.on("connect", () => {
            this.coreSocket.emit("isMember")
            //When the pin for the client is valid
            this.coreSocket.on("member_success", () => {
                //SET VISUAL STATE TO NAME (get user name)
                _.setState({ state: "NAME" })
            })
            //When a client enters the invalid pin
            this.coreSocket.on("member_invalidPin", () => {
                alert("INVALID PIN")
                _.setState({ pinInvalid: true })
            })
            //Wait for the MASTER to start the game
            this.coreSocket.on("member_waiting", () => {
                duix.set("stop", false)
                _.setState({ state: "WAITING", random: false })
            })
            this.coreSocket.on("member_startGame", (data) => {
                console.log(data)
                _.setState({ state: "GAME", game: data.game })
            })
            this.coreSocket.on("member_stopGame", (data) => {
                duix.set("stop", true)
                duix.set("reset", true)
                _.setState({ state: "WAITING", random: false })
            })

            this.coreSocket.on("member_randomStartGame", () => {
                duix.set("random", true)
                _.setState({ random: true })
            })
            this.coreSocket.on("member_winner", () => {
                _.setState({ state: "WIN" })
            })
        });
    }
    /**
     * onEnterPin - When the input enters a pin.
     * @param {Object} event 
     */
    onEnterPin(event) {
        this.setState({ pinValue: event.target.value })
    }
    onEnterName(event) {
        this.setState({ nameValue: event.target.value })
    }
    /**
     * onConnect - When the connect button is clicked send the pin value
     */
    onConnect() {
        this.coreSocket.emit("member_validatePin", { pin: this.state.pinValue })
    }

    /**
     *  when set name button is clicked, send name
     */
    onSetName() {
        this.coreSocket.emit("member_setName", { name: this.state.nameValue })
    }
    setScore(score) {
        console.log("SENDING SCORE: " + score)
        this.coreSocket.emit("member_sendscore", { score })
    }
    render() {
        if (this.props.choice == "member") {
            let btnStyle = {
                fontSize: 25,
                padding: 5,
                paddingTop: 10,
                borderRadius: 5,
                height: 60,
            }
            if (this.state.state == "CONNECT") {
                return <Grid canvas>
                    <Grid row center h v background="gray">
                        <Title />
                        <Grid row background="lightgray" width={300} height={160} style={{ borderRadius: 10, padding: 15 }}>
                            <Grid style={{ textAlign: "center" }} height={70}>
                                <Input value={this.state.pinValue} placeholder="Enter Pin" onInput={this.onEnterPin.bind(this)} />
                            </Grid>
                            <Grid style={{ textAlign: "center" }} height={70}>
                                <div className="f-button" style={btnStyle} onClick={this.onConnect.bind(this)}>
                                    <p>Connect</p>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            } else if (this.state.state == "NAME") {
                return <Grid canvas>
                    <Grid row center h v background="gray">
                        <Grid row background="lightgray" width={300} height={160} style={{ borderRadius: 10, padding: 15 }}>
                            <Grid style={{ textAlign: "center" }} height={70}>
                                <Input value={this.state.nameValue} placeholder="Enter Name" onInput={this.onEnterName.bind(this)} />
                            </Grid>
                            <Grid style={{ textAlign: "center" }} height={70}>
                                <div className="f-button" style={btnStyle} onClick={this.onSetName.bind(this)}>
                                    <p>Set Name</p>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            } else if (this.state.state == "WAITING") {
                return <Grid canvas background="lightgray">
                    <Grid row center h v>
                        <img style={{ width: 100, height: 100 }} src={loaderSpinner} />
                    </Grid>
                </Grid>
            } else if (this.state.state == "GAME") {
                return <Grid canvas background="lightgray">
                    <DontPress game={this.state.game} random={this.state.random} setScore={this.setScore.bind(this)} />
                    <BottleFlip game={this.state.game} random={this.state.random} setScore={this.setScore.bind(this)} />
                </Grid>
            } else if (this.state.state == "WIN") {
                return <Grid canvas background="lightgray">
                    <Grid row center h v>
                        <h1> Game has ended! Sorry for your misery.</h1>
                    </Grid>
                </Grid>
            }

            return null
        }
        return null
    }

}