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
                            <img src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${country.iso_3166_1.toLowerCase()}.svg`} title={country.iso_3166_1} />
                        </Country>
                    ))}
                </CountriesContainer>    
            </>}
        </Container>
        </>
    )

}