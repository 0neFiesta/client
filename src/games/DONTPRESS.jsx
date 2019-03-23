import React, { Component } from "react"
import Grid from "f-grid"
import duix from "duix"
export default class Game extends Component {
    constructor() {
        super()
        this.unsubscribe = []
        this.state = {
            random: false,
            done: false,
        }
    }
    random() {
        this.setState({ random: true })
    }
    reset() {
        this.setState({ random: false, done: false })
    }
    componentDidMount() {
        this.unsubscribe[1] = duix.subscribe('random', this.random.bind(this));
        this.unsubscribe[2] = duix.subscribe('reset', this.random.bind(this));
    }
    componentWillUnmount() {
        this.unsubscribe[1]();
        this.unsubscribe[2]();
    }
    onClick() {
        if (this.state.random == false) {
            this.setState({ score: 1 })
            this.props.setScore(1)
        } else {
            this.props.setScore(10)
        }
        this.setState({ done: true })
    }
    render() {
        if (this.state.done == false) {
            let background = "red"
            if (this.props.random) {
                background = "green"
            }
            if (this.props.game == "Don't Press") {
                return <Grid canvas>
                    <Grid canvas background="lightgray">
                        <Grid row center h v>
                            <Grid style={{ background, textAlign: "center", width: 400, height: 400, borderRadius: 15 }} onClick={this.onClick.bind(this)}>
                                «Press when green»
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        } else {
            if (this.props.game == "Don't Press") {
                return <Grid canvas >
                    <Grid row width={500} height={500} center v h style={{ padding: 50 }} onClick={this.onClick.bind(this)}>
                        You did it!
                    </Grid>
                </Grid >
            }
        }
        return null
    }
}