'use strict'

const mongoose = require('mongoose');
const app = require('./app');
let port = 3900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true})
		.then( () => {
			console.log("La conexión a la base de datos ha sido satisfactoria!!!");

			//Crear servidor y ponerlo a la escucha
			app.listen(port, () => {
				console.log("Servidor corriendo en puerto http://localhost:"+port);


			});


		});
