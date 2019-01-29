# Design Document

## Data Sources and Transformation
* [National Snow & Ice Data Center - Sea Ice Index Data](https://nsidc.org/data/seaice_index/)
  * __Arctic Ice Extent Shapefiles__ (ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/monthly/shapefiles/shp_extent/) These are converted to GeoJSON files in the WGS84 coordinate reference system, via [GeoConverter](https://geoconverter.hsr.ch/), an online converter. The output JSONs are combined to one JSON file, through a Python script.
  * __Daily Ice Extent CSV__ (ftp://sidads.colorado.edu/DATASETS/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v3.0.csv) This file can be imported in Python, and transformed to a Pandas dataframe. Then ice extent of each month will be averaged. The monthly data file that this gives rise to can be combined with the monthly data files on atmospheric greenhouse gas concentrations, as explained below.
* [ESRL Global Monitoring Division](https://www.esrl.noaa.gov/gmd/dv/data/index.php?pageID=2&category=Greenhouse%2BGases&frequency=Monthly%2BAverages&site=ZEP)
  * __Atmospheric Greenhouse Gas Concentration CSVs__ Monthly atmospheric concentrations of CH4, CO, CO2, N2O, and SF6, in molar fractions of air, measured on Svalbard (which is on the Arctic), from 1998 to 2017. These monthly data CSVs can be combined with the Daily Ice Extent CSV, which is done via a Python script, using Pandas.

## Technical Components
* A __map__ showing the monthly arctic ice coverage (or extent), for any month in 1979 to 2018. The map will be made from a GeoJSON file, and in D3-geo.
* A __slider__ will allow the user to define the month of which the map is shown. The slider can be built with D3 drag.
  * A play button for the slider, added in HTML.
* A __dropdown menu__, allowing the user to choose a month to only show data of.
* A __line chart__, showing the ice extent by default, to which lines can be added (and from which they can be deleted), by clicking an animal icon (or an emission type).
* Animal __icons__ (or emission types, indicated by chemical formulas), along with an ice icon, with the animal population, amount of emission, or ice coverage area data, from the month of which the map is shown.
* If emissions: perhaps a __pie chart__ showing the distribution of the main human emissions.

## Used Plugins
* Bootstap
* [GeoConverter](https://geoconverter.hsr.ch/) for converting shapefiles to GeoJSONs in WGS84 coordinates
