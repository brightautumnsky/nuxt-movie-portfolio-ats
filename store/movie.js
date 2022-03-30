import axios from "axios";
import _uniqBy from "lodash/uniqBy";

export default {
  namespaced: true,
  state: () => ({
    movies: [], // 영화 목록 정보 데이터
    loading: false, // 처음 로딩 상태는 false
    message: "Search for the movie title!",
    theMovie: {} // 영화 상세 정보 데이터
  }),
  getters: {},
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key];
      });
    }
  },
  actions: {
    async searchMovies({ state, commit }, payload) {
      if (state.loading) return;

      commit("updateState", {
        loading: true,
        message: ""
      });

      try {
        const res = await _fetchMovie(payload);
        const { Search, totalResults } = res.data;
        commit("updateState", {
          movies: _uniqBy(Search, "imdbID")
        });

        const total = parseInt(totalResults, 10);
        const pageLength = Math.ceil(total / 10);

        // 검색된 총 결과가 2페이지 이상이어서 데이터를 더 요청해야할 경우
        if (pageLength > 1) {
          for (let page = 2; page <= pageLength; page += 1) {
            if (page > payload.number / 10) break;

            const res = await _fetchMovie({
              ...payload,
              page
            });
            const { Search } = res.data;
            commit("updateState", {
              movies: _uniqBy([...state.movies, ...Search], "imdbID")
            });
          }
        }
      } catch (error) {
        console.log(error);
        commit("updateState", {
          message: error.message,
          movies: []
        });
      } finally {
        commit("updateState", {
          loading: false
        });
      }
    },

    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) return;

      commit("updateState", {
        loading: true
      });

      try {
        const res = await _fetchMovie({
          id: payload.id
        });
        console.log(res.data);

        commit("updateState", {
          theMovie: res.data
        });
      } catch (error) {
        commit("updateState", {
          message: error.message
        });
      } finally {
        commit("updateState", {
          loading: false
        });
      }
    }
  }
};

// 호이스팅이 가능하고 store/movie.js 내에서만 사용하는 _일반 함수
async function _fetchMovie(payload) {
  // CSR: '/api/movie' => '주소/api/movie'
  // SSR: '/api/movie' => '/api/movie'
  const url = process.client
    ? "/api/movie"
    : `${process.env.CLIENT_URL}/api/movie`;
  return await axios.post(url, payload);
}
