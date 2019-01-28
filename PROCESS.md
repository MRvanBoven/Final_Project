# Process Book

## Day 2
* Plan: make prototype slider/map of monthly data from one year. Use [mapshaper](https://mapshaper.org) to convert shapefiles to GeoJSON/TopoJSON files. (Later a Python script, using GeoPandas, could be used for this, if the prototype trial is successful.)
* I use the [Daily Sea Ice Extent Data File](ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v3.0.csv), because the monthly data files provided by [National Snow & Ice Data Center](https://nsidc.org/) lack some information. The extents of each month will be averaged in Pandas.

## Day 3
* Turns out [mapshaper](https://mapshaper.org) converted my shapefiles to the wrong kind of coordinate system (probably Ordnance Survey National Grid). Luckily, [MyGeodata Converter](https://mygeodata.cloud/converter/shp-to-json) can convert them to TopoJSONs with WGS84 coordinates (which geoJSON/d3-geo expect per default). As input to that converter I gave all files in the downloaded shapefile zip (.cpg, .dbf, .prj, .shp, .shx). I doesn't work with only a .shp file (whereas [mapshaper](https://mapshaper.org) did). I'm not sure if I can write a Python script incorporating all these, or at least exporting a TopoJSON file in WGS84 coordinates. So now I have two possible courses of action:
  * convert the rest of 1979's months shapefiles via [MyGeodata Converter](https://mygeodata.cloud/converter/shp-to-json), test if I can load them into one TopoJSON, and see if the slider works out,
  * or try to write a Python script to convert my shapefiles to useful TopoJSONs.
* Development: [MyGeodata Converter](https://mygeodata.cloud/converter/shp-to-json) has a conversion limit of 3 datasets a month, so using this to convert all shapefiles doesn't seem like a good option (although incognito mode may provide a solution). It would be much nicer to have a working script for the conversion anyway. I did, however, convert three sets to useful topoJSONs, with which I can make a very simple test version of the slider.

## Day 4
* Installation of libraries (GeoPandas, GDAL and shapefile library) to manipulate and convert shapefiles all unsuccessful.
* Installation of command line [mapshaper](https://github.com/mbloch/mapshaper/blob/master/README.md) succesful. (Finally!)

## Day 5
* No progress, due to illness.

## Day 6
* Files converted to WGS84 TopoJSONs with command line mapshaper are not compatible with D3 geo.
* Found [GeoConverter](https://geoconverter.hsr.ch/), an online converter that allows the output coordinate reference system (EPSG) to be defined as WGS84 (EPSG no. 4326), accept batch input, and can convert to output GeoJSON files.
* So now GeoJSON input in D3 instead of TopoJSON.
* Usable GeoJSONs of all maps dowloaded. Will now write a (python) script to combine those to one JSON file, in order to reduce input load on website.
* Simple slider was added to JavaScript script, to test map transitions with.

## Day 7
* JSONmerger.py works and outputs a very big json file containing all GeoJSONs.
* The file might be so large that it will be hard to use on my website. Options to fix this:
  * Put it online?
  * First convert all GeoJSONs to TopoJSONs, which are about 75% smaller. Problem now: converting to TopoJSON with mapshaper command line gives a file with presumably the wrong winding order, so the TopoJSON isn't functional yet.
  * Use only 20 or even 10 years of data. (Would be a shame, though.)

## Day 8
* Because I want to implement an option to filter on a specific month, I rearranged the JSONmerger a bit, to let months be the first keys, and years the second, so that the maps of a specific month can easily be selected.
* Using 10 years of data, instead of the full 40, gives rise to a file of about 25% the size of the full data, as expected. This is still quite some to process for the site, but it solves the loading problem partially. Because having more data in this case will show the decay of the arctic ice extent much better, for now I still opt for using all 40 years of data. However, showing 480 months on a slider might be a lot to ask, so perhaps 20 or 10 years will be chosen after all.
* For testing, I now use one year, so that the site loads rather fast.
* Found great [example of slider](https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763) with exactly the same features as I want for my visualisation, so implemented slider following this example.
* Slider needs to be made ordinal (with discrete month steps instead of continuous). This hopefully also solves current problem of not (always) reaching final value when using play button. (Although that might also (partially) be due to the if statement defining when to stop playing.) [Step slider example that might be useful](https://bl.ocks.org/shashank2104/d7051d80e43098bf9a48e9b6d3e10e73)
* Maps successfully linked to slider. No transition yet, would be nice for later.
* Issue that might also be solved with making slider ordinal: maps now updated for every minor movement of slider.

## Day 9
* Found atmospheric greenhouse gases concentration data, measured on Svalbard, by the [ESRL Global Monitoring Division](https://www.esrl.noaa.gov/gmd/dv/data/index.php?pageID=2&category=Greenhouse%2BGases&frequency=Monthly%2BAverages&site=ZEP]) The Svalbard part is great, because this is a location on the arctic.
* Here I found data about CH4, CO, CO2, NO2, and SF6, almost complete from 1998 to 2017. So hereby it's decided that I will also use the maps of this period.
* Concentration data missing: 2010-10 & 2010-11 CO2. From [this dataset](ftp://aftp.cmdl.noaa.gov/data/trace_gases/co2/flask/surface/co2_zep_surface-flask_1_ccgg_event.txt) of the same institute, it is clear that the values measured in this month were remarkably high and had a high uncertainty. This could have been due to measurement errors, equipment malfunction, or something of the sort. Because this data seems untrustworthy, it is not used to replace the missing data.
* Wrote Python script to combine all csv files into one JSON output file, with same nested structure as allmaps-JSON file (month = first key, year = second), with info of years 1998-2017. The similar structure will be useful for selecting data per month.

## Day 10
* Line chart added. By default it shows the ice extent area. Later, when greenhouse gas data can be added, a right side y axis might be needed, for the gases can probably use the same axis, but they cannot share the ice area axis. Another option is to change it into an area graph and show the ice area underneath the x axis, and the greenhouse gases above it.
* All scales (time, ice area, gases) are saved in an object, with the variable name corresponding to the scale as key. Like this they can be easily selected later, when data will be added to or removed from the line chart.
* All variable data was also converted to lists of objects like {"date": corresponding time, "value": value}. Like this they are easily accessible and compatible for the line graph, amongst other uses.
* Idea from mentor session: add loading icon to page while uploading GeoJSON data. Will be nice for user to see that the page is working on something.

## Day 11 (sort of)
* Bootstrap used for lay out of page. For now divs set in bootstrap grid. Later other functionalities of Bootstrap, like a nav bar and dropdown, may also be used.
  * The dimensions of svg elements and specific propeties of graphs/charts are no longer defined in main, but in the function making the svg and element.
  * Because it is nice when the page loads with sizes adjusted to window width, the width of the bootstrap-divided divs is obtained in JavaScript via document.getElementById("div-name").offsetWidth.
* All scales are made in one function and returned in an object. This gives the opportunity to use the scales in various functions, without having to create them again. Because every graph/chart may have another range, the range is defined in the function creating the graph/chart.
* The combined geoJSON data file was too large to upload to GitHub. In order to let the site work via GitHub, two JSON files, each containing 10 years of the total 20, were made and are merged in the JavaScript script, in the function mergeJSONS.
* The slider steps are now dependent of the time scale (which is dependent of the input geoJSON data). This ensures that steps are roughly one month, independent of how many months of data are given. However this is still buggy, so a better solution should be found (perhaps using the abilities of D3 time scales).
* The functions sortTime and convertToLists are written in order to get the data in the right format for making a line graph. This formatting will probably also turn out useful for other types of charts/graphs.
* It would be nice if the data loaded into the JavaScript script needn't be in the same directory, so that it could be stored in the Data directory. However, using ../Data/filename doesn't work. So for the time being, the data is kept in the code directory. 
