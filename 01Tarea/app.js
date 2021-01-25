// I. Configuración
graf = d3.select('#graf')

ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 12

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 80, left: 100, right: 15, bottom: 300 }

ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// II. Variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto  + 'px')

y = d3.scaleLinear()
          .range([alto , 0])

x = d3.scaleBand()
      .range([0, ancho])
      .paddingInner(0.1)
      .paddingOuter(0.3)

color = d3.scaleOrdinal()
           .range(['#898d8d','#00843d', '#fca800', '#f65545', '#ec95c5','#91d400','#6b4c2a','#ae8156'])
          // https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
          //.range(d3.schemePastel1)

xAxisGroup = g.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')
yAxisGroup = g.append('g')
              .attr('class', 'eje')

titulo = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', '-60px')
          .attr('text-anchor', 'middle')
          .text('Situación de la Cartera Crediticia')
          .attr('class', 'titulo-grafica')

fontsize = alto * 0.07

cierreDisplay = g.append('text')                
                .attr('x',20 )                
                .attr('y', -20 )
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#898d8d')
                .text('Cierre: 200612')

AcreditadosDisplay = g.append('text')                
                .attr('x', 300 )                
                .attr('y', -20 )
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#898d8d')
                .text('Acreditados: ')

MontoMorosidadDisplay = g.append('text')                
                .attr('x', 700 )                
                .attr('y', -20 )
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Roboto')
                .attr('font-size', `${fontsize}px`)
                .attr('fill', '#898d8d')
                .text('Morosidad : $ ')              
                
                
dataArray = []

// (1) Variables globales para determinar que mostrar y
//     poder obtener los datos del select
Cierre = '200612'
TipoCartera = "Todas"

escaladorCierre = d3.scaleOrdinal()

cierreSelect = d3.select('#Cierre')

tipoCarteraSelect = d3.select('#tipoCartera')

metrica = 'Acreditados'
metricaSelect = d3.select('#metrica')

ascendente = false

// III. render (update o dibujo)
function render(data) {
  // function(d, i) { return d }
  // (d, i) => d
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
        // https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
        // .ease(d3.easeElastic)
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


  yAxisCall = d3.axisLeft(y)
                .ticks(10)
                .tickFormat(((metrica == 'MontoMorosos') ? d3.format("$,.2r") : d3.format(",.2r") ))


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
d3.csv('AcreditadosV02.csv')
.then(function(data) {
  data.forEach(d => {
    d.Acreditados = +d.Acreditados
    d.Morosos = +d.Morosos
    d.MontoMorosos = +d.MontoMorosos
    d.Saldo = +d.Saldo
  })

  dataArray = data

  color.domain(data.map(d => d.Tipo))

  escaladorCierre.domain(data.map(d => d.Cierre))

  // <select>
  //   <option value="x">despliega</option>
  // </select>

  //cierreSelect.append('option')              

  escaladorCierre.domain().forEach(d => {
    console.log(d)
    cierreSelect.append('option')
                .attr('value', d)
                .text(d)
 
  })
  
  tipoCarteraSelect.append('option')
              .attr('value', 'Todas')
              .text('Todas')

  color.domain().forEach(d => {
    console.log(d)
    tipoCarteraSelect.append('option')
                .attr('value', d)
                .text(d)
 
  })      

  // V. Despliegue
  frame()
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frame() {
  
  dataframe = dataArray

  dataframe = d3.filter(dataArray, d => d.Cierre == Cierre)
  
  if (TipoCartera != 'Todas') {
    dataframe = d3.filter(dataframe, d => d.Tipo == TipoCartera)
  }

 // sumamos el saldo de lo que se tenga filtrado 
  montoAdeudos = d3.sum(dataframe, d => d.MontoMorosos)
  numeroAcreditados = d3.sum(dataframe, d => d.Acreditados)
  numeroAcreditadosMorosos = d3.sum(dataframe, d => d.Morosos)

//  console.log(valorSaldo)
  
  cierreDisplay.text('Cierre: ' + Cierre)
  AcreditadosDisplay.text('Tasa de morosidad: ' + d3.format(".0%")(numeroAcreditadosMorosos/numeroAcreditados))
  MontoMorosidadDisplay.text('Monto adeudos: ' + d3.format("$,.0f")(montoAdeudos))
  
  dataframe.sort((a, b) => {
    return ascendente ? d3.ascending(a[metrica], b[metrica]) : d3.descending(a[metrica], b[metrica])
    //
    // Es equivalente a...
    //
    // return ascendente ? a[metrica] - b[metrica] : b[metrica] - a[metrica]
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