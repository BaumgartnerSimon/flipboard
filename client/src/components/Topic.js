import React from "react";
import Typography from "@material-ui/core/Typography";

export default class Topic extends React.Component {

    render() {
        return (
            <div style={{marginTop: this.props.selected ? '-7px' : '-7px', flexDirection: 'column', marginLeft: '12px', marginRight: '12px'}}>
                <Typography style={{fontSize: '20px', color: "white", fontWeight: 'bold', fontFamily: 'HelveticaNeueBold'}}>
                    {this.props.topic}
                </Typography>
                {this.props.selected &&
                    <div style={{marginTop: '-3px', backgroundColor: '#F52828', height: '3px'}} />
                }
            </div>
        );
    }
}
