import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Paper from "../components/Paper";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import FlipIn from "../components/FlipIn";

export default function Topic(props) {
    const [load, setLoad] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    const [papers, setPapers] = React.useState([]);
    const [page, setPage] = React.useState([]);
    const [magazines, setMagazines] = React.useState([]);
    const [url, seturl] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [nbPages, setNbPages] = React.useState(10)

    const getPapers = (page) => {
        axios.get('http://localhost:5000/get_papers_from_topic?favorite='+ props.match.params.id +'&page=' + page.toString(), {
            headers: {
                unique_login: localStorage.getItem(("id")),
            }
        })
            .then(res => {
                console.log("OUI LE LIEN", 'http://localhost:5000/get_papers_from_topic?favorite='+ props.match.params.id +'&page=' + page.toString());
                console.log("RESPONSE GET PAPER", props.match.params.id,  res.data);
                console.log("NBPAGES", res.data.nb_pages);
                setPapers(res.data.papers);
                setLoad(true);
                setLoaded(true);
                setNbPages(res.data.nb_pages)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const getMagazine = () => {
        axios.get('http://localhost:5000/get_magazines', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET MAGAZINES", res.data);
                setMagazines(res.data.private_magazines);
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
        setLoad(false);
        getPapers(1)
        console.log("AAAAAAAAAAA", papers);
    }, [props.match.params.id]);

    const changePage = (event, value) => {
        setPage(value);
        getPapers(value);
        window.scrollTo(0, 0)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const setTopicUrl = (url) => {
        seturl(url);
    }

    const setTopicOpen = (open) => {
        getMagazine();
        setOpen(open)
    }

    return (
        <div>
            <FlipIn magazines={magazines} refresh={refresh} open={open} url={url} handleClose={handleClose}/>
            <div style={{flexDirection: 'column', display: "flex",alignItems: 'center', justifyContent: "center", marginTop: '156px', marginBottom: '144px'}}>
                <Typography style={{fontWeight: 900, fontFamily: 'HelveticaNeueBold', fontSize: '30px'}}>
                    #{props.match.params.id.toUpperCase()}
                </Typography>
            </div>
            {load && papers.map((element, index) => {
                if (index % 3 === 0) {
                    return (
                        <div key={index} style={{marginBottom: '50px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1142px'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Paper setOpen={setTopicOpen} setUrl={setTopicUrl} refresh={refresh} setRefresh={setRefresh} paper={papers[index]}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper setOpen={setTopicOpen} setUrl={setTopicUrl} refresh={refresh} setRefresh={setRefresh} paper={papers[index + 1]}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper setOpen={setTopicOpen} setUrl={setTopicUrl} refresh={refresh} setRefresh={setRefresh} paper={papers[index + 2]}/>
                                </Grid>
                            </Grid>
                        </div>
                    )
                } else {
                    return null;
                }})}
            {load &&
            <div style={{marginBottom: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Pagination page={page} count={nbPages} onChange={changePage}/>
            </div>}
        </div>
    );
}
