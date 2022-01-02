import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import axios from 'axios';

import Sidebar from './Sidebar';

import Global from '../Global';
import ImageDefault from '../assets/images/default.png';



class EditArticle extends Component {


	url = Global.url;
	articleId = null;

	titleRef = React.createRef();
	contentRef = React.createRef();

	state = {
		article: {},
		status: null,
		selectedFile: null
	};


	componentWillMount(){
		this.articleId = this.props.match.params.id;
		this.getArticle(this.articleId);

		this.validator = new SimpleReactValidator({
			messages: {
				required: 'El campo es requerido.',
				alpha: 'Solo puede contener letras'
			}
		});
	}


	getArticle = (id) => {
		let endpoint = this.url + 'article/' + id;
		axios.get(endpoint)
			.then( res => {
				this.setState({
					article: res.data.article
				});
			});
	};


	changeState = () => {
		this.setState({
			article: {
				title: this.titleRef.current.value,
				content: this.contentRef.current.value,
				image: this.state.article.image
			},
		});
	};



	saveArticle = (e) => {
		e.preventDefault();

		this.changeState();

		if(this.validator.allValid()){
			let endpoint = this.url + 'article/' + this.articleId;
			axios.put(endpoint, this.state.article)
				.then( res => {
					if(res.data.article){
						this.setState({
							article: res.data.article,
							status: 'waiting'
						});

						swal("Artículo actualizado",
							"El artículo se ha actualizado correctamente.",
							"success"
						);

						if(this.state.selectedFile !== null){
							let articleId = this.state.article._id;

							const formData = new FormData();
							formData.append(
								'file0', 
								this.state.selectedFile,
								this.state.selectedFile.name
							);

							let endpoint = this.url + 'upload-image/' + articleId;
							axios.post(endpoint, formData)
							.then(res => {
								if(res.data.article){
									this.setState({
										article: res.data.article,
										status: 'success'
									});
								} else{
									this.setState({
										article: res.data.article,
										status: 'failed'
									});
								}
							});
						} else{
							this.setState({
								status: 'success'
							});
						}
					} else{
						this.setState({
							status: 'failed'
						});
					}
				});

		} else {

			this.setState({
				status: 'failed'
			});

			this.validator.showMessages();
			this.forceUpdate();
		}
	};


	fileChange = (event) => {
		this.setState({
			selectedFile: event.target.files[0]
		});


	};


	render(){

		let article = this.state.article;

		if(this.state.status === 'success'){
			return <Redirect to="/blog" />;
		}

		return (

			<div className="center">
				<section id="content">
					<h1 className="subheader">Editar artículo</h1>

					{this.state.article.title &&

						<form className="mid-form" onSubmit={this.saveArticle}>
							<div className="form-group">
								<label htmlFor="title">Título</label>
								<input type="text" name="title" defaultValue={article.title} ref={this.titleRef} onChange={this.changeState} />
								{this.validator.message('title', this.state.article.title, 'required|alpha')}
							</div>


							<div className="form-group">
								<label htmlFor="content">Contenido</label>
								<textarea name="content" defaultValue={article.content} ref={this.contentRef} onChange={this.changeState} ></textarea>
								{this.validator.message('title', this.state.article.title, 'required')}
							</div>

							<div className="form-group">
								<label htmlFor="file0">Imagen</label>
								<input type="file" name="file0" onChange={this.fileChange} />
							</div>

							<div className="image-wrap">
	                        	{ 
	                        		article.image != null ? (
		                        		<img src={this.url+'get-image/'+article.image} 
		                        		alt={article.title} className="thumb"/>
		                        	) : (
		                        		<img src={ImageDefault} className="thumb" />
		                        	)
	                       		}
	                        </div>

	                        <div className="clearfix"></div>

							<input type="submit" value="Guardar" className="btn btn-success" />
						</form>

					}

					{!this.state.article.title && 

						<h1 className="subheader">Cargando...</h1>
					}

				



				</section>


				<Sidebar />
			</div>

		);
	}
}



export default EditArticle;
