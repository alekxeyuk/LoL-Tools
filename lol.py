import base64

def pad0(n, length):
    line = '' + str(n)
    while len(line) < length:
        line = '0' + line
    return line

class B64:
    """Base 64 encode/decode"""

    def __init__(self):
        self.table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    
    def decode(self, data, url = None):
        if url:
            data = data.replace('-', '+')
            data = data.replace('~', '/')
            data = data.replace('_', '=')
        result = str(base64.b64decode(data))[2:-1]
        return result

    def encode(self, data, url = None):
        result = str(base64.b64encode(bytes(data.encode("ISO-8859-1"))))[2:-1]
        if url:
            result = result.replace('+', '-')
            result = result.replace('/', '~')
            result = result.replace('=', '_')
        return result

#b6 = B64()
#print(b6.encode("anal", True))
#print(b6.decode(b6.encode("anal", True), True))