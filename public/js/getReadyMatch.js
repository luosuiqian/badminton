var getReadyMatch = function (year, users, matches) {
  var ready = [];
  var types = [1, 3, 4, 5];
  var total = [null, 0, null, 0, 0, 0];
  var userName = [null, {}, null, {}, {}, {}];
  for (var i = 0; i < users.length; i++) {
    total[users[i].type] = users[i].total;
    userName[users[i].type][users[i].id] = users[i].name;
  }
  for (var t in types) {
    var type = types[t];
    var winner = new Array(total[type]);
    var loser = new Array(total[type]);
    for (var i = 0; i < total[type]; i++) {
      winner[i] = 0;
      loser[i] = 0;
    }
    for (var i = 1; i < total[type]; i += 2) {
      if (type <= 2) {
        var idL = i;
        var idR = i + 1;
      } else {
        var idL = i * 2 - 1;
        var idR = i * 2 + 1;
      }
      if (userName[type][idL] == null) {
        loser[i] = idL;
        winner[i] = idR;
      }
      if (userName[type][idR] == null) {
        winner[i] = idL;
        loser[i] = idR;
      }
    }
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].type == type) {
        if (matches[i].leftP > matches[i].rightP) var p = 0;
        else var p = parseInt((matches[i].leftP + matches[i].rightP) / 2);
        if (matches[i].status >= 2) {
          var detail = parseMatch(matches[i]);
          if (detail.gameL > detail.gameR) {
            var w = matches[i].id1;
            var l = matches[i].id3;
          }
          if (detail.gameL < detail.gameR) {
            var l = matches[i].id1;
            var w = matches[i].id3;
          }
          winner[p] = w;
          loser[p] = l;
        } else {
          winner[p] = -1;
          loser[p] = -1;
        }
        matches[i].nam1 = userName[type][matches[i].id1];
        matches[i].nam2 = matches[i].id2 == 0 ? '' : userName[type][matches[i].id2];
        matches[i].nam3 = userName[type][matches[i].id3];
        matches[i].nam4 = matches[i].id4 == 0 ? '' : userName[type][matches[i].id4];
      }
    }
    for (var i = 1; i < total[type]; i += 2) {
      if (winner[i] == 0) {
        ready.push({year: year, type: type, totalP: total[type],
            leftP: i, rightP: i + 1,
            id1: type==1 ?   i : i*2-1,
            id2: type==1 ?   0 :   i*2,
            id3: type==1 ? i+1 : i*2+1,
            id4: type==1 ?   0 : i*2+2,
        });
      }
    }
    for (var i = 2; i < total[type]; i += 2) {
      if (winner[i] == 0) {
        var idL =  i - (i - (i & (i - 1)) >> 1);
        var idR =  i + (i - (i & (i - 1)) >> 1);
        if (winner[idL] > 0 && winner[idR] > 0) {
          ready.push({year: year, type: type, totalP: total[type],
              leftP: (i & (i - 1)) + 1, rightP: i + (i - (i & (i - 1))),
              id1: winner[idL],
              id2: type==1 ? 0 : winner[idL] + 1,
              id3: winner[idR],
              id4: type==1 ? 0 : winner[idR] + 1,
          });
        }
      }
    }
    if (winner[0] == 0) {
      var idL = parseInt(total[type] / 4);
      var idR = idL * 3;
      if (winner[idL] > 0 && winner[idR] > 0) {
        ready.push({year: year, type: type, totalP: total[type],
            leftP: total[type], rightP: 1,
            id1: loser[idL],
            id2: type==1 ? 0 : loser[idL] + 1,
            id3: loser[idR],
            id4: type==1 ? 0 : loser[idR] + 1,
        });
      }
    }
  }
  for (var i = 0; i < ready.length; i++) {
    ready[i].nam1 = userName[ready[i].type][ready[i].id1];
    ready[i].nam2 = ready[i].id2 == 0 ? '' : userName[ready[i].type][ready[i].id2];
    ready[i].nam3 = userName[ready[i].type][ready[i].id3];
    ready[i].nam4 = ready[i].id4 == 0 ? '' : userName[ready[i].type][ready[i].id4];
  }
  return ready;
};

