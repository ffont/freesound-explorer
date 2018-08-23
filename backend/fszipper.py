from backend.settings import DOWNLOAD_FOLDER_PATH
import os
import urllib2
import csv
import zipfile
import uuid
import time
import json
import re


class FsZipper:


    def __init__(self, zipabs, csvabs, access_token, download_id):
        self.zipabs = zipabs
        self.csvabs = csvabs
        self.download_id = download_id
        self.access_token = access_token
        self.cleanup_array = []


    def zip_originals(self, fsids, negative_list):
        """
        requests given sounds from freesound and ads them to a zipfile including metadata,
        which will be added to a csv file included in the zip.
        @parameters:
            fsids:          list of freesound ids
            negative_list:  names of columns discard from the freesound metadata
        @return:
            cleanup_array:  list of all filepaths to be removed after request
        """

        prefix = os.path.join(os.getcwd(), DOWNLOAD_FOLDER_PATH, self.download_id)
        for id in fsids:
            # prepare
            dl_url = "https://freesound.org/apiv2/sounds/{}/download/".format(id)
            urlrequest = urllib2.Request(dl_url)
            urlrequest.add_header("Authorization", "Bearer {}".format(self.access_token))
            try:
                file = urllib2.urlopen(urlrequest)
            except:
                print('No internet connection?\n' + 'urlreceived: ' + dl_url)

            # get sound infos
            info_url = "https://freesound.org/apiv2/sounds/{}/?format=json".format(id)
            urlrequest2 = (urllib2.Request(info_url))
            urlrequest2.add_header("Authorization", "Bearer {}".format(self.access_token))
            metadata = urllib2.urlopen(urlrequest2)
            info_dict = json.load(metadata, encoding='utf-8')

            # get freesound filename from file response and reshape it to <name><fsid>.<suffix>
            try:
                fn_reshaped = ''.join([
                    info_dict['name'].split('.')[0],
                    '__', unicode(info_dict['id']), 
                    '.', info_dict['type']
                    ])
            except BaseException as be: 
                fn_reshaped = 'unnamed_audio.' + info_dict['type']
                print('! error in renaming the downloaded audio file: ' + str(be))
            filepath = os.path.join(prefix, fn_reshaped)

            # write file to disk
            output = open(filepath ,'wb')
            self.cleanup_array.append(filepath)
            output.write(file.read())
            output.close()

            ### prepare csv entries
            # delete unwanted columns
            for key in negative_list:
                info_dict.pop(key, None)
            # reshape tags
            info_dict['tags'] = ', '.join(info_dict['tags'])
            for k in info_dict:
                info_dict[k] = unicode(info_dict[k]).encode('utf-8')

            # prepare madatory fieldnames argument for csv.DictWriter
            columns = []
            for key in info_dict:
                columns.append(key)

            # write fileinfo to csv, writing header only once
            csvobj = open(self.csvabs, "a")
            if (id == fsids[0]):
                writer = csv.DictWriter(csvobj, fieldnames=columns)
                writer.writeheader()
            try: 
                writer = csv.DictWriter(csvobj, dialect='excel', fieldnames=columns)
                writer.writerow(info_dict)
            except BaseException as err: 
                print('!! Error appending metadata to csv. Error Message: \n' + str(err))
            csvobj.close()
        # end for id in fsids

        self.cleanup_array.append(self.csvabs)

        with zipfile.ZipFile(self.zipabs, "a") as zipobj:
            for path in self.cleanup_array:
                try: 
                    zipobj.write(path, os.path.basename(path))
                except:
                    print('Error adding cleanup_array paths to zip' + str(self.cleanup_array))

        self.cleanup_array.append(self.zipabs)
        return self.cleanup_array


    def cleanup(self):
        """ 
        Iterates through the cleanup array contining all files to be removed
        """
        # remove all files inside first
        for path in self.cleanup_array:
            os.remove(path)
        # then remove the temp folder
        try:
            os.rmdir(os.path.dirname(self.cleanup_array[0]))
        except OSError as err:
            print(err)
        return
