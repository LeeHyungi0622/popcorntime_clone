import React, { Component, useState, useEffect } from "react";
import { moviesApi, tvApi } from "../../api";
import Loader from "../../Components/Loader";
import Section from "../../Components/Section";
import Message from "../../Components/Message";
import Poster from "../../Components/Poster";
import styled from "styled-components";

const Container = styled.div`
    padding: 0px 20px;
`;

const Form = styled.form`
    margin-bottom: 50px;
    width: 100%;
`;

const Input = styled.input`
    all: unset;
    font-size: 28px;
    width: 100%;
`;

export default function Search() {
    const [movieResults, setMovieResults] = useState([]);
    const [tvResults, setTvResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateTerm = (event) => {
        const {target: { value }} = event;
        setSearchTerm(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm !== "") {
            searchByTerm();
        }
    }

    const searchByTerm = async() => {
        setLoading(true);
        try {
            const { data: { results: movieResults } } = await moviesApi.search(searchTerm);
            const { data: { results: tvResults } } = await tvApi.search(searchTerm);
            setMovieResults(movieResults);
            setTvResults(tvResults);
        } catch (error) {
            setError("Can't find results.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Input 
                    placeholder="Search Movies or TV Shows..."
                    value={searchTerm}
                    onChange={updateTerm}
                />
            </Form>
            {loading? (<Loader />) : (
                    <>
                        {movieResults && movieResults.length > 0 && (
                            <Section title="Movie Results">
                                {movieResults.map(movie => (
                                    <Poster
                                    key={movie.id}
                                    id={movie.id}
                                    imageUrl={movie.poster_path}
                                    title={movie.original_title}
                                    rating={movie.vote_average}
                                    year={movie.release_date && movie.release_date.substring(0, 4)}
                                    isMovie={true}
                                />
                                ))}
                            </Section>
                        )}
                        {tvResults && tvResults.length > 0 && (
                            <Section title="TV Show Results">
                                {tvResults.map((show) => (
                                <Poster
                                    key={show.id}
                                    id={show.id}
                                    imageUrl={show.poster_path}
                                    title={show.name}
                                    rating={show.vote_average}
                                    year={
                                    show.first_air_date && show.first_air_date.substring(0, 4)
                                    }
                                    isMovie={false}
                                />
                                ))}
                            </Section>
                        )}
                        {error && <Message text={error} color="#e74c3c" />}
                        {tvResults &&
                        movieResults &&
                        tvResults.length === 0 &&
                        movieResults.length === 0 && (
                            <Message text={"Nothing found"} color="#95a5a6" />
                        )}
                    </>
                )}
        </Container>
    )
}