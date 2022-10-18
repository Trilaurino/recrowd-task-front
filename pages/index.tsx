import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { Navbar } from '../components/Navbar';

const Home: NextPage = () => {
	return (
		<>
			<Navbar teamCreator teamList />
			<div className={styles.container}>
				<main className={styles.main}>
					<h1>Pokemon Team Manager</h1>
					<h2>Recrowd task - Triana Laurino</h2>
				</main>
			</div>
		</>
	);
};

export default Home;
