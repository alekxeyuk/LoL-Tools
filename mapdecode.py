width = 640
height = 640

def updateWithData(data):
    data = data.split('#')
    print('data', data)
    weather = data[0].split('|')
    print('weather', weather)
    wsymbol = weather[0]
    print('wsymbol', wsymbol)
    temp = int(weather[1])
    print('temp', temp)
    #$('#weather').css('background-image', 'url(/img/weather/' + wsymbol + '.png)').html('' + temp + '<small>°C</small>')
    mgmts = data[1].split('$')
    print('mgmts', mgmts)
    html = ''
    for i in mgmts:
        if i == '':
            continue
        mgmt = i.split('|')
        print('mgmt', mgmt)
        html += '<div class="round">'
        html += f'<img class="round pointer" onclick="lol.go(\'/arm/org/{mgmt[0]}\')"'
        html += f' src="/img/herald/{mgmt[1]}.st.jpg" title="{mgmt[2]}">'
        mgmtFin = int(mgmt[3] or 0)
        mgmtUnit = int(mgmt[4] or 0)
        mgmtBuild = int(mgmt[5] or 0)
        mgmtTrade = int(mgmt[6] or 0)
        html += ' <div class="mgmtbtns">'
        if mgmtFin:
            html += '<a class="blur" href="/mgmt/' + mgmt[0] + '/finances"><img class="round" src="/img/button/fin.png"></a> '
        else:
            html += '<img class="round blur" src="/img/button/black.png"> '
        if mgmtUnit:
            html += '<a class="blur" href="/mgmt/' + mgmt[0] + '/units"><img class="round" src="/img/button/unit.png"></a><br>'
        else:
            html += '<img class="round blur" src="/img/button/black.png"><br>'
        if mgmtBuild:
            html += '<a class="blur" href="/mgmt/' + mgmt[0] + '/buildings"><img class="round" src="/img/button/bld.png"></a> '
        else:
            html += '<img class="round blur" src="/img/button/black.png"> '
        if mgmtTrade:
            html += '<a class="blur" href="/mgmt/' + mgmt[0] + '/resources"><img class="round" src="/img/button/res.png"></a>'
        else:
            html += '<img class="round blur" src="/img/button/black.png">'
        html += '</div>'
        html += '</div>'
    #$('#mapMgmt').html(html)
    n = 0
    info = data[2].split('|')
    x = int(info[++n])
    y = int(info[++n])
    w = int(info[++n])
    h = int(info[++n])
    zoom = int(info[++n])
    mode = info[++n]
    tx0 = int(info[++n])
    ty0 = int(info[++n])
    tw = int(info[++n])
    th = int(info[++n])
    mtx0 = tx0 - tw
    mty0 = ty0 - th
    mtw = tw * 3
    mth = th * 3
    info = {
        x: x,
        y: y,
        w: w,
        h: h,
        zoom: zoom,
        tx0: tx0,
        ty0: ty0,
        tw: tw,
        th: th,
        mtx0: mtx0,
        mty0: mty0,
        mtw: mtw,
        mth: mth
    }
    #var div = $('#map .map')
    #var divWidth = div.width()
    #var divHeight = div.height()
    tcoords = {}
    tiles = data[3].split('$')
    #div.children('.tile.new').remove()
    #div.children('.tile').addClass('deprecated')
    tileWidth = 100.0 * zoom * 16 / width
    tileHeight = 100.0 * zoom * 16 / height
    print('tiles', tiles)
    for i in tiles:
        if i == "":
            continue
        tile = i.split('|')
        print('tile', tile)
        ttag = tile[0]
        tx = int(tile[1])
        ty = int(tile[2])
        version = int(tile[3])
        released = int(tile[4])
        key = f'tile:{tx}:{ty}:{zoom}:{version}'
        left = 100.0 * (tx * 16 + width / 2) / width
        top = 100.0 * (ty * 16 + height / 2) / height
        style = f'left:{left}%top:{top}%width:{tileWidth}%height:{tileHeight}%'
        #if anim:
        #    style += 'display:none'
        src = f'/img/tile/{ttag}.{zoom}.{version}{("" if released else ".unreleased")}.jpg'
        html = '<img class="tile new" style="' + style + '" src="' + src + '" data-key="' + key + '"/>'
        #div.append(html)
        tcoords[f'{tx}:{ty}'] = True
    
    for tx in range(tx0, tx0+tw, zoom):             # (tx = tx0 tx < tx0 + tw tx += zoom)
        for ty in range(ty0, ty0+th, zoom):         # (ty = ty0 ty < ty0 + th ty += zoom)
            #print(tcoords)
            print(tcoords)
            if tcoords[f'{tx}:{ty}']:
                continue
            key = 'tile:' + tx + ':' + ty + ':' + zoom + ':0'
            left = 100.0 * (tx * 16 + width / 2) / width
            top = 100.0 * (ty * 16 + height / 2) / height
            style = 'left:' + left + '%top:' + top + '%width:' + tileWidth + '%height:' + tileHeight + '%'
            if anim:
                style += 'display:none'
            src = '/img/tile/' + Math.abs((tx / zoom) % 2) + Math.abs((ty / zoom) % 2) + '.' + zoom + '.0.jpg'
            html = '<img class="tile new" style="' + style + '" src="' + src + '" data-key="' + key + '"/>'
            div.append(html)

    orgs = data[4].split('$')
    #div.children('.label').remove()
    for i in orgs:
        if not orgs[i]:
            continue
        org = orgs[i].split('|')
        x = int(org[0])
        y = int(org[1])
        crest = org[2]
        name = org[3]
        blazon = org[4]
        left = 100.0 * (x + width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        top = 100.0 * (y + height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        style = 'left:' + left + '%top:' + top + '%'
        html = '<div class="label" style="' + style + '">'
        if crest.length:
            html += '<img class="crest" src="/img/crest/' + crest + '.sh.png"/>'
        html += '<img class="blz" src="/img/herald/' + blazon + '.sh.png"/>'
        html += '<p class="old uppercase round txt ellipsis">' + name + '</p></div>'
        div.append(html)

    cellWidth = 100.0 * lol.Map.cellWidth / divWidth * zoom / lol.Map.zoom
    cellHeight = 100.0 * lol.Map.cellWidth / divHeight * zoom / lol.Map.zoom
    unitGroups = data[5].split('$')
    #div.children('.units').remove()
    for i in unitGroups:
        if not unitGroups[i]:
            continue
        units = unitGroups[i].split('|')
        x = int(units[0])
        y = int(units[1])
        n = Math.min(int(units[2]), 9)
        left = 100.0 * (x - 0.25 + width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        top = 100.0 * (y - 0.25 + height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        style = 'left:' + left + '%top:' + top + '%width:' + (cellWidth * 1.5) + '%height:' + (cellHeight * 1.5) + '%'
        html = '<img class="units noMouse" style="' + style + '" src="/img/map/units' + n + '.gif"/>'
        div.append(html)

    routes = data[6].split('$')
    #div.children('.route').remove()
    for i in routes:
        if not routes[i]:
            continue
        route = routes[i].split('|')
        x = int(route[0])
        y = int(route[1])
        type = route[2]
        title = __('route.' + type)
        left = 100.0 * (x - 0.25 + width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        top = 100.0 * (y - 0.25 + height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        style = 'left:' + left + '%top:' + top + '%width:' + (cellWidth * 1.5) + '%height:' + (cellHeight * 1.5) + '%'
        html = '<img class="route" style="' + style + '" src="/img/map/route.png" title="' + title + '"/>'
        div.append(html)

    actions = data[7].split('$')
    #div.children('.act').remove()
    for i in actions:
        if not actions[i]:
            continue
        action = actions[i].split('|')
        x = int(action[0])
        y = int(action[1])
        type = action[2]
        title = __('act.' + type)
        left = 100.0 * (x - 0.25 + width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        top = 100.0 * (y - 0.25 + height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        style = 'left:' + left + '%top:' + top + '%width:' + (cellWidth * 1.5) + '%height:' + (cellHeight * 1.5) + '%'
        html = '<img class="act" style="' + style + '" src="/img/map/act/' + type + '.gif" title="' + title + '"/>'
        div.append(html)

    if anim:
        pass
        #div.children('img.new').load(function() {
        #    $(this).fadeIn(400, function() {
        #        if ($(this).is('.deprecated')) return
        #        var key = $(this).attr('data-key')
        #        div.children('.deprecated[data-key="' + key + '"]').remove()
        #    })
        #})

    div.children('img.new').removeClass('new')
    clearTimeout(lol.Map.deprecatedTimeout)
    #lol.Map.deprecatedTimeout = setTimeout(function() {
    #    div.children('.deprecated').remove()
    #}, 30000)


if __name__ == "__main__":
    data = "8r|28#235437|E2M70XrHQF-ioZmpv2RUotfySbxS|Домен Ninouland||||$#-6230|-1686|80|80|1|st|-392|-108|6|6#mKqlBgp7gJR9mCl5Qw__|-389|-105|1798|13$lKqlBgp7gJR9mCV5Qw__|-389|-104|1185|13$lqqlBgp7gJR9mCd5Qw__|-389|-106|2124|13$lKqlBgp3gJR9mCl5Qw__|-388|-105|1075|13$GKqlBo53gJR9mCl5Qw__|-390|-105|355|13$kqqlBgp3gJR9mCd5Qw__|-388|-106|1822|13$FKqlBo53gJR9mCV5Qw__|-390|-104|182|13$FqqlBo53gJR9mCd5Qw__|-390|-106|944|13$kKqlBgp3gJR9mCV5Qw__|-388|-104|189|13$mqqlBgp7gJR9mCt5Qw__|-389|-107|483|13$maqlBgp7gJR9mCp5Qw__|-389|-103|277|13$G6qlBop-gJR9mCl5Qw__|-387|-105|1549|13$HKqlBo57gJR9mCl5Qw__|-391|-105|513|13$GaqlBop-gJR9mCd5Qw__|-387|-106|2411|13$GqqlBo57gJR9mCd5Qw__|-391|-106|1293|13$GKqlBo57gJR9mCV5Qw__|-391|-104|167|13$laqlBgp3gJR9mCp5Qw__|-388|-103|396|13$lqqlBgp3gJR9mCt5Qw__|-388|-107|410|13$GqqlBo53gJR9mCt5Qw__|-390|-107|236|13$GaqlBo53gJR9mCp5Qw__|-390|-103|165|13$F6qlBop-gJR9mCV5Qw__|-387|-104|1145|13$HaqlBo57gJR9mCp5Qw__|-391|-103|180|13$HqqlBo57gJR9mCt5Qw__|-391|-107|1013|13$HaqlBop-gJR9mCt5Qw__|-387|-107|895|13$HKqlBop-gJR9mCp5Qw__|-387|-103|502|13$GqqlBo55gJR9mCl5Qw__|-392|-105|612|13$E6qlBgp7gJR9GCR5Qw__|-389|-108|654|13$FqqlBo55gJR9mCV5Qw__|-392|-104|860|13$GKqlBo55gJR9mCd5Qw__|-392|-106|1852|13$k6qlBo53gJR9GCR5Qw__|-390|-108|394|13$D6qlBgp3gJR9GCR5Qw__|-388|-108|114|13$l6qlBo57gJR9GCR5Qw__|-391|-108|1074|13$G6qlBo55gJR9mCp5Qw__|-392|-103|912|13$lqqlBop-gJR9GCR5Qw__|-387|-108|1031|13$HKqlBo55gJR9mCt5Qw__|-392|-107|1324|13$laqlBo55gJR9GCR5Qw__|-392|-108|98|13$##-6231|-1686|1$-6231|-1684|1$-6230|-1685|1$###"
    updateWithData(data)