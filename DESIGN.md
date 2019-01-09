# Design Document

## Data Sources and Transformation
* [National Snow & Ice Data Center - Sea Ice Index Data](https://nsidc.org/data/seaice_index/)
  * __Arctic Ice Extent Shapefiles__ (ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/monthly/shapefiles/shp_extent/) These need to be converted to TopoJSON files, in WGS84 coordinates. For the first test version, this is done using [MyGeodata Converter](https://mygeodata.cloud/converter/shp-to-json). Later a Python file will be written, using either GeoPandas or the Python Shapefile Library, to convert all shapefiles to TopoJSON formats and output these in one JSON file.
  * __Daily Ice Extent CSV__ (ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v3.0.csv) This file can be imported in Python, and transformed to a Pandas dataframe. Then ice extent of each month will be averaged. The monthly data file that this gives rise to can be combined with other monthly data files (on comparison variables, such as emissions, polar bear populations, etc.).

## Technical Components

## Used D3 Plugin
