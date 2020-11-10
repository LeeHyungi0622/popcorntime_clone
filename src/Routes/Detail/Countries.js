import React, { useEffect, useState } from "react";
import { moviesApi, tvApi } from "../../api";
import styled from "styled-components";

const Container = styled.div`

`;

const CountriesContainer = styled.div`
    font-size: 25px;
    padding: 15px 0 15px 0;
    margin-top: 30px;
`;

const Country = styled('div')``;

export default function Countries({ location:{ pathname },match: { params: { id } } }) {
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const isMovie = pathname.includes("/movie/")

    const getMovieInfo = async() => {
        try {
            if(isMovie){
                const { data } = await moviesApi.movieDetail(id);
                setMovie(data);
            }else{
                const { data } = await tvApi.showDetail(id);
                setMovie(data);
            }
            
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMovieInfo();
    }, []);

    return loading ? (
        "Loading..."
    ) : (
        <>
        <Container>
            {movie.production_countries && 
            <>
                <CountriesContainer key={`${movie.id}`}>
                    {movie.production_countries.map((country, index) => (
                        <Country key={`${country}${index}`}>
                            <h1>{country.name}</h1>
                            <img src={`https://image.tmdb.org/t/p/w300${country.poster_path}.jpg`} title={country.name} />
                        </Country>
                    ))}
                </CountriesContainer>    
            </>}
        </Container>
        </>
    )

}