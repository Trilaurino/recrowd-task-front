import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { PokemonDisplay } from '../../components/PokemonDisplay';
import styles from './create.module.css';
import { randomNumberBetween } from '../../helpers/randomNumber';

const TeamCreator = () => {
	const [pokemonsInTeam, setPokemonsInTeam] = useState<number[]>([]);
	const [teamName, setTeamName] = useState<string>('');

	const router = useRouter();

	const randomPokemon = () => {
		const randomId = randomNumberBetween(1, 898);
		return `https://pokeapi.co/api/v2/pokemon/${randomId}`;
	};

	const addRandomPokemon = async () => {
		const pokemon = await fetch(randomPokemon());
		const pokemonJson = await pokemon.json();
		setPokemonsInTeam([...pokemonsInTeam, pokemonJson]);
	};

	const submitTeam = async () => {
		const requestBody = {
			team_name: teamName,
			pokemons: pokemonsInTeam.map((pokemon: any) => pokemon.id).toString(),
			team_id: nanoid(5),
			creation_date: new Date().toISOString().split('T')[0],
		};
		const response = await fetch('http://localhost:4556/api/teams', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify(requestBody),
		});
		const responseJson = await response;
		setTimeout(() => router.push('/team/list'), 1500);
	};

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTeamName(e.target.value);
	};

	return (
		<>
			<Navbar teamList />
			<div className={styles.container}>
				<h1>Team Creator</h1>
				<span>Team Name:</span>
				<input
					type='text'
					className={styles.teamNameInput}
					onChange={(e) => handleNameChange(e)}></input>
				<div className={styles.teamDisplay}>
					{pokemonsInTeam.map((pokemon: any) => (
						<PokemonDisplay pokemon={pokemon} />
					))}
				</div>
				<button className={styles.button} onClick={() => addRandomPokemon()}>
					Gotta Catch 'Em All
				</button>
				<button onClick={() => submitTeam()} className={styles.button}>
					Save Team
				</button>
			</div>
		</>
	);
};

export default TeamCreator;
