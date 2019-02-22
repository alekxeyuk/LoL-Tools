import requests
from urllib.parse import quote as encodeURIComponent
import math
import time
import lol
import string

B64 = lol.B64()

class XHR:
    """XHR requests class"""
 
    def __init__(self):
        """Constructor"""
        self.token = 'GlG5mM1tsmlWrQNRBLc2'

    def query(self, query, args, callback):
        r = requests.post("https://www.landsoflords.com/ajax/query", data={'token': self.token, 'q': self.encode(query, args)})
        return r.text

    def encode(self, query, args):
        q = ''
        if args:
            for i in args.keys():
                q += i + ':' + encodeURIComponent(bytes(str(args[i]).encode("utf-8")), safe='~()*!.\'') + ','
        #print(q)
        q += 'query:' + query
        #print(q)
        ts = math.floor(math.floor(time.time()) / 9) % 9999
        kstring = self.token + str(ts)
        #print(kstring)
        klen = len(kstring)
        k = ''
        for i in range(0, 20):
            k += kstring[int((ts + i * 7) % klen):int((ts + i * 7) % klen + 1)]
        #print(k)
        enc = lol.pad0(ts, 4)
        #print(enc)
        for i in range(0, len(q)):
            c = ord(q[i])
            kc = ord(k[(i * 7) % len(k)])
            enc += chr((c + kc) % 256)
        #print(enc)
        return B64.encode(enc)

XHR = XHR()

print(XHR.encode('map', {
        'nav': 0,
        'x': -6230,
        'y': -1686,
        'w': 80,
        'h': 80,
        'zoom': 1,
        'mode': 'st'
    }))