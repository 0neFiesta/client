import React, { Component } from "react"
import Grid from "f-grid"
import duix from "duix"


import waterS from "./waterS.png"
import water from "./water.png"
import waterU from "./waterU.png"



export default class Game extends Component {
    constructor() {
        super()
        this.unsubscribe = []
    }
    stop() {

    }
    componentDidMount() {
        this.unsubscribe[0] = duix.subscribe('stop', this.stop.bind(this));
        var audio = new Audio('airhorn.mp3');

        let _ = this
        this.game = () => { }
        function init() {
            var stage = new createjs.Stage("demoCanvas");
            var width = 800;
            var height = 600;
            var success = 1;


            //table
            var rect = new createjs.Shape();
            rect.graphics.beginFill("Brown").drawRect(0, height / 2, width, 10);
            stage.addChild(rect);




            //bottle
            var bitmap = new createjs.Bitmap(water);
            bitmap.setTransform(width / 2, height / 3, .25, .25);
            stage.addChild(bitmap);

            createjs.Tween.get(bitmap);


            //click bar
            var bar = new createjs.Shape();
            bar.graphics.beginFill("Blue").drawRect(0, height - 60, width, 30)
            bar.x;
            bar.y;
            bar.scaleX = 1;
            stage.addChild(bar);

            var barR = new createjs.Shape();
            barR.graphics.beginFill("Red").drawRect(0, height - 30, width, 30)
            stage.addChild(barR);

            var barR = new createjs.Shape();
            barR.graphics.beginFill("Yellow").drawRect(width / 8 * 3, height - 30, width / 4, 30)
            stage.addChild(barR);

            var barG = new createjs.Shape();
            barG.graphics.beginFill("Green").drawRect(width / 32 * 15, height - 30, width / 16, 30)
            stage.addChild(barG);

            createjs.Tween.get(bar, { loop: true })
                .to({ scaleX: 0 }, 3000, createjs.Ease.getPowInOut(4))
                .to({ scaleX: 1 }, 3000, createjs.Ease.getPowInOut(4));

            _.game = function () {
                createjs.Tween.get(bar, { override: true }).to({}, 0)


                if (bar.scaleX < .53 && bar.scaleX > .47) {
                    success = 2;
                    audio.play();
                   //alert("2")
                    _.props.setScore(20)
                } else if (bar.scaleX < .63 && bar.scaleX > .37) {
                    success = 1;
                    //alert("1")
                    _.props.setScore(10)
                } else {
                    //lert("0")
                    success = 0;
                    _.props.setScore(0)
                }

                if (success === 1) {
                    createjs.Tween.get(bitmap, { override: true }).to({ rotation: 360 * 4, y: 27 }, 2000, createjs.Ease.getPowInOut(4));
                } else if (success === 2) {
                    //bottleUpsideDownShadow
                    var bitmapU = new createjs.Bitmap(waterU);
                    bitmapU.setTransform(width / 2, height / 3, .25, .25);
                    stage.addChild(bitmapU);

                    createjs.Tween.get(bitmap).to({ alpha: 0, visible: false })
                    createjs.Tween.get(bitmapU).to({ rotation: 360 * 4 + 180, y: 300 }, 3000, createjs.Ease.getPowInOut(4));
                } else {
                    //bottleUpsideDownShadow
                    var bitmapS = new createjs.Bitmap(waterS);
                    bitmapS.setTransform(width / 2, height / 3, .25, .25);
                    stage.addChild(bitmapS);

                    createjs.Tween.get(bitmap).to({ alpha: 0, visible: false });
                    createjs.Tween.get(bitmapS).to({ rotation: 360 * 4 + 90, y: 206 }, 2000, createjs.Ease.getPowInOut(4));
                }
            }

            createjs.Ticker.setFPS(60);
            createjs.Ticker.addEventListener("tick", stage);
        }
        init()

    }
    componentWillUnmount() {
        this.unsubscribe[0]();
    }
    onClick() {
        this.game()
    }
    render() {
        let display = "none"
        if (this.props.game == "Bottle Flip") {
            display = ""
        }
        return <Grid col width={500} height={500} center v h style={{ padding: 50, display }} onClick={this.onClick.bind(this)}>
            <Grid style={{textAlign: "center", width: 400, height: 400, borderRadius: 15 }}>
                <canvas id="demoCanvas" width="800" height="600"></canvas>
            </Grid>
        </Grid>

    }
}