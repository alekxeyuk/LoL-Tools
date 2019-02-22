def pad0(n, length):
    line = '' + str(n)
    while len(line) < length:
        line = '0' + line
    return line