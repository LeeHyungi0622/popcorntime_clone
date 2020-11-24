import React, { useState, useEffect } from "react";
import { tvApi } from "../../api";
import styled from "styled-components";
import Section from "../../Components/Section";
import Poster from "../../Components/Poster";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";

const Container = styled.div`
    padding: 20px 20px;
`;



export default function TV() {
    const [topRated, setTopRated] = useState([]);
    const [popular, setPopular] = useState([]);
    const [airingToday, setAiringToday] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getData = async() => {
        try{
            const {data: {results: topRated}} = await tvApi.topRated();
            const {data: {results: popular}} = await tvApi.popular();
            const {data: {results: airingToday}} = await tvApi.airingToday();
            setTopRated(topRated);
            setPopular(popular);
            setAiringToday(airingToday);
        }catch(error){
            setError("Can't find results");
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => { getData(); }, []);

    return loading ? <Loader /> : (
        <Container>
            {topRated && topRated.length > 0 && (
                <Section title="Top Rated Show">
                    {topRated.map(show => (
                        <Poster 
                        key={show.id}
                        id={show.id}
                        imageUrl={show.poster_path}
                        title={show.name}
                        rating={show.vote_average}
                        year={show.first_air_date && show.first_air_date.substring(0, 4)}
                        isMovie={false}
                        />
                    ))}
                </Section>
            )}
            {popular && popular.length > 0 && (
                <Section title="Popular Shows">
                {popular.map((show) => (
                    <Poster
                    key={show.id}
                    id={show.id}
                    imageUrl={show.poster_path}
                    title={show.name}
                    rating={show.vote_average}
                    year={show.first_air_date && show.first_air_date.substring(0, 4)}
                    isMovie={false}
                    />
                ))}
                </Section>
            )}
            {airingToday && airingToday.length > 0 && (
                <Section title="Airing Today">
                {airingToday.map((show) => (
                    <Poster
                    key={show.id}
                    id={show.id}
                    imageUrl={show.poster_path}
                    title={show.name}
                    rating={show.vote_average}
                    year={show.first_air_date && show.first_air_date.substring(0, 4)}
                    isMovie={false}
                    />
                ))}
                </Section>
            )}
            {error && <Message text={error} color="#e74c3c" />}
        </Container>
    );
}