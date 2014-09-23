

function Mundo(){
	this.escalaTiempo=5;	//El tiempo transcurrir� X veces m�s r�pido
	
	this.canvas;
	this.contexto;
	
	this.radioBola=5;		//El radio de la bola
	this.bolas=[];			//Las bolas que hay volando
	this.elimBolas=[];		//Las bolas que hay que eliminar en la siguiente vuelta del bucle
	
	this.minRec=5;			//El n�mero m�nimo de obst�culos que pintar en el escenario
	this.maxRec=10;			//El n�mero m�ximo de obst�culos
	this.rangoAltura=0.5; 	//Altura max obstaculos en relacion al heigth del canvas
	this.rectangulos=[];	//Lista con los obstaculos
	
	this.ladoJugador=20;	//Lado del cuadrado que forma al jugador
	this.jugadores=[];		//Lista de jugadores (habr� 2)
	
	this.gravedad=9.8;		//Gravedad del mundo
	this.maxViento=2;		//M�xima fuerza absoluta del viento
	this.viento=0;			//Viento actual
	this.turnoViento=8;		//N�mero de turnos a transcurrir para cambiar el viento
	this.tiempoTranscurrido;	
	this.funcionando=false;
	
	this.idBoton;		
	this.idAngulo;
	this.idFuerza;
	this.idLimpiar;
	
	this.puntuacion0=0;
	this.puntuacion1=0;
	
	this.numTurno=0;		//N�mero de turnos jugados en la partida actual
	this.turno=0;			//Jugador actual que tiene que disparar
	
	this.constructor=function(idCanvas,boton,angulo,fuerza,limpiar){
		//Propiedades del canvas
		this.canvas=document.getElementById(idCanvas);
		this.canvas.width=1000;
		this.canvas.height=200;
		this.canvas.style.backgroundColor="black";
		this.contexto=this.canvas.getContext('2d');
		//Formulario de recogida de datos
		this.idAngulo=document.getElementById(angulo);
		this.idFuerza=document.getElementById(fuerza);
		this.idLimpiar=document.getElementById(limpiar);
		this.idBoton=document.getElementById(boton);
		var self=this;
		this.idBoton.onclick=function(){
			self.disparar(self.idAngulo.value,self.idFuerza.value);
			self.idBoton.disabled=true;
			return false;
		};
		
		this.reiniciar();
	};
	this.reiniciar=function(){
		this.bolas=[];
		this.elimBolas=[];
		this.rectangulos=[];
		this.jugadores=[];
		
		this.contexto.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.viento=Math.round((Math.random()*this.maxViento*2-this.maxViento)*10)/10;
		this.numTurno=0;
		this.generarMundo();
	};
	
	this.generarMundo=function(){
		//Obtenemos un n�mero de obstaculos al azar
		var numRec=Math.round(Math.random()*(this.maxRec-this.minRec))+this.minRec;
		//Obtemos la anchura exacta de cada obstaculo (a partir del width del canvas)
		var anchura=this.canvas.width/numRec;
		
		//Creamos cada rect�ngulo de obst�culo con los datos adecuados
		var rec, altura;
		for (var i=0;i<numRec;i++)
		{
			altura=Math.round(Math.random()*this.canvas.height*this.rangoAltura)+10;
			rec=new Rectangulo(new Punto2D(i*anchura,this.canvas.height-altura),anchura,altura,this.randomColor());
			this.rectangulos.push(rec);
		}
		this.posicionarJugadores();
	};
	//Ponemos los jugadores en sus posiciones
	this.posicionarJugadores=function(){
		var nRec=this.rectangulos.length-1;
		var pos1=0;
		var pos2=0;
		while(pos1>=pos2)
		{
			pos1=Math.round(Math.random()*nRec);
			pos2=Math.round(Math.random()*nRec);
		}
		this.jugadores.push(new Rectangulo(new Punto2D(this.rectangulos[pos1].get("x")+this.rectangulos[pos1].get("ancho")/2-this.ladoJugador/2,this.rectangulos[pos1].get("y")-this.ladoJugador),this.ladoJugador,this.ladoJugador,"blue"));
		this.jugadores.push(new Rectangulo(new Punto2D(this.rectangulos[pos2].get("x")+this.rectangulos[pos2].get("ancho")/2-this.ladoJugador/2,this.rectangulos[pos2].get("y")-this.ladoJugador),this.ladoJugador,this.ladoJugador,"red"));
	};
	
	this.get=function(clave){
		switch(clave)
		{
			case "gravedad":
				return this.gravedad;
			case "viento":
				return this.viento;
			case "anchura":
				return this.canvas.width;
			case "altura":
				return this.canvas.height;
		}
	};
	//Creamos un color RGB al azar (util al crear los obstaculos)
	this.randomColor=function(){
		return "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
	}
	//Nos ordenan disparar
	this.disparar=function(angulo,fuerza){
		var poX,posY;
		if(this.turno==0)
		{
			posX=this.jugadores[0].get("x")+this.jugadores[0].get("ancho");
		}
		else
		{
			posX=this.jugadores[1].get("x")-this.radioBola;
			angulo=180-angulo;
		}
		posY=this.jugadores[this.turno].get("y")-this.radioBola;
		
		var bola=new Bola(this,this.radioBola,new Punto2D(posX,posY),this.jugadores[this.turno].get("color"));
		bola.aplicarFuerza(fuerza,angulo);
		this.bolas.push(bola);
	};
	this.eliminarBola=function(bola){
		this.elimBolas.push(bola);
		this.cambiarTurno();
	};
	this.cambiarTurno=function(){
		this.numTurno++;
		if(this.numTurno%this.turnoViento==0)
		{
			this.viento=Math.round((Math.random()*this.maxViento*2-this.maxViento)*10)/10;
		}
		this.turno=(this.turno+1)%2;
		this.idBoton.disabled=false;
	};
	this.loop=function(){
		if (!this.funcionando)
		{
			this.tiempoTranscurrido=new Date().getTime();
			this.funcionando=true;
		}
		else
		{
			var delta=(new Date().getTime()) - this.tiempoTranscurrido;
			delta/=1000;
			this.tiempoTranscurrido=new Date().getTime();
			if (this.idLimpiar.checked)
			{
				this.contexto.clearRect(0,0,this.canvas.width,this.canvas.height);
			}
			//Dibujamos los rectangulos pisos
			var nRec=this.rectangulos.length;
			for (var i=0;i<nRec;i++)
			{
				this.rectangulos[i].dibujar(this.contexto);
			}
			//Dibujamos los jugadores
			for (var i=0;i<2;i++)
			{
				this.jugadores[i].dibujar(this.contexto);
			}
			//Dibujamos la bola
			var nbolas=this.bolas.length;
			for (var i=0;i<nbolas;i++)
			{
				this.bolas[i].mover(delta);
				this.bolas[i].dibujar(this.contexto);
			}
			
			var m=this.elimBolas.length;
			for(var i=0;i<m;i++)
			{
				var n=this.bolas.length;
				for(var j=0;j<n;j++)
				{
					if (this.elimBolas[i]==this.bolas[j])
					{
						this.bolas.splice(j,1);
						break;
					}
				}
			}
			this.elimBolas=[];
			
			//Colisiones jugadores
			var m=this.bolas.length;
			var finJuego=false;
			for(var i=0;i<m;i++)
			{
				var n=this.jugadores.length;
				for(var j=0;j<n;j++)
				{
					if (this.bolas[i].colisiona(this.jugadores[j]))
					{
						this.jugadorDestruido(j);
						finJuego=true;
						break;
					}
				}
				if (finJuego) break;
			}
			//Colisiones pisos
			var m=this.bolas.length;
			for(var i=0;i<m;i++)
			{
				var n=this.rectangulos.length;
				for(var j=0;j<n;j++)
				{
					if (this.bolas[i].colisiona(this.rectangulos[j]))
					{
						this.eliminarBola(this.bolas[i]);
						break;
					}
				}
			}
			
			//GUI puntos y viento
			var v=Math.abs(this.viento);
			if(this.viento>0)
			{
				v="→ "+v;
			}
			else
			{
				v="← "+v;
			}
			this.contexto.font = "bold 20px monospace";
			this.contexto.fillStyle="yellow";
			this.contexto.fillText("Puntos jugador 1: "+this.puntuacion0,20,30);
			this.contexto.fillStyle="green";
			this.contexto.fillText("Viento: "+v+" // Jugador: "+(this.turno+1),this.canvas.width/2-140,30);
			this.contexto.fillStyle="yellow";
			this.contexto.fillText("Puntos jugador 2: "+this.puntuacion1,this.canvas.width-260,30);
		}
	};
	this.jugadorDestruido=function(jugador){
		if(jugador==0)
		{
			this.puntuacion1++;
		}
		else
		{
			this.puntuacion0++;
		}
		this.cambiarTurno();
		this.reiniciar();
	};
}