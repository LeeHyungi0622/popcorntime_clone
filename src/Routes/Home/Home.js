import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { moviesApi } from "../../api";
import Loader from "../../Components/Loader";
import Section from "../../Components/Section";
import Poster from "../../Components/Poster";
import Message from "../../Components/Message";

const Container = styled.div`
    padding: 20px 20px;
`;

export default function Home(){
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const getData = async() => {
        try{
            const {data: {results : nowPlaying }} = await moviesApi.nowPlaying();
            const {data: {results : popular }} = await moviesApi.popular();
            const {data: {results : upcoming }} = await moviesApi.upcoming();
            setNowPlaying (nowPlaying);
            setPopular(popular);
            setUpcoming(upcoming);
        }catch(e){
            setError(e);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return loading ? (<Loader />) : (
        <Container>
            {nowPlaying && nowPlaying.length > 0 && (
                <Section title="Now Playing">
                    {nowPlaying.map(movie => (
                        <Poster
                        key={movie.id}
                        id={movie.id}
                        imageUrl={movie.poster_path}
                        title={movie.original_title}
                        rating={movie.vote_average}
                        year={movie.release_date.substring(0, 4)}
                        isMovie={true}
                    />
                    ))}
                </Section>
            )}
            {upcoming && upcoming.length > 0 && (
                <Section title="Upcoming Movies">
                    {upcoming.map((movie) => (
                    <Poster
                        key={movie.id}
                        id={movie.id}
                        imageUrl={movie.poster_path}
                        title={movie.original_title}
                        rating={movie.vote_average}
                        year={movie.release_date.substring(0, 4)}
                        isMovie={true}
                    />
                    ))}
              </Section>
            )}
            {popular && popular.length > 0 && (
                <Section title="Popular Movies">
                {popular.map((movie) => (
                  <Poster
                    key={movie.id}
                    id={movie.id}
                    imageUrl={movie.poster_path}
                    title={movie.original_title}
                    rating={movie.vote_average}
                    year={movie.release_date.substring(0, 4)}
                    isMovie={true}
                  />
                ))}
              </Section>
            )}
            {error && <Message text={error} color="#e74c3c" />}
        </Container>
    )
}