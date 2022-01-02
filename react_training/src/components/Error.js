import React from 'react';

const Error = () => {

	const errorStyle = {
		color: 'red',
	};

	return(
		<section id="Error">
			<h2 style={errorStyle}>404 - Página no encontrada</h2>
			<p>La página a la que se quiere acceder no existe.</p>
		</section>
	);
}



export default Error;
