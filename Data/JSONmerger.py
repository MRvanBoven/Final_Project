#!/usr/bin/env python
# Name: Maud van Boven
# Student number: 12474673
"""
This script combines multiple JSON files to one JSON file.
"""

import os
import sys
# directory = os.path.dirname(os.path.realpath(__file__))
# parentdir = os.path.dirname(directory)
# sys.path.append(os.path.join(parentdir, "objects"))

import json
import numpy as np
import pandas as pd

OUTPUT_JSON = 'allmaps.json'


if __name__ == "__main__":

    allmaps = {}

    dir = "./Maps/JSONfiles/"
    months = ["01-January", "02-February", "03-March", "04-April", "05-May",
              "06-June", "07-July", "08-August", "09-September", "10-October",
              "11-November", "12-December"]

    for month in months:
        for i in range(1979, 2019):
            name = f"extent_N_{i}{month[:2]}_polygon_v3.0"
            path = f"{dir}/{month}/{name}/{name}.geojson"

            if os.path.exists(path):
                with open(path, 'r') as infile:
                    geojson = json.load(infile)

                    if i in allmaps.keys():
                        allmaps[i][month[:2]] = geojson
                    else:
                        allmaps[i] = {month[:2]: geojson}

                    infile.close()

    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(allmaps, outfile, indent=4)
