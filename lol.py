import math
import base64
from typing import Union


'''# -*- coding: ISO-8859-1 -*-'''
locales = {
    'quality.0': "ужасного качества",
    'quality.1': "низкого качества",
    'quality.2': "среднего качества",
    'quality.3': "хорошего качества",
    'quality.4': "отличного качества",
    'quality.5': "исключительного качества",
}


def pad0(data: Union[int, str], length: int) -> str:
    return f"{data:0>{length}}"


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


class GameObject(object):
    def __init__(self):
        self.data = dict()

    @property
    def qualityPercent(self) -> int:
        return math.ceil(float(self.data['quality']) * 50)

    @property
    def qualityAsString(self) -> str:
        return locales.get('quality.' + str(min(math.floor(float(self.data['quality']) * 2.5), 5)))


class Building(GameObject):
    def __init__(self, data: str, sep: str = '|'):
        params = ('id', 'type', 'level', 'status', 'name', 'quality', 'state', 'x', 'y', 'value', 'isIncompatible')
        data_list = data.split(sep)
        data_dict = dict(zip(params, data_list[:-3]))
        data_dict.update({
            'owner': dict(zip(('id', 'blazon', 'name'), data_list[-3:])),
            'icon': f'{data_dict.get("type")}.{data_dict.get("level")}{data_dict.get("status")}'
        })
        del data_list, params
        self.data = data_dict


class Res(GameObject):
    def __init__(self, data: str, sep: str = '|'):
        params = ('type', 'name', 'isRelic', 'isConflict', 'unit', 'quality', 'quantity', 'inside', 'maxQuantity',
                  'missingQuantity', 'restored', 'rank', 'value', 'volume', 'isInStock', 'auto', 'sale', 'cons',
                  'purchase', 'maxStock', 'reservedStock', 'sellPrice', 'purchasePrice', 'purchasedQuality')
        data_list = data.split(sep)
        data_dict = dict(zip(params, data_list[:11] + data_list[16:-12]))
        data_dict.update({
            'owner': dict(zip(('id', 'blazon', 'name', 'money', 'cost'), data_list[11:16])),
        })
        if owner_id := data_dict.get('owner', {}).get('id', None):
            if owner_id[0] == 'o':
                data_dict['owner'].update(dict(org_id=int(owner_id[1:])))
            else:
                data_dict['owner'].update(dict(unit_id=int(owner_id[1:])))
        data_dict.update({
            'trade': {
                'region': dict(zip(('id', 'forSale', 'price', 'value'), data_list[-12:-8])),
                'order': dict(zip(('id', 'created', 'auto', 'put', 'price', 'done'), data_list[-8:-2]))
            }
        })
        data_dict.update({
            'demand': dict(zip(('count', 'happinessBonus'), data_list[-2:])),
        })
        del data_list, params
        self.data = data_dict
