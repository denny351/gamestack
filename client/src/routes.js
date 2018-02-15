import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './hoc/layout';
import Home from './components/Home/home';
import GamePage from './containers/games_container';
import Login from './containers/Admin/login';

const Routes = () => {
	return (
		<Layout>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/game/:id" exact component={GamePage} />
				<Route path="/login" exact component={Login} />
        
			</Switch>
		</Layout>
	);
};

export default Routes;
