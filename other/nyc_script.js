			var permon = d3.format("$,.3f")
			var totmon = d3.format("$,.0f")
			var popul = d3.format(",")

			//Width and height
			var h = 650;
			var w = 800;

			//Define map projection

							 
			var totalContribsColor = d3.scale.threshold()
									.domain([0.2, 0.5, 1, 10, 100, 1000, 10000])
								    .range(["#ff0000", "#ff4000", "#ff8000", "#fff000", "#00ff00", "#00aa00", "#005500"]);

			var perCapitaColor = d3.scale.threshold()
									.domain([0.2, 0.5, 1, 10, 100, 1000, 10000])
								    .range(['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#990000']);
			var scaleVars = [
			{"name": "$0-$0.20", "color": 0.1},
			{"name": "$0.20-$0.50", "color": 0.3},
			{"name": "$0.50-$1", "color": 0.75},
			{"name": "$1-$10", "color": 7},
			{"name": "$10-$100", "color": 50},
			{"name": "$100-$1000", "color": 500}, 
			{"name": "$1000+", "color": 5000}]
			//Create SVG element
			var svg2 = d3.select("div#nycmap")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Load in agriculture data
			d3.csv("nycdata.csv", function(data) {

				//Load in GeoJSON data
				d3.json("NYCzips.geojson", function(json) {

					//Set input domain for color scale

				for (var i = 0; i < data.length; i++) {
				
						//Grab state name
						var zipname = data[i].ZCTA;
						//Grab data value, and convert from string to float
						var zipPerCapita = parseFloat(data[i].TotalContribs)/parseFloat(data[i].Total);
				
						//Find the corresponding state inside the GeoJSON
						for (var j = 0; j < json.features.length; j++) {

							var jsonzip = json.features[j].properties.postalCode;
				
							if (zipname == jsonzip) {
						
								//Copy the data value into the JSON
								json.features[j].properties.percapita = zipPerCapita;
								json.features[j].properties.TotalContribs = parseFloat(data[i].TotalContribs)
								json.features[j].properties.Population = parseFloat(data[i].Total)

								
								//Stop looking through the JSON
								
							}
						}
					}
					console.log(json)

					var projection = d3.geo.mercator()
								   .translate([w/2, h/2])
								   .center([-73.975242, 40.690610])
								   .scale([60000]);

					//Define path generator
					var path = d3.geo.path()
									 .projection(projection);

					//Bind data and create one path per GeoJSON feature
					svg2.selectAll("path")
					   .data(json.features)
					   .enter()
					   .append("path")
					   .attr("d", path)
					   .classed("code", true)
					   .style("fill", function(d) {
					   		//Get data value
					   		var value = d.properties.percapita;
					   		if (value) {
					   			//If value exists…
						   		return perCapitaColor(value);
					   		} else {
					   			//If value is undefined…
						   		return "#ffffff";
					   		}
					   })
					   .on("mouseover", function(d) {

					        updatetooltip(this);
					              

					            d3.select("#tip_title")
					            .html(d.properties.postalCode);

					            d3.select("#value")
					            .html("Population: " +popul(d.properties.Population) + "<br>"+
					            	  "Contributions: " +totmon(d.properties.TotalContribs) + "<br>"+
					            	  "Per Capita: " + permon(d.properties.percapita));
					         
					          d3.select("#tooltip").classed("hidden", false);

					         })
				     	.on("mouseout", function() {
				     
				      	d3.select("#tooltip").classed("hidden", true);
				     	
				     	});

				     	 svg2.on("mousemove", function(e){
							    updatetooltip(this);
							 	 });

				     var legend = svg2.selectAll(".legend")
							            .data(scaleVars)
							          .enter().append("g")
							            .attr("class", "legend")
							            .attr("transform", function (d, i) { return "translate(200," + i * 25 + ")"; });

							        legend.append("rect")
							            .attr("x", 2)
							            .attr("y", 100)
							            .attr("width", 20)
							            .attr("height", 20)
							            .style("fill", function(d){ return perCapitaColor(d.color);})
							            .style("stroke", "white");

							        legend.append("text")
							            .attr("x", 0)
							            .attr("y", 110)
							            .attr("dy", ".35em")
							            .style("text-anchor", "end")
							            .text(function (d) { return d.name; });

					/** var title = svg.append("text")
								   .classed("title", true)
								   .attr("x", 650)
								   .attr("y", 80)
								   .style("text-anchor", "start")
								   .text("Chicago's Per Capita Contributions by Zipcode")
					
					**/
			
				});
			
			});

function updatetooltip(e){
          var coordinates = [0, 0];
          coordinates = d3.mouse(document.body);
          var Mx = coordinates[0];
          var My = coordinates[1];
          var side;
          var vside;




          //Update the tooltip position and value
          tip = d3.select("#tooltip")
                  .style("left", Mx + 30 +  "px")
                  .style("top", My + 20 + "px");
}
