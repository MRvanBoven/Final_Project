#!/usr/bin/env python
# Name: Maud van Boven
# Student number: 12474673
"""
This script loads in multiple CSV files, combines them, and converts the
combined dataset to a JSON output file.
"""

import csv
import json
import numpy as np
import os
import os
import pandas as pd
from functools import reduce

PATH = './CSV_files/'
OUTPUT_JSON = 'ice_area+gg(1998-2017).json'


def combine(dataframes):
    """
    Combines given dataframes to one. Returns that one dataframe.
    """

    # save dataframes in list, making sure all have month & year as int type
    dfs = []
    for key in dataframes:
        dataframes[key]['Year'] = dataframes[key]['Year'].astype(int)
        dataframes[key]['Month'] = dataframes[key]['Month'].astype(int)
        dfs.append(dataframes[key])

    # combine dataframes, merging on Year and Month columns
    df = reduce(lambda left, right:
                pd.merge(left, right, on=['Year', 'Month'], how='outer'), dfs)

    return df


def preprocess(df):
    """
    Preprocesses given data frame. Returns preprocessed data frame.
    """

    # remove redundant spacing around column titles
    column_names = list(df.columns.values)
    column_names = [col.strip() for col in column_names]
    df.columns = column_names

    # drop colums with data of no interest to us
    df = df.drop(columns=['Missing', 'Source Data'])

    # remove first row, as it doesn't contain data values
    df = df.drop(index=[0])

    # convert Extent data in to numbers
    df['Extent'] = pd.to_numeric(df['Extent'], errors='coerce')

    # calculate average of each month for every year and group data as such
    df = df.groupby(['Year', 'Month'], as_index=False, sort=False).mean()

    return df


def to_dictionary(df):
    """
    Converts input dataframe to a nested dictionary. Returns that dictionary.
    """

    dict = {}

    # get unique month & year values, sort them, save them as 1st & 2nd keys
    first_keys = list(df['Month'].unique())
    first_keys.sort()
    second_keys = list(df['Year'].unique())
    second_keys.sort()

    # give dict month:{year:{CH4,CO2,CO,N2O,SF6,ice}} structure and fill in data
    for key1 in first_keys:
        key1 = int(key1)
        dict[key1] = {}
        for key2 in second_keys:
            key2 = int(key2)
            dict[key1][key2] = {"CH4": df.loc[(df['Month'] == key1)
                                              & (df['Year'] == key2),
                                              'CH4'].iloc[0],
                                "CO": df.loc[(df['Month'] == key1)
                                              & (df['Year'] == key2),
                                              'CO'].iloc[0],
                                "CO2": df.loc[(df['Month'] == key1)
                                              & (df['Year'] == key2),
                                              'CO2'].iloc[0],
                                "N2O": df.loc[(df['Month'] == key1)
                                              & (df['Year'] == key2),
                                              'N2O'].iloc[0],
                                "SF6": df.loc[(df['Month'] == key1)
                                              & (df['Year'] == key2),
                                              'SF6'].iloc[0],
                                "Extent": df.loc[(df['Month'] == key1)
                                                  & (df['Year'] == key2),
                                                  'Extent'].iloc[0]
                                }

    return dict


if __name__ == "__main__":

    # create dataframes of all files in path directory and save them in a dict
    filelist = os.listdir(PATH)
    dataframes = {}
    for file in filelist:
        if file[-4:] == '.csv':
            with open(PATH + file, 'r') as infile:

                # make sure right separator is used for each file
                if file == 'ice_extent_daily.csv':
                    df = pd.read_csv(infile)
                else:
                    df = pd.read_csv(infile, sep=';')

                dataframes[file[:-4]] = df

                infile.close()

    # preprocess ice extent data frame
    dataframes["ice_extent_daily"] = preprocess(dataframes["ice_extent_daily"])

    # combine all dataframes to one dataframe
    df = combine(dataframes)

    # only preserve data from the years 1998-2017
    df = df[df['Year'].isin(list(range(1998, 2018)))]

    # convert dataframe to nested dictionary
    dict = to_dictionary(df)

    # write dictionary to json file
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(dict, outfile, indent=4)
