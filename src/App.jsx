import { useState } from 'react'
import { useEffect } from 'react'
import './App.css';

function ShowPokemon({pokemons, handleClick}) {
  return (
    <div>
          {pokemons.map((pokemon) => {
            return <button key={pokemon.id} onClick = {() => handleClick(pokemon)}><img src={pokemon.image} style = {{ height: 50, width: 50}}/>{pokemon.name}</button>;
          })}
    </div>
  )
}

export default function App() {
  const [pokemons, setPokemons] = useState([])
  const [team, setTeam] = useState([])
  const [offset, setOffSet] = useState(20)
  const [textboxvalue, setTextBoxValue] = useState('')
  const limit = 20
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)
        .then(res => res.json())
        .then(json => {
          const pokemonList = json.results.map(pokemon => 
            fetch(pokemon.url)
              .then(res => res.json())
              .then(data => ({
                  id: data.id,
                  name: pokemon.name,
                  image: data.sprites.front_default,
              }))
          )

          Promise.all(pokemonList) 
            .then(pokemonData => {
              setPokemons(pokemonData)
            });
          })
  }, [offset]);
  
  function MakeTeams(pokemon) {
    if (team.length > 4) {
      alert("Past limit")
    } else {
      setTeam(prevTeam => [...prevTeam, pokemon]);
    }
  }

  function AdjustTeams(pokemonToRemove) {
    setTeam((prevTeam) => {
      const indexToRemove = prevTeam.findIndex(
        (pokemon) => pokemon.id === pokemonToRemove.id
      );

      if (indexToRemove !== -1) {
        return [
          ...prevTeam.slice(0, indexToRemove),
          ...prevTeam.slice(indexToRemove + 1),
        ];
      }

      return prevTeam;
    });
  }

  function NextPage() {
    if (offset === 1300) {
      alert("No more pokemon")
    } else {
      setOffSet(prevOffSet => prevOffSet + limit)
    }
  }

  function PreviousPage() {
    if (offset === 20) {
      alert("No more pokemon")
    } else {
      setOffSet(prevOffSet => prevOffSet - limit)
    }
  }

  async function Search() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${textboxvalue.toLowerCase()}`)
      if (response.ok) {
        const data = await response.json()

        const pokemon = {
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
        }

        MakeTeams(pokemon)
      } else {
        alert("Doesn't match boiiiii")
      }
      setTextBoxValue('')
  }

  return (
    <>
      <h1>Pokemon Team Builder</h1>
      <input placeholder="Enter pokemon name" value={textboxvalue} onChange={(event) => setTextBoxValue(event.target.value)}></input>
      <button onClick={Search}>Search for pokemon</button>
      <h2>Choose 5</h2>
      <ShowPokemon pokemons={pokemons} handleClick={MakeTeams}/>
      <br></br> 
      <div className = "container">
        <button onClick={PreviousPage}>Previous Page</button> 
        <button onClick={NextPage}>Next Page</button>
      </div>
      <h3>My Team: </h3>
      {team.map((pokemon, index) => (
        <button key={`${pokemon.id}-${index}`} onClick = {() => AdjustTeams(pokemon)}><img src={pokemon.image} style = {{ height: 50, width: 50 }}/> Click to remove {pokemon.name}</button>
      ))}
    </>
  )
}


