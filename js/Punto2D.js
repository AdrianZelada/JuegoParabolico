/**********************************/
/* Juan Gabriel Rodríguez Carrión */
/*    jlabstudio.com       2012   */
/**********************************/

/**
* Clase que nos servirá para manejar los puntos
*/
function Punto2D(x,y){
	this.x=x;
	this.y=y;
	
	/*Getter y Setter*/
	this.get=function(variable){
		switch(variable)
		{
			case "x":
				return this.x;
			case "y":
				return this.y;
		}
	};
	this.set=function(variable, valor){
		switch(variable)
		{
			case "x":
				this.x=valor;
				break;
			case "y":
				this.y=valor;
		}
	};
}