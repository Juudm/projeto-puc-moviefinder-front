import React, {useEffect, useState} from "react";
import {api} from "../../services/api";

import {Swiper, SwiperSlide} from "swiper/react";
import {MdKeyboardArrowRight} from "react-icons/md"
import {GoSearch} from "react-icons/go"
import SwiperCore, {Autoplay, Navigation, Pagination, Virtual} from "swiper";
import {Link, useNavigate} from 'react-router-dom';
import Rodal from 'rodal';
import Input from '@mui/joy/Input';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

import './Home.css'
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'rodal/lib/rodal.css';

import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';
import {useContext} from "react";
import {AuthContext} from "../../contexts/AuthContext.jsx";
import Cookies from "js-cookie";

SwiperCore.use([Virtual, Navigation, Pagination]);

function Home() {

    const [visibleLogin, setvisibleLogin] = useState(false)
    const [visibleRegister, setvisibleRegister] = useState(false)
    const [visibleFavorites, setvisibleFavorites] = useState(false)
    const [popularMovies, setPopularMovies] = useState([])
    const [recommendedMovies, setRecommendedMovies] = useState([])
    const [topRatedMovies, setTopRatedMovies] = useState([])
    const [discoverList, setDiscoverList] = useState([])
    const [name, setName] = useState('');
    const [isNameValid, setIsNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [emailLogin, setEmailLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [passwordLogin, setPasswordLogin] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isPasswordConfirmationValid, setIsPasswordConfirmationValid] = useState(true);
    const [age, setAge] = useState('');
    const [isAgeValid, setIsAgeValid] = useState(true);
    const [genre, setGenre] = useState('');
    const [isGenreValid, setIsGenreValid] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const authContext = useContext(AuthContext);
    const {userDto} = authContext;
    const {authenticated} = authContext;
    const token = Cookies.get('moviefinder-token');
    const {favorito} = authContext;

    const showModalFavorites = () => {
        setvisibleFavorites(true);
    }
    const closeModalFavorites = () => {
        setvisibleFavorites(false);
    }

    const navigate = useNavigate()

    const showModalLogin = () => {
        setvisibleLogin(true);
    }
    const closeModalLogin = () => {
        setvisibleLogin(false);
        setEmailLogin('');
        setPasswordLogin('');
    }
    const showModalRegister = () => {
        setvisibleRegister(true);
    }
    const closeModalRegister = () => {
        setvisibleRegister(false);
        setIsNameValid(true);
        setName('');
        setIsEmailValid(true);
        setEmail('');
        setIsPasswordValid(true);
        setPassword('');
        setIsPasswordConfirmationValid(true);
        setPasswordConfirmation('');
        setIsGenreValid(true);
        setGenre('');
        setIsAgeValid(true);
        setAge('');
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            if ((isGenreValid && genre !== '') &&
                (isNameValid && name !== '') &&
                (validateEmail(email) && isEmailValid && email !== '') &&
                (isPasswordValid && password !== '' && (password.length >= 5 && password.length <= 8)) &&
                (isPasswordConfirmationValid && passwordConfirmation !== '' && (passwordConfirmation.length >= 5 && passwordConfirmation.length <= 8 && passwordConfirmation === password)) &&
                ((isAgeValid && age !== '') && 12 <= age <= 100)) {
                const response = await api.post('/movieFinder/cadastrarUsuario', {
                    nome: name,
                    email,
                    senha: password,
                    idade: parseInt(age),
                    genero: genre,
                })
                closeModalRegister()
                setSeverity("success");
                setMessage(response.data.message);
                setOpen(true)
                console.log(response.data.message);
            } else {
                if (genre === '') {
                    setIsGenreValid(false);
                } else {
                    setIsGenreValid(true);
                }
                if (name === '') {
                    setIsNameValid(false);
                } else {
                    setIsNameValid(true);
                }
                if (email === '' || !validateEmail(email)) {
                    setIsEmailValid(false);
                } else {
                    setIsEmailValid(true);
                }
                if (password === '' || password.length < 5 || password.length > 8 || passwordConfirmation !== password) {
                    setIsPasswordValid(false);
                } else {
                    setIsPasswordValid(true);
                }
                if (passwordConfirmation === '' || passwordConfirmation < 5 || passwordConfirmation.length > 8 || passwordConfirmation !== password) {
                    setIsPasswordConfirmationValid(false);
                } else {
                    setIsPasswordConfirmationValid(true);
                }
                if (age === '' || age < 12 || age > 100) {
                    setIsAgeValid(false);
                } else {
                    setIsAgeValid(true);
                }
            }

        } catch (error) {
            if (error.response && error.response.data) {
                setSeverity("error");
                setMessage(error.response.data.message);
                setOpen(true);
                console.error(error.response.data.message);
            } else {
                console.error(error);
            }
        }
    }

    const handleLogin = async () => {
        try {
            const response = await authContext.logIn(emailLogin, passwordLogin);
            navigate('/');
            closeModalLogin();
            setSeverity("success");
            setMessage(response.message);
            setOpen(true);

        } catch (error) {
            if (error.response && error.response.data) {
                setSeverity("error");
                setMessage(error.response.data.message);
                setOpen(true);
                console.error(error.response.data.message);
            } else {
                console.error(error);
            }
        }
    }

    const logout = () => {
        authContext.logOut();
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const getPopularMovies = async () => {
        const response = await api.get('/movieFinder/movie/popularity')
        setPopularMovies(response.data)
    }

    const getRecommendedMovies = async () => {
        const response = await api.get(`/movieFinder/recommendation/list`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        setRecommendedMovies(response.data)
    }

    const getTopRatedMovies = async () => {
        const response = await api.get('/movieFinder/movie/top_rated')
        setTopRatedMovies(response.data)
    }

    const getGenreList = async () => {
        const response = await api.get('/movieFinder/genre/list')
        const {genres} = response.data
        const promises = genres.map(async (genre) => {
            const discoverList = await getDiscoverList(genre.id)
            return {
                genreName: genre.name,
                movies: discoverList
            }
        })
        const genresWithMovies = await Promise.all(promises)
        setDiscoverList(genresWithMovies)
    }

    const getDiscoverList = async (genreId) => {
        const response = await api.get(`/movieFinder/discover/movie?genreId=${genreId}`)
        return response.data.results
    }

    const gotoDetails = async (movie) => {
        if (authenticated) {
            await authContext.isFavorite(movie);
        }
        navigate(`/Resultado/${movie.id}`);
    }

    const handleGenreChange = e => {
        const selectedGenre = e.target.value;
        if (selectedGenre === 'Masculino' || selectedGenre === 'Feminino') {
            setIsGenreValid(true);
            setGenre(selectedGenre);
        } else {
            setIsGenreValid(false);
            setGenre('');
        }
    };

    const handleNameChange = e => {
        const name = e.target.value;
        if (name !== '') {
            setIsNameValid(true);
            setName(name);
        } else {
            setIsNameValid(false);
            setName('');
        }
    };

    const handleEmailChange = e => {
        const email = e.target.value;
        if (email !== '') {
            setIsEmailValid(true);
            setEmail(email);
        } else {
            setIsEmailValid(false);
            setEmail('');
        }
    };

    const handlePasswordChange = e => {
        const password = e.target.value;
        if (password !== '') {
            setIsPasswordValid(true);
            setPassword(password);
        } else {
            setIsPasswordValid(false);
            setPassword('');
        }
    };

    const handlePasswordConfirmationChange = e => {
        const passwordConfirmation = e.target.value;
        if (passwordConfirmation !== '') {
            setIsPasswordConfirmationValid(true);
            setPasswordConfirmation(passwordConfirmation);
        } else {
            setIsPasswordConfirmationValid(false);
            setPasswordConfirmation('');
        }
    };

    const handleAgeChange = e => {
        const age = e.target.value;
        if (age !== '' && 12 <= age <= 100) {
            setIsAgeValid(true);
            setAge(age);
        } else {
            setIsAgeValid(false);
            setAge('');
        }
    };

    const handleEmailLoginChange = e => {
        const emailLogin = e.target.value;
        setEmailLogin(emailLogin);
    }

    const handlePasswordLoginChange = e => {
        const passwordLogin = e.target.value;
        setPasswordLogin(passwordLogin);
    }

    useEffect(() => {
        getPopularMovies()
        getTopRatedMovies()
        getGenreList()
        getRecommendedMovies()
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="home-body">

            <div className='header'>
                <div className="header-text">
                    <div className='header-left'>
                        <Link to="/Busca"><h2><GoSearch style={{color: "rgba(255, 255, 255, 0.849)"}}/>Pesquisar</h2>
                        </Link>
                    </div>
                    <div className='header-center'>
                        <Link to="/">
                            <h1>MovieFinder</h1>
                        </Link>
                    </div>
                    <div className='header-right'>
                        <div>
                            {userDto !== null ? (
                                <div style={{display: 'flex'}}>
                                    <h2 style={{paddingRight: '15px'}} onClick={showModalFavorites}>{userDto.nome}</h2>
                                    <h2 onClick={logout}>Logout</h2>
                                </div>
                            ) : (
                                <div style={{display: 'flex'}}>
                                    <h2 onClick={showModalRegister} style={{paddingRight: '15px'}}>Cadastro</h2>
                                    <h2 onClick={showModalLogin}>Login</h2>
                                </div>
                            )}
                        </div>
                        <Rodal
                            visible={visibleFavorites}
                            onClose={closeModalFavorites}
                            showMask={true}
                            closeOnEsc={true}
                            closeMaskOnClick={true}
                            showCloseButton={true}
                            className="rodal-favorites-results"
                            width={450}
                            height={450}
                            customStyles={{
                                background: 'linear-gradient(45deg, rgba(6,35,64,1) 24%, rgba(6,10,64,1) 49%, rgba(11,4,46,1) 68%)',
                                borderRadius: '10px',
                            }}
                        >
                            <div className="modal-perfil">
                                <div>
                                    <h1>MovieFinder</h1>
                                </div>
                                <div className="modal-perfil-results">
                                    <FormControl>
                                        <FormLabel>E-mail:</FormLabel>
                                        <Input
                                            disabled={false}
                                            size="md"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Nome:</FormLabel>
                                        <Input
                                            disabled={false}
                                            size="md"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Senha:</FormLabel>
                                        <Input
                                            disabled={false}
                                            size="md"
                                            type="password"
                                        />
                                    </FormControl>
                                    <div className='modal-perfil-results-button'>
                                        <Button className="modal-button-perfil">Atualizar</Button>
                                    </div>
                                </div>
                            </div>
                        </Rodal>
                        <Rodal
                            visible={visibleLogin}
                            onClose={closeModalLogin}
                            showMask={true}
                            closeOnEsc={true}
                            closeMaskOnClick={true}
                            showCloseButton={true}
                            className="rodal-login-home"
                            width={450}
                            height={500}
                            customStyles={{
                                background: 'linear-gradient(45deg, rgba(6,35,64,1) 24%, rgba(6,10,64,1) 49%, rgba(11,4,46,1) 68%)',
                                borderRadius: '10px',
                            }}
                        >
                            <div className="modal-login-home">
                                <h1>MovieFinder</h1>
                                <div className="modal-login-body">
                                    <div className="modal-login-text">
                                        <h2>Login</h2>
                                    </div>
                                    <div className="modal-login-input-label">
                                        <Input
                                            color="neutral"
                                            value={emailLogin}
                                            disabled={false}
                                            size="md"
                                            onChange={handleEmailLoginChange}
                                            placeholder="Email..."

                                        />
                                        <Input
                                            color="neutral"
                                            value={passwordLogin}
                                            disabled={false}
                                            placeholder="Senha..."
                                            size="md"
                                            onChange={handlePasswordLoginChange}
                                            type="password"
                                        />
                                    </div>
                                    <div className="modal-login-in">
                                        <p>Esqueceu a senha?</p>
                                        <Button className="modal-button-login" onClick={handleLogin}>Entrar</Button>
                                    </div>
                                </div>
                            </div>
                        </Rodal>
                        <Rodal
                            visible={visibleRegister}
                            onClose={closeModalRegister}
                            showMask={true}
                            closeOnEsc={true}
                            closeMaskOnClick={true}
                            showCloseButton={true}
                            className="rodal-register-home"
                            width={450}
                            height={500}
                            customStyles={{
                                background: 'linear-gradient(45deg, rgba(6,35,64,1) 24%, rgba(6,10,64,1) 49%, rgba(11,4,46,1) 68%)',
                                borderRadius: '10px',
                            }}
                        >
                            <div className="modal-register-home">
                                <h1>MovieFinder</h1>
                                <div className="modal-register-input-button">
                                    <div className="modal-register-text">
                                        <h2>Cadastro</h2>
                                    </div>
                                    <Input
                                        color={isNameValid ? 'neutral' : 'danger'}
                                        disabled={false}
                                        size="md"
                                        placeholder="Nome Completo..."
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                    <Input
                                        color={isEmailValid ? 'neutral' : 'danger'}
                                        disabled={false}
                                        size="md"
                                        placeholder="E-mail..."
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                    <Input
                                        color={isPasswordValid ? 'neutral' : 'danger'}
                                        disabled={false}
                                        placeholder="Senha... (min 5, máx 8 caracteres)"
                                        size="md"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        type="password"
                                    />
                                    <Input
                                        color={isPasswordConfirmationValid ? 'neutral' : 'danger'}
                                        disabled={false}
                                        placeholder="Confirme sua senha..."
                                        size="md"
                                        value={passwordConfirmation}
                                        type="password"
                                        onChange={handlePasswordConfirmationChange}
                                    />

                                    <select
                                        value={genre}
                                        className={`modal-register-select ${isGenreValid ? '' : 'invalid'}`}
                                        onChange={handleGenreChange}
                                    >
                                        <option value="">
                                            Selecione o gênero...
                                        </option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                    </select>
                                    <Input
                                        color={isAgeValid ? 'neutral' : 'danger'}
                                        type="number"
                                        disabled={false}
                                        placeholder="Digite sua idade..."
                                        size="md"
                                        value={age}
                                        onChange={handleAgeChange}
                                    />
                                    <p>Crie sua conta agora no MovieFinder</p>
                                    <Button
                                        className="modal-register-button"
                                        onClick={handleSubmit}
                                    >
                                        Cadastrar
                                    </Button>
                                </div>
                            </div>
                        </Rodal>
                        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open}
                                  autoHideDuration={3000} onClose={handleClose}>
                            <Alert elevation={100000000} onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                                {message}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>

                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="swiper-home-header"
                >
                    {popularMovies.map((movie) => (
                        <SwiperSlide onClick={() => gotoDetails(movie)} className="swiper-header-img" style={{
                            height: "850px",
                            backgroundImage: `url(${"http://image.tmdb.org/t/p/original" + movie.backdropPath})`,
                            backgroundPosition: "center",
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: "cover",
                        }}>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="content-home-body">
                <div className="content-home">
                    <div className='recommendation-movies'>
                        <div className='recommendation-movies-text'>
                            <h2>Filmes com melhores avaliações</h2>
                            <MdKeyboardArrowRight/>
                        </div>
                        <Swiper
                            loop={true}
                            loopPreventsSliding={true}
                            navigation={true}
                            virtual
                            breakpoints={{
                                "@0.00": {
                                    slidesPerView: 1,
                                },
                                "@0.75": {
                                    slidesPerView: 3,
                                },
                                "@1.00": {
                                    slidesPerView: 4,
                                },
                                "@1.50": {
                                    slidesPerView: 8,
                                },
                            }}
                        >
                            {topRatedMovies.map((movie, index) => movie.posterPath && (
                                <SwiperSlide onClick={() => gotoDetails(movie)} className="swiper-cards-slide"
                                             key={movie} virtualIndex={index}>
                                    <MovieCard movie={movie} posterSize="200px"/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className='recommendation-movies'>
                        {authenticated && (
                            <>
                                <div className='recommendation-movies-text'>
                                    <h2>Filmes recomendados</h2>
                                    <MdKeyboardArrowRight/>
                                </div>
                                <Swiper
                                    loop={true}
                                    loopPreventsSliding={true}
                                    navigation={true}
                                    virtual
                                    breakpoints={{
                                        "@0.00": {
                                            slidesPerView: 1,
                                        },
                                        "@0.75": {
                                            slidesPerView: 3,
                                        },
                                        "@1.00": {
                                            slidesPerView: 4,
                                        },
                                        "@1.50": {
                                            slidesPerView: 8,
                                        },
                                    }}
                                >
                                    {recommendedMovies?.map((movie) => movie.posterPath &&
                                        <SwiperSlide onClick={() => gotoDetails(movie)} className="swiper-cards-slide">
                                            <MovieCard movie={movie} posterSize="200px"/>
                                        </SwiperSlide>
                                    )}
                                </Swiper>
                            </>
                        )}
                    </div>
                    {discoverList.map((moviesByGenre) => (
                        <div className='recommendation-movies'>
                            <div className='recommendation-movies-text'>
                                <h2>Filmes de {moviesByGenre.genreName}</h2>
                                <MdKeyboardArrowRight/>
                            </div>
                            <Swiper
                                loop={true}
                                loopPreventsSliding={true}
                                navigation={true}
                                virtual
                                breakpoints={{
                                    "@0.00": {
                                        slidesPerView: 1,
                                    },
                                    "@0.75": {
                                        slidesPerView: 3,
                                    },
                                    "@1.00": {
                                        slidesPerView: 4,
                                    },
                                    "@1.50": {
                                        slidesPerView: 8,
                                    },
                                }}
                            >
                                {moviesByGenre.movies.map((movie) => movie.posterPath &&
                                    <SwiperSlide onClick={() => gotoDetails(movie)} className="swiper-cards-slide">
                                        <MovieCard movie={movie} posterSize="200px"/>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    ))}
                </div>
                <Footer/>
            </div>
        </div>
    )
}

export default Home
