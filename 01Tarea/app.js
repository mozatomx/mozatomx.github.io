
// I. Configuración
// Se toma el elemento del html <div id="graf" class="vizprev"></div>
// 
graf = d3.select('#graf')

// Definiciones de ancho y alto para el área de trabajo
ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 12

// Asignación de alto y ancho de la gráfica para el elemento html id="graf"
graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

// Definiciión de margenes para el área de trabajo

margins = { top: 80, left: 100, right: 15, bottom: 300 }

// Definición del ancho y alto del elemento svg, propiamente el área de trabajo del gráfico
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// II.  Definición de variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)


g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto  + 'px')

// definición de escalador para el eje Y
y = d3.scaleLinear()
          .range([alto , 0])

// DEfinición de escalador para el eje x          
x = d3.scaleBand()
      .range([0, ancho])
      .paddingInner(0.1)
      .paddingOuter(0.3)

// Se define un escalador de tipo ordinal para los colores de las barras
// Los colores se encuentran basados en el Manual de Identidad Institucional del Gobierno de la Ciudad de México 2018 - 2024.
// 

color = d3.scaleOrdinal()
           .range(['#898d8d','#00843d', '#fca800', '#f65545', '#ec95c5','#91d400','#6b4c2a','#ae8156'])
          // https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
          //.range(d3.schemePastel1)

// definición de Eje de X          
xAxisGroup = g.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')

// definición de Eje de Y          
yAxisGroup = g.append('g')
              .attr('class', 'eje')

//  se agrega un título a la gráfica              
titulo = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', '-60px')
          .attr('text-anchor', 'middle')
          .text('Situación de la Cartera Crediticia')
          .attr('class', 'titulo-grafica')

// Se define un tamaño de fuente para las 3 etiquetas que contendrá la gráfica para identificar el cierre, la tasa de morosidad de acreditados 
// así como el monto de los adeudos

fontsize = alto * 0.07

// Se agrega el text para el cierre
cierreDisplay = g.append('text')                
                .attr('x',20 )                
                .attr('y', -20 )
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#898d8d')
                .text('Cierre: 200612')

// Se agrega el text para la tasa de morosidad
AcreditadosDisplay = g.append('text')                
                .attr('x', 300 )                
                .attr('y', -20 )
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#898d8d')
                .text('Tasa de morosidad: ')

// Se agrega el text para el monto de morosidad
MontoMorosidadDisplay = g.append('text')                
                .attr('x', 700 )                
                .attr('y', -20 )
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#898d8d')
                .text('Morosidad : $ ')              
                
                
dataArray = []


//  Variables globales para determinar que Cierre mostrar y el tipo de cartera
//     poder obtener los datos del select
Cierre = '200612'
TipoCartera = "Todas"

// Utilizamos un escalador  ordinal para obtener del dataset los años y meses de manera única y llenar el select del
escaladorCierre = d3.scaleOrdinal()

// Obtenemos el elemento select de html id="cierre"
cierreSelect = d3.select('#Cierre')
// Obtenemos el elemento select de html id="tipoCartera"
tipoCarteraSelect = d3.select('#tipoCartera')

// Definimos una métrica a mostrar que pueden ser tres para mostrar en el eje de las Y, Acreditados, Morosos o Monto de Morosisdad
metrica = 'Acreditados'

// Obtenemos el elemento select de html id="tipoCartera"
metricaSelect = d3.select('#metrica')

// Nuestra variable para la ordenación
ascendente = false

// III. render (update o dibujo)
function render(data) {
  // se dibujan las barras con los datos que se reciben en la variable data
  
  bars = g.selectAll('rect')
            .data(data, d => d.Linea)
            .attr('alt', d => d[metrica])

  bars.enter()
      .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${y(0)}px`)
        .style('fill', '#000')
        .style('x', d => x(d.Linea) + 'px')
      .merge(bars)
        .transition()        
        .duration(2000)
          .style('x', d => x(d.Linea) + 'px')
          .style('y', d => (y(d[metrica])) + 'px')
          .style('height', d => (alto - y(d[metrica])) + 'px')
          .style('fill', d => color(d.Tipo))
          .style('width', d => `${x.bandwidth()}px`)

  bars.exit()
      .transition()
      .duration(2000)
        .style('height', '0px')
        .style('y', d => `${y(0)}px`)
        .style('fill', '#000000')
      .remove()

// Aquí formateamos el eje de las Y, solo en el caso de mostrar el monto de morosidad, lo formateamos con el simbolo de $, en otro caso
// unicamente lo mostramos con formato de número separado por coma para los miles o millones

  yAxisCall = d3.axisLeft(y)
                .ticks(10)
                .tickFormat(((metrica == 'MontoMorosos') ? d3.format("$,.2r") : d3.format(",.2r") ))

// Transición del eje de las Y

  yAxisGroup.transition()
            .duration(2000)
            .call(yAxisCall)

  xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition()
            .duration(2000)
            .call(xAxisCall)
            .selectAll('text')
            .attr('x', '-8px')
            .attr('y', '-5px')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
}

// IV. Carga de datos
// nuestro dataset en formato csv para la visualización
// Convertimos en números los que son números, que en este caso son las columnas de
// Acreditados
// Morosos
// MontoMorosos
// saldo

d3.csv('AcreditadosV02.csv')
.then(function(data) {
  data.forEach(d => {
    d.Acreditados = +d.Acreditados
    d.Morosos = +d.Morosos
    d.MontoMorosos = +d.MontoMorosos
    d.Saldo = +d.Saldo
  })

  dataArray = data

  // Asignamos el domino al color, con la columna Tipo de cartera 

  color.domain(data.map(d => d.Tipo))

  // ASignamos el dominio para el escalador de cierre que será utilizado para llenar el select, con la columna d.cierre
  escaladorCierre.domain(data.map(d => d.Cierre))

  // Con el dominio del escalador de cierre, llenamos el select de html con los valores únicos que tenemos en el dominio

  escaladorCierre.domain().forEach(d => {
    console.log(d)
    cierreSelect.append('option')
                .attr('value', d)
                .text(d)
 
  })
  
  // Al select de html de tipo cartera, le agregamos un optión con el valor de todas
  tipoCarteraSelect.append('option')
              .attr('value', 'Todas')
              .text('Todas')

  // Al select de html de tipo cartera, le agregamos los valores únicos que tenemos en el escalador de color y con el dominio llenamos el select 

  color.domain().forEach(d => {
    console.log(d)
    tipoCarteraSelect.append('option')
                .attr('value', d)
                .text(d)
 
  })      

  // V. invocamos a nuestra función de despliegue
  frame()
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frame() {
  
  dataframe = dataArray
// En primer lugar, filtramos el dataarray con los valores de cierre
// ya que lo que deseamos mostrar es el conjunto de carteras pero para un cierre determinado

  dataframe = d3.filter(dataArray, d => d.Cierre == Cierre)

  // En caso de que  el select donde tenemos al tipo de cartera sea diferente de "todas", filtramos el tipo de cartera y lo dejamos en la variable dataframe
  
  if (TipoCartera != 'Todas') {
    dataframe = d3.filter(dataframe, d => d.Tipo == TipoCartera)
  }

 // Ya con los datos filtrados, utilizamos el dataframe para realizar los calculos de: 
 // MontoAdeudos
 // Numero de acreditados 
 // Numero de acreditados morosos

  montoAdeudos = d3.sum(dataframe, d => d.MontoMorosos)
  numeroAcreditados = d3.sum(dataframe, d => d.Acreditados)
  numeroAcreditadosMorosos = d3.sum(dataframe, d => d.Morosos)

//  Agregamos los textos a las etiquetas dentro de la gráfica 
// En el caso de la tasa de morosidad, se calcula diviviendo los acreditados morosos entre el número de acreditados
// Se formatean en porcentaje y en monto de pesos correspondiente
  
  cierreDisplay.text('Cierre: ' + Cierre)
  AcreditadosDisplay.text('Tasa de morosidad: ' + d3.format(".0%")(numeroAcreditadosMorosos/numeroAcreditados))
  MontoMorosidadDisplay.text('Monto adeudos: ' + d3.format("$,.0f")(montoAdeudos))
  
// se ordenan los datos de acuerdo a la variable definida originalmente se realiz en forma descendente
  dataframe.sort((a, b) => {
    return ascendente ? d3.ascending(a[metrica], b[metrica]) : d3.descending(a[metrica], b[metrica])
    
  })

  // Calcular la altura más alta dentro de
  // los datos (columna "oficial")
  maxy = d3.max(dataframe, d => d[metrica])
  // Creamos una función para calcular la altura
  // de las barras y que quepan en nuestro canvas
  y.domain([0, maxy])
  x.domain(dataframe.map(d => d.Linea))

  render(dataframe)
}



cierreSelect.on('change', () => {
  Cierre = cierreSelect.node().value  
  frame()
})

metricaSelect.on('change', () => {
  metrica = metricaSelect.node().value
  frame()
})

tipoCarteraSelect.on('change', () => {
  TipoCartera = tipoCarteraSelect.node().value
  frame()
})


function cambiaOrden() {
  ascendente = !ascendente
  if(ascendente){
    document.getElementById("btnOrdenar").value="Ascendente";       
  }
  else  {
    document.getElementById("btnOrdenar").value="Descendente";
  }
    
  frame()
}