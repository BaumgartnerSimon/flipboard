import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    item: {
        fontFamily: 'HelveticaNeueBold',
        fontSize: '25px'
    }
}


class TopicList extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <div>
                <List component="nav" aria-label="topic list">
                        {this.props.topics.map((element, index) => {
                            return (
                                <ListItem key={index} onClick={() => {
                                    this.props.setClickedTopic(element);
                                    this.props.setSelectedTopic(true);
                                    this.props.handleDrawerState();
                                }} button>
                                    <ListItemText
                                        classes={{primary: classes.item}}
                                        primary={`#${element.toUpperCase()}`} />
                                </ListItem>
                            );
                        })}

                </List>
            </div>
        )
    }
}

export default withStyles(styles)(TopicList);
