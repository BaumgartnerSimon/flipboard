import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Category from "./Category";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{flexGrow: 1}}>
                <AppBar style={{height: '70px', backgroundColor: 'black'}} elevation={2} position="fixed">
                    <Toolbar>
                        <Link
                            onClick={() => this.props.history.push("/home")}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                style={{marginLeft: '-36px'}}
                            >
                                <img src={'./logoFlip70.png'}/>
                            </IconButton>
                        </Link>
                        {this.props.categories.map((element, ind) => {
                            return (
                                <IconButton key={ind} style={{marginLeft: '-10px', marginRight: '-10px'}} onClick={() => this.props.handleCategory(ind)}>
                                    <Category selected={element[1]} category={element[0]}/>
                                </IconButton>
                            );
                        })}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
