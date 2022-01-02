import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Moment from 'react-moment';
import 'moment/locale/es';

import Sidebar from './Sidebar';

import Global from '../Global';
import ImageDefault from '../assets/images/default.png';



class Article extends Component{

	url = Global.url;

	state = {
		article: false,
		status: null
	};

	dateFormater(date){
		let fDate= new Date(date);
		return fDate.toString();
	}


	componentWillMount(){
		this.getArticle();
	}


	getArticle = () => {
		let id = this.props.match.params.id;
		let endpoint = this.url + '/article/' + id;

		axios.get(endpoint)
		.then(res => {
			this.setState({
				article: res.data.article,
				status: 'success'
			});
		});
	};


	deleteArticle = (id) => {
		swal({
			title: "¿Está seguro?",
			text: "El articulo se borrará de manera permanente",
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then( (willDelete) => {
			if(willDelete){
				let endpoint = this.url + 'article/' + id;
				axios.delete(endpoint)
					.then( res => {
						this.setState({
							article: res.data.article,
							status: 'deleted'
						});
					});

				swal(
					"Artículo borrado",
					"El artículo se ha borrado correctamente.",
					"success"
				);
			} else{
				swal(
					"Tranquilo",
					"No se ha borrado nada.",
					"success"
				);
			}
		});
	};


	render(){

		if(this.state.status === 'deleted'){
			return <Redirect to='/blog' />
		} 

		const article = this.state.article;
		return (
			<div className="center">
	            <section id="content">
	            	{ article ? ( 
	                    <article className="article-item article-detail">
	                        <div className="image-wrap">
	                        	{ 
	                        		article.image != null ? (
		                        		<img src={this.url+'get-image/'+article.image} alt={article.title}/>
		                        	) : (
		                        		<img src={ImageDefault}/>
		                        	)
	                       		}
	                        </div>
	    
	                        <h1 className="subheader"> {article.title} </h1>
	                        <span className="date">
	                        	<Moment locale="es" fromNow> 
	                        		{ this.dateFormater(article.date) } 
	                        	</Moment>
	                        </span>
	                        <p>
	                        	{article.content}    
	                        </p>

	                        <button onClick={
	                        	() => {
	                        		this.deleteArticle(article._id);
	                        	}
	                        } 
	                        className="btn btn-danger">Eliminar</button>

	                        <Link to={'/blog/edit/' + article._id}  className="btn btn-warning">Editar</Link>
	                    
	                        <div className="clearfix"></div>
	                    </article> 

	                    ) : (
	                    	<article>
	                    		<h2 className="subheader">El artículo no existe</h2>
	                    		<p>No se ha encontrado ningún artículo.</p>
	                    	</article>
	                    )
	            	}
	            </section>

	            <Sidebar />

	            <div className="clearfix"></div>
	        </div>
		);
	}
}


export default Article;