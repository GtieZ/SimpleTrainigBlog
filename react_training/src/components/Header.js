import React, {Component} from 'react';
import logo from '../assets/images/react.svg'

import {NavLink} from 'react-router-dom';



class Header extends Component{


	render(){

		return(
		        <header id="header">
		            <div className="center">
		                {/*  LOGO  */}
		                <div id="logo">
		                    <img src={logo} className="app-logo" alt="Logotipo" />
		                    <span id="brand">
		                        <strong>React</strong>Training
		                    </span>
		                </div>
		                
		                {/* MENU  */}
		                <nav id="menu"> 
		                    <ul>
		                        <li>
		                        	<NavLink to = "/home" activeClassName="active">Inicio</ NavLink>
		                            
		                        </li>
		                        <li>
		                            <NavLink to = "/blog" activeClassName="active">Blog</ NavLink>
		                        </li>
		                        <li>
		                            <NavLink to = "/otro-mas" activeClassName="active">Formularios</ NavLink>
		                        </li>
		                        <li>
		                            <NavLink to = "/la pinga" activeClassName="active">Página 1</ NavLink>
		                        </li>
		                        <li>
		                            <NavLink to = "/prueba" activeClassName="active">Página 2</ NavLink>
		                        </li>                            
		                    </ul>
		                </nav>

		                { /*LIMPIAR FLOTADOS*/ }
		                <div className="clearfix"></div>
		            </div>
		        </header>
			);
	} // end render
}


export default Header;
