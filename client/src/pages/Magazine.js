import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import Paper from "../components/Paper";
import Grid from "@material-ui/core/Grid";

export default function Profile(props) {
    const [load, setLoad] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    const [papers, setPapers] = React.useState([]);

    const getPapers = () => {
        axios.get('http://localhost:5000/get_flips_from_magazines?magazine_id=' + props.match.params.id.split(":")[1], {
            headers: {
                unique_login: localStorage.getItem(("id")),
            }
        })
            .then(res => {
                console.log("RESPONSE GET PAPER FROM MAGAZINE", res.data);
                setLoad(true);
                setPapers(res.data.flips);
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
        getPapers()
    }, []);

    return (
        <div>
            <div style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: '60px', maxWidth: '1142px'}}>
                <div style={{paddingTop: '64px', paddingBottom: '16px', marginRight: 'auto', flexDirection: 'row', display: 'flex', alignItems: "center"}}>
                    <Typography style={{marginLeft: '10px', fontSize: '30px', fontFamily: 'HelveticaNeueBold'}}>
                        {props.match.params.id.substring(0, props.match.params.id.indexOf(":")).toUpperCase()}
                    </Typography>
                </div>
                <Divider style={{marginBottom: '48px'}}/>
                {load && papers.map((element, index) => {
                    console.log('ELEMENT DE FLIPS')
                    if (index % 3 === 0) {
                        return (
                            <div key={index} style={{marginBottom: '50px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1142px'}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Paper refresh={refresh} setRefresh={setRefresh} paper={papers[index]}/>
                                    </Grid>
                                    {papers.length > 1 &&
                                    <Grid item xs={4}>
                                        <Paper refresh={refresh} setRefresh={setRefresh} paper={papers[index + 1]}/>
                                    </Grid>}
                                    {papers.length > 2 &&
                                    <Grid item xs={4}>
                                        <Paper refresh={refresh} setRefresh={setRefresh} paper={papers[index + 2]}/>
                                    </Grid>}
                                </Grid>
                            </div>
                        )
                    } else {
                        return null;
                    }})}
            </div>
        </div>
    );
}
