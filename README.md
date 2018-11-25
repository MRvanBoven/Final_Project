# Arctic ice coverage and arctic animal species population sizes: How do they vary over time and how do they correlate?

In this project, the final project for the programming minor of the University of Amsterdam, a website will be built, showing an interactive data visualisation of arctic ice coverage and the population sizes of several arctic animal species. The aim of this visualisation is to create insight into the correlations that might exist between those variables, and to create awareness of the imminent danger that slow freeze of the arctic poses upon many animal species.

## Problem

"The polar caps are melting," is a frequently heard statement in climate change discussions. However, most people do not know exactly what this statement entails. The term 'arctic freeze rate' for example is widely unknown, as is the fact that this year it hit a record breaking low. Amongst many people all over the world there is a lack of awareness of the imminent danger this poses for many arctic animal species. Also, the correlation between the arctic ice coverage at certain times of year and size of animal populations needs further investigation, knowledge retrieved from which might be of specific interest to arctic biologist.

## Solution

An interactive website dedicated to arctic ice coverage and population size of certain arctic animal species over time, will help gain information about the correlations between these two and create awareness about the imminent dangers polar animal species are facing due to slow arctic freeze.

### Visual sketch final product

![alt text](https://github.com/MRvanBoven/Final_Project/blob/master/vis_sketch.jpg "Visualisation Sketch")

__User Interactions__

Possible user interactions that can be incorporated in this website are:

* A timeline with a slidable position marker,
* A play button to show the arctic ice coverage change over time,
* Animal and ice figures (also showing population size and coverage area data for each time on the timeline) that can be clicked to show a line chart of the population size respectively coverage area over time above (or under) the timeline, and can be shown simultaneously in order to allow comparison,
* A dropdown menu to show specifications for several animal species, such as population territories, and birthing and hunting locations.

__Main Features__

Main features available to users, devided into minimum viable product (MVP) and optional implementation categories, are:

_MVP_
* A timeline with a slidable position marker,
* Maps of arctic ice coverage for every moment on timeline,
* (Estimated) animal populations for each moment on timeline,
* Line charts ice area and animal populations, which can be, if so chosen by the user, visible simultaneously.

_Optional Implementations_
* Annual human CO2 production data and clickable line chart,
* Markings of specific polar bear population and pregnant female hibernation sites (and show possible troubles in reaching these hibernation sites),
* Similar markings for other animal species,
* A dropdown menu for showing all such markings, grouped by animal species,
* A timeline play button,
* Additional facts about animal behaviour and why this puts them at risk in situations of slow freeze.

## Prerequisites

### Data Sources

Databases and sets that may be used in this project include:

* Google Earth archives,
* Sea Ice Index NOAA (https://catalog.data.gov/dataset/sea-ice-index),
* Minimum Annual Arctic Sea Ice Extent (https://data.world/gpsdd/625ff6c3-56c2-4f64-a473-60611a8a1623),
* Data from: Harvesting wildlife affected by climate change: a modelling and management approach for polar bears, by Regehr EV, Wilson RR, Rode KD, Runge MC, Stern HL (https://datadryad.org/handle/10255/dryad.134106),
* IUCN,
* WWF.

### External Components

Libraries needed for running this project site are:

* D3: https://d3js.org/.


### Review of Related Visualisations


### Hardest Parts

The hardest parts of implementing this data visualisation will be obtaining the data and visualising the ice coverage in an actual map.

## Authors

* Maud van Boven


## Acknowledgments

* Minor Programmeren University of Amsterdam
