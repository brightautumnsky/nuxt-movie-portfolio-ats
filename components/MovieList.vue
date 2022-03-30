<template>
  <div class="container">
    <div :class="{ 'no-result': noMovies }" class="inner">
      <Loader v-if="loading" />
      <div v-if="message" class="message">
        {{ message }}
      </div>
      <div class="movies">
        <MovieItem v-for="movie in movies" :key="movie.imdbID" :movie="movie" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loader from "@/components/Loader";
import MovieItem from "@/components/MovieItem";

export default {
  components: {
    Loader,
    MovieItem
  },
  computed: {
    ...mapState("movie", ["movies", "loading", "message"]),
    noMovies() {
      return !this.movies.length;
    }
  }
};
</script>

<style lang="scss" scoped>
/* bootstrap이 $변수를 읽기 위해 scss 폴더의 main 파일을 먼저 불러와야 한다. webpack.config.js 파일에서 sass-loader의 옵션을 설정해주어 @import "@/scss/main"을 자동으로 가져온다 */
.container {
  margin-top: 30px;
  .inner {
    background-color: $gray-200;
    padding: 10px 0;
    border-radius: 4px;
    text-align: center;
    &.no-result {
      padding: 70px 0;
    }
    .message {
      color: $gray-400;
      font-size: 20px;
    }
    .movies {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}
</style>
