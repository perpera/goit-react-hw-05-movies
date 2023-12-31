import { Suspense, useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { getMovieById } from '../service/movies-api';
import { Loader } from '../components/Loader/Loader';
import MovieInfo from '../components/MovieInfo/MovieInfo';
import GoBackBtn from '../components/GoBackBtn/GoBackBtn';
import { notification } from '../helpers/notification';
import { Container, AdLinksWrap, AdLink } from '../components/App/App.styled';
import { ScrollUpBtn } from '../components/ScrollUpBtn/ScrollUpBtn';

const MovieDetails = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const [movieInfo, setMovieInfo] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setLoader(true);

    const fetchMovieById = async () => {
      try {
        const movie = await getMovieById(movieId);

        setMovieInfo(movie);
      } catch ({ message }) {
        notification(message);
      } finally {
        setLoader(false);
      }
    };
    fetchMovieById();
  }, [movieId]);

  const goBackPath = useRef(location?.state?.from ?? '/');

  return (
    <Container>
      {loader && <Loader />}
      <GoBackBtn path={goBackPath.current} />
      {movieInfo && <MovieInfo movie={movieInfo} />}
      <AdLinksWrap>
        <AdLink to="cast">Cast</AdLink>
        <AdLink to="reviews">Reviews</AdLink>
      </AdLinksWrap>
      <ScrollUpBtn />
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </Container>
  );
};

export default MovieDetails;
