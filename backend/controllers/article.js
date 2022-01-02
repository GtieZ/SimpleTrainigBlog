'use strict'

const validator = require('validator');
const fs = require('fs');
const path = require('path');

const Article = require('../models/article');


var controller = {

	save: (req, res) => {
		//Recoger los parámetros por POST
		let params = req.body;
		
		//Validar datos (validator)
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content); 
		} catch(err){

			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar!!!',
			});
		}

		if(validate_title && validate_content){
			//Crear el objeto a guardar
			let article = new Article();

			//Asignar valores
			article.title = params.title;
			article.content = params.content;
			article.image = null;

			//Guardar artículo
			article.save( (err, articleStored) => {
				if(err || !articleStored){
					return res.status(404).send({
						status: 'error',
						message: 'El artículo no se ha guardado!!!'
					});
				}
				//Devolver la respuesta
				return res.status(200).send({
					status: "success",				
					article: articleStored
				});
			});

		} else{
			return res.status(200).send({
				status: 'error',
				message: "Los datos no son válidos!!",
			});
		}
	}, //end save

	getArticles: (req, res) => {

		let query = Article.find({});
		let last = req.params.last;

		if(last || last != undefined){
			query.limit(5);
		}

		//Find
		query.sort('-_id').exec( (err, articles) => {
			if(err){
				return rest.staus(500).send({
					status: 'error',
					message: 'Error al devolver los artículos!!!!'
				});
			}

			if(!articles){
				return rest.staus(404).send({
					status: 'error',
					message: 'No hay artículos....'
				});
			}

			return res.status(200).send({
				staus: 'success',
				articles
			});
		});
	}, //end getArticles

	getArticle: (req, res) => {
		//Recoger id de la url
		let articleId = req.params.id;

		//Comprobando que el artículo existe
		if(!articleId || articleId == null){
			return res.status(404).send({
				status: 'error',
				message: 'El artículo no existe!!!'
			});
		}

		//Buscar el artículo
		Article.findById(articleId, (err, article) => {
			if(err || !article){
				return res.status(404).send({
					status: 'error',
					message: 'El artículo no existe!!!'
				});
			}

			return res.status(200).send({
				message: 'success',
				article
			});
		});
	}, // end getArticle

	update: (req, res) => {
		//Recoger el id del artículo por la url
		let articleId = req.params.id;
		//Recoger los datos
		let params = req.body;
		//Validar los datos
		try{
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
		} catch(err){
			return res.status(404).send({
				status: 'error',
				message: 'Faltan datos por enviar!!!'
			});
		}

		if(validate_title && validate_content){
			//Find and update
			Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
				if(err){
					return res.status(500).send({
						status: 'error',
						message: 'Error al actualizar!!!!'
					});
				}

				if(!articleUpdated){
					return res.status(404).send({
						status: 'error',
						message: 'No existe el artículo!!!!'
					});
				}

				return res.status(200).send({
					status: 'success',
					article: articleUpdated
				});
			});

		} else{
			return res.status(200).send({
				status: 'error',
				message: 'La validación no es correcta!!!!'
			});
		}
	}, // end upadate

	delete: (req, res) => {
		//Recoger id de la url
		let articleId = req.params.id;
		//Find and delete
		Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {

			if(err){
				return res.status(500).send({
					status: 'error',
					message: 'Error al borrar!!!'
				});
			}

			if(!articleRemoved){
				return res.status(404).send({
					staus: 'error',
					message: 'No se ha encontrado el artículo!!!'
				});
			}

			return res.status(200).send({
				status: 'success',
				message: 'El articulo ha sido borrado',
				article: articleRemoved
			});
		});
	}, //end delete

	upload: (req, res) => {
		//Recojer el fichero de la petición
		let file_name = 'Imagen no subida....';

		if(!req.files || req.files.file0 == undefined){
			return res.status(404).send({
				status: 'error',
				message: file_name
			});
		}
		//Conseguir el nombre y extensión del archivo
		let file_path = req.files.file0.path;
		let file_split = file_path.split('/');

		file_name = file_split[2];
		let file_ext = file_name.split('.')[1];

		//Comprobar la extensión, solo imágenes y si no es válida borrar el fichero
		if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){

			//Borrar el archivo subido
			fs.unlink(file_path, (err) => {
				return res.status(200).send({
					status: 'error',
					message: 'La extension del fichero no es válida!!!'
				});
			});
		} else {
			//Buscar el artículo, asignarle el nobre de la imagen y actualizarlo
			let articleId = req.params.id;
			Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
				if(err || !articleUpdated){
					return res.status(500).send({
						status: 'error',
						message: 'Error al guardar la imagen de artículo!!!!'
					});
				}
				return res.status(200).send({
					status: 'success',
					article: articleUpdated
				});
			});
		}
	}, //end upload

	getImage: (req, res) => {
		let file = req.params.image;
		let path_file = './upload/articles/'+file;

		fs.exists(path_file, (exists) => {
			if (exists){
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(404).send({
					status: 'error',
					message: 'La imagen no existe!!!!!'
				});
			}
		});
	}, //end getImage

	search: (req, res) => {
		//Sacar el string a buscar
		let searchString = req.params.search;
		//Find
		Article.find({ "$or": [
			{"title": {"$regex": searchString, "$options": "i"}},
			{"content": {"$regex": searchString, "$options": "i"}},
		]})
		.sort([['date', 'descending']])
		.exec( (err, articles) => {
			if(err){
				return res.status(500).send({
					status: error,
					message: 'Error en la petición!!'
				});
			}
			if(!articles || articles.length <= 0){
				return res.status(404).send({
					status: 'success',
					message: 'No hay artículos para mostrar...'
				});
			}
			return res.status(200).send({
				status: 'success',
				articles
			});
		}); //end Article.find
	}, // end search






}; //end controller



module.exports = controller;
