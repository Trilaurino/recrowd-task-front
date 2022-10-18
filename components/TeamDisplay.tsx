import { useRouter } from 'next/router';
import styles from './TeamDisplay.module.css';

export const TeamDisplay = ({ team, pokemonsToDisplay }: any) => {
	const router = useRouter();

	return (
		<div key={team.teamId} className={styles.teamContainer}>
			<h2
				onClick={() => router.push(`/team/${team.teamId}/edit`)}
				className={styles.teamName}>
				{team.teamName}
			</h2>
			<h4>Id: {team.teamId}</h4>
			<p>
				<strong>Creation date:</strong> {team.creationDate.slice(0, 10)}
			</p>
			<div className={styles.pokemonSpriteContainer}>
				{team.pokemons.map((pokemonId: number, key: number) => (
					<img
						key={key}
						src={
							pokemonsToDisplay.find((pokemon: any) => pokemon.id === pokemonId)
								?.sprites.front_default
						}
					/>
				))}
			</div>
			<p>
				<strong>Sum of experience: </strong>
				{pokemonsToDisplay
					.filter((pokemon: any) => team.pokemons.includes(pokemon.id))
					.reduce(
						(acc: number, pokemon: any) => acc + pokemon.base_experience,
						0
					)}
			</p>
			<p>
				<strong>Types: </strong>
				{pokemonsToDisplay
					.filter((pokemon: any) => team.pokemons.includes(pokemon.id))
					.reduce((acc: any, pokemon: any) => {
						const types = pokemon.types.map((type: any) => type.type.name);
						return [...acc, ...types];
					}, [])
					.filter(
						(value: string, index: number, self: string[]) =>
							self.indexOf(value) === index
					)
					.join(', ')}
			</p>
		</div>
	);
};
