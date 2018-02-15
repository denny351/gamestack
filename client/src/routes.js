import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './hoc/layout';
import Home from './components/Home/home';
import GamePage from './containers/games_container';
import Login from './containers/Admin/login';
import User from './components/Admin';

import Auth from './hoc/auth';

const Routes = () => {
	return (
		<Layout>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/game/:id" exact component={GamePage} />
				<Route path="/login" exact component={Login} />
				<Route path="/user" exact component={User} />

			</Switch>
		</Layout>
	);
};

export default Routes;
