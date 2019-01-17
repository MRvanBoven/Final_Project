#!/usr/bin/env python
# Name: Maud van Boven
# Student number: 12474673
"""
This script combines multiple JSON files to one JSON file.
"""

import json
import os

OUTPUT_JSON = 'geoJSONs_1998-2017.json'


if __name__ == "__main__":

    # create dictionary to be eventually written out to JSON file
    allmaps = {}

    # define path and names of directories found when following path
    dir = "./Maps/JSONfiles/"
    months = ["01-January", "02-February", "03-March", "04-April", "05-May",
              "06-June", "07-July", "08-August", "09-September", "10-October",
              "11-November", "12-December"]

    # enter each month's directory
    for month in months:

        # for all years in this range, save data in output JSON
        for i in range(1998, 2018):

            # define exact path to geoJSON file
            name = f"extent_N_{i}{month[:2]}_polygon_v3.0"
            path = f"{dir}/{month}/{name}/{name}.geojson"

            # if file exists, save it in dictionary
            if os.path.exists(path):
                with open(path, 'r') as infile:
                    geojson = json.load(infile)

                    # get {month: {year: geoJSON, year: geoJSON, ...}} structure
                    if month[:2] in allmaps.keys():
                        allmaps[month[:2]][i] = geojson
                    else:
                        allmaps[month[:2]] = {i: geojson}

                    infile.close()

    # write filled dictionary to JSON output file
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(allmaps, outfile, indent=4)
