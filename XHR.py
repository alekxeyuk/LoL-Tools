import requests
from urllib.parse import quote as encodeURIComponent
import math
import time

class XHR:
    """XHR requests class"""
 
    def __init__(self):
        """Constructor"""
        pass

    def query(self, query, args, callback):
        r = requests.post("https://www.landsoflords.com/ajax/query", data={'token': self.token, 'q': self.encode(query, args)})
        return r.text

    def encode(self, query, args):
        q = ''
        if args:
            for i,v in args:
                q += i + ':' + encodeURIComponent(v, safe='~()*!.\'') + ','
        q += 'query:' + query
        ts = math.floor(math.floor(time.time()) / 9) % 9999
        kstring = self.token + ts
        klen = len(kstring)
        k = ''
        for i in range(0, 20):
            k += kstring.substring((ts + i * 7) % klen, (ts + i * 7) % klen + 1)
        enc = lol.pad0(ts, 4)
        for i in range(0, len(q)):
            c = q.charCodeAt(i)
            kc = k.charCodeAt((i * 7) % k.length)
            enc += String.fromCharCode((c + kc) % 256)
        return lol.B64.encode(enc)