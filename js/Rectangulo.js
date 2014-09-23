
/**
* Clase que nos servirá para manejar los puntos
*/
function Rectangulo(p,ancho,alto,color){
	this.pos=p; //Vertice superior izquierdo
	this.ancho=ancho;
	this.alto=alto;
	this.color=color;
	
	/*Getter y Setter*/
	this.get=function(variable){
		switch(variable)
		{
			case "pos":
				return this.pos;
			case "ancho":
				return this.ancho;
			case "alto":
				return this.alto;
			case "x":
				return this.pos.get("x");
			case "y":
				return this.pos.get("y");
			case "color":
				return this.color;
		}
	};
	
	this.dibujar=function(contexto){
		contexto.fillStyle = this.color;  
        contexto.fillRect(this.pos.get("x"), this.pos.get("y"), this.ancho, this.alto);
	};
}