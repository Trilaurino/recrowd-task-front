import styles from './PokemonDisplay.module.css';

export const PokemonDisplay = ({ pokemon }: any) => {
	return (
		<div key={pokemon.id} className={styles.container}>
			<img src={pokemon.sprites.front_default} alt={pokemon.name} />
			<h2>{pokemon.name}</h2>
			<p>Experience: {pokemon.base_experience}</p>
			<ul className={styles.abilities}>Abilities:</ul>
			{pokemon.abilities.map((ability: any, key: any) => (
				<li key={key}>{ability.ability.name}</li>
			))}
			<ul className={styles.types}>Types:</ul>
			{pokemon.types.map((type: any, key: any) => (
				<li key={key}>{type.type.name}</li>
			))}
		</div>
	);
};
