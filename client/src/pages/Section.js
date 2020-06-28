import React from "react";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Paper from "../components/Paper";
import Pagination from "@material-ui/lab/Pagination";
import FlipIn from "../components/FlipIn";

export default class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            papers: [],
            load: false,
            refresh: false,
            update: false,
            page: 1,
            open: false,
            url: "",
            magazines: [],
            nbPages: 10
        }
    }

    setRefresh = () => {
        this.setState({refresh: !this.state.refresh})
    }

    getPapers = (fav, page) => {
        console.log('JOIGHAEOIGA', this.state.page.toString())
        axios.get('http://localhost:5000/get_papers?favorite='+ this.props.match.params.id +'&page=' + page.toString(), {
            headers: {
                unique_login: localStorage.getItem(("id")),
                favorite: fav
            }
        })
            .then(res => {
                console.log("RESPONSE GET PAPER", res.data);
                this.setState({load: true, papers: res.data.papers, nbPages: res.data.nb_pages})
            })
            .catch(err => {
                console.error(err)
            })
    }

    componentDidMount() {
        this.getPapers(this.props.match.params.id, 1)
        console.log(this.props.match.params.id, 1)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState({page: 1})
            this.getPapers(this.props.match.params.id, 1)
        }
        console.log("UPDATE")
    }

    getMagazine = () => {
        axios.get('http://localhost:5000/get_magazines', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET MAGAZINES", res.data);
                this.setState({magazines: res.data.private_magazines})
            })
            .catch(err => {
                console.error(err)
            })
    }

    changePage = (event, value) => {
        this.setState({page: value})
        this.getPapers(this.props.match.params.id, value)
        window.scrollTo(0, 0)
    }
    handleClose = () => {
        this.setState({open: false});
    }

    setUrl = (url) => {
        this.setState({url : url})
    }

    setOpen = (open) => {
        this.getMagazine()
        this.setState({open: open})
    }

    render() {
        return (
            <div>
                <FlipIn magazines={this.state.magazines} refresh={this.state.refresh} open={this.state.open} url={this.state.url} handleClose={this.handleClose}/>
                <div style={{flexDirection: 'column', display: "flex",alignItems: 'center', justifyContent: "center", marginTop: '156px', marginBottom: '144px'}}>
                    <Typography style={{fontWeight: 900, fontFamily: 'HelveticaNeueBold', fontSize: '30px'}}>
                        {this.props.match.params.id.toUpperCase()}
                    </Typography>
                    <Typography style={{marginTop: '10px', fontFamily: 'HelveticaNeueRegular', fontSize: '16px'}}>
                        {`Featuring stories about #${this.props.match.params.id}`}
                    </Typography>
                </div>
                {this.state.load && this.state.papers.map((element, index) => {
                    if (index % 3 === 0) {
                        return (
                            <div key={index} style={{marginBottom: '50px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1142px'}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Paper setOpen={this.setOpen} setUrl={this.setUrl} refresh={this.state.refresh} setRefresh={this.setRefresh} paper={this.state.papers[index]}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper setOpen={this.setOpen} setUrl={this.setUrl} refresh={this.state.refresh} setRefresh={this.setRefresh} paper={this.state.papers[index+1]}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper setOpen={this.setOpen} setUrl={this.setUrl} refresh={this.state.refresh} setRefresh={this.setRefresh} paper={this.state.papers[index+2]}/>
                                    </Grid>
                                </Grid>
                            </div>
                        )
                    } else {
                        return null;
                    }})}
                {this.state.load &&
                <div style={{marginBottom: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Pagination page={this.state.page} count={this.state.nbPages} onChange={this.changePage}/>
                </div>}
            </div>
        );
    }
}
