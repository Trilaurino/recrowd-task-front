import styles from './Navbar.module.css';
import { useRouter } from 'next/router';

interface INavbarProps {
	teamCreator?: boolean;
	teamList?: boolean;
}

export const Navbar = ({ teamCreator, teamList }: INavbarProps) => {
	const router = useRouter();

	return (
		<nav className={styles.navbar}>
			{teamList && (
				<a onClick={() => router.push('/team/list')}>All Teams List</a>
			)}
			{teamCreator && (
				<a onClick={() => router.push('/team/create')}>Team Creator</a>
			)}
		</nav>
	);
};
