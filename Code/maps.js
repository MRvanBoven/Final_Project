/**
 * This file extends index.html.
 *
 * The file loads in a TopoJSON (or Geo?) file, makes in into a map and adds
 * slider to update maps with over time.  *
 *
 * Name: Maud van Boven
 * Student ID: 12474673
 */


/**
 * Loads in local JSON data file and hands it to main.
 */
window.onload = function() {
    // load in JSON data file
    Promise.resolve(d3.json("test.json"))
           .then(function(data) {
                main(data);
            })
           .catch(function(e) {
               throw(e);
            });
};


/**
 * Main function, started once a successful response has been received.
 */
function main(map) {
    console.log("main");
    console.log(map);
    // console.log(map.objects.extent_N_197901_polygon_v3.geometries);


    // define svg dimensions
    let w = (window.innerWidth * 0.95) / 2;
    let h = w * 1.5;
    let margins = {top: 0.05 * w, bottom: 0.05 * h,
                   left: 0.05 * w, right: 0.05 * w},
        width = (w - margins.left - margins.right),
        height = (h - margins.top - margins.bottom);
    let dims = {w: w, h: h, margins: margins, width: width, height: height};

    // create SVG element
    let svg = d3.select("body")
                .append("svg")
                .attr("width", dims.w)
                .attr("height", dims.h);

    var geoPath = d3.geoPath()
                    .projection(d3.geoAlbers()
                                  .center([0, 0])
                                  .scale(50)
                                  .translate([width / 2 + dims.margins.left,
                                              height / 2 + dims.margins.top]));

    // map.geometries.forEach(function(feature) {
    //                         feature.geometry = turf.rewind(feature.geometry,
    //                                                        {reverse:true});
    //                     });

    // svg.append("path")
    //    .datum(map.objects.extent_N_197901_polygon_v3)
    //    .attr("d", geoPath)
    //    .style("fill", "#FFFFFF");

    // svg.selectAll("path")
    //    .data(map.arcs)
    //    .enter()
    //    .append("path")
    //    .attr("d", geoPath)
    //    .style("fill", "#FFFFFF");

    svg.selectAll("path")
       .data(topojson.feature(map, map.objects.extent_N_197901_polygon_v3).features)
       .enter()
       .append("path")
       .attr("d", geoPath)
       .style("fill", "#FFFFFF");

    // svg.append("path")
    //    .datum(topojson.feature(map, map.objects.extent_N_197901_polygon_v3))
    //    .attr("d", geoPath)
    //    .style("fill", "#FFFFFF");
}
