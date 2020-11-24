import React, { Component } from "react";
import { moviesApi, tvApi } from "../../api";
import SearchPresenter from "./SearchPresenter";

export default class extends Component {
    state = {
        movieResults: null,
        tvResults: null,
        searchTerm: "",
        // 사용자가 검색을 시도했을때, 영화, 티비 결과를 둘 다 보여줄 것이기 때문에
        // loding은 false로 초기화를 시켜둔다.
        loading: false,
        error: null
    };

    //   handleSubmit
    handleSubmit = (event) => {
        // submit을 했을때, browser가 page가 새로고침되면서
        // 원래 갖고 있던 state정보를 refresh하는 것을 방지하기 위해
        event.preventDefault();
        const { searchTerm } = this.state;
        if (searchTerm !== "") {
            this.searchByTerm();
        }
    };

    // UpdateSearch
    updateTerm = (event) => {
        const {
            target: { value }
        } = event;
        // state값을 업데이트 해주면 페이지도 자동으로 re-rendering되기 때문에
        // 아래와 같이 state 내부에 있는 searchTerm항목을 입력받은 value값으로 초기화를 시켜준다.
        this.setState({
            searchTerm: value
        });
    };

    searchByTerm = async() => {
        const { searchTerm } = this.state;
        this.setState({ loading: true });
        try {
            const {
                data: { results: movieResults }
            } = await moviesApi.search(searchTerm);
            const {
                data: { results: tvResults }
            } = await tvApi.search(searchTerm);
            // 누군가 검색을 했을때, 로딩을 true로 만든다. (default:false)

            this.setState({
                movieResults,
                tvResults
            });
        } catch {
            this.setState({ error: "Can't find results." });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { movieResults, tvResults, searchTerm, loading, error } = this.state;
        return ( < SearchPresenter movieResults = { movieResults }
            tvResults = { tvResults }
            loading = { loading }
            error = { error }
            searchTerm = { searchTerm }
            handleSubmit = { this.handleSubmit }
            updateTerm = { this.updateTerm }
            />
        );
    }
}