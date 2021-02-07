// Aplicación de la gráfica tipo Gapminder a la morosidad invi
// 
//
// Eje Y                        Tamaño de burbuja
// Tasa de                      Monto de Morosidad
// morosidad            
//
//
//                             Eje X # Créditos Morosos       
////////////////////////////////////////////////////////

// I. Configuración
// Se toma el elemento del html <div id="graf" class="vizprev"></div>
// 
graf = d3.select('#graf')

// Definiciones de ancho y alto para el área de trabajo
ancho_total = graf.style('width').slice(0, -2)
alto_total  = ancho_total * 0.48

// Definiciión de margenes para el área de trabajo
margins = {
  top: 50,
  left: 50,
  right: 20,
  bottom: 50
}

// Definición del ancho y alto del elemento svg, propiamente el área de trabajo del gráfico
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom


svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

// Contenedor "interno" donde van a estar los gráficos
g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')

// configuración para mostrar en marca de agua el intervalo de los datos 
// que se están mostrando en la representación de las burbujas
// se inicia con 2016 12 = Diciembre de 2006

fontsize = alto * 0.65
yearDisplay = g.append('text')
                .attr('x', ancho / 2)
                .attr('y', alto / 2 + fontsize/2)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#cccccc')
                .text('200612')

g.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', ancho - 15)
  .attr('height', alto)
  .attr('stroke', 'black')
  .attr('fill', 'none')

g.append('clipPath')
  .attr('id', 'clip')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', ancho-15)
    .attr('height', alto)


//  se agrega un título a la gráfica              
titulo = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', '-15px')
          .attr('text-anchor', 'middle')
          .text('Créditos vs Tasa de Morosidad  Dic 2006 - Nov 2020')
          .attr('class', 'titulo-grafica')

tituloY = g.append('text')
          .attr('x', -70)
          .attr('y', '-30px')
          .attr('text-anchor', 'middle')
          .text('Tasa de morosidad')
          .attr('transform', 'rotate(-90)')
          //.attr('class', 'titulo-grafica')

tituloX = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', alto + 35 )
          .attr('text-anchor', 'middle')
          .text('Acreditados morosos')
          


// DEfinición de escaladores

x = d3.scaleLog().range([0, ancho])
y = d3.scaleLinear().range([alto, 0])
r = d3.scaleLinear().range([10, 100])

// Se define un escalador de tipo ordinal para los colores de las barras
// Los colores se encuentran basados en el Manual de Identidad Institucional del Gobierno de la Ciudad de México 2018 - 2024.
// 

color = d3.scaleOrdinal().range(['#00843d', '#fca800', '#f65545', '#ec95c5','#91d400','#6b4c2a','#ae8156','#898d8d','#009288','#2b2287','#ffc200','#7343be','#d44787'])

// II.  Definición de variables globales
// 

datos = []
years = []
iyear = 0


TipoCartera = 'todos'
corriendo  = true

var interval

// Obtenemos los elementos  html por su id para su manipulación don d3

tipoCarteraSelect = d3.select('#TipoCartera')
botonPausa = d3.select('#pausa')
slider     = d3.select('#slider')

// IV. Carga de datos
// El dataset en formato csv 
// Convertimos en números los que son números, 
// que en este caso son las columnas de
// Acreditados
// Morosos
// TasaMorosos
// MontoMorosos
// saldo
// Cierre


d3.csv('acreditadosV07.csv').then((data) => {
  data.forEach((d) => {
    d.Acreditados = +d.Acreditados
    d.Morosos = +d.Morosos
    d.TasaMorosos = +d.TasaMorosos
    d.MontoMorosos = +d.MontoMorosos
    d.Saldo = +d.Saldo
    d.Cierre = +d.Cierre

  })

  // mapeamos los datos para obtener un array de los intervalos a mostrar 
  // en nuestro caso será la columna cierre, la cual 
  // contiene datos del año en sus primeros cuadro dígitos 
  // y del mes en los ultimos dos dígitos
  
  years = Array.from(new Set(d3.map(data, d => d.Cierre)))

  // Filtramos solo aquellos que tienen un monto moroso
  // No es necesario mostrar aquellos que no tienen Morosidad

  data = data.filter((d) => {
    return (d.MontoMorosos > 0) && (d.TasaMorosos > 0)
  })
  // data = data.filter((d) => (d.income > 0) && (d.life_exp > 0))


  datos = data

  // Asignamos el intervalo al Slider, que nos servirá de índice 
  // para movernos en el arreglo de years y filtrar los datos del 
  // cierre que queramos mostrar
  // lo inicializamos en 0

  slider.attr('min', 0)
        .attr('max', years.length - 1)
  slider.node().value = 0


  // El dominio para el escalador ordinal
  // para asignar colores a los diferentes tipos de carteras

  color.domain(d3.map(data, d => d.Tipo))

  // definimos el dominio para el escalador de mosoros 
  // que será utilizado el eje de las X 
  x.domain([d3.min(data, d => d.Morosos),
            d3.max(data, d => d.Morosos) + 20000])

  // definimos el dominio para el escalador de TasaMorosos 
  // que será utilizado el eje de las Y

  y.domain([d3.min(data, d => d.TasaMorosos),
            d3.max(data, d => d.TasaMorosos) + 20 ])

  // definimos el dominio para el escalador de MontoMorosos 
  // que será utilizado el radio de las burbujas
            
  r.domain([d3.min(data, d => d.MontoMorosos),
            d3.max(data, d => d.MontoMorosos)])

  // definición de Ejes
  xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickFormat(d => d3.format(',d')(d))
  xAxisG = d3.axisBottom(x)
            .ticks(10)
            .tickFormat('')
            .tickSize(-alto)

  yAxis = d3.axisLeft(y)
            .ticks(10)
  yAxisG = d3.axisLeft(y)
            .ticks(10)
            .tickFormat(' %')
            .tickSize(-ancho)

  g.append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${alto})`)
  g.append('g')
    .call(yAxis)

  g.append('g')
    .attr('class', 'ejes')
    .call(xAxisG)
    .attr('transform', `translate(0,${alto})`)
  g.append('g')
    .attr('class', 'ejes')
    .call(yAxisG)

  // Al select de html de tipo cartera, le agregamos un optión con el 
  // valor de todos
  // despues con el dominio color, lo usamos para llenar cada tipo de 
  // cartera dentro del select

  tipoCarteraSelect.append('option')
              .attr('value', 'todos')
              .text('Todos')
  color.domain().forEach(d => {
    tipoCarteraSelect.append('option')
                .attr('value', d)
                .text(d)
  })

  // Configuración de la leyenda
  // Escalamos el fontsize   con el alto

  fontsize = alto * 0.015

  // agregamos un rectangulo para encerrar las leyendas

  g.append('rect')
    .attr('x', 10)
    .attr('y', 10 )
    .attr('width', 250)
    .attr('height', 450)
    .attr('stroke', 'gray')
    .attr('fill', '#dedede')
    .attr('fill-opacity', 0.75)      

    // con el dominino del color, lo usamos para llenar cada leyendas
    // para cada una generamos un recuadro de 20x20 px 
    // le colocamos el nombre del tipo de cartera 
    

  color.domain().forEach((d, i) => {
    g.append('rect')
      .attr('x', 20)
      .attr('y', 20 + i*30)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', color(d))

    g.append('text')
      .attr('x', 40 )
      .attr('y', 30 + i*30)
      .attr('fill', 'black')
      .attr('font-size', `${fontsize}px`)
      .text(d)
      //.text(d[0].toUpperCase() + d.slice(1))

  })
 

  frame()
  interval = d3.interval(() => delta(1), 300)
})


// Función de despliegue

function frame() {
    // identificamos el indice a mostrar del intervalo cierre

  year = years[iyear]

  // filtramos los datos y los dejamos en data


  data = d3.filter(datos, d => d.Cierre == year)

  // filtramos en caso de que se haya seleccionado un tipo de cartera
  // o bien todas
  
  data = d3.filter(data, d => {
    if (TipoCartera == 'todos')
      return true
    else
      return d.Tipo == TipoCartera
  })

  // Al slider le asignamos el número del indice que tenemos en iyera
  // para que sea congruente durante la animación

  slider.node().value = iyear

  // Mandamos a pintar los circulos

  render(data)
}


// Actualización de los elementos que componen la gráfica

function render(data) {
    // actualizamos la leyenda principal que muesta el intervalo del cierre

  yearDisplay.text(years[iyear])

    // agregamos las burbujas


   p = g.selectAll('circle')
        .data(data, d => d.Linea)
    
   p.enter()
    .append('circle')
      .attr('r', 0)
      .attr('cx', d => x(d.Morosos))
      .attr('cy', d => y(d.TasaMorosos))
      .attr('fill', '#005500')
      .attr('clip-path', 'url(#clip)')
      .attr('stroke', '#333333')
      .attr('fill-opacity', 0.75)      

      
    .merge(p)
      .transition().duration(300)
      .attr('cx', d => x(d.Morosos))
      .attr('cy', d => y(d.TasaMorosos))
      .attr('r', d => r(d.MontoMorosos))
      .attr('fill', d => color(d.Tipo))

      
      
  p.exit()
    .transition().duration(100)
    .attr('r', 0)
    .attr('fill', '#ff0000')
    .remove()
}

// Funciones de interactividad con los elementos html p
// que solicitan la invocación de funciones en los eventos 
// onclick="delta(-5)"
// change
// input
// mousedown
// mouseup

// funcion que nos permite avanzar o retroceder (d) cantidad de números

function delta(d) {
  iyear += d
  console.log(iyear)

  if (iyear < 0) iyear = years.length-1
  if (iyear > years.length-1) iyear = 0
  frame()
}

// cuando hay un cambio en la selección del tipo de cartera
// Se actualiza la variable con la que se filtran los datos 
// en la funcion frame 

tipoCarteraSelect.on('change', () => {
    TipoCartera = tipoCarteraSelect.node().value
  frame()
})

// Botón pausa que permite pausar la animación
// cambia los estilos del botón y su ícono central

botonPausa.on('click', () => {
  corriendo = !corriendo
  if (corriendo) {
    botonPausa
      .classed('btn-danger', true)
      .classed('btn-success', false)
      .html('<i class="fas fa-pause-circle"></i>')
      interval = d3.interval(() => delta(1), 300)
  } else {
    botonPausa
      .classed('btn-danger', false)
      .classed('btn-success', true)
      .html('<i class="fas fa-play-circle"></i>')
    interval.stop()
  }
})

// Interacción con el slider para actualizar el indice que 
// permite el filtrado de un determinado intervalo definido por la
// columna cierre

slider.on('input', () => {
  // d3.select('#sliderv').text(slider.node().value)
  iyear = +slider.node().value
  frame()
})

slider.on('mousedown', () => {
  if (corriendo) interval.stop()
})

slider.on('mouseup', () => {
  if (corriendo) interval = d3.interval(() => delta(1), 300)
})