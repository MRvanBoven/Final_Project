# Design Document

## Data Sources and Transformation
* [National Snow & Ice Data Center - Sea Ice Index Data](https://nsidc.org/data/seaice_index/)
  * __Arctic Ice Extent Shapefiles__ (ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/monthly/shapefiles/shp_extent/) These are converted to GeoJSON files in the WGS84 coordinate reference system, via [GeoConverter](https://geoconverter.hsr.ch/), an online converter. The output JSONs are combined to one JSON file, through a Python script.
  * __Daily Ice Extent CSV__ (ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v3.0.csv) This file can be imported in Python, and transformed to a Pandas dataframe. Then ice extent of each month will be averaged. The monthly data file that this gives rise to can be combined with other monthly data files (on comparison variables, such as emissions, polar bear populations, etc.).
* Data on either arctic animal populations or global emissions. Preferably, these data can be combined with the daily ice extent CSV, using the Pandas library in a Python script.

## Technical Components
* A __map__ showing the monthly arctic ice coverage (or extent), for any month in 1979 to 2018. The map will be made from a GeoJSON file, and in D3-geo.
* A __slider__ will allow the user to define the month of which the map is shown. The slider can be built with D3 Simple Slider. 
  * Possibly a play button can be added to the slider, which, when clicked, gives rise to an animation of the arctic ice extent from 1979 to 2018.
* A dropdown menu, allowing the user to choose a month to only show data of.
* A line graph, showing the ice extent by default, to which lines can be added (and from which they can be deleted), by clicking an animal icon (or an emission type).
* Animal icons (or emission types, indicated by chemical formulas), along with an ice icon, with the animal population, amount of emission, or ice coverage area data, from the month of which the map is shown.
* If emissions: perhaps a pie chart showing the distribution of the main human emissions.

## Used D3 Plugins
* D3 Simple Slider
