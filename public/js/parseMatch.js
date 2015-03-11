var parseMatch = function(match) {
  var totalGame = parseInt(match.game);
  var scoreL = new Array(totalGame * 2 - 1);
  var scoreR = new Array(totalGame * 2 - 1);
  for (var i = 0; i < totalGame * 2 - 1; i++) scoreL[i] = scoreR[i] = 0;
  var gameL = 0, gameR = 0, now = 0, swap = false, giveUp = false;
  var finished = false, newGame = true, finalPos = false;
  var pos = match.pos, serve = match.serve;
  var posL = match.pos12 & 1;
  var posR = match.pos34 & 1;
  for (var i = 0; i < match.points.length; i++) {
    swap = false;
    if (match.points[i] == '8' || match.points[i] == '9') {
      if (match.points[i] == '8') gameR = totalGame;
      if (match.points[i] == '9') gameL = totalGame;
      giveUp = true;
      finished = true;
      newGame = false;
      break;
    }
    if (match.points[i] == '0') {
      scoreL[now]++;
      if (serve == 0) posL = 1 - posL;
      else serve = 0;
    }
    if (match.points[i] == '1') {
      scoreR[now]++;
      if (serve == 1) posR = 1 - posR;
      else serve = 1;
    }
    if (now == totalGame * 2 - 2 && (scoreL[now] == parseInt((match.total + 1) / 2)
        || scoreR[now] == parseInt((match.total + 1) / 2)) && !finalPos) {
      finalPos = true;
      pos = 1 - pos;
      swap = true;
    }
    if (((scoreL[now] >= match.total || scoreR[now] >= match.total)
        && (scoreL[now] - scoreR[now] >= match.diff
            || scoreR[now] - scoreL[now] >= match.diff))
        || scoreL[now] == match.upper || scoreR[now] == match.upper) {
      if (scoreL[now] > scoreR[now]) gameL++;
      if (scoreL[now] < scoreR[now]) gameR++;
      if (gameL == totalGame || gameR == totalGame) {
        finished = true;
        newGame = false;
        break;
      } else {
        finished = false;
        newGame = true;
        now++;
        pos = 1 - pos;
        swap = true;
        posL = (match.pos12 >> now) & 1;
        posR = (match.pos34 >> now) & 1;
      }
    } else {
      finished = false;
      newGame = false;
    }
  }
  var points = '';
  for (var i = 0; i <= now; i++) {
    if (scoreL[i] > 0 || scoreR[i] > 0) {
      if (i > 0) points += ',';
      points += scoreL[i] + "-" + scoreR[i];
    }
  }
  if (giveUp) {
    if (points != '') points += ',';
    points += "弃";
  }
  return {gameL: gameL, gameR: gameR, giveUp: giveUp,
      scoreL: scoreL, scoreR: scoreR, points: points, swap: swap,
      now: now, newGame: newGame, finished: finished,
      pos: pos, posL: posL, posR: posR, serve: serve};
};

