import React, { useEffect, useState } from "react";
import { moviesApi } from "../../api";
import styled from "styled-components";

const Container = styled.div`

`;

const OverviewContainer = styled.div`
    font-size: 25px;
    padding: 15px 0 15px 0;
    margin-top: 30px;
`;

export default function Overview({ match: { params: { id } } }) {
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState([]);

    const getMovieInfo = async() => {
        try {
            const { data } = await moviesApi.movieDetail(id);
            setMovie(data);
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
            {movie.overview && 
            <>
                <OverviewContainer key={`${movie.id}`}>
                    <p>{movie.overview}</p>
                </OverviewContainer>    
            </>}
        </Container>
        </>
    )

}