import './MovieCard.css'

function MovieCard(props) {


  return (
    <div className='movie-card-all'>
      <div className="movie-card"  style={{ width: props.posterSize || "auto" }}>
          <div className='movie-card-img'>
            <img src={"https://image.tmdb.org/t/p/w185" + props.movie?.posterPath} alt="cards"/>
          </div>
        <div className='movie-card-titulo'>
            <h2>{props.movie?.title}</h2>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
