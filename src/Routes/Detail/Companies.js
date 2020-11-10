import React, { useEffect, useState } from "react";
import { moviesApi } from "../../api";
import styled from "styled-components";

const Container = styled.div`

`;

const Company = styled.div`
    font-size: 25px;
    padding: 15px 0 15px 0;
    img{
        margin: 10px;
    }
    :first-child{
        margin-top: 30px;
    }
`;

export default function Companies({ match: { params: { id } } }) {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);

    const getCompaniesInfo = async() => {

        try {
            const { data } = await moviesApi.movieDetail(id);
            setCompanies(data);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCompaniesInfo();
    }, []);

    return loading ? (
        "Loading..."
    ) : (
        <>
        <Container>
            {companies.production_companies && 
            <>
                {companies.production_companies.map((company, index)=> 
                    <Company key={`${index}${company.name}`}>
                        <h1>{company.name}, {company.origin_country}</h1>
                        <img src={`https://image.tmdb.org/t/p/w300/${company.logo_path}`} alt="company_logo"/>
                    </Company>    
                )}
            </>}
        </Container>
        </>
    )

}