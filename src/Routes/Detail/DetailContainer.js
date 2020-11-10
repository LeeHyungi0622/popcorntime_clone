import React, { Component } from "react";
import { moviesApi, tvApi } from "../../api";
import DetailPresenter from "./DetailPresenter";

export default class extends Component {
    constructor(props) {
        super(props);
        const {
            location: { pathname }
        } = props;
        this.state = {
            result: null,
            error: null,
            loading: true,
            isMovie: pathname.includes("/movie/")
        };
    }

    async componentDidMount() {
        const {
            match: {
                params: { id }
            },
            history: { push }
        } = this.props;
        const { isMovie } = this.state;
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return push("/");
        }
        let result = null;
        try {
            if (isMovie) {
                ({ data: result } = await moviesApi.movieDetail(parsedId));
            } else {
                ({ data: result } = await tvApi.showDetail(parsedId));
            }
            console.log(result);
        } catch {
            this.setState({ error: "Can't find anything." });
        } finally {
            this.setState({ loading: false, result });
        }
    }

    render() {
        console.log(this.state);
        const { location: { pathname } } = this.props;
        const { result, error, loading, isMovie } = this.state;
        console.log("check result : ", result)
        return <DetailPresenter result = { result }
        error = { error }
        loading = { loading }
        pathname = { pathname }
        isMovie = { isMovie }
        />;
    }
}