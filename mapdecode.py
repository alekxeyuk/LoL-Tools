def updateWithData(data):
    data = data.split('#')
    weather = data[0].split('|')
    wsymbol = weather[0]
    temp = int(weather[1])
    #$('#weather').css('background-image', 'url(/img/weather/' + wsymbol + '.png)').html('' + temp + '<small>°C</small>')
    mgmts = data[1].split('$')
    html = ''
    for i in mgmts:
        if not mgmts[i]:
            continue
        mgmt = mgmts[i].split('|')
        html += '<div class="round">'
        html += f'<img class="round pointer" onclick="lol.go(\'/arm/org/{mgmt[0]}\')"'
        html += f' src="/img/herald/{mgmt[1]}.st.jpg" title="{mgmt[2]}">'
        mgmtFin = int(mgmt[3])
        mgmtUnit = int(mgmt[4])
        mgmtBuild = int(mgmt[5])
        mgmtTrade = int(mgmt[6])
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
    x = int(info[n++])
    y = int(info[n++])
    w = int(info[n++])
    h = int(info[n++])
    zoom = int(info[n++])
    mode = info[n++]
    tx0 = int(info[n++])
    ty0 = int(info[n++])
    tw = int(info[n++])
    th = int(info[n++])
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
    #var tileWidth = 100.0 * zoom * 16 / lol.Map.width
    #var tileHeight = 100.0 * zoom * 16 / lol.Map.height
    for i in tiles:
        if not tiles[i]:
            continue
        tile = tiles[i].split('|')
        ttag = tile[0]
        tx = int(tile[1])
        ty = int(tile[2])
        version = int(tile[3])
        released = int(tile[4])
        key = 'tile:' + tx + ':' + ty + ':' + zoom + ':' + version
        left = 100.0 * (tx * 16 + lol.Map.width / 2) / lol.Map.width
        top = 100.0 * (ty * 16 + lol.Map.height / 2) / lol.Map.height
        style = 'left:' + left + '%top:' + top + '%width:' + tileWidth + '%height:' + tileHeight + '%'
        if anim:
            style += 'display:none'
        src = '/img/tile/' + ttag + '.' + zoom + '.' + version + (released ? '' : '.unreleased') + '.jpg'
        html = '<img class="tile new" style="' + style + '" src="' + src + '" data-key="' + key + '"/>'
        div.append(html)
        tcoords['' + tx + ':' + ty] = true
    
    for (var tx = tx0 tx < tx0 + tw tx += zoom)
        for (var ty = ty0 ty < ty0 + th ty += zoom) {
            if (tcoords['' + tx + ':' + ty]) continue
            var key = 'tile:' + tx + ':' + ty + ':' + zoom + ':0'
            var left = 100.0 * (tx * 16 + lol.Map.width / 2) / lol.Map.width
            var top = 100.0 * (ty * 16 + lol.Map.height / 2) / lol.Map.height
            var style = 'left:' + left + '%top:' + top + '%width:' + tileWidth + '%height:' + tileHeight + '%'
            if (anim) style += 'display:none'
            var src = '/img/tile/' + Math.abs((tx / zoom) % 2) + Math.abs((ty / zoom) % 2) + '.' + zoom + '.0.jpg'
            var html = '<img class="tile new" style="' + style + '" src="' + src + '" data-key="' + key + '"/>'
            div.append(html)
        }
    var orgs = data[4].split('$')
    div.children('.label').remove()
    for (var i in orgs) {
        if (!orgs[i]) continue
        var org = orgs[i].split('|')
        var x = int(org[0])
        var y = int(org[1])
        var crest = org[2]
        var name = org[3]
        var blazon = org[4]
        var left = 100.0 * (x + lol.Map.width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        var top = 100.0 * (y + lol.Map.height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        var style = 'left:' + left + '%top:' + top + '%'
        var html = '<div class="label" style="' + style + '">'
        if (crest.length) html += '<img class="crest" src="/img/crest/' + crest + '.sh.png"/>'
        html += '<img class="blz" src="/img/herald/' + blazon + '.sh.png"/>'
        html += '<p class="old uppercase round txt ellipsis">' + name + '</p></div>'
        div.append(html)
    }
    var cellWidth = 100.0 * lol.Map.cellWidth / divWidth * zoom / lol.Map.zoom
    var cellHeight = 100.0 * lol.Map.cellWidth / divHeight * zoom / lol.Map.zoom
    var unitGroups = data[5].split('$')
    div.children('.units').remove()
    for (var i in unitGroups) {
        if (!unitGroups[i]) continue
        var units = unitGroups[i].split('|')
        var x = int(units[0])
        var y = int(units[1])
        var n = Math.min(int(units[2]), 9)
        var left = 100.0 * (x - 0.25 + lol.Map.width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        var top = 100.0 * (y - 0.25 + lol.Map.height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        var style = 'left:' + left + '%top:' + top + '%width:' + (cellWidth * 1.5) + '%height:' + (cellHeight * 1.5) + '%'
        var html = '<img class="units noMouse" style="' + style + '" src="/img/map/units' + n + '.gif"/>'
        div.append(html)
    }
    var routes = data[6].split('$')
    div.children('.route').remove()
    for (var i in routes) {
        if (!routes[i]) continue
        var route = routes[i].split('|')
        var x = int(route[0])
        var y = int(route[1])
        var type = route[2]
        var title = __('route.' + type)
        var left = 100.0 * (x - 0.25 + lol.Map.width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        var top = 100.0 * (y - 0.25 + lol.Map.height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        var style = 'left:' + left + '%top:' + top + '%width:' + (cellWidth * 1.5) + '%height:' + (cellHeight * 1.5) + '%'
        var html = '<img class="route" style="' + style + '" src="/img/map/route.png" title="' + title + '"/>'
        div.append(html)
    }
    var actions = data[7].split('$')
    div.children('.act').remove()
    for (var i in actions) {
        if (!actions[i]) continue
        var action = actions[i].split('|')
        var x = int(action[0])
        var y = int(action[1])
        var type = action[2]
        var title = __('act.' + type)
        var left = 100.0 * (x - 0.25 + lol.Map.width / 2) * lol.Map.cellWidth / lol.Map.zoom / divWidth
        var top = 100.0 * (y - 0.25 + lol.Map.height / 2) * lol.Map.cellWidth / lol.Map.zoom / divHeight
        var style = 'left:' + left + '%top:' + top + '%width:' + (cellWidth * 1.5) + '%height:' + (cellHeight * 1.5) + '%'
        var html = '<img class="act" style="' + style + '" src="/img/map/act/' + type + '.gif" title="' + title + '"/>'
        div.append(html)
    }
    if (anim) {
        div.children('img.new').load(function() {
            $(this).fadeIn(400, function() {
                if ($(this).is('.deprecated')) return
                var key = $(this).attr('data-key')
                div.children('.deprecated[data-key="' + key + '"]').remove()
            })
        })
    }
    div.children('img.new').removeClass('new')
    clearTimeout(lol.Map.deprecatedTimeout)
    lol.Map.deprecatedTimeout = setTimeout(function() {
        div.children('.deprecated').remove()
    }, 30000)


if __name__ == "__main__":
    data = "8r|28#235437|E2M70XrHQF-ioZmpv2RUotfySbxS|Домен Ninouland||||$#-6230|-1686|80|80|1|st|-392|-108|6|6#mKqlBgp7gJR9mCl5Qw__|-389|-105|1798|13$lKqlBgp7gJR9mCV5Qw__|-389|-104|1185|13$lqqlBgp7gJR9mCd5Qw__|-389|-106|2124|13$lKqlBgp3gJR9mCl5Qw__|-388|-105|1075|13$GKqlBo53gJR9mCl5Qw__|-390|-105|355|13$kqqlBgp3gJR9mCd5Qw__|-388|-106|1822|13$FKqlBo53gJR9mCV5Qw__|-390|-104|182|13$FqqlBo53gJR9mCd5Qw__|-390|-106|944|13$kKqlBgp3gJR9mCV5Qw__|-388|-104|189|13$mqqlBgp7gJR9mCt5Qw__|-389|-107|483|13$maqlBgp7gJR9mCp5Qw__|-389|-103|277|13$G6qlBop-gJR9mCl5Qw__|-387|-105|1549|13$HKqlBo57gJR9mCl5Qw__|-391|-105|513|13$GaqlBop-gJR9mCd5Qw__|-387|-106|2411|13$GqqlBo57gJR9mCd5Qw__|-391|-106|1293|13$GKqlBo57gJR9mCV5Qw__|-391|-104|167|13$laqlBgp3gJR9mCp5Qw__|-388|-103|396|13$lqqlBgp3gJR9mCt5Qw__|-388|-107|410|13$GqqlBo53gJR9mCt5Qw__|-390|-107|236|13$GaqlBo53gJR9mCp5Qw__|-390|-103|165|13$F6qlBop-gJR9mCV5Qw__|-387|-104|1145|13$HaqlBo57gJR9mCp5Qw__|-391|-103|180|13$HqqlBo57gJR9mCt5Qw__|-391|-107|1013|13$HaqlBop-gJR9mCt5Qw__|-387|-107|895|13$HKqlBop-gJR9mCp5Qw__|-387|-103|502|13$GqqlBo55gJR9mCl5Qw__|-392|-105|612|13$E6qlBgp7gJR9GCR5Qw__|-389|-108|654|13$FqqlBo55gJR9mCV5Qw__|-392|-104|860|13$GKqlBo55gJR9mCd5Qw__|-392|-106|1852|13$k6qlBo53gJR9GCR5Qw__|-390|-108|394|13$D6qlBgp3gJR9GCR5Qw__|-388|-108|114|13$l6qlBo57gJR9GCR5Qw__|-391|-108|1074|13$G6qlBo55gJR9mCp5Qw__|-392|-103|912|13$lqqlBop-gJR9GCR5Qw__|-387|-108|1031|13$HKqlBo55gJR9mCt5Qw__|-392|-107|1324|13$laqlBo55gJR9GCR5Qw__|-392|-108|98|13$##-6231|-1686|1$-6231|-1684|1$-6230|-1685|1$###"
    updateWithData(data)