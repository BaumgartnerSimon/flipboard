import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "../components/Paper";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import FlipIn from "../components/FlipIn";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            papers: [],
            load: false,
            refresh: false,
            page: 1,
            open: false,
            url: "",
            magazines: [],
        }
    }

    setRefresh = () => {
        this.setState({refresh: !this.state.refresh})
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

    getAbout = () => {
        axios.get('http://localhost:5000/about.json', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE ABOUT", res.data)
                if (res.data.success)
                    this.setState({maxFav: res.data.favorites})
            })
            .catch(err => {
                console.error(err)
            })
    }

    getPaper = (page) => {
        axios.get('http://localhost:5000/get_papers?page=' + page.toString(), {
            headers: {
                unique_login: localStorage.getItem(("id")),
            }
        })
            .then(res => {
                console.log("RESPONSE GET PAPER", res.data);
                console.log("RESPONSE GET PAPER SIZE", res.data.papers.length);
                this.setState({load: true, papers: res.data.papers})
            })
            .catch(err => {
                console.error(err)
            })
    }

    componentDidMount() {
        console.log('GETISLOGIN', localStorage.getItem("isLogin"))
        this.getPaper(1);
        this.getAbout();
        this.getMagazine();
        if (localStorage.getItem("id") === "") {
            this.props.history.push("/login")
        }
    }

    handleClose = () => {
        this.setState({open: false});
    }

    changePage = (event, value) => {
        this.setState({page: value})
        this.getPaper(value)
        window.scrollTo(0, 0)
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
                        FOR YOU
                    </Typography>
                    <Typography style={{marginTop: '10px', fontFamily: 'HelveticaNeueRegular', fontSize: '16px'}}>
                        The best of everything you follow
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
                    <Pagination page={this.state.page} count={10} onChange={this.changePage}/>
                </div>}
            </div>
        );
    }
}
