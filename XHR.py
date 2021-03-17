# -*- coding: ISO-8859-1 -*-

from typing import Union
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

        key = ''.join([kstring[(ts + i * kstring_arg) % klen] for i in range(0, 20)])
        result = self.cipher(data[4:], key, decode=True)
        return decodeURIComponent(result)

    def decode_client(self, data: str) -> str:
        return self._decode(data, 7)

    def decode_server(self, data: str) -> str:
        return self._decode(data, 3)

    def encode(self, query: str, args: Union[dict, None] = None) -> str:
        serialized = [
            f"""{key}:{encodeURIComponent(str(value).encode("ISO-8859-1"), safe="~()*!.'")}"""
            for key, value in args.items()
        ] if args else []

        serialized.append(f'query:{query}')
        serialized = ','.join(serialized)

        ts = math.floor(math.floor(time.time()) / 9) % 9999
        kstring = self.token + str(ts)
        klen = len(kstring)

        key = ''.join([kstring[int((ts + i * 7) % klen)] for i in range(0, 20)])
        enc = [lol.pad0(ts, 4), self.cipher(serialized, key)]
        return B64.encode(''.join(enc))

    @staticmethod
    def cipher(data: str, key: str, decode: bool = False) -> str:
        key_len = len(key)
        return ''.join([
            chr((ord(char) - ord(key[(i * 7) % key_len])) % 256)
            if decode else
            chr((ord(char) + ord(key[(i * 7) % key_len])) % 256)
            for i, char in enumerate(data)
        ])

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
