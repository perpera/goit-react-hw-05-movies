import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Loader } from '../components/Loader/Loader';
import MoviesList from '../components/MoviesList/MoviesList';
import SearchMovies from '../components/SearchMovies/SearchMovies';
import { getMoviesBySearch } from '../service/movies-api';
import { notification } from '../helpers/notification';
import PaginationList from '../components/PaginationList/PaginationList';
import { ScrollUpBtn } from '../components/ScrollUpBtn/ScrollUpBtn';
import { smoothScroll } from '../helpers/SmoothScroll';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();

  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pg, setPg] = useState(1);
  const [pageQty, setPageQty] = useState(0);

  const handleSearch = value => {
    setPg(1);
    setSearchParams({ query: value, page: pg });
  };

  useEffect(() => {
    const queryForSearch = searchParams.get('query') || '';
    if (!queryForSearch) return;
    setLoader(true);

    const fetchMoviesBySearch = async () => {
      try {
        const { page, results, total_pages } = await getMoviesBySearch(
          queryForSearch,
          pg
        );

        setMovies(results);
        setPg(page);
        setPageQty(total_pages);
        setSearchParams({ query: queryForSearch, page: pg });

        if (!results.length) {
          setSearchParams({});
          return notification(
            `Sorry, no movies found on query ${queryForSearch}`
          );
        }

        return results;
      } catch ({ message }) {
        notification(message);
      } finally {
        setLoader(false);

        smoothScroll('movieList');
      }
    };
    fetchMoviesBySearch();
  }, [searchParams, pg, setSearchParams]);

  return (
    <>
      {loader && <Loader />}
      <SearchMovies search={handleSearch} />

      {pageQty > 1 && (
        <PaginationList pageQty={pageQty} pg={pg} onChange={setPg} />
      )}

      {movies.length > 0 && <MoviesList movies={movies} location={location} />}

      <ScrollUpBtn />
    </>
  );
};

export default Movies;
