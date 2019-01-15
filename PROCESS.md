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
