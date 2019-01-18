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
    let requests = [d3.json("geoJSONs_1998.json"),
                    d3.json("ice_area+gg(1998-2017).json")];

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
    let maps = response[0],
        iceAndGg = response[1];

    // define svg dimensions
    let w = (window.innerWidth * 0.95) / 2;
    let h = w;
    let margins = {top: 0.05 * w, bottom: 0.05 * h,
                   left: 0.05 * w, right: 0.05 * w},
        width = (w - margins.left - margins.right),
        height = (h - margins.top - margins.bottom);
    let dims = {w: w, h: h, margins: margins, width: width, height: height};

    // make a map of default month, january 1998
    makeMap(maps["01"]["1998"], dims);

    // get list of chronologically sorted time values
    let times = sortTime(maps);

    // convert ice and greenhouse gas data to chronologically sorted lists
    let iceGgLists = convertToLists(iceAndGg, times);

    // make scales for time, ice, and greenhouse gases
    let scales = makeScales(times, iceGgLists, dims);

    // make a time slider, connected to map
    makeSlider(scales["Time"], dims, maps);

    // make a line chart, showing ice extent data by default
    makeLineChart(iceGgLists["Extent"], dims, scales["Extent"]);
}


/**
 * Makes time scale from input times, and scales for all variables in input
 * dataLists. Returns all scales in object, with variable name as key.
 */
function makeScales(times, dataLists, dims) {
    let scales = {};

    // make scales for all variables in data
    for (i in dataLists) {
        scales[i] = d3.scaleLinear()
                      .domain(d3.extent(dataLists[i], y => y["value"]))
                      .range([dims.height, 0]);
    }

    // add a time scale, made from the input times
    scales["Time"] = d3.scaleTime()
                       .domain(d3.extent(times))
                       .range([0, dims.width])
                       .clamp(true);

    return(scales);
}


/**
 * Makes a line chart of given input data.
 */
function makeLineChart(data, dims, yScale) {
    xScale1 = d3.scaleTime()
               .domain(d3.extent(data, d => d["date"]))
               .range([0, dims.width * 2]);

    let parseTime = d3.timeParse("%Y-%m");

    // create SVG element
    let svg = d3.select("#line-chart-div")
                .append("svg")
                .attr("class", "lineChart")
                .attr("width", dims.w * 2)
                .attr("height", dims.h);

    let g = svg.append("g")
               .attr("class", "line-chart")
               .attr("transform", "translate(" + dims.margins.left
                                               + ","
                                               + dims.margins.top
                                               + ")");

    // make axes
    axes(svg, xScale1, yScale, dims);

    let line = d3.line()
                 .x(function(d) {
                      return xScale1(d["date"]);
                  })
                 .y(function(d) {
                      return yScale(d["value"]);
                  });
                 // .curve(d3.curveMonotoneX); Should I use this --> question!!

    g.append("path")
     .data([data])
     .attr("class", "line")
     .attr("d", line)
     .style("stroke", "white");

    // create dots for scatter plot
    let dots = g.selectAll("circle:not(.legendCirc)")
                .data(data)
                .enter()
                .append("circle");

    // define properties of dots
    dots.attr("cx", function(d) {
             return xScale1(d["date"]);
         })
        .attr("cy", function(d) {
             return yScale(d["value"]);
         })
        .attr("r", 3)
        .style("fill", function(d) {
             return "white";
         });
}


/**
 * Converts variables corresponding to month + year to lists. Returns object with
 * these lists saved under keys of the variable names. Format is usable for
 * making scales and plots.
 */
function convertToLists(data, times) {
    // get names of variables by entering first month & year
    let month1 = Object.keys(data)[0],
        year1 = Object.keys(data[month1])[0];
    let vars = Object.keys(data[month1][year1]);


    let getYear = d3.timeFormat("%Y"),
        getMonth = d3.timeFormat("%m");

    // transform data to dict with lists for each var, ordered chronologically
    let dataLists = {}
    for (i in times) {
        let year = getYear(times[i]),
            month = getMonth(times[i]);

        for (j in vars) {
            if (vars[j] in dataLists) {
                dataLists[vars[j]].push({"date": times[i],
                                         "value": Number(data[month][year]
                                                         [vars[j]])
                                        });
            }
            else {
                dataLists[vars[j]] = [{"date": times[i],
                                       "value": Number(data[month][year]
                                                       [vars[j]])
                                      }];
            }
        }
    }

    return dataLists;
}


/**
 * Defines, creates, and adds labels to the x and y axis.
 */
function axes(svg, xScale, yScale, dims) {
    // define x axis
    var xAxis = d3.axisBottom()
                  .scale(xScale);

    // define y axis
    var yAxis = d3.axisLeft()
                  .scale(yScale);

    // create x axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + dims.margins.left
                                       + ","
                                       + (dims.margins.top + dims.height)
                                       + ")")
       .call(xAxis);

    // create y axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + dims.margins.left
                                       + ","
                                       + dims.margins.top
                                       + ")")
       .call(yAxis);

    // add label x axis
    svg.append("text")
       .attr("class", "label")
       .attr("x", dims.margins.left + dims.width / 2)
       .attr("y", dims.margins.top + dims.height + dims.margins.bottom)
       .style("text-anchor", "middle")
       .text("Time");

    // add label y axis
    svg.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("x", - dims.margins.top - dims.height / 2)
       .attr("y", dims.margins.left / 5)
       .style("text-anchor", "middle")
       .text("Different axes? :O At least: Ice Area (perhaps downward?)");
}

/**
 * Converts times from input JSON to chronologically sorted list. Returns list.
 */
function sortTime(json) {
    // get months (first keys) from json, sort chronologically
    let months = Object.keys(json);
    months.sort();

    let parseTime = d3.timeParse("%Y-%m");

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

    // sort times chronologically
    times.sort();

    // convert times to D3 time format
    for (i in times) {
        times[i] = parseTime(times[i]);
    }

    return times;
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
       .data(map.features)
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

    // create handle, marking current position on slider
    let handle = slider.append("circle", "track-overlay")
                       .attr("class", "handle")
                       .attr("r", 10);

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
          // .attr("class", "ticks")
          .attr("x", xScale)
          .attr("y", h / 4)
          .attr("text-anchor", "middle")
          .text(function(d) {
              return formatYear(d);
           })
          .style("fill", "white"); // better via css, but not working

    // create label showing current slider position above handle
    let label = slider.append("text")
                      .attr("class", "label")
                      .attr("text-anchor", "middle")
                      .text(formatMonthYear(xScale.domain()[0]))
                      .attr("transform", "translate(0," + (- h / 4) + ")")
                      .style("fill", "white"); // better via css, but not working

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
    console.log("update");

    // remove map's svg element
    let svg = d3.select(".map");
    svg.remove();

    makeMap(map, dims);

    // transition??
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
