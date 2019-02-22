# -*- coding: ISO-8859-1 -*-

import requests
from urllib.parse import quote as encodeURIComponent, unquote as decodeURIComponent
import math
import time
import lol
import string
import mapdecode

B64 = lol.B64()

class XHR:
    """XHR requests class"""
 
    def __init__(self):
        """Constructor"""
        self.token = 'jaVdJ5hK4vOSwTn8w8sq'

    def query(self, query, args):
        r = requests.post("https://www.landsoflords.com/ajax/query", data={'token': self.token, 'q': self.encode(query, args)})
        if r.text[0] == "!":
            return r.text
        return self.decode(r.text)

    def decode(self, data):
        data = data.replace('\n\r', '')
        data = data.strip()
        data = B64.decode(data).decode('ISO-8859-1')
        ts = int(data[0:4])
        kstring = self.token + str(ts)
        klen = len(kstring)
        k = ''
        for i in range(0, 20):
            k += kstring[int((ts + i * 3) % klen):int((ts + i * 3) % klen + 1)]
        result = ''
        data = data[4:]
        for i in range(len(data)):
            c = ord(data[i])
            kc = ord(k[(i * 7) % len(k)])
            result += chr((c - kc) % 256)
        
        return decodeURIComponent(result)

    def encode(self, query, args):
        q = ''
        if args:
            for i in args.keys():
                q += i + ':' + encodeURIComponent(bytes(str(args[i]).encode("ISO-8859-1")), safe='~()*!.\'') + ','
        q += 'query:' + query
        ts = math.floor(math.floor(time.time()) / 9) % 9999
        kstring = self.token + str(ts)
        klen = len(kstring)
        k = ''
        for i in range(0, 20):
            k += kstring[int((ts + i * 7) % klen):int((ts + i * 7) % klen + 1)]
        enc = lol.pad0(ts, 4)
        for i in range(0, len(q)):
            c = ord(q[i])
            kc = ord(k[(i * 7) % len(k)])
            enc += chr((c + kc) % 256)
        return B64.encode(enc)

XHR = XHR()

for x in range(-476, -800, -1):
    data = XHR.query('map', {
            'nav': 0,
            'x': x*16,
            'y': -14528,
            'w': 1,
            'h': 1,
            'zoom': 1,
            'mode': 'st'
        })

    if data != "!EXPIRED":
        mapdecode.updateWithData(data)
    else:
        print(data)