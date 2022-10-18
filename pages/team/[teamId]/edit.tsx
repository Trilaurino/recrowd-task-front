import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Navbar } from '../../../components/Navbar';
import { randomNumberBetween } from '../../../helpers/randomNumber';
import styles from './edit.module.css';

const TeamEdit = () => {
	const [teamFromDb, setTeamFromDb] = useState<any>({});
	const router = useRouter();
	const { teamId } = router.query;

	const getSingleTeamFromDb = async (id: string | string[] | undefined) => {
		if (id === undefined) return;
		const team = await fetch(`http://localhost:4556/api/teams/${teamId}`);
		const teamJson = await team.json();
		const transformedTeam = transformArray(teamJson);
		setTeamFromDb(transformedTeam);
	};

	const transformArray = (team: any) => {
		return {
			...team,
			pokemons: team.pokemons.split(',').map(Number),
		};
	};

	const handleDelete = async (pokemonId: number) => {
		const newPokemonList = teamFromDb.pokemons.filter(
			(id: number) => id !== pokemonId
		);
		const newPokemonListString = newPokemonList.join(',');
		const updatedTeam = {
			team_id: teamFromDb.team_id,
			team_name: teamFromDb.team_name,
			creation_date: teamFromDb.creation_date,
			pokemons: newPokemonListString,
		};
		await fetch(`http://localhost:4556/api/teams/${teamId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedTeam),
		});
		setTeamFromDb(transformArray(updatedTeam));
	};

	const handleAdd = async () => {
		const newPokemonList = [
			...teamFromDb.pokemons,
			randomNumberBetween(1, 898),
		];
		const newPokemonListString = newPokemonList.join(',');
		const updatedTeam = {
			team_id: teamFromDb.team_id,
			team_name: teamFromDb.team_name,
			creation_date: teamFromDb.creation_date,
			pokemons: newPokemonListString,
		};
		await fetch(`http://localhost:4556/api/teams/${teamId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedTeam),
		});
		setTeamFromDb(transformArray(updatedTeam));
	};

	useEffect(() => {
		getSingleTeamFromDb(teamId);
	}, [teamId]);

	return (
		<>
			<Navbar teamCreator teamList />
			<div className={styles.container}>
				<h1>Team Edit</h1>
				<p>
					<strong>Team name:</strong> {teamFromDb.team_name}
				</p>
				<p>
					<strong>Team Id:</strong> {teamFromDb.team_id}
				</p>
				<p>
					<strong>Creation date: </strong>
					{teamFromDb.creation_date?.slice(0, 10)}
				</p>
				<div>
					<p>
						<strong>Pokemon Id:</strong>
					</p>
					<div className={styles.pokemonList}>
						{teamFromDb.pokemons?.map((pokemonId: number, key: any) => (
							<div key={key}>
								<span>{pokemonId}</span>
								<button onClick={() => handleDelete(pokemonId)}>Delete</button>
							</div>
						))}
					</div>
				</div>
				<button onClick={() => handleAdd()} className={styles.addButton}>
					Add random Pokemon to team
				</button>
			</div>
		</>
	);
};

export default TeamEdit;
