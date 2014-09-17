/**********************************/
/* Juan Gabriel Rodríguez Carrión */
/*    jlabstudio.com       2012   */
/**********************************/

function Bola(mundo,radio,punto,color){

	this.mundo=mundo;
	this.radio=radio;
	this.centro=punto;
	this.ini=new Punto2D(punto.get("x"),punto.get("y"));
	this.color=color;
	this.vx=0;
	this.vy=0;
	this.tiempo=0;
	
	this.destruida=false;
	
	//Creamos unas velocidades iniciales para el eje X e Y según el ángulo y la cantidad de fuerza suministrada
	this.aplicarFuerza=function (velocidad,angulo){
		//Convertimos el ángulo de grados a radianes, necesario para poder calcular
		//el seno y el coseno en javascript
		var radianes=(angulo / 180) * Math.PI;
		this.vx=velocidad*Math.cos(radianes);
		//El - del principio se debe a que la Y debe decrecer para ir hacia arriba
		this.vy=-velocidad*Math.sin(radianes);
	};
	
	//Aplicamos los cálculos físicos del tiro parabólico
	this.mover=function (delta){
		if (this.destruida) return;
		this.tiempo+=delta*mundo.escalaTiempo;
		this.centro.set("x",this.ini.get("x")+this.vx*this.tiempo);
		this.centro.set("x",this.ini.get("x")+this.vx*this.tiempo+this.mundo.get("viento")/2*this.tiempo*this.tiempo);
		this.centro.set("y",this.ini.get("y")+this.vy*this.tiempo+this.mundo.get("gravedad")/2*this.tiempo*this.tiempo);
		
		if(this.centro.get("x")>this.mundo.get("anchura")+this.radio*4 || this.centro.get("y")>this.mundo.get("altura") || this.centro.get("x")<-this.radio*4){
			this.mundo.eliminarBola(this);
		}
	};
	this.dibujar=function(contexto){
		if (this.destruida) return;
		contexto.beginPath();
		contexto.arc(this.centro.get("x"), this.centro.get("y"), this.radio, 0, 2 * Math.PI, false);
		contexto.fillStyle = this.color;
		contexto.fill();
	};
	
	//Cálculo de colisiones en 2D entre círculos y rectángulos
	this.colisiona=function(rec){
		if (this.destruida) return false;
		var cdx=Math.abs(this.centro.get("x")-rec.get("x")-rec.get("ancho")/2);
		var cdy=Math.abs(this.centro.get("y")-rec.get("y")-rec.get("alto")/2);
		
		if(cdx>(rec.get("ancho")/2+this.radio)) return false;
		if(cdy>(rec.get("alto")/2+this.radio)) return false;
		if(cdx<=(rec.get("ancho")/2)) return true;
		if(cdy<=(rec.get("alto")/2)) return true;
		
		var distancia=Math.pow(cdx-rec.get("ancho")/2,2)+Math.pow(cdy-rec.get("alto")/2,2);
		return (distancia<=Math.pow(this.radio,2));
	};
}