import React, {Component} from 'react';

import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Blog from './components/Blog';
import Search from './components/Search';
import Article from './components/Article';
import CreateArticle from './components/CreateArticle';
import EditArticle from './components/EditArticle'

import Error from './components/Error';





class Router extends Component{

	render(){
		return(
			<BrowserRouter>

				<Header/> 

		        <Switch>
					<Route exact path="/home" component={Home} />

					<Route exact path="/blog" component={Blog} />

					<Route exact path="/blog/search/:search" component={Search} />

					<Route exact path="/blog/create" component={CreateArticle} />

					<Route exact path="/redirect/:search" render={
						(props) => {
							let search = props.match.params.search;
							return (<Redirect to={'/blog/search/' + search} />);
						}
					} />

					<Route exact path="/blog/article/:id" component={Article} />

					<Route path="/blog/edit/:id" component={EditArticle} />

					<Route component={Error} />
				</Switch>

		       
		        

		        <div className="clearfix"></div>
			     

				<Footer/>
			</BrowserRouter>
		);
	}
}



export default Router;