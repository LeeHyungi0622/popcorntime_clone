import React, { useState, useEffect } from "react";
import { moviesApi, tvApi } from "../../api";
import styled from "styled-components";
import Loader from "../../Components/Loader";
import {Link, Route} from "react-router-dom";
import Companies from "./Companies";
import Overview from "./Overview";
import Countries from "./Countries";
import Seasons from "./Seasons";

const Container = styled.div`
  /* 100vh(viewport width)에서 맨위에 표시된 Navigation bar의 높이를 빼준다. */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 50px;
`;

// image에 흐릿한 Blur 효과를 주기 위해서 Backdrop STYLE component를 만들어준다.
const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;
  z-index: 0;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

const Cover = styled.div`
  width: 30%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
`;

const Data = styled.div`
  width: 70%;
  margin-left: 10px;
`;

const Title = styled.span`
  font-size: 32px;
  margin-bottom: 10px;
  a img{
    margin-left: 15px;
    width: 50px;
    height: 25px;
  }
`;

const ItemContainer = styled.div`
  margin: 20px 0px;
`;

const Item = styled.span``;

const Divider = styled.span`
  margin: 0 10px;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 80%;
  margin-top: 45px;
  iframe{
    width: 100%;
    height: 500px;
  }
`;

const OutContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabContainer = styled.div`
display: flex;
`;
const List = styled("ul")`
  display: flex;
`;

const ListItem = styled("li")`
  margin-right: 20px;
  text-transform: uppercase;
  font-weight: 600;
  border: 2px solid #1abc9c;
  padding: 5px;
  background-color: ${props => (props.active ? "#1abc9c" : "transparent")};
`;

export default function Detail({match: {params: { id }}, history: { push }, location: { pathname }}) {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMovie, setIsMovie] = useState();

    const getData = async() => {
        const isMovie = pathname.includes("/movie/");
        if(isMovie){
            setIsMovie(true);
        }else{
            setIsMovie(false);  
        }
        const parsedId = parseInt(id);

        let result = null;
        try{
            if(isMovie) {
                ({ data: result } = await moviesApi.movieDetail(parsedId));
            }else{
                ({ data: result } = await tvApi.showDetail(parsedId));
            }
            setResult(result);
        }catch(error){
            setError("Can't find anything.");
        }finally{
            setLoading(false)
        }

    };

    useEffect(() => { getData(); }, []);

    return loading ? <Loader /> : (
        <>
            <OutContainer>
                { result.videos.results[0]? (
                <VideoContainer>
                    <section>
                    {result && <iframe src={`https://www.youtube.com/embed/${result.videos.results[0]["key"]}?autoplay=1`} title="Youtube"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                    </section>
                </VideoContainer>
                ):(
                <section>
                </section>
                )}
                <Container>
                <Backdrop
                    bgImage={result && `https://image.tmdb.org/t/p/original${result.backdrop_path}`}
                />
                <Content>
                    <Cover
                    bgImage={ result && 
                        result.poster_path
                        ? `https://image.tmdb.org/t/p/original${result.poster_path}`
                        : require("../../assets/noPosterSmall.png")
                    }
                    />
                    <Data>
                    <Title>
                        {result &&
                        result.original_title
                        ? result.original_title
                        : result.original_name}
                        {result.imdb_id
                        ? <a href={`https://www.imdb.com/title/${result.imdb_id}`} target="_blank">
                            <img src={require("../../assets/imdb.png")} alt="imdb_icon"/>
                            </a>
                        : ""}
                        
                    </Title>
                    <ItemContainer>
                        <Item>
                        {result.release_date
                            ? result.release_date.substring(0, 4)
                            : result.first_air_date.substring(0, 4)}
                        </Item>
                        <Divider>・</Divider>
                        <Item>
                        {result.runtime ? result.runtime : result.episode_run_time[0]}min
                        </Item>
                        <Divider>・</Divider>
                        <Item>
                        {result.genres &&
                            result.genres.map((genre, index) =>
                            index === result.genres.length - 1
                                ? genre.name
                                : `${genre.name} / `
                            )}
                        </Item>
                    </ItemContainer>
                    <TabContainer>
                        <List>
                        <ListItem active={isMovie? pathname === `/movie/${result.id}/overview` || pathname === `/movie/${result.id}`: pathname === `/show/${result.id}/overview` || pathname === `/show/${result.id}`}>
                            <Link to={isMovie? `/movie/${result.id}/overview` : `/show/${result.id}/overview`}>Overview</Link>
                        </ListItem>
                        <ListItem active={pathname === `/movie/${result.id}/companies` || pathname === `/show/${result.id}/companies`}>
                            <Link to={isMovie? `/movie/${result.id}/companies` : `/show/${result.id}/companies`}>Production Companies</Link>
                        </ListItem>
                        {isMovie? (<ListItem active={pathname === `/movie/${result.id}/countries`}>
                            <Link to={`/movie/${result.id}/countries`}>Production Countries</Link>
                        </ListItem>) : (<ListItem active={pathname === `/show/${result.id}/seasons`}>
                            <Link to={`/show/${result.id}/seasons`}>Seasons</Link>
                        </ListItem>)}
                        
                        </List>
                    </TabContainer>
                    <Route path="/movie/:id" exact component={Overview}/>
                    <Route path="/show/:id" exact component={Overview}/>
                    <Route path="/movie/:id/overview" component={Overview} />
                    <Route path="/movie/:id/companies" component={Companies} />
                    <Route path="/movie/:id/countries" component={Countries} />
                    <Route path="/show/:id/overview" component={Overview} />
                    <Route path="/show/:id/companies" component={Companies} />
                    <Route path="/show/:id/countries" component={Countries} />
                    <Route path="/show/:id/seasons" component={Seasons} />
                    
                    </Data>
                </Content>
                </Container>
            </OutContainer>
        </>
    )
}