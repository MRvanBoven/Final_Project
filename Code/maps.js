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
    let requests = [d3.json("oneyear.json")];

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
    let maps = response[0];

    // define svg dimensions
    let w = (window.innerWidth * 0.95) / 2;
    let h = w;
    let margins = {top: 0.05 * w, bottom: 0.05 * h,
                   left: 0.05 * w, right: 0.05 * w},
        width = (w - margins.left - margins.right),
        height = (h - margins.top - margins.bottom);
    let dims = {w: w, h: h, margins: margins, width: width, height: height};

    // make a map of default month, january 1979
    makeMap(maps["01"]["1979"], dims);

    // make a time slider, connected to map
    makeSlider(makeXScale(maps, dims), dims, maps);
}


/**
 * Gets time ticks for slider from input json file.
 */
function makeXScale(json, dims) {
    // get years (first keys) from json, make sure they're sorted old -> new
    let months = Object.keys(json);
    months.sort();

    // create empty array to save time values in
    let times = [];

    // iterate over all found months
    for (let i = 0; i < months.length; i++) {
        // find all years for which data in json of current month, sort them
        let years = Object.keys(json[months[i]]);
        years.sort();

        // add all combinations of year and month to ticks array
        for (let j = 0; j < years.length; j++) {
            times.push(`${years[j]}-${months[i]}`);
        }
    }

    // sort times to get historical order
    times.sort();
    console.log(times);

    // create an ordinal x scale with the time data
    var xScale = d3.scaleTime()
                   .domain([Date.parse(times[0]),
                            Date.parse(times[times.length - 1])])
                   .range([0, dims.width])
                   .clamp(true);
                   // .ticks(d3.timeMonth);
                   // .rangePoints([0, ticks.length - 1]);

    return(xScale);
}


/**
 * Makes a map of input geojson.
 */
function makeMap(map, dims) {
    // create SVG element
    let svg = d3.select("#map-div")
                .append("svg")
                .attr("class", "map")
                .attr("width", dims.w)
                .attr("height", dims.h);

    // define map projection, ensuring top view of the arctic
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
       .attr("id", "map-g")
       .selectAll("path")
       .data(map.features)//topojson.feature(map, map["objects"]["geo"]).features)
       .enter()
       .append("path")
       .attr("d", geoPath)
       .style("fill", "#FFFFFF");

}


/**
 * Makes a slider via which the user can choose of which month data is shown.
 * Code based on example by Jane Pong. Source: https://bit.ly/2RK1wcH.
 */
function makeSlider(xScale, dims, maps) {
    // define slider svg dimensions
    let h = 100;
    let w = dims.width + dims.margins.left + dims.margins.right;

    // define time formatters
    let formatYear = d3.timeFormat("%Y");
    let formatMonth = d3.timeFormat("%m");
    let formatMonthYear = d3.timeFormat("%b %Y");

    // set start variable to begin of slider, not playing
    let moving = false;
    let currentValue = 0;

    // select play button from html
    let playButton = d3.select("#play-button");

    // create SVG element and add slider
    let svg = d3.select("#slider")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    let slider = svg.append("g")
                    .attr("class", "slider")
                    .attr("transform",
                          "translate(" + dims.margins.left + "," + h / 2 + ")");

    // create slider line and define what happens when dragging the slider
    let track = slider.append("line")
          .attr("class", "track")
          .attr("x1", xScale.range()[0])
          .attr("x2", xScale.range()[1]);

    d3.select(slider.node().appendChild(track.node().cloneNode()))
          .attr("class", "track-inset");

    let handle = slider.append("circle", "track-overlay")
                       .attr("class", "handle")
                       .attr("r", 10);
                     // .call(d3.drag()
                     //         .on("start", dragging)
                     //         .on("drag", dragging)
                     //         .on("end", function() {console.log("blub2")})
                     //  );

    d3.select(slider.node().appendChild(track.node().cloneNode()))
      .attr("class", "track-overlay")
      .call(d3.drag()
              .on("start", dragging)
              .on("drag", dragging)
              .on("end", function() {console.log("blub")})
       );

    // add year ticks to the slider
    slider.insert("g", ".track-overlay")
          .attr("class", "ticks")
          .attr("transform", "translate(0," + 0 + ")")
          .selectAll("text")
          .data(xScale.ticks())
          .enter()
          .append("text")
          .attr("x", xScale)
          .attr("y", h / 4)
          .attr("text-anchor", "middle")
          .text(function(d) {
              return formatYear(d);
          });

    let label = slider.append("text")
                      .attr("class", "label")
                      .attr("text-anchor", "middle")
                      .text(formatMonthYear(xScale.domain()[0]))
                      .attr("transform", "translate(0," + (- h / 4) + ")");

    // define what happens when play button is clicked
    playButton.on("click", function() {
                   let button = d3.select(this);
                   if (button.text() == "Pause") {
                       moving = false;
                       clearInterval(timer);
                       button.text("Play");
                   }
                   else {
                       moving = true;
                       timer = setInterval(step, 400);
                       button.text("Pause");
                   }
               });

    /**
    * Defines what happens when slider is dragged: update slider and update map.
    */
    function dragging(d) {
        currentValue = d3.event.x;
        updateSlider(xScale.invert(currentValue));
        updateMap(maps,
                  formatMonth(xScale.invert(currentValue)),
                  formatYear(xScale.invert(currentValue)),
                  dims);
    }

    /**
    *
    */
    function step() {
        updateSlider(xScale.invert(currentValue));
        updateMap(maps,
                  formatMonth(xScale.invert(currentValue)),
                  formatYear(xScale.invert(currentValue)),
                  dims);

        currentValue = currentValue + dims.width / (xScale.ticks().length + 1);

        if (currentValue > dims.width) {
            moving = false;
            currentValue = 0;
            clearInterval(timer);

            playButton.text("Play");
        }
    }


    /**
    * Updates slider to new position.
    */
    function updateSlider(position) {
        // update position and text of label according to slider scale
        handle.attr("cx", xScale(position));
        label.attr("x", xScale(position))
             .text(formatMonthYear(position));
    }
}


/**
 * Updates map via a transition to given month's map.
 */
function updateMap(maps, month, year, dims) {
    let map = maps[month][year];
    console.log(map);

    // select map's svg element
    let svg = d3.select(".map");
    // let g = d3.select("#map-g");
    //
    // g.selectAll("path")
    //  .transition()
    //  .duration(2000)
    //  .remove()

    // g.remove();
    svg.remove();

    makeMap(map, dims);

    // g.selectAll("path")
    //  .data(map.features)
     // .attrTween("d", function(d) {
     //      let interpol = d3.interpolate(this._current, d);
     //      this._current = interpol(0);
     //      return function(t) {
     //          return arc(interpol(t));
     //      }
     //  });
}

//
// /**
//  * Updates donut chart with given gender ratio dat, via transitions.
//  */
// function updateDonut(data, dims) {
//     // get character gender ratio data of all series
//     let genders = findGenderRatio(data);
//
//     // define pie division
//     let pie = d3.pie(genders)
//                 .padAngle(0.005)
//                 .sort(null)
//                 .value(function(d) {
//                      return d["value"];
//                  });
//
//     // define arcs
//     let arc = d3.arc()
//                 .innerRadius(dims.radius * 0.7)
//                 .outerRadius(dims.radius);
//
//     let arcs = pie(genders);
//
//     // define arc transitions
//     d3.select("#donut")
//       .selectAll("path")
//       .data(arcs)
//       .transition()
//       .duration(750)
//       .attrTween("d", function(d) {
//           let interpol = d3.interpolate(this._current, d);
//           this._current = interpol(0);
//           return function(t) {
//               return arc(interpol(t));
//           };
//       });
//
//     // define label transitions
//     d3.select("#donut")
//       .selectAll("text")
//       .data(arcs)
//       .transition()
//       .duration(750)
//       .attrTween("transform", function(d) {
//            let interpol = d3.interpolate(this._current, d);
//            this._current = interpol(0);
//            return function(t) {
//                return "translate(" + arc.centroid(interpol(t)) + ")";
//            };
//        })
//       .attr("display", function(d) {
//            return (d.value !== 0) ? null : "none";
//        });
//
//     // define title transitions, scaling font size to fit inside donut
//     d3.select("#donutTitle")
//       .selectAll("text")
//       .transition()
//       .duration(750)
//       .style("opacity", 0)
//       .transition()
//       .duration(750)
//       .style("opacity", 1)
//       .style("font-size", `${dims.width * 1.3 / (data.name.length)}px`)
//       .text(data.name);
// }
