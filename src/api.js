import axios from "axios";

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    params: {
        api_key: "06e43891a2b919ee11ba3f3894d63374",
        language: "en-US"
    }
});

export const moviesApi = {
    nowPlaying: () => api.get("movie/now_playing"),
    upcoming: () => api.get("movie/upcoming"),
    popular: () => api.get("movie/popular"),
    movieDetail: (id) =>
        api.get(`movie/${id}`, {
            params: {
                append_to_response: "videos"
            }
        }),
    search: (term) =>
        api.get("search/movie", {
            params: {
                // 실제로 URL상에서 space나 특수문자는 encode된 상태로 넘어가기 때문에 다음과 같이
                // encodeURIComponent()를 사용해서 encoding 처리를 해준다.
                query: encodeURIComponent(term)
            }
        })
};

export const tvApi = {
    topRated: () => api.get("tv/top_rated"),
    popular: () => api.get("tv/popular"),
    airingToday: () => api.get("tv/airing_today"),
    showDetail: (id) =>
        api.get(`tv/${id}`, {
            params: {
                append_to_response: "videos"
            }
        }),
    search: (term) =>
        api.get("search/tv", {
            params: {
                // 실제로 URL상에서 space나 특수문자는 encode된 상태로 넘어가기 때문에 다음과 같이
                // encodeURIComponent()를 사용해서 encoding 처리를 해준다.
                query: encodeURIComponent(term)
            }
        })
};