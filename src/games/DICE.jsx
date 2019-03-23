import React, { Component } from "react"
import Grid from "f-grid"
import duix from "duix"
export default class Game extends Component {
    constructor() {
        super()
        this.unsubscribe = []
        this.state = {
            rolled: false,
            score: 0,
            done: false,

            userNum: 0,
            compNum: 0,
        }
    }
    random() {
        this.setState({ random: true })
    }
    reset() {
        this.setState({ rolled: false, done: false, score: 0 })
    }
    componentDidMount() {
        this.unsubscribe[1] = duix.subscribe('random', this.random.bind(this));
        this.unsubscribe[2] = duix.subscribe('reset', this.random.bind(this));
    }
    componentWillUnmount() {
        this.unsubscribe[0]();
        this.unsubscribe[1]();
        this.unsubscribe[2]();
    }
    onClick() {
        var userNum = Math.floor((Math.random() * 10) + 1);
        var compNum = Math.floor((Math.random() * 10) + 1);

        this.setState({ userNum, compNum })
        if (userNum <= compNum && this.state.rolled == false) {
            let score = 0
            this.setState({ score, rolled: true })
            this.props.setScore(score)
        } else {
            let score = 5
            this.setState({ score, rolled: true })
            this.props.setScore(score)
        }
        setInterval(() => {
            this.setState({ done: true })
        }, 2000)
    }
    renderButtons() {
        if (this.state.rolled) {
            return <Grid col>
                <Grid>{this.state.userNum}</Grid>
                <Grid>{this.state.compNum}</Grid>
            </Grid>
        } else {
            return <Grid col>
                <Grid>? (1)</Grid>
                <Grid>? (2)</Grid>
            </Grid>
        }
    }
    render() {
        if (this.state.done == false) {
            if (this.props.game == "Dice") {
                return <Grid canvas>
                    <Grid row center h v background="lightgray">
                        <Grid row style={{ borderRadius: 10 }}>
                            {this.renderButtons()}}
                            <Grid><Button onClick={this.onClick.bind(this)}>Roll</Button></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        } else {
            if (this.props.game == "Dice") {

                return <Grid canvas>
                    <Grid row center h v background="lightgray">
                        <Grid row style={{ borderRadius: 10 }}>
                            You have already rolled           
                        </Grid>
                    </Grid>
                </Grid>
            }
        }

    }
}