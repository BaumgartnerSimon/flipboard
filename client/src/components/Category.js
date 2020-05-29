import React from "react";
import Typography from "@material-ui/core/Typography";

export default class Category extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div style={{marginTop: this.props.selected ? '-0' : '-5px', flexDirection: 'column', marginLeft: '15px', marginRight: '15px'}}>
                <Typography style={{fontSize: '25px', color: "white", fontWeight: 'bold', fontFamily: 'HelveticaNeueBold'}}>
                    {this.props.category}
                </Typography>
                {this.props.selected &&
                    <div style={{backgroundColor: '#CC0000', height: '5px'}} />
                }
            </div>
        );
    }
}
