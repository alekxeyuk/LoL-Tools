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

def pad0(n, length):
    if not isinstance(n, str):
        n = str(n)
    return f"{'0'*(length-len(n))}{n}"

class B64:
    """Base 64 encode/decode"""

    def __init__(self):
        self.table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    
    def decode(self, data, url = None, string = False):
        if url:
            data = data.replace('-', '+')
            data = data.replace('~', '/')
            data = data.replace('_', '=')
        return base64.b64decode(data) if not string else str(base64.b64decode(data))[2:-1]

    def encode(self, data, url = None):
        result = str(base64.b64encode(bytes(data.encode("ISO-8859-1"))))[2:-1]
        if url:
            result = result.replace('+', '-')
            result = result.replace('/', '~')
            result = result.replace('=', '_')
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
