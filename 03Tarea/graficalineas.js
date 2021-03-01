// Gráficas de Stocks
//

graf = d3.select('#graf')
graf2 = d3.select('#graf2')

ancho_total = graf.style('width').slice(0, -2)
alto_total  = ancho_total * 0.5625
margins = {
  top: 50,
  left: 80,
  right: 15,
  bottom: 50
}
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// Area total de visualización para la gráfica 1
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)


svg2 = graf2.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)


// Contenedor "interno" donde van a estar el gráfico 1
g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')

titulo = g.append('text')
      .attr('x', `${ancho / 2}px`)
      .attr('y', '-15px')
      .attr('text-anchor', 'middle')          
      .text('Incremento de la morosidad')
      .attr('class', 'titulo-grafica')
      
tituloY = g.append('text')
      .attr('x', -40)
      .attr('y', '0px')
      .attr('text-anchor', 'middle')
      .text('$')
      
      
      
tituloX = g.append('text')
      .attr('x', `${ancho / 2}px`)
      .attr('y', alto + 35 )
      .attr('text-anchor', 'middle')
      .text('Corte')



g2 = svg2.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')


titulo2 = g2.append('text')
      .attr('x', `${ancho / 2}px`)
      .attr('y', '-15px')
      .attr('text-anchor', 'middle')          
      .text('Incremento de la morosidad')
      .attr('class', 'titulo-grafica')
      
tituloY2 = g2.append('text')
      .attr('x', -40)
      .attr('y', '0px')
      .attr('text-anchor', 'middle')
      .text('$')
            
tituloX2 = g2.append('text')
      .attr('x', `${ancho / 2}px`)
      .attr('y', alto + 35 )
      .attr('text-anchor', 'middle')
      .text('Corte')

svg.append("rect")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")        
        .attr('id', '_rect01')
        .attr('fill', 'blue')
        .attr('fill-opacity', 0.1)
        .attr("width", ancho)
        .attr("height", alto)
        .on("mouseover", function() { focus.style("display", null); })
        //.on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", e => mousemove(e))


svg2.append("rect")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        // .attr("class", "overlay")
        .attr('id', '_rect02')
        .attr('fill', 'green')
        .attr('fill-opacity', 0.1)
        .attr("width", ancho)
        .attr("height", alto)
        .on("mouseover", function() { focus2.style("display", null); })
        //.on("mouseout", function() { focus2.style("display", "none"); })
        .on("mousemove", e => mousemove(e))


// grupo con el que semostrará el punto las líneas punteadas y los recuadros con los datos
// que correspondan al punto

focus = g.append("g")
        .attr('id', '_focus01')
        .attr("class", "focus")
        .style("display", "none")

focus.append("line")
        .attr("class", "y-hover-line hover-line")
focus.append("line")
        .attr("class", "x-hover-line hover-line")

focus.append("circle")
        .attr("r", 7.5)


focus.append('rect')
        .attr("id","_idEncabezadoF01")
        .attr("x", 10)
        .attr("y", -15)
        .attr('width', 125)
        .attr('height', 25)
        .attr('fill', 'white')
        .attr('stroke', 'black')

focus.append("text")
        .attr('id', '_fecha')
        .attr("x", 15)
        .attr("y", -5)
        .attr("dy", ".31em");

focus.append('rect')
        .attr("id","_idContenidoF01")
        .attr("x", 10)
        .attr("y", 10)
        .attr('width', 125)
        .attr('height', 25)
        .attr('fill', 'white')
        .attr('stroke', 'black')

focus.append("text")
        .attr('id', '_cotiza')
        .attr("x", 15)
        .attr("y", 25)
        .attr("dy", ".31em");        

// grupo 2 con el que semostrará el punto las líneas punteadas y los recuadros con los datos
// que correspondan al punto para la gráfica 2

focus2 = g2.append("g")
        .attr('id', '_focus02')
        .attr("class", "focus")
        .style("display", "none")

focus2.append("line")
        .attr("class", "y-hover-line hover-line")
focus2.append("line")
        .attr("class", "x-hover-line hover-line")

focus2.append("circle")
        .attr("r", 7.5)

focus2.append("text")        
        .attr("x", 15)
        .attr("dy", ".31em");        

focus2.append('rect')
        .attr("id","_idEncabezadoF02")
        .attr("x", 10)
        .attr("y", -15)
        .attr('width', 125)
        .attr('height', 25)
        .attr('fill', 'white')
        .attr('stroke', 'black')

focus2.append("text")
        .attr('id', '_fecha2')
        .attr("x", 15)
        .attr("y", -5)
        .attr("dy", ".31em");

focus2.append('rect')
        .attr("id","_idContenidoF02")
        .attr("x", 10)
        .attr("y", 10)
        .attr('width', 125)
        .attr('height', 25)
        .attr('fill', 'white')
        .attr('stroke', 'black')

focus2.append("text")
        .attr('id', '_cotiza2')
        .attr("x", 15)
        .attr("y", 25)
        .attr("dy", ".31em");   


// Escaladores de la gráfica 1
x = d3.scaleTime().range([0, ancho])
y = d3.scaleLinear().range([alto, 0])


// Escaladores de la gráfica 2
xe2 = d3.scaleTime().range([0, ancho])
ye2 = d3.scaleLinear().range([alto, 0])

// Colores para cada una de las carteras

color = d3.scaleOrdinal()
          .domain(['AC', 'AF', 'AH', 'AK'])
          .range(['#898d8d','#00843d', '#fca800', '#f65545'])


// Ejes de la gráfica 1
xAxisCall = d3.axisBottom()
xAxis = g.append('g')
          .attr('class', 'ejes')
          .attr('transform', `translate(0, ${alto})`)
yAxisCall = d3.axisLeft()
yAxis = g.append('g')
          .attr('class', 'ejes')


// Ejes de la gráfica 2
xAxisCall2 = d3.axisBottom()
xAxis2 = g2.append('g')
          .attr('class', 'ejes')
          .attr('transform', `translate(0, ${alto})`)
yAxisCall2 = d3.axisLeft()
yAxis2 = g2.append('g')
          .attr('class', 'ejes')



// Generador de líneas grafica 1
lineaGen = d3.line()
              .x(d => x(d.Date))
              .y(d => y(d.Close))
linea = g.append('path')

var data


// Generador de líneas grafica 2
lineaGen2 = d3.line()
              .x(d => xe2(d.Date))
              .y(d => ye2(d.Close))

linea2 = g2.append('path')

var data2

// Documentación de la librería de D3:
// https://github.com/d3/d3-time-format
parser = d3.timeParse(d3.timeParse('%Y-%m-%d'))

// Carga de los datos provenientes de archivos separados por comas
// Para la gráfica 1

function load(symbol='AK') {
  d3.csv(`${symbol}.csv`).then(data => {
    data.forEach(d => {
      d.Close = +d.Close
      d.Date = parser(d.Date)
    })
    console.log(data)

    x.domain(d3.extent(data, d => d.Date))

    y.domain([
      d3.min(data, d => d.Close) * 0.95,
      d3.max(data, d => d.Close) * 1.05
    ])

    // Ejes
    xAxis.transition()
          .duration(500)
          .call(xAxisCall.scale(x))
    yAxis.transition()
          .duration(500)
          .call(yAxisCall.scale(y))

    this.data = data

    d3.select("#_rect01").attr("fill", color(symbol))


    render(data, symbol)
  })
}

// Carga de los datos provenientes de archivos separados por comas
// Para la gráfica 2


function load2(symbol='AC') {
  d3.csv(`${symbol}.csv`).then(data2 => {
    data2.forEach(d => {
      d.Close = +d.Close
      d.Date = parser(d.Date)
    })
    console.log(data2)

    xe2.domain(d3.extent(data2, d => d.Date))
    
    ye2.domain([
      d3.min(data2, d => d.Close) * 0.95,
      d3.max(data2, d => d.Close) * 1.05
    ])

    // Ejes
    xAxis2.transition()
          .duration(500)
          .call(xAxisCall2.scale(xe2))
    yAxis2.transition()
          .duration(500)
          .call(yAxisCall2.scale(ye2))

    this.data2 = data2

    d3.select("#_rect02").attr("fill", color(symbol))
    
    //console.log(color(symbol))
    render2(data2, symbol)
  })
}

// Render para la gráfica 1

function render(data, symbol) {
  linea.attr('fill', 'none')
        .attr('stroke-width', 3)
        .transition()
        .duration(500)
        .attr('stroke', color(symbol))
        .attr('d', lineaGen(data))
}

// Render para la gráfica 2

function render2(data2, symbol) {
  linea2.attr('fill', 'none')
        .attr('stroke-width', 3)
        .transition()
        .duration(500)
        .attr('stroke', color(symbol))
        .attr('d', lineaGen2(data2))
}

// Funciones de carga automática al ejecutar la pagina para ambas gráficas

load()
load2()

// Función de se ejecuta cuando se ha seleccionado otra cartera en el elemento 
// Select de html para la gráfica 1

function cambio() {
  load(d3.select('#stock').node().value)
}

// Función de se ejecuta cuando se ha seleccionado otra cartera en el elemento 
// Select de html para la gráfica 2

function cambio2() {
  load2(d3.select('#stock2').node().value)
}

// Función que permite desplazar algún elemnto hacia al frente, 
// Lo utilizamos para mover la ficha de datos que se muestra para cada punto

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// Función que se activa cuando se pasa el raton sobre el área de la gráfica de
// permite calcular la posición del puntero con relación a algún punto de la gráfica de
// Identificar el valor de X y su correspondiente en Y.


function mousemove(e) {
  // console.log(`${d3.pointer(e)}`)

  // Este artículo explica bien que es un bisector y la
  // filosofía tras el:
  // https://stackoverflow.com/questions/26882631/d3-what-is-a-bisector

  x0 = x.invert(d3.pointer(e)[0])
  x0g2 = x.invert(d3.pointer(e)[0])

  bisectDate = d3.bisector((d) => d.Date).left
  bisectDate2 = d3.bisector((d) => d.Date).left
  
  i = bisectDate(data, x0, 1)
  i2 = bisectDate2(data2, x0g2, 1)

  //console.log(`${x0g2} = ${i2}`)

  d0 = data[i - 1],
  d1 = data[i],
  
  d0g2 = data2[i2 - 1],
  d1g2 = data2[i2],

  d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;

  d2 = x0g2 - d0g2.Date > d1g2.Date - x0g2 ? d1g2 : d0g2;

  // Una vez identificado el punto, la capa focus para ambas gráficas es trasladada a dicha posición
  // con lo que se logra dibujar el punto y los datos en la ficha.

  focus.attr("transform", "translate(" + x(d.Date) + "," + y(d.Close) + ")");


  focus.select("#_fecha").text(d3.timeFormat("%b %Y")(d.Date))
  focus.select("#_cotiza").text(d3.format('$,.0f')(d.Close))
  //focus.select("text").text(function() { return d.Close; });

  focus.select(".x-hover-line").attr("x1", -x(d.Date))
  focus.select(".y-hover-line").attr("y1", alto - y(d.Close))

  // Se calcula la posición de Y de la ficha para la primer gráfica, si esta demasiado abajo
  // se punta arriba del punto para evitar que salga de la zona de trabajo.

  if(y(d.Close) + 36 > alto ){
    focus.select("#_idEncabezadoF01").attr("y",-35)
    focus.select("#_fecha").attr("y",-22)
    
    focus.select("#_idContenidoF01").attr("y",-10)
    focus.select("#_cotiza").attr("y",2)
    
  }
  else{
    focus.select("#_idEncabezadoF01").attr("y",-15)
    focus.select("#_fecha").attr("y",-5)

    focus.select("#_idContenidoF01").attr("y",10)
    focus.select("#_cotiza").attr("y",25)

  }

  // Se calcula la posición de x de la ficha para la primer gráfica, si esta demasiado a la derecha
  // se pinta al lado izquierdo del punto para evitar que salga de la zona de trabajo.
  
  if(x(d.Date) + 110 > ancho ){
    focus.select("#_idEncabezadoF01").attr("x",-130)
    focus.select("#_fecha").attr("x",-120)
    
    focus.select("#_idContenidoF01").attr("x",-130)
    focus.select("#_cotiza").attr("x",-120)
    
  }
  else{
    focus.select("#_idEncabezadoF01").attr("x",10)
    focus.select("#_fecha").attr("x",15)

    focus.select("#_idContenidoF01").attr("x",10)
    focus.select("#_cotiza").attr("x",15)

  }

  // Se calcula la posición de Y de la ficha para la segunda gráfica, si esta demasiado abajo
  // se punta arriba del punto para evitar que salga de la zona de trabajo.

  if(ye2(d2.Close) + 36 > alto ){
    focus2.select("#_idEncabezadoF02").attr("y",-45)
    focus2.select("#_fecha2").attr("y",-32)
    
    focus2.select("#_idContenidoF02").attr("y",-20)
    focus2.select("#_cotiza2").attr("y",-8)
    
  }
  else{
    focus2.select("#_idEncabezadoF02").attr("y",-15)
    focus2.select("#_fecha2").attr("y",-5)

    focus2.select("#_idContenidoF02").attr("y",10)
    focus2.select("#_cotiza2").attr("y",25)

  }

  // Se calcula la posición de x de la ficha para la segunda gráfica, si esta demasiado a la derecha
  // se pinta al lado izquierdo del punto para evitar que salga de la zona de trabajo.

  if(xe2(d2.Date) + 110 > ancho ){
    focus2.select("#_idEncabezadoF02").attr("x",-130)
    focus2.select("#_fecha2").attr("x",-120)
    
    focus2.select("#_idContenidoF02").attr("x",-130)
    focus2.select("#_cotiza2").attr("x",-120)
    
  }
  else{
    focus2.select("#_idEncabezadoF02").attr("x",10)
    focus2.select("#_fecha2").attr("x",15)

    focus2.select("#_idContenidoF02").attr("x",10)
    focus2.select("#_cotiza2").attr("x",15)

  }



  //console.log(`x=${xe2(d2.Date)} y= ${ye2(d2.Close)} ancho = ${ancho} alto = ${alto}`)



  // Una vez identificado el punto que corresponde al puntero del ratón, la capa focus para ambas gráficas es trasladada a dicha posición
  // con lo que se logra dibujar el punto y los datos en la ficha.

  focus2.attr("transform", "translate(" + xe2(d2.Date) + "," + ye2(d2.Close) + ")");
  
  focus2.select("#_fecha2").text(d3.timeFormat("%b  %Y")(d2.Date))
  focus2.select("#_cotiza2").text(d3.format('$,.0f')(d2.Close))

  focus2.select(".x-hover-line").attr("x1", -xe2(d2.Date))
  focus2.select(".y-hover-line").attr("y1", alto - ye2(d2.Close))
  
  // movemos ambas fichas al frente
  
  d3.select('#_focus01').moveToFront()
  d3.select('#_focus02').moveToFront()

  
}

