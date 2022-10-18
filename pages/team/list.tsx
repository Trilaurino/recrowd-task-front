import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import styles from './list.module.css';
import { TeamDisplay } from '../../components/TeamDisplay';
import { ITeamInterface } from '../../types/team';

// creationDate was not requested to be displayed in the task, but is left to debug sorting
const TeamList = () => {
	const [teamsFromDb, setTeamsFromDb] = useState<ITeamInterface[]>([]);
	const [pokemonsToDisplay, setPokemonsToDisplay] = useState<any[]>([]);
	const [typeFilter, setTypeFilter] = useState<string>('all');

	const getTeamsFromDb = async () => {
		const teams = await fetch('http://localhost:4556/api/teams');
		const teamsJson = await teams.json();
		const transformArray = teamsJson.map((team: ITeamInterface) => {
			return {
				teamName: team.team_name,
				teamId: team.team_id,
				creationDate: team.creation_date,
				pokemons: team.pokemons.split(',').map(Number),
			};
		});
		setTeamsFromDb(transformArray);
	};

	// reduces the array of all pokemon ids in all teams, to a single array of unique pokemon ids
	// we do this to omit repeating calls to the API for the same pokemon
	const reducePokemonIds = (teams: ITeamInterface[]) => {
		const allPokemonIds = teams.reduce((acc: any, team: any) => {
			return [...acc, ...team.pokemons];
		}, []);
		const filterPokemonIds = allPokemonIds.filter(
			(value: number, index: number) => allPokemonIds.indexOf(value) === index
		);
		return filterPokemonIds;
	};

	// fetches all pokemon data from the pokemon api, and returns an array of pokemon objects
	const getPokemonsInTeams = async () => {
		const pokemonIds = reducePokemonIds(teamsFromDb);
		const pokemonPromises = pokemonIds.map((id: number) =>
			fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
		);
		const pokemonResponses = await Promise.all(pokemonPromises);
		const pokemonJsons = await Promise.all(
			pokemonResponses.map((response) => response.json())
		);
		setPokemonsToDisplay(pokemonJsons);
	};

	// array of all unique pokemon types
	const allUniqueTypes = pokemonsToDisplay.reduce((acc: any, pokemon: any) => {
		const types = pokemon.types.map((type: any) => type.type.name);
		return [...acc, ...types];
	}, []);

	// checks if a team has any pokemon of the selected type
	const teamHasType = (team: ITeamInterface, type: string) => {
		const teamPokemonIds = team.pokemons;
		const teamPokemon = pokemonsToDisplay.filter((pokemon: any) =>
			teamPokemonIds.includes(pokemon.id)
		);
		const teamTypes = teamPokemon.reduce((acc: any, pokemon: any) => {
			const types = pokemon.types.map((type: any) => type.type.name);
			return [...acc, ...types];
		}, []);
		return teamTypes.includes(type);
	};

	useEffect(() => {
		getTeamsFromDb();
	}, []);

	useEffect(() => {
		getPokemonsInTeams();
	}, [teamsFromDb]);

	return (
		<>
			<Navbar teamCreator />
			<div className={styles.container}>
				<h1>Team List</h1>
				<div className={styles.filter}>
					<div>Filter by type:</div>
					<select onChange={(e) => setTypeFilter(e.target.value)}>
						<option value='all'>All</option>
						{allUniqueTypes.map((type: string, key: number) => (
							<option key={key} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
				<div className={styles.teamDisplay}>
					{teamsFromDb.map((team) =>
						typeFilter === 'all' || teamHasType(team, typeFilter) ? (
							<TeamDisplay team={team} pokemonsToDisplay={pokemonsToDisplay} />
						) : null
					)}
				</div>
			</div>
		</>
	);
};

export default TeamList;
