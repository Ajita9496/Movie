import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useNavigate, useLocation } from 'react-router-dom';
import "./dashboard.css"

const Dashboard = () => {
  const location = useLocation();
  const { username } = location.state;
  console.log("username", username);

  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt.decode(token);
      console.log(user);
      if (!user) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        fetchMoviesData();
      }
    }
    else {
      navigate('/')
    }
    fetch('http://localhost:8080/api/test/admin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          setIsAdmin(true);
        } else {
          console.log("user content visible")
        }
      })
      .catch(error => {
        console.error(error);
      });
    filterMovies(searchTitle);
  }, [navigate]);

  console.log(isAdmin);
  const fetchMoviesData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/movies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMovies(data);
        setFilteredMovies(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createMovie = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log("token", token);
      const response = await fetch('http://localhost:8080/api/movie/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          image: {
            url: imageUrl,
            alt: imageAlt,
          },
          rating,
          description,
        }),
      });
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert(data.message);
        setTitle('');
        setImageUrl('');
        setImageAlt('');
        setRating(0);
        setDescription('');
        fetchMoviesData();
      }
      else {
        console.error(data.message);
        alert('Failed to create movie.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create movie.');
    }
  };
  const deleteMovie = async (id) => {
    console.log(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/movie/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchMoviesData();
      } else {
        console.error(data.message);
        alert('Failed to delete movie.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete movie.');
    }
  };
  const updateMovie = async () => {
    if (!selectedMovie) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/movie/update/${selectedMovie._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: selectedMovie.title,
          image: {
            url: selectedMovie.image.url,
            alt: selectedMovie.image.alt,
          },
          rating: selectedMovie.rating,
          description: selectedMovie.description,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedMovie(null);
        fetchMoviesData();
      } else {
        console.error(data.message);
        alert('Failed to update movie.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update movie.');
    }
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCancelEdit = () => {
    setSelectedMovie(null);
  };
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedMovie((prevState) => {
      const updatedMovie = { ...prevState };
      if (name === "title") {
        updatedMovie.title = value;
      } else if (name === "imageUrl") {
        updatedMovie.image.url = value;
      } else if (name === "imageAlt") {
        updatedMovie.image.alt = value;
      } else if (name === "rating") {
        updatedMovie.rating = value;
      } else if (name === "description") {
        updatedMovie.description = value;
      }

      return updatedMovie;
    });
  };
  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setSearchTitle(searchQuery);
    filterMovies(searchQuery);
  };
  const filterMovies = (searchQuery) => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };
  const handleLogout = (e) => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    }
  }
  function toggleHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    hamburgerMenu.classList.toggle('change');
  }

  return (
    <div className="dashboard">
      <nav className='header'>
        <div className='header-text'>
          <text>MOVIES</text>
        </div>
        <div className='header-search'>
          <div className='search-text'>
            <text>Search Movie</text>
          </div>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className='right-header'>
          <div className='user-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className='user-name'>{username}</div>
          <button className="logout-button" onClick={() => handleLogout()}>Logout</button>
        </div>
        <div class="hamburger-menu" onClick={()=>toggleHamburgerMenu()}>
          <div>hello</div>
          <div>bye</div>
          <div>hey</div>
        </div>
      </nav>
      {/* Movie Creation Form */}

      {isAdmin && (
        <div className='form'>
          <div className='button-create-movie'>
            <button className='create-button' onClick={() => setShowCreateForm(true)}>Create Movie</button>
          </div>
          <div className="modal" style={{ display: showCreateForm ? 'block' : 'none' }}>
            <div className="modal-content">
              <span className="modal-close" onClick={() => setShowCreateForm(false)}>
                &times;
              </span>
              <h3> Create Movies</h3>
              {showCreateForm && (
                <form onSubmit={createMovie} className="model-form" >
                  <input
                    type="text"
                    placeholder="Movie Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image Alt Text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Rating"
                    value={rating}
                    max={5}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Movie Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit">Create Movie</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Movie List */}
      <div className='movie-data'>
        <ul className="movie-list">
          {filteredMovies.map((movie) => (
            <li className='movie-details' key={movie._id}>
              {selectedMovie && selectedMovie._id === movie._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="title"
                    value={selectedMovie.title}
                    onChange={handleUpdateInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="imageUrl"
                    value={selectedMovie.image.url}
                    onChange={handleUpdateInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="imageAlt"
                    value={selectedMovie.image.alt}
                    onChange={handleUpdateInputChange}
                    required
                  />
                  <input
                    type="number"
                    name="rating"
                    value={selectedMovie.rating}
                    onChange={handleUpdateInputChange}
                    required
                  />
                  <textarea
                    name="description"
                    value={selectedMovie.description}
                    onChange={handleUpdateInputChange}
                    required
                  ></textarea>
                  <button className='update-button' onClick={updateMovie}>Update</button>
                  <button className='edit-button' onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className='movie-box'>
                  <div className="image-container">
                    <img className="image" src={movie.image.url} alt={movie.image.alt} />
                  </div>
                  <br />
                  <div className='image-title-rating'>
                    <div className='movie-title-box'>
                      <text className='movie-title'>{movie.title}</text>
                    </div>
                    <div className='rating'>
                      {Array.from({ length: movie.rating }, (_, index) => (
                        <span key={index} className="filled-star">&#9733;</span>
                      ))}
                      {Array.from({ length: 5 - movie.rating }, (_, index) => (
                        <span key={index} className="empty-star">&#9734;</span>
                      ))}
                    </div>
                  </div>
                  <br />
                  <div className='movie-description'>
                    {movie.description}
                  </div>
                  <br />
                  {isAdmin && (
                    <div className='movie-buttons'>
                      <button className='edit-button' onClick={() => handleEditMovie(movie)}>Edit</button>
                      <button className='delete-button' onClick={() => deleteMovie(movie._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;
