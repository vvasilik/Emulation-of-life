// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
var Cow = function Cow(mapObject) {
  this.type = 'cow';
  this.xPos = mapObject.xPos;
  this.yPos = mapObject.yPos;
  this.minRandomEnergy = 100;
  this.maxRandomEnergy = 200;
  this.enoughEnergyToBorn = 650;
  this.lessEnoughAfterToBorn = 300;
  this.energy = mapObject.energy || Math.floor(Math.random() * (this.maxRandomEnergy - this.minRandomEnergy + 1) + this.minRandomEnergy);
  this.energyKoef = 700;
  this.koefPossibilityEnter = 1;
  this.maxPossibleEnergy = 700;
  this.possibleObjectsToMove = ['empty', 'grass'];
  this.BLOCKED_OBJECT = false;
  this.objectClass = 'cow';
  this.moveStepEnergy = 5;
};

var Grass = function Grass(mapObject) {
  this.type = 'grass';
  this.xPos = mapObject.xPos;
  this.yPos = mapObject.yPos;
  this.minRandomEnergy = 10;
  this.maxRandomEnergy = 20;
  this.enoughEnergyToBorn = 45;
  this.lessEnoughAfterToBorn = 25;
  this.energy = mapObject.energy || Math.floor(Math.random() * (this.maxRandomEnergy - this.minRandomEnergy + 1) + this.minRandomEnergy);
  this.energyKoef = 50;
  this.koefPossibilityEnter = 1;
  this.maxPossibleEnergy = 50;
  this.possibleObjectsToMove = ['empty'];
  this.BLOCKED_OBJECT = false;
  this.objectClass = 'grass';
  this.addEnergyEveryStep = 1;
};

var Stone = function Stone() {
  this.type = 'stone';
  this.objectClass = 'stone';
  this.koefPossibilityEnter = 1;
};

var Empty = function Empty() {
  this.type = 'empty';
  this.objectClass = 'empty';
  this.koefPossibilityEnter = 1;
}; //представление карты


var map = {
  CURRENT_LOOP_INDEX: 0,
  RANDOM_GRASS_APPEARANCE: 5,
  INTERVAL_TIME: 300,
  MAP_POSSIBLE_WIDTH: Math.floor(screen.width / 50) - 1,
  MAP_WIDTH: 999,
  MAP_HEIGHT: 10,
  MIN_POSSIBLE_TIME_INTERVAL: 500,
  COORDS_LIST: [],
  start: function start(newInterval) {
    var mapEl = $('.map');

    if (!mapEl.hasClass('move')) {
      var self = this;

      if (newInterval === undefined) {
        newInterval = this.timeInerval;
      }

      this.timeInerval = setInterval($.proxy(self.lookEveryCell, self), newInterval);
      mapEl.addClass('move');
    }
  },
  stop: function stop() {
    clearInterval(this.timeInerval);
    $('.map').removeClass('move');
  },
  setNewTimeInterval: function setNewTimeInterval() {
    this.stop();
    this.INTERVAL_TIME = prompt('Введите новую скорость (милисекунды)');

    if (this.INTERVAL_TIME < this.MIN_POSSIBLE_TIME_INTERVAL) {
      this.INTERVAL_TIME = this.MIN_POSSIBLE_TIME_INTERVAL;
    }

    $('._mapSpeedInput').val(this.INTERVAL_TIME);
    $.proxy(setTimeout(this.start(this.INTERVAL_TIME), 1000), this);
  },
  lookEveryCell: function lookEveryCell() {
    this.CURRENT_LOOP_INDEX++;

    if (this.CURRENT_LOOP_INDEX % this.RANDOM_GRASS_APPEARANCE === 0) {
      this.setObjectToMap({
        type: 'grass'
      });
    }

    for (var i = 0; i < this.MAP_HEIGHT; i++) {
      for (var j = 0; j < this.MAP_WIDTH; j++) {
        if (this.COORDS_LIST[i][j].type === 'cow' || this.COORDS_LIST[i][j].type === 'grass') {
          if (this.COORDS_LIST[i][j].BLOCKED_OBJECT !== this.CURRENT_LOOP_INDEX) {
            if (this.COORDS_LIST[i][j].energy <= 0) {
              this.COORDS_LIST[i][j] = new Empty();
            } else {
              this.moveObject(this.COORDS_LIST[i][j]);
            }
          }
        } else if (this.COORDS_LIST[i][j].type === 'empty') {
          this.COORDS_LIST[i][j].koefPossibilityEnter++;
        }
      }
    }
  },
  createMap: function createMap() {
    //проверка максимально возможной ширины карты
    this.MAP_WIDTH = this.MAP_WIDTH > this.MAP_POSSIBLE_WIDTH ? this.MAP_POSSIBLE_WIDTH : this.MAP_WIDTH;

    for (var i = 0; i < this.MAP_HEIGHT; i++) {
      this.COORDS_LIST[i] = [];

      for (var j = 0; j < this.MAP_WIDTH; j++) {
        if (i === 0 || j === 0 || i === this.MAP_HEIGHT - 1 || j === this.MAP_WIDTH - 1) {
          this.COORDS_LIST[i][j] = new Stone();
        } else {
          this.COORDS_LIST[i][j] = new Empty();
        }
      }
    }

    this.show();
  },
  show: function show() {
    var mapHTML = $('.map');
    mapHTML.empty();
    var mapList = '';

    for (var i = 0; i < this.MAP_HEIGHT; i++) {
      for (var j = 0; j < this.MAP_WIDTH; j++) {
        var energy = this.COORDS_LIST[i][j].energy;
        var energyСoef = this.COORDS_LIST[i][j].energyKoef;
        var energySize = '';

        if (energyСoef === undefined) {
          energySize = 'no-energy';
        } else if (energy < energyСoef / 5) {
          energySize = 'e1';
        } else if (energy < 2 * energyСoef / 5) {
          energySize = 'e2';
        } else if (energy < 3 * energyСoef / 5) {
          energySize = 'e3';
        } else if (energy < 4 * energyСoef / 5) {
          energySize = 'e4';
        } else {
          energySize = 'e5';
        }

        mapList = mapList + '<li class="map-frame ' + this.COORDS_LIST[i][j].objectClass + '" data-pos="' + [i, j] + '"><span class="energy ' + energySize + '"></span></li>';
      }

      mapList = mapList + '<br />';
    }

    mapHTML.append(mapList);
  },
  setObjectToMap: function setObjectToMap(mapObject) {
    if (!mapObject.xPos || !mapObject.yPos) {
      var allEmptyCellsArr = this.findFromAllEmptyCells();

      if (!allEmptyCellsArr) {
        map.stop();
        return alert('Места нет!');
      }

      mapObject.xPos = allEmptyCellsArr[0];
      mapObject.yPos = allEmptyCellsArr[1];
    }

    if (mapObject.type === 'cow') {
      this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = new Cow(mapObject);
    } else if (mapObject.type === 'grass') {
      this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = new Grass(mapObject);
    } else if (mapObject.type === 'stone') {
      this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = new Stone();
    }

    this.show();
  },
  mapCellClick: function mapCellClick(cell) {
    map.stop();
    map.deleteNav();
    $(cell).prepend($('.cell-nav-holder').html());
    $.proxy(map.addCellListeners(), map);
  },
  deleteNav: function deleteNav() {
    $('.map .cell-nav').each(function () {
      $(this).remove();
    });
  },
  addCellListeners: function addCellListeners() {
    $('._cell-nav-cancel').on('click', this.closeCellNav);
    $('._cell-nav-delete').on('click', this.deleteObject);
    $('._cell-nav-add-cow').on('click', this.addCowByCell);
    $('._cell-nav-add-grass').on('click', this.addGrassByCell);
    $('._cell-nav-add-stone').on('click', this.addStoneByCell);
  },
  closeCellNav: function closeCellNav() {
    $(this).closest('.cell-nav').remove();
  },
  deleteObject: function deleteObject() {
    var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');

    if (clickedPositionList[0] == 0 || clickedPositionList[1] == 0 || clickedPositionList[0] == this.MAP_HEIGHT - 1 || clickedPositionList[1] == this.MAP_WIDTH - 1) {
      alert('Невозможно удалить стену!');
    } else {
      map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = new Empty();
      map.show();
    }
  },
  addCowByCell: function addCowByCell() {
    var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
    map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = new Cow({
      type: 'cow',
      xPos: parseFloat(clickedPositionList[0]),
      yPos: parseFloat(clickedPositionList[1])
    });
    map.show();
  },
  addGrassByCell: function addGrassByCell() {
    var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
    map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = new Grass({
      type: 'grass',
      xPos: parseFloat(clickedPositionList[0]),
      yPos: parseFloat(clickedPositionList[1])
    });
    map.show();
  },
  addStoneByCell: function addStoneByCell() {
    var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
    map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = new Stone();
    map.show();
  },
  findFromAllEmptyCells: function findFromAllEmptyCells() {
    var allEmptyCells = [];

    for (var i = 0; i < this.MAP_HEIGHT; i++) {
      for (var j = 0; j < this.MAP_WIDTH; j++) {
        if (this.COORDS_LIST[i][j].type === 'empty') {
          allEmptyCells.push([i, j]);
        }
      }
    }

    if (!allEmptyCells.length) {
      return false;
    } else {
      return allEmptyCells[Math.floor(Math.random() * allEmptyCells.length)];
    }
  },
  moveObject: function moveObject(mapObject) {
    var randomObjValues = this.getRandomEmptyPlace(mapObject);
    var newObj = {};
    newObj.xPos = randomObjValues.xPos;
    newObj.yPos = randomObjValues.yPos;
    newObj.energy = randomObjValues.energy;

    if (this.COORDS_LIST[newObj.xPos][newObj.yPos].type === 'grass' && this.COORDS_LIST[mapObject.xPos][mapObject.yPos].type === 'cow') {
      mapObject.energy = mapObject.energy + this.COORDS_LIST[newObj.xPos][newObj.yPos].energy;
    }

    if (mapObject.enoughEnergyToBorn && mapObject.energy >= mapObject.enoughEnergyToBorn) {
      mapObject.energy = mapObject.energy - mapObject.lessEnoughAfterToBorn;
      mapObject.BLOCKED_OBJECT = this.CURRENT_LOOP_INDEX;
      this.setObjectToMap({
        type: mapObject.type,
        xPos: newObj.xPos,
        yPos: newObj.yPos
      });
    } else if (mapObject.type === 'cow') {
      this.COORDS_LIST[mapObject.xPos][mapObject.yPos].koefPossibilityEnter = 1;
      this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = new Empty();
      mapObject.xPos = newObj.xPos;
      mapObject.yPos = newObj.yPos;
      this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = mapObject;
      mapObject.BLOCKED_OBJECT = this.CURRENT_LOOP_INDEX;
    }

    if (mapObject.moveStepEnergy !== undefined) {
      mapObject.energy = mapObject.energy - mapObject.moveStepEnergy;
    }

    if (mapObject.addEnergyEveryStep !== undefined) {
      if (mapObject.energy < mapObject.maxPossibleEnergy) {
        mapObject.energy = mapObject.energy + mapObject.addEnergyEveryStep;
      }
    }

    this.show();
  },
  getRandomEmptyPlace: function getRandomEmptyPlace(mapObject) {
    var emptyCellsList = this.findEmptyCells(mapObject);

    if (!emptyCellsList) {
      return {
        xPos: mapObject.xPos,
        yPos: mapObject.yPos,
        energy: mapObject.energy - mapObject.moveStepEnergy
      };
    }

    var randomEmptyCell = this.randomUseKoef(emptyCellsList);
    var energy = Math.floor(Math.random() * (mapObject.maxRandomEnergy - mapObject.minRandomEnergy + 1) + mapObject.minRandomEnergy);
    return {
      xPos: randomEmptyCell.xPos,
      yPos: randomEmptyCell.yPos,
      energy: energy
    };
  },
  randomUseKoef: function randomUseKoef(list) {
    var koefSum = 0;

    for (var i = 0; i < list.length; i++) {
      koefSum += list[i].koefPossibilityEnter;
    }

    var etalon = 100 / koefSum;

    for (var i = 0; i < list.length; i++) {
      list[i].procent = list[i].koefPossibilityEnter * etalon;
    }

    var randomNumber = Math.floor(Math.random() * 100);
    var procentSum = 0;

    for (var i = 0; i < list.length; i++) {
      if (randomNumber >= procentSum && randomNumber < procentSum + list[i].procent) {
        return list[i];
      } else {
        procentSum += list[i].procent;
      }
    }
  },
  findEmptyCells: function findEmptyCells(mapObject) {
    var emptyCellsList = [];

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos - 1].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos - 1,
        yPos: mapObject.yPos - 1,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos - 1].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos - 1,
        yPos: mapObject.yPos,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos + 1].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos - 1,
        yPos: mapObject.yPos + 1,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos + 1].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos][mapObject.yPos - 1].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos,
        yPos: mapObject.yPos - 1,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos][mapObject.yPos - 1].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos][mapObject.yPos + 1].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos,
        yPos: mapObject.yPos + 1,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos][mapObject.yPos + 1].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos - 1].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos + 1,
        yPos: mapObject.yPos - 1,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos - 1].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos + 1,
        yPos: mapObject.yPos,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos].koefPossibilityEnter
      });
    }

    if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos + 1].type) > -1) {
      emptyCellsList.push({
        xPos: mapObject.xPos + 1,
        yPos: mapObject.yPos + 1,
        koefPossibilityEnter: map.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos + 1].koefPossibilityEnter
      });
    } //умная корова


    var filterGrassList = emptyCellsList.filter(this.filterGrass);

    if (mapObject.type === 'cow' && filterGrassList.length !== 0) {
      return filterGrassList;
    } //


    if (emptyCellsList.length) {
      return emptyCellsList;
    } else {
      return false;
    }
  },
  filterGrass: function filterGrass(coords) {
    return map.COORDS_LIST[coords.xPos][coords.yPos].type === 'grass';
  }
};

var addListeners = function addListeners() {
  $('._addCow').on('click', addCow);
  $('._addGrass').on('click', addGrass);
  $('._addStone').on('click', addStone);
  $('._mapStart').on('click', mapStart);
  $('._mapStop').on('click', mapStop);
  $('._mapSpeedBtn').on('click', setNewTimeInterval);
  $('.map').on('click', '.map-frame', mapCellClick);
};

var addCow = function addCow() {
  $.proxy(map.setObjectToMap({
    type: 'cow'
  }), map);
};

var addGrass = function addGrass() {
  $.proxy(map.setObjectToMap({
    type: 'grass'
  }), map);
};

var addStone = function addStone() {
  $.proxy(map.setObjectToMap({
    type: 'stone'
  }), map);
};

var mapCellClick = function mapCellClick() {
  $.proxy(map.mapCellClick(this), map);
};

var mapStart = function mapStart() {
  $.proxy(map.start(parseInt($('._mapSpeedInput').val()), map));
};

var mapStop = function mapStop() {
  $.proxy(map.stop(), map);
};

var setNewTimeInterval = function setNewTimeInterval() {
  $.proxy(map.setNewTimeInterval(), map);
};

jQuery(function () {
  map.createMap();
  addListeners();
});
},{}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61571" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map