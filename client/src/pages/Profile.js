import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import {AccountCircle} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CreateMagazine from "../components/CreateMagazine";
import {Redirect} from "react-router-dom";

export default function Profile() {
    const [sectionUrl, setSectionUrl] = React.useState("");
    const [magazineUrl, setMagazineUrl] = React.useState("");
    const [magazineId, setMagazineId] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [section, setSection] = React.useState(false);
    const [magazine, setMagazine] = React.useState(false);
    const [favorites, setFavorites] = React.useState([]);
    const [magazines, setMagazines] = React.useState([]);

    const getFavorites = () => {
        axios.get('http://localhost:5000/get_favorites', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET FAV", res.data);
                if (res.data.success) {
                    setFavorites(res.data.favorites)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const getUsername = () => {
        axios.get('http://localhost:5000/get_username', {
            headers: {
                unique_login: localStorage.getItem(("id"))
            }
        })
            .then(res => {
                console.log("RESPONSE GET FAV", res.data);
                if (res.data.success) {
                    setUsername(res.data.username)
                }
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
                setLoad(true)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleCreateClose = () => {
        getMagazine();
        setOpen(false)
    }

    const renderRedirect = () => {
        if (section) {
            return (
                <Redirect
                    to={`/section/${sectionUrl}`}
                />
            );
        } else if (magazine) {
            return (
                <Redirect
                    to={{
                        pathname: `/magazine/${magazineUrl}:${magazineId}`,
                    }}
                />
            );
        }
    };

    useEffect(() => {
        getMagazine();
        getFavorites();
        getUsername();
    }, []);

    return (
        <div>
            <CreateMagazine open={open} handleCreateClose={handleCreateClose}/>
            <div style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: '60px', maxWidth: '1142px'}}>
                <div style={{paddingTop: '64px', paddingBottom: '16px', marginRight: 'auto', flexDirection: 'row', display: 'flex', alignItems: "center"}}>
                    <AccountCircle style={{ width: '90px', height: '90px'}}/>
                    <Typography style={{marginLeft: '10px', fontSize: '30px', fontFamily: 'HelveticaNeueBold'}}>
                        {username}
                    </Typography>
                </div>
                <Divider style={{marginBottom: '48px'}}/>
                {load &&
                <div>
                    <Typography style={{
                        marginBottom: '5px',
                        fontSize: '22px',
                        fontFamily: 'HelveticaNeueBold'
                    }}>MAGAZINES</Typography>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Card onClick={() => setOpen(true)}
                              style={{width: '150px', height: '150px', backgroundColor: "#999"}}>
                            <CardContent>
                                <Typography style={{
                                    marginLeft: '-7px',
                                    marginTop: '-7px',
                                    color: 'white',
                                    fontSize: '17px',
                                    fontFamily: 'HelveticaNeueBold',
                                    fontWeight: 600
                                }} gutterBottom variant="h5" component="h2">
                                    MAKE A NEW MAGAZINE...
                                </Typography>
                                <Typography style={{
                                    marginLeft: '-7px',
                                    marginTop: '30px',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontFamily: 'AvenirNextMedium',
                                    fontWeight: 500
                                }}>
                                    Read, collect and share stories about something you love
                                </Typography>
                            </CardContent>
                        </Card>
                        {magazines.map((element, index) => {
                            return (
                                <Card key={index}
                                      onClick={() => {
                                          setMagazine(true);
                                          setMagazineUrl(element.title)
                                          setMagazineId(element._id)
                                      }}
                                      style={{
                                    marginLeft: '10px',
                                    width: '150px',
                                    height: '150px',
                                    backgroundColor: "#AB1C1C"
                                }}>
                                    <CardContent>
                                        <Typography style={{
                                            color: 'white',
                                            fontSize: '16px',
                                            fontFamily: 'HelveticaNeueBold',
                                            fontWeight: 600
                                        }} gutterBottom variant="h5" component="h2">
                                            {element.title.toUpperCase()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                    <div style={{marginTop: '50px'}}>
                        <Typography style={{
                            marginBottom: '5px',
                            fontSize: '22px',
                            fontFamily: 'HelveticaNeueBold'
                        }}>FAVORITES</Typography>
                        <div style={{marginLeft: '-10px', display: 'flex', flexDirection: 'row'}}>
                            {favorites.map((element, index) => {
                                return (
                                    <Card key={index}
                                        onClick={() => {
                                        setSection(true);
                                        setSectionUrl(element)
                                    }} style={{
                                        marginLeft: '10px',
                                        width: '150px',
                                        height: '150px',
                                        backgroundColor: "black"
                                    }}>
                                        <CardContent>
                                            <Typography style={{
                                                color: 'white',
                                                fontSize: '16px',
                                                fontFamily: 'HelveticaNeueBold',
                                                fontWeight: 600
                                            }} gutterBottom variant="h5" component="h2">
                                                {element.toUpperCase()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </div>
                }
            </div>
            {renderRedirect()}
        </div>
    );
}
