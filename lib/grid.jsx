import React, { Component } from 'react'
import classNames from 'classnames'
//Import Generic Styles

export default class Grid extends Component {
    render() {
        let id = this.props.id || ""
        const {className, style, ...props} = this.props;
        let gridClass = classNames({
            'crust--grid--flex': true,
            'crust--grid--col': (this.props.col & !this.props.center) || (this.props.canvas && !this.props.col),
            'crust--grid--row': this.props.row & !this.props.center,
        });
        let gridStyle = {}
        if (this.props.background) {
            gridStyle.backgroundColor = this.props.background
        }
        //Change the background
        if (this.props.width) {
            gridStyle.flex = '0 0 auto'
            gridStyle.width = this.props.width
        }
        //Change the height
        if (this.props.height) {
            gridStyle.flex = '0 0 auto'
            gridStyle.height = this.props.height
        }
        if (this.props.canvas) {
            id = "crust--grid--canvas"
        }
        let _id = "?"
        if (this.props.id) {
            _id = this.props.id
        }
        
        
        let children = this.props.children
        if (this.props.center) {
            gridStyle.display = 'flex'
            //Check if the CENTER is
            if (this.props.v) {
                gridStyle.justifyContent = "center"
            }
            //Check if the CENTER is going to be centered HORIZONTALLY
            if (this.props.h) {
                gridStyle.alignItems = "center"
            }
            //Wrap it
            children = <div> {this.props.children} </div>
        }
        return (
            <div ref={this.props.gridRef} data-id={_id} className={classNames(gridClass, this.props.className)} id={id} style={{...gridStyle, ...this.props.style}} {...props}>{children}</div>
        )
    }
}