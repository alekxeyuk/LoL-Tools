import math
import base64


'''# -*- coding: ISO-8859-1 -*-'''
locales = {
    'quality.0': "ужасного качества",
    'quality.1': "низкого качества",
    'quality.2': "среднего качества",
    'quality.3': "хорошего качества",
    'quality.4': "отличного качества",
    'quality.5': "исключительного качества",
}

def pad0(data, length: int) -> str:
    if not isinstance(data, str):
        n = str(data)
    return data.zfill(length)

class B64:
    """Base 64 encode/decode"""

    def __init__(self):
        self.table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        self.decode_table = str.maketrans('-~_', '+/=')
        self.encode_table = {v: k for k, v in self.decode_table.items()}
    
    def decode(self, data: str, url = None, string = False) -> bytes:
        if url:
            data = data.translate(self.decode_table)
        return base64.b64decode(data) if not string else str(base64.b64decode(data))[2:-1]

    def encode(self, data: str, url = None) -> str:
        result = str(base64.b64encode(bytes(data.encode("ISO-8859-1"))))[2:-1]
        if url:
            result = result.translate(self.encode_table)
        return result


class Building(object):
    @staticmethod
    def Building(data: str, sep: str = '|') -> dict:
        params = ('id', 'type', 'level', 'status', 'name', 'quality', 'state', 'x', 'y', 'value', 'isIncompatible')
        data_list = data.split(sep)
        data_dict = dict(zip(params, data_list[:-3]))
        data_dict.update({
            'owner': dict(zip(('id', 'blazon', 'name'), data_list[-3:])),
            'icon': f'{data_dict.get("type")}.{data_dict.get("level")}{data_dict.get("status")}'
        })
        del data_list, params
        return data_dict

    @staticmethod
    def qualityAsString(quality: int) -> str:
        return locales.get('quality.' + str(min(math.floor(float(quality) * 2.5), 5)))
