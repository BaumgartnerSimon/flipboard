import React from "react";
import TopBar from "../components/TopBar";
import Typography from "@material-ui/core/Typography";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [['FOR YOU', true], ['MUSIC', false], ['TECHNOLOGY', false]],
            category: "FOR YOU"
        }
    }

    handleCategory = (index) => {
        const cpy = this.state.categories.slice()
        for(let i = 0; this.state.categories[i]; i++) {
            cpy[i][1] = false
        }
        cpy[index][1] = true;
        this.setState({categories: cpy, category: cpy[index][0]})
    };

    render() {
        return (
            <div>
                <TopBar handleCategory={this.handleCategory} categories={this.state.categories}/>
                <div style={{flexDirection: 'column', display: "flex",alignItems: 'center', justifyContent: "center", marginTop: '170px'}}>
                    <Typography style={{fontFamily: 'HelveticaNeueBold', fontSize: '40px'}}>
                        {this.state.category}
                    </Typography>
                    <Typography style={{fontFamily: 'HelveticaNeueRegular', fontSize: '20px'}}>
                        The best of what you follow
                    </Typography>
                </div>
            </div>
        );
    }
}
