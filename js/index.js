var Cow = function (mapObject) {
    this.type = 'cow';
    this.xPos = mapObject.xPos;
    this.yPos = mapObject.yPos;
    this.minRandomEnergy = 100;
    this.maxRandomEnergy = 200;
    this.enoughEnergyToBorn = 650;
    this.lessEnoughAfterToBorn = 300;
    this.energy = mapObject.energy ||  Math.floor(Math.random() * (this.maxRandomEnergy - this.minRandomEnergy + 1) + this.minRandomEnergy);
    this.energyKoef = 700;
    this.maxPossibleEnergy = 700;
    this.possibleObjectsToMove = ['empty', 'grass'];
    this.BLOCKED_OBJECT = false;
    this.objectClass = 'cow';
    this.moveStepEnergy = 5;
};


var Grass = function (mapObject) {
    this.type = 'grass';
    this.xPos = mapObject.xPos;
    this.yPos = mapObject.yPos;
    this.minRandomEnergy = 10;
    this.maxRandomEnergy = 20;
    this.enoughEnergyToBorn = 45;
    this.lessEnoughAfterToBorn = 25;
    this.energy = mapObject.energy ||  Math.floor(Math.random() * (this.maxRandomEnergy - this.minRandomEnergy + 1) + this.minRandomEnergy);
    this.energyKoef = 50;
    this.maxPossibleEnergy = 50;
    this.possibleObjectsToMove = ['empty'];
    this.BLOCKED_OBJECT = false;
    this.objectClass = 'grass';
    this.addEnergyEveryStep = 1;
};


//представление карты
var map = {
    CURRENT_LOOP_INDEX: 0,
    RANDOM_GRASS_APPEARANCE: 5,
    INTERVAL_TIME: 300,
    MAP_POSSIBLE_WIDTH: Math.floor(screen.width / 50) - 1,
    MAP_WIDTH: 999,
    MAP_HEIGHT: 10,
    MIN_POSSIBLE_TIME_INTERVAL: 500,
    COORDS_LIST: [],
    EMPTY_OBJ: {
        type: 'empty',
        objectClass: 'empty'
    },
    STONE_OBJ: {
        type: 'stone',
        objectClass: 'stone'
    },
    start: function (newInterval) {
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
    stop: function () {
        clearInterval(this.timeInerval);
        $('.map').removeClass('move');
    },
    setNewTimeInterval: function () {
        this.stop();
        this.INTERVAL_TIME = prompt('Введите новую скорость (милисекунды)');
        if (this.INTERVAL_TIME < this.MIN_POSSIBLE_TIME_INTERVAL) {
            this.INTERVAL_TIME = this.MIN_POSSIBLE_TIME_INTERVAL;
        }
        $('._mapSpeedInput').val(this.INTERVAL_TIME);
        $.proxy(setTimeout(this.start(this.INTERVAL_TIME), 1000), this);
    },
    lookEveryCell: function () {
        this.CURRENT_LOOP_INDEX++;
        if (this.CURRENT_LOOP_INDEX % this.RANDOM_GRASS_APPEARANCE === 0) {
            this.setObjectToMap({type: 'grass'});
        }
        for (var i = 0; i < this.MAP_HEIGHT; i++) {
            for (var j = 0; j < this.MAP_WIDTH; j++) {
                if (this.COORDS_LIST[i][j].type === 'cow' || this.COORDS_LIST[i][j].type === 'grass') {
                    if (this.COORDS_LIST[i][j].BLOCKED_OBJECT !== this.CURRENT_LOOP_INDEX){
                        if (this.COORDS_LIST[i][j].energy <= 0) {
                            this.COORDS_LIST[i][j] = this.EMPTY_OBJ;
                        } else {
                            this.moveObject(this.COORDS_LIST[i][j]);
                        }
                    }
                }
            }
        }
    },
    createMap: function () {
        //проверка максимально возможной ширины карты
        this.MAP_WIDTH = this.MAP_WIDTH > this.MAP_POSSIBLE_WIDTH ? this.MAP_POSSIBLE_WIDTH :this.MAP_WIDTH ;

        for (var i = 0; i < this.MAP_HEIGHT; i++) {
            this.COORDS_LIST[i] = [];
            for (var j = 0; j < this.MAP_WIDTH; j++) {
                if (i === 0 || j === 0 || i === this.MAP_HEIGHT - 1 || j === this.MAP_WIDTH - 1) {
                    this.COORDS_LIST[i][j] = this.STONE_OBJ;
                } else {
                    this.COORDS_LIST[i][j] = this.EMPTY_OBJ;
                }
            }
        }
        this.show();
    },
    show: function () {
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
                } else if (energy < energyСoef/5) {
                    energySize = 'e1';
                } else if (energy < 2*energyСoef/5) {
                    energySize = 'e2';
                } else if (energy < 3*energyСoef/5) {
                    energySize = 'e3';
                } else if (energy < 4*energyСoef/5) {
                    energySize = 'e4';
                } else {
                    energySize = 'e5';
                }
                mapList = mapList + '<li class="map-frame ' + this.COORDS_LIST[i][j].objectClass + '" data-pos="' + [i, j] + '"><span class="energy ' + energySize + '"></li>'
            }
            mapList = mapList + '<br />'
        }
        mapHTML.append(mapList);
    },
    setObjectToMap: function (mapObject) {
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
            this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = this.STONE_OBJ;
        }

        this.show();
    },
    mapCellClick: function (cell) {
        map.stop();
        map.deleteNav();
        $(cell).prepend($('.cell-nav-holder').html());
        $.proxy(map.addCellListeners(), map);
    },
    deleteNav: function () {
        $('.map .cell-nav').each(function () {
          $(this).remove();
        });
    },
    addCellListeners: function () {
        $('._cell-nav-cancel').on('click', this.closeCellNav);
        $('._cell-nav-delete').on('click', this.deleteObject);
        $('._cell-nav-add-cow').on('click', this.addCowByCell);
        $('._cell-nav-add-grass').on('click', this.addGrassByCell);
        $('._cell-nav-add-stone').on('click', this.addStoneByCell);
    },
    closeCellNav: function () {
        $(this).closest('.cell-nav').remove();
    },
    deleteObject: function () {
        var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
        if (clickedPositionList[0] == 0 || clickedPositionList[1] == 0 || clickedPositionList[0] == this.MAP_HEIGHT - 1 || clickedPositionList[1] == this.MAP_WIDTH - 1){
            alert('Невозможно удалить стену!');
        } else {
            map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = map.EMPTY_OBJ;
            map.show();
        }
    },
    addCowByCell: function () {
        var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
        map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = new Cow({type: 'cow', xPos: parseFloat(clickedPositionList[0]), yPos: parseFloat(clickedPositionList[1])});
        map.show();
    },
    addGrassByCell: function () {
        var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
        map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = new Grass({type: 'grass', xPos: parseFloat(clickedPositionList[0]), yPos: parseFloat(clickedPositionList[1])});
        map.show();
    },
    addStoneByCell: function () {
        var clickedPositionList = $(this).closest('.map-frame').data('pos').split(',');
        map.COORDS_LIST[clickedPositionList[0]][clickedPositionList[1]] = map.STONE_OBJ;
        map.show();
    },
    findFromAllEmptyCells: function () {
        var allEmptyCells = [];
        for (var i = 0; i < this.MAP_HEIGHT; i++) {
            for (var j = 0; j < this.MAP_WIDTH; j++) {
                if (this.COORDS_LIST[i][j].type === 'empty') {
                    allEmptyCells.push([i,j]);
                }
            }
        }
        if (!allEmptyCells.length) {
            return false;
        } else {
            return allEmptyCells[Math.floor(Math.random() * allEmptyCells.length)];
        }
    },
    moveObject: function (mapObject) {
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
            this.setObjectToMap({type : mapObject.type, xPos: newObj.xPos, yPos: newObj.yPos})
        } else if (mapObject.type === 'cow') {
            this.COORDS_LIST[mapObject.xPos][mapObject.yPos] = this.EMPTY_OBJ;

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
    getRandomEmptyPlace: function (mapObject) {
        var emptyCellsList = this.findEmptyCells(mapObject);
        if (!emptyCellsList) {
            return {xPos: mapObject.xPos, yPos: mapObject.yPos, energy: mapObject.energy - mapObject.moveStepEnergy}
        }
        var randomMoveIndex = Math.floor(Math.random() * emptyCellsList.length);
        var energy = Math.floor(Math.random() * (mapObject.maxRandomEnergy - mapObject.minRandomEnergy + 1) + mapObject.minRandomEnergy);
        return {xPos: emptyCellsList[randomMoveIndex][0], yPos: emptyCellsList[randomMoveIndex][1], energy: energy};
    },
    findEmptyCells: function (mapObject) {
        var emptyCellsList = [];
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos - 1].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos - 1, mapObject.yPos - 1]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos - 1, mapObject.yPos]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos - 1][mapObject.yPos + 1].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos - 1, mapObject.yPos + 1]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos][mapObject.yPos - 1].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos, mapObject.yPos - 1]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos][mapObject.yPos + 1].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos, mapObject.yPos + 1]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos - 1].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos + 1, mapObject.yPos - 1]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos + 1, mapObject.yPos]);
        }
        if (mapObject.possibleObjectsToMove.indexOf(this.COORDS_LIST[mapObject.xPos + 1][mapObject.yPos + 1].type) > -1 ) {
            emptyCellsList.push([mapObject.xPos + 1, mapObject.yPos + 1]);
        }

        //умная корова
        if (mapObject.type === 'cow' && emptyCellsList.filter(this.filterGrass).length !== 0) {
            return emptyCellsList.filter(this.filterGrass);
        }
        //

        if (emptyCellsList.length) {
            return emptyCellsList;
        } else {
            return false;
        }
    },
    filterGrass: function (coords) {
        return map.COORDS_LIST[coords[0]][coords[1]].type === 'grass';
    }
};

var addListeners = function () {
    $('._addCow').on('click', addCow);
    $('._addGrass').on('click', addGrass);
    $('._addStone').on('click', addStone);
    $('._mapStart').on('click', mapStart);
    $('._mapStop').on('click', mapStop);
    $('._mapSpeedBtn').on('click', setNewTimeInterval);
    $('.map').on('click', '.map-frame', mapCellClick);
};

var addCow = function () {
    $.proxy(map.setObjectToMap({type: 'cow'}), map);
};

var addGrass = function () {
    $.proxy(map.setObjectToMap({type: 'grass'}), map);
};

var addStone = function () {
    $.proxy(map.setObjectToMap({type: 'stone'}), map);
};

var mapCellClick = function () {
    $.proxy(map.mapCellClick(this), map);
};

var mapStart = function () {
    $.proxy(map.start(parseInt($('._mapSpeedInput').val()), map));
};

var mapStop = function () {
    $.proxy(map.stop(), map);
};

var setNewTimeInterval = function () {
    $.proxy(map.setNewTimeInterval(), map);
};

jQuery(function () {
    map.createMap();
    addListeners();
});