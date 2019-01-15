/**
 * This file extends index.html.
 *
 * The file loads a JSON file, containing several GeoJSON files, makes them into
 * a map and adds slider to update maps with over time.
 *
 * Name: Maud van Boven
 * Student ID: 12474673
 */


/**
 * Loads in local JSON data file and hands it to main.
 */
window.onload = function() {
    let requests = [d3.json("try.geojson")];

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
    // define svg dimensions
    let w = (window.innerWidth * 0.95) / 2;
    let h = w;
    let margins = {top: 0.05 * w, bottom: 0.05 * h,
                   left: 0.05 * w, right: 0.05 * w},
        width = (w - margins.left - margins.right),
        height = (h - margins.top - margins.bottom);
    let dims = {w: w, h: h, margins: margins, width: width, height: height};

    // make a map
    makeMap(response, dims);

    // make a time slider, connected to map
    makeSlider(response, dims);
}


/**
 * Makes a slider via which the user can choose of which month data is shown.
 */
function makeMap(maps, dims) {
    // set default map to January 1979
    let map = maps[0];

    // create SVG element
    let svg = d3.select("body")
                .append("svg")
                .attr("class", "map")
                .attr("width", dims.w)
                .attr("height", dims.h);

    // define map projection
    let projection = d3.geoAzimuthalEquidistant()
                       .center([0, 0])
                       .scale(dims.w * 0.6)
                       .rotate([0, -90, 0])
                       .translate([dims.width / 2 + dims.margins.left,
                                   dims.height / 2 + dims.margins.top]);

    // define geoPath
    let geoPath = d3.geoPath()
                    .projection(projection);

    // add map to svg
    svg.append("g")
       .selectAll("path")
       .data(map.features)
       .enter()
       .append("path")
       .attr("d", geoPath)
       .style("fill", "#FFFFFF");

}


/**
 * Makes a slider via which the user can choose of which month data is shown.
 */
function makeSlider(maps, dims) {
    // define slider svg dimensions
    let h = 100;
    let w = dims.width + dims.margins.left + dims.margins.right;

    // get array of data for slider values
    let months = [197901, 197902, 197903];

    // define slider
    let slider = d3.sliderHorizontal()
                   .min(d3.min(months))
                   .max(d3.max(months))
                   .step(1)
                   .width(dims.width)
                   .tickValues(months)
                   .tickFormat(d3.format("d"))
                   .on("onchange", function(month) {
                      return updateMap(maps, month);
                    });

    // create SVG element and add slider
    let svg = d3.select("body")
                .append("svg")
                .attr("class", "slider")
                .attr("width", w)
                .attr("height", h);

    svg.append("g")
       .attr("transform", "translate(" + dims.margins.left + "," + h / 2 + ")")
                .call(slider);
}


/**
 * Updates map via a transition to given month's map.
 */
function updateMap(maps, month) {
    console.log(month);
    return
}
