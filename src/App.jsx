import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (search === '') {
      setPokemon(null);
      setError('');
      return;
    }

    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Pokémon no encontrado');
        }
        const data = await response.json();
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
        });
      } catch (err) {
        setPokemon(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPokemon();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="app">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Busca un Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {pokemon && !error && (
        <div className="pokemon">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
      )}
    </div>
  );
}

export default App;
