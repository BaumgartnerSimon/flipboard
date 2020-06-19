import React, {useEffect} from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: '277px',
        width: 'auto',
    },
    avatar: {
        height: '37px',
        width: '37px',
        backgroundColor: 'black',
    },
}));


export default function Paper(props) {
    const classes = useStyles();

    const paperClick = (element) => {
        axios.post('http://localhost:5000/paper_click', {
            paper_id: element
        }, {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET CLICK", res.data)
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
    }, []);

    return (
        <div>
            <Card style={{ display: 'flex', flexDirection: 'column', elevation: 0, borderRadius: '0px', height: '666px'}}>
                <a onClick={() => paperClick(props.paper._id)} style={{textDecoration: 'none'}} rel="noopener noreferrer" href={props.paper.link} target="_blank">
                    {props.paper.image_link !== 'null' &&
                    <CardMedia
                        className={classes.media}
                        image={props.paper.image_link}
                        title="Paella dish"
                    />
                    }
                    {props.paper.image_link === 'null' &&
                    <div style={{display:'flex', justifyContent:"center", alignItems: "center", backgroundColor: '#F7F7F7', height: '277px', width: 'auto'}}>
                        <svg role="img" aria-labelledby="logo-icon-title logo-icon-desc" className="logo--icon" width="120"
                             height="120" viewBox="0 0 100 100" shapeRendering="crispEdges"><title
                            id="logo-icon-title">Flipboard</title>
                            <desc id="logo-icon-desc">Icon version of the Flipboard logo</desc>
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Flipboard_01_Lockup" fill="#666" fillRule="nonzero">
                                    <path
                                        d="M0,0 L0,100 L100,100 L100,0 L0,0 Z M80,40 L60,40 L60,60 L40,60 L40,80 L20,80 L20,20 L80,20 L80,40 Z"
                                        id="Shape"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                    }
                </a>
                <a style={{color: '#000', textDecoration: 'none'}} rel="noopener noreferrer" href={props.paper.link} target="_blank">
                    <CardContent>
                        <Typography style={{fontSize: '22px', fontFamily: 'TiemposHeadline', fontWeight: 600}} gutterBottom variant="h5" component="h2">
                            {props.paper.title}
                        </Typography>
                        <Typography style={{fontSize: '13px', fontFamily: 'AvenirNextMedium', fontWeight: 500, color: '#666'}}>
                            {props.paper.author}
                        </Typography>
                        <Typography style={{color: '#262626', marginTop: '16px', fontSize: '16px', fontFamily: 'AvenirNextMedium'}} variant="body2" color="textSecondary" component="p">
                            {props.paper.description}
                        </Typography>
                    </CardContent>
                </a>
                <CardActions style={{ marginTop: 'auto'}}>
                    <Typography style={{color: '#999', fontSize: '16px', fontWeight: '400'}}>
                        {props.paper.date_created}
                    </Typography>
                    <div style={{marginLeft: 'auto'}} >
                        <IconButton onClick={() => {
                            props.setUrl(props.paper.link);
                            props.setRefresh();
                            props.setOpen(true);
                        }} style={{marginLeft: '5px'}} size={'small'} aria-label="share">
                            <AddIcon style={{color :'#999'}}/>
                        </IconButton>
                    </div>
                </CardActions>
            </Card>
        </div>
    );
}
