import { Component } from 'solid-js';
import { Link, useRoutes, useLocation } from 'solid-app-router';
import { routes } from './routes';

const App: Component = () => {
	const location = useLocation();
	const Route = useRoutes(routes);

	return (
		<>
			<nav className="bg-gray-700">
				<ul className="flex items-center">
					<li className="py-2 px-4">
						<Link href="/">Home</Link>
					</li>
					<li className="py-2 px-4">
						<Link href="/example">Example Page</Link>
					</li>
					<li className="py-2 px-4">
						<Link href="/error">Test Error</Link>
					</li>
				</ul>
			</nav>
			<div className="font-mono text-slate-50	">Hello From Solid</div>
			<main>
				<Route />
			</main>
		</>
	);
};

export default App;
