import React, { useEffect, useState } from "react";
import { moviesApi, tvApi } from "../../api";
import styled from "styled-components";

const Container = styled.div`

`;

const SeasonsContainer = styled.div`
    font-size: 25px;
    padding: 15px 0 15px 0;
    margin-top: 30px;
`;

const Season = styled('div')``;

export default function Seasons({ location:{ pathname },match: { params: { id } } }) {
    const [loading, setLoading] = useState(true);
    const [tv, setTV] = useState([]);

    const getShowInfo = async() => {
        try {
            const { data } = await tvApi.showDetail(id);
            setTV(data);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getShowInfo();
    }, []);

    return loading ? (
        "Loading..."
    ) : (
        <>
        <Container>
            {tv.seasons && 
            <>
                <SeasonsContainer key={`${tv.id}`}>
                    {tv.seasons.map((season, index) => (
                        <Season key={`${season}${index}`}>
                            <img src={`https://image.tmdb.org/t/p/w300${season.poster_path}`} title={season.name} />
                            <h1>Air date : {season.air_date}</h1>
                            <h1>Episode : {season.episode_count}</h1>
                            <h2>{season.name}</h2>
                        </Season>
                    ))}
                </SeasonsContainer>    
            </>}
        </Container>
        </>
    )

}
