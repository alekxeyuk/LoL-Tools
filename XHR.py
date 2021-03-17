# -*- coding: ISO-8859-1 -*-

import requests
from urllib.parse import quote as encodeURIComponent, unquote as decodeURIComponent
import math
import time
import lol
import mapdecode

B64 = lol.B64()

class XHR:
    """XHR requests class"""
 
    def __init__(self, token: str, phpsessid: str, lang: str = 'ru'):
        """Constructor"""
        self.token = token
        self.session = requests.Session()
        self.session.cookies.update({'lang': lang, 'PHPSESSID': phpsessid})

    def token_update(self, url = None):
        pass

    def query(self, query, args):
        r = self.session.post("https://www.landsoflords.com/ajax/query", data={'token': self.token, 'ts': math.floor(time.time()), 'q': self.encode(query, args)})
        if r.text == "" or r.text[0] == "!":
            return "!eRRor: " + r.text
        return self.decode_server(r.text)

    def _decode(self, data: str, kstring_arg: int = 3) -> str:
        data = data.replace('\n\r', '').strip()
        data = B64.decode(data).decode('ISO-8859-1')
        ts = int(data[0:4])
        kstring = self.token + str(ts)
        klen = len(kstring)
        k = ''.join([kstring[(ts + i * kstring_arg) % klen] for i in range(0, 20)])
        k_len = len(k)
        result = [
            chr((ord(char) - ord(k[(i * 7) % k_len])) % 256)
            for i, char in enumerate(data[4:])
        ]

        return decodeURIComponent(''.join(result))

    def decode_client(self, data: str) -> str:
        return self._decode(data, 7)

    def decode_server(self, data: str) -> str:
        return self._decode(data, 3)

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

if __name__ == "__main__":
    XHR = XHR(input('Enter token'), input('Enter PHPSESSID'))

    #for x in range(-476, -800, -1):
    data = XHR.query('map', {
        'nav': 0,
        'x': 0,
        'y': 0,
        'w': 20000,
        'h': 20000,
        'zoom': 1,
        'mode': 'st'
    })

    if data[0] != "!":
        mapdecode.updateWithData(data)
    else:
        print(data)
