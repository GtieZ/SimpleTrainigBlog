import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';

import Global from '../Global'
import ImageDefault from '../assets/images/default.png';


class Articles extends Component{

	url = Global.url;


	state = {
		articles: [],
		status: null,
	};


	dateFormater(date){
		let fDate= new Date(date);
		return fDate.toString();
	}


	componentWillMount(){
		let home = this.props.home;
		let search = this.props.search;

		if(home === 'true'){
			this.getLastArticles();
		} else if(search && search != null && search != undefined){
			this.getArticlesBySearch(search);
		} else{
			this.getArticles();
		}	
	}


	getArticlesBySearch = (searched) => {
		let endpoint = this.url + 'search/' + searched;
		axios.get(endpoint)
			.then( res => {
				this.setState({
					articles: res.data.articles,
					status: 'success'
				});
			}). catch(err => {
				this.setState({
					articles: [],
					status: 'success'
				});
			});
	};



	getLastArticles = () => {
		let endpoint = this.url + 'articles/last';
		axios.get(endpoint)
			.then( res => {
				this.setState({
					articles: res.data.articles,
					status: 'success'
				});
			});
	};


	getArticles = () => {
		let endpoint = this.url + 'articles';
		axios.get(endpoint)
			.then( res => {
				this.setState({
					articles: res.data.articles,
					status: 'success'
				});
			});
	};



	
	
	render(){

		if(this.state.articles.length > 0){
			let listArticles = this.state.articles.map( (article, index) => {
				return (
					<article className="article-item" id="article-template" key={article._id}>
                        <div className="image-wrap">
                        	{ 
                        		article.image != null ? (
	                        		<img src={this.url+'get-image/'+article.image} alt={article.title}/>
	                        	) : (
	                        		<img src={ImageDefault}/>
	                        	)
	                        }
                        </div>
    
                        <h2> {article.title} </h2>

                        <span className="date">
	                        <Moment locale="es" fromNow>
	                        	{ this.dateFormater(article.date) }
	                        </Moment>
                        </span>

                        <Link to={'/blog/article/' + article._id}>Leer más</Link>
                      
                        <div className="clearfix"></div>
                    </article>
				);
			});
			return (
				<div id="articles">
					{listArticles}
				</div>
			);

		} else if(this.state.articles.length === 0 && this.state.status === 'success'){
			return (
				<div id="articles">
					<h2 className="subheader">No hay artículos para mostrar</h2>
					<p>Todavía no hay contenido en esta sección.</p>
				</div>
			);
		} else{
			return (
				<div id="articles">
					<h2 className="subheader">Cargando...</h2>
					<p>Espere mintras carga el contenido.</p>
				</div>
			);
		}	
	}
}


export default Articles;
