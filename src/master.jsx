import React, { Component, memo } from "react"
import duix from "duix"
import Grid from "f-grid"
import io from "socket.io-client"
import _default from "antd/lib/notification";
let ip = "localhost:35575"
import Title from "./title"


export default class MemberApp extends Component {
    constructor() {
        super()
        this.state = {
            pin: null,
            state: "WAITING",
            timer: 5,
            totalGames: 0,
            scores: {
                now: {},
                users: {}
            },
            winnerName: "?",
            winnerAmount: 0,
            nextGame: false
        }
    }
    /**
     * Did this react component mount
     */
    componentDidMount() {
        //Make a local reference of this object
        let _ = this

        //Creat the socket handler
        this.coreSocket = io.connect(`http://${ip}/core/`)
        //Connection of code
        this.coreSocket.on("connect", () => {
            this.coreSocket.emit("isMaster")
            this.coreSocket.on("master_pin", (data) => {
                let pin = data.pin
                _.setState({ pin })
            })
            this.coreSocket.on("master_users", (data) => {
                console.log(data.users)
            })
            this.coreSocket.on("master_totalGames", (data) => {
                _.setState({ totalGames: data.amount })
            })
            this.coreSocket.on("master_preview", (data) => {
                let _ = this
                _.setState({ state: "PREVIEW", gameName: data.game, gameOn: data.number })
                let timer = 2
                let timerInstance = setInterval(() => {
                    timer--
                    _.setState({ timer })
                    if (timer == 0) {
                        clearInterval(timerInstance)
                        _.setState({ state: "DASHBOARD", timer: 15 })
                        this.coreSocket.emit("master_startGame")
                    }
                }, 1000)
            })
            this.coreSocket.on("master_updateScores", (data) => {
                let scores = data.scores
                _.setState({ scores })
            });
            this.coreSocket.on("master_startGame", () => {
                let timer = 15
                let nextGame = () => {
                    timer = 5
                    let timerInstance = setInterval(() => {
                        timer--
                        _.setState({ timer })
                        if (timer < 0) {
                            clearInterval(timerInstance)
                            _.setState({ state: "DASHBOARD", timer: 10, nextGame: false, })
                            this.coreSocket.emit("master_begin")
                        }
                    }, 1000)
                }
                let timerInstance = setInterval(() => {
                    timer--
                    _.setState({ timer })
                    if (timer == 1) {
                        clearInterval(timerInstance)
                        _.setState({ state: "DASHBOARD", nextGame: true })
                        this.coreSocket.emit("master_stopGame")
                        nextGame()
                    }
                }, 1000)
            })
            this.coreSocket.on("master_winner", (data) => {
                let score = data.score
                let name = data.name
                _.setState({ state: "WINNER", timer: 10, winnerName: name, winnerAmount: score })
            })
        });
    }
    componentWillUnmount() {
        this.coreSocket.close()
    }
    onStart() {
        this.coreSocket.emit("master_begin")
    }
    renderScoresNow() {
        let items = []
        for (let users in this.state.scores.now) {
            let name = this.state.scores.now[users].name
            let score = this.state.scores.now[users].score
            items.push(<Grid col height={10}>
                <Grid style={{ fontWeight: "bold" }}>{name}</Grid>
                <Grid> {score}</Grid>
            </Grid>)
        }
        return items
    }
    renderScoresAll() {
        let items = []
        for (let users in this.state.scores.users) {
            let name = this.state.scores.users[users].name
            let score = this.state.scores.users[users].score
            items.push(<Grid col height={10}>
                <Grid style={{ fontWeight: "bold" }}>{name}</Grid>
                <Grid> {score}</Grid>
            </Grid>)
        }
        return items
    }
    render() {
        let btnStyle = {
            fontSize: 60,
            padding: 5,
            paddingTop: 5,
            borderRadius: 5,
            height: 100,
        }
        let pinStyle = btnStyle
        pinStyle.fontWeight = "bold"

        let nextGame = "none"
        if (this.state.nextGame == true) {
            nextGame  = ""
        }
        if (this.props.choice == "master") {
            if (this.state.state == "WAITING") {
                return <Grid canvas>
                    <Grid row center h v background="gray">
                        <Grid row background="lightgray" width={500} height={240} style={{ borderRadius: 10, padding: 15 }}>
                            <Grid height={100} style={{ textAlign: "center", marginBottom: 15 }}>
                                <div className="f-button" style={pinStyle}>
                                    <p>{this.state.pin}</p>
                                </div>
                            </Grid>
                            <Grid style={{ textAlign: "center" }} height={100}>
                                <div className="f-button" style={btnStyle} onClick={this.onStart.bind(this)}>
                                    <p>Begin Game</p>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            else if (this.state.state == "PREVIEW") {
                return <Grid canvas>
                    <Grid row center h v background="lightgray">
                        <Grid row background="lightgray" width={500} height={240} style={{ borderRadius: 10, padding: 15 }}>
                            <Grid height={100} style={{ textAlign: "center", marginBottom: 15 }}>
                                <p style={{ fontSize: 70, fontWeight: "bold" }}>{this.state.timer}</p>
                            </Grid>
                            <Grid height={100} style={{ textAlign: "center", marginBottom: 15 }}>
                                <p style={{ fontSize: 70, fontWeight: "bold" }}>{this.state.gameName}</p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            else if (this.state.state == "DASHBOARD") {
                return <Grid canvas>
                    <Grid row center h v background="lightgray">
                        <Grid col style={{ borderRadius: 10 }}>
                            <Grid width={100} background="#FF5858" style={{ fontSize: 50, fontWeight: "bold", textAlign: "center", borderRadius: 10, marginLeft: 10, marginRight: 50 }}>
                                {this.state.timer}
                            </Grid>
                            <Grid width={500} center style={{ textAlign: "center", fontSize: 50, fontWeight: "bold", textAlign: "center" }} background="#ffA358">
                                {this.state.gameName}
                            </Grid>
                        </Grid>
                        <Grid col background="lightgray" width={800} height={400} style={{ borderRadius: 10, padding: 15 }}>
                            <Grid row background="#53F1F1" style={{ borderTopLeftRadius: 10 }}>
                                <Grid height={30} style={{ textAlign: "center", fontSize: 24 }}>Scores for this round</Grid>
                                {this.renderScoresNow()}
                            </Grid>
                            <Grid row background="#55F855" style={{ borderTopRightRadius: 10 }}>
                                <Grid height={30} style={{ textAlign: "center", fontSize: 24 }}>Scores for everything</Grid>
                                {this.renderScoresAll()}
                            </Grid>
                        </Grid>
                        <Grid col background="lightgray" height={100} background="green" style={{display: nextGame, fontSize: 60, textAlign: "center", borderRadius: 10 }}>
                            <span style={{ textAlign: "center" }}>Next game starting soon!</span>
                        </Grid>
                    </Grid>
                </Grid>
            } else if (this.state.state == "WINNER") {
                return <Grid canvas>
                    <Grid row center h v background="lightgray">
                        <Grid col style={btnStyle}><span style={{color: "green", textDecoration: "underline"}}>WINNER IS!</span></Grid>
                        <Grid col style={btnStyle}><span style={{color: "red"}}> {this.state.winnerName}</span></Grid>
                        <Grid col style={btnStyle}>SCORE: {this.state.winnerAmount}</Grid>
                    </Grid>
                </Grid>

            }
        }
        return null

    }
}