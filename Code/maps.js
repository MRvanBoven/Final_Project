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
    let requests = [d3.json("test_1979_01.json"),
                    d3.json("test_1979_02.json"),
                    d3.json("test_1979_03.json")];

    // load in JSON data file
    Promise.all(requests)
           .then(function(response) {
                main(response);
            })
           .catch(function(e) {
               throw(e);
            });
};


/**
 * Main function, started once a successful response has been received.
 */
function main(response) {
    let map = response[0];

    console.log("main");
    console.log(map);

    // define svg dimensions
    let w = (window.innerWidth * 0.95) / 2;
    let h = w;
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

    let projection = d3.geoAzimuthalEquidistant()
                       .center([0, 0])
                       .scale(500)
                       .rotate([0, -90, 0])
                       .translate([width / 2 + dims.margins.left,
                                   height / 2 + dims.margins.top]);

    let geoPath = d3.geoPath()
                    .projection(projection);

    console.log(2);

    svg.append("g")
       .selectAll("path")
       .data(topojson.feature(map, map["objects"]["extent"]).features)
       .enter()
       .append("path")
       .attr("d", geoPath)
       .style("fill", "#FFFFFF");

    console.log(topojson.feature(map, map["objects"]["extent_N_197901_polygon_v3.0"]).features);
}
