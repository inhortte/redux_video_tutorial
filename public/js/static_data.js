// -----------------------------------
// { categoryName:
//   { interestName:
//     { source: 'facebook',
//       clicks: 5,
//       added: Date.now() },
//     ...
// -----------------------------------

'use strict';

Array.prototype.add = function (arr) {
  var res = [];
  for (var i = 0; i < this.length || i < arr.length; i++) {
    if (this[i] === undefined) {
      res.push(arr[i]);
    } else if (arr[i] === undefined) {
      res.push(this[i]);
    } else {
      res.push(this[i] + arr[i]);
    }
  };
  return res;
};

module.exports = {
  staticInterests: {
    music: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
      related: 'rock music,jazz,concerts,opera' },
    "french actors": { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'drama,film' },
    actors: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'czech film, film' },
    spirituality: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'literature,music' },
    "czech film": { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'film,actors' },
    "rock music": { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'music' },
    "world music": { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'music' },
    jazz: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
      related: 'music' },
    technology: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'health,science' },
    health: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
      related: 'science,dental' },
    dental: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'health' },
    comics: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'humor,literature' },
    humor: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'actors,literature' },
    literature: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'theater,comics' },
    science: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'technology,health' },
    drama: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'theater,film,literature' },
    theater: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'drama,literature,opera' },
    film: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'drama,literature,comics' },
    concerts: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'music,theater' },
    "contemporary art": { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
      related: 'literature,film,theater' },
    opera: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'music,theater' },
    fitness: { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
      related: 'health,science' }
  },

  arbitraryBinMapping: {
    "music": "1000000000000000000000000000000000000",
    "french actors": "10000000000000000000000000000000000000",
    "actors": "100000000000000000000000000000000000000",
    "la rioja": "1000000000000000000000000000000000000000",
    "castille y león": "10000000000000000000000000000000000000000",
    "spain": "100000000000000000000000000000000000000000",
    "spirituality": "1000000000000000000000000000000000000000000",
    "rio": "10000000000000000000000000000000000000000000",
    "czech film": "100000000000000000000000000000000000000000000",
    "rock music": "1000000000000000000000000000000000000000000000",
    "jazz": "10000000000000000000000000000000000000000000000",
    "technology": "100000000000000000000000000000000000000000000000",
    "health": "1000000000000000000000000000000000000000000000000",
    "dental": "10000000000000000000000000000000000000000000000000",
    "comics": "100000000000000000000000000000000000000000000000000",
    "humor": "1000000000000000000000000000000000000000000000000000",
    "literature": "10000000000000000000000000000000000000000000000000000",
    "science": "100000000000000000000000000000000000000000000000000000",
    "drama": "1000000000000000000000000000000000000000000000000000000",
    "theater": "10000000000000000000000000000000000000000000000000000000",
    "film": "100000000000000000000000000000000000000000000000000000000",
    "concerts": "1000000000000000000000000000000000000000000000000000000000",
    "contemporary art": "10000000000000000000000000000000000000000000000000000000000",
    "opera": "100000000000000000000000000000000000000000000000000000000000",
    "fitness": "1000000000000000000000000000000000000000000000000000000000000"
  },

  privacySlider: 3,
  power: true,
  info_balloon: false,
  facebookConnect: false,
  pinterestConnect: false,

  // ---- settings
  // for sorting: 0: vdna off
  //              1: sorted vdnaclass divs
  //              2: unsorted vdnaclass divs
  //              3: sorted and truncated vdnaclass divs
  //              4: unsorted but truncated vdnaclass divs
  autosave: true,
  sorting: 1,
  truncateLength: 10, // Static for now.

  reverseBinMapping: function reverseBinMapping() {
    var _this = this;

    return Object.keys(this.arbitraryBinMapping).reduce(function (rMap, key) {
      rMap[_this.arbitraryBinMapping[key]] = key;
      return rMap;
    }, {});
  },

  // --- everything must be split into two 32 bit thurks.
  arbitraryDecMapping: function arbitraryDecMapping() {
    var _this2 = this;

    return Object.keys(this.arbitraryBinMapping).reduce(function (dMap, key) {
      dMap[key] = _this2.binStringArrToDecArr(_this2.binStringSplit(32, _this2.arbitraryBinMapping[key]));
      return dMap;
    }, {});
  },

  // --- helper monkeys (cookies)

  powOf2Arr: function powOf2Arr(i) {
    var arr = [];
    for (var j = 0; j < i; j++) {
      arr.push(Math.pow(2, j));
    };
    return arr;
  },

  // --- split into n (32 for now) bit trozos.
  binStringSplit: function binStringSplit(n, binString) {
    var remString = binString;
    var trozos = [];
    while (remString.length > n) {
      trozos.unshift(remString.substr(remString.length - n));
      remString = remString.substr(0, remString.length - n);
    };
    trozos.unshift(remString);
    return trozos;
  },

  binStringToDec: function binStringToDec(binString) {
    var powArr = this.powOf2Arr(binString.length).reverse();
    var acc = 0;
    for (var i = 0; i < binString.length; i++) {
      acc += powArr[i] * parseInt(binString.charAt(i));
    };
    return acc;
  },

  binStringArrToDecArr: function binStringArrToDecArr(binStringArr) {
    var _this3 = this;

    return binStringArr.map(function (binString) {
      return _this3.binStringToDec(binString);
    });
  },

  // Esto solo funciona con integrales positivos.
  decToBinString: function decToBinString(dec) {
    if (dec === undefined) {
      return "0";
    }
    var binString = "";
    while (dec >= 1) {
      binString = (dec % 2).toString() + binString;
      dec = Math.floor(dec / 2);
    };
    return binString;
  },

  // --- end helper monkeys

  //----------------------
  // In: [Keyword, ....], mapping
  // Out: {binString: "1000000.....", dec: 78210...}
  //----------------------
  interestsToBinStringAndDec: function interestsToBinStringAndDec(keywordArr, mapping) {
    var _this4 = this;

    return keywordArr.map(function (keyword) {
      return mapping[keyword];
    }).reduce(function (culmination, binString) {
      var dec = undefined;
      if (binString === undefined) {
        dec = dec;
      } else {
        dec = culmination['dec'] + _this4.binStringToDec(binString);
      }
      culmination['binString'] = _this4.decToBinString(dec);
      culmination['dec'] = dec;
      return culmination;
    }, { binString: "", dec: 0 });
  },

  // -----------------------
  // In [Keyword, ....] (to DecArr) mapping.
  // Out: {binString: "10000...", decArr: [ 4194304, 0 ] (example)}
  interestsToDecArr: function interestsToDecArr(interestsArr, mapping) {
    var _mapping = mapping === undefined ? this.arbitraryDecMapping() : mapping;
    return interestsArr.map(function (interest) {
      return _mapping[interest.toLowerCase()];
    }).reduce(function (culmination, decArr) {
      if (decArr !== undefined) {
        culmination = culmination.add(decArr);
      }
      return culmination;
    }, [0]);
  },

  tallyExtraInterests: function tallyExtraInterests(interestsArr, mapping) {
    var _mapping = mapping === undefined ? this.arbitraryDecMapping() : mapping;
    return interestsArr.filter(function (interest) {
      return _mapping[interest.toLowerCase()] === undefined;
    }).join(':::');
  },

  //----------------------
  // In: decimal array
  // Out: [Keyword, Keyword, ....]
  // For now, I'll always pass arbitraryDecMapping as mapping
  // ---------------------
  decArrToInterests: function decArrToInterests(decArr, mapping) {
    var _mapping = mapping === undefined ? this.arbitraryDecMapping() : mapping;
    return Object.keys(_mapping).reduce(function (interests, interest) {
      var interestDecArr = _mapping[interest];
      if (interestDecArr.length == decArr.length) {
        var match = true;
        for (var i = 0; i < decArr.length; i++) {
          match = match && (decArr[i] == interestDecArr[i] || (decArr[i] & interestDecArr[i]) > 0);
        };
        if (match) {
          interests.push(interest);
        }
      }
      return interests;
    }, []);
  },

  capitalize: function capitalize(s) {
    return s[0].toUpperCase() + s.substr(1);
  },

  getSelectedInterests: function getSelectedInterests() {
    var _this5 = this;

    return Object.keys(this.staticInterests).filter(function (interest) {
      return _this5.staticInterests[interest]['selected'];
    }).reduce(function (is, i) {
      is[i] = _this5.staticInterests[i];
      return is;
    }, {});
  },

  /* No longer used */
  blinkNodes: function blinkNodes() {
    console.log('blinkNodes!!!!!!');
    var that = this;
    var minVdnaWeight = (5 - this.privacySlider) * 2;
    var truncate = this.sorting === 2;
    var selectedInterests = this.getSelectedInterests();
    var selectedInterestKeys = Object.keys(selectedInterests);
    console.log(JSON.stringify(selectedInterestKeys));

    var shownIndex = 0;
    $("*[vdnaclass]").each(function (index, el) {
      var vdnaWeight = parseInt($(el).attr('vdnaweight'));
      var show = $(el).attr('vdnaclass').split(/,/).reduce(function (showOrHide, keyword) {
        return showOrHide || selectedInterestKeys.indexOf(keyword) > -1;
      }, false) && vdnaWeight >= minVdnaWeight && (!truncate || shownIndex < that.truncateLength);
      if (show) {
        $(el).show();
        shownIndex += 1;
      } else {
        if (that.power) {
          $(el).hide();
        } else {
          $(el).show();
          shownIndex += 1;
        }
      }
    });
  },

  unselectAllStaticInterests: function unselectAllStaticInterests() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(this.staticInterests)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var interest = _step.value;

        this.staticInterests[interest]['selected'] = false;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  },

  addInterest: function addInterest(interest) {
    if (typeof this.staticInterests[interest] === 'object') {
      this.staticInterests[interest]['selected'] = true;
      this.gatherVdna();
      this.showVdnaDivs();
      return true;
    } else {
      return false;
    }
  },

  addRelatedInterest: function addRelatedInterest(interest) {
    this.staticInterests[interest]['selected'] = true;
    this.gatherVdna();
    this.showVdnaDivs();
  },

  unLikeAnInterest: function unLikeAnInterest(interest) {
    this.staticInterests[interest]['selected'] = false;
    this.gatherVdna();
    this.showVdnaDivs();
  },

  setPrivacySlider: function setPrivacySlider(val) {
    if (val !== this.privacySlider) {
      this.privacySlider = val;
      console.log('privacy slider set to: ' + val);
      this.gatherVdna();
      this.showVdnaDivs();
    }
  },

  /* Replaced by Object.assign(...) */
  mergeObjects: function mergeObjects(obj1, obj2) {
    Object.keys(obj2).forEach(function (key) {
      obj1[key] = obj2[key];
    });
    return obj1;
  },

  facebook: [{
    cnet: { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
      related: 'technology,helth,science' },
    "jazz dock": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
      related: 'music,jazz,concerts' }
  }, {
    "new scientist": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
      related: 'science,literature' },
    "divadlo archa": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
      related: 'music,theater,concerts' }
  }, {
    hiking: { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
      related: 'health,fitness' },
    recycling: { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
      related: 'technology' }
  }],
  newLikes: {},
  totalFacebookSync: 0,

  pinterest: [{
    mammals: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
      related: 'science' },
    spain: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
      related: 'literature,film,music' }
  }, {
    prague: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
      related: 'literature,film,music' },
    ferrets: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
      related: 'humor,science' }
  }, {
    "avant garde": { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
      related: 'music,drama,theater,film' },
    synchronicities: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
      related: 'spirituality,literature,film' }
  }],
  totalPinterestSync: 0,

  facebookImportReset: function facebookImportReset() {
    this.facebook = [];
    this.totalFacebookSync = 0;
  },

  importNewLike: function importNewLike(like) {
    this.newLikes[like.toLowerCase()] = { source: 'facebook', clicks: 0, added: Date.now(), selected: true, related: '' };
  },

  pushNewLikes: function pushNewLikes() {
    if (Object.keys(this.newLikes).length > 0) {
      this.facebook.unshift(this.newLikes);
      this.newLikes = {};
    }
  },

  /* -------------------------------------------------
   find all divs marked with the attribute vdnaroot.
   create an array with all children marked with the
   attribute vdnaclass.
   that's the first step, anyway.
   vdnaDivs: { divName: { 0: [ vdna off (all divs) ], 1: [ sorted vdnaclass divs ],
                          2: [ unsorted vdnaclass divs ], 3: [ sorted and truncated vdnaclass divs],
                          4: [ unsorted but truncated vdnaclass divs ] }, divName: { ... } }
     ------------------------------------------------- */

  originalVdnaDivs: {},
  vdnaDivs: {},

  _appendDivs: function _appendDivs(vdnaRootName, numero) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.vdnaDivs[vdnaRootName][numero][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var div = _step2.value;

        $("div[vdnaroot='" + vdnaRootName + "']").append(div);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    ;
  },

  showVdnaDivs: function showVdnaDivs() {
    var _this6 = this;

    $("*[vdnaroot]").each(function (index, vdnaRootEl) {
      $(vdnaRootEl).html('');
      var vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
      console.log('Sorting: ' + _this6.sorting);
      console.log('About to append ' + _this6.vdnaDivs[vdnaRootName][_this6.sorting].length + ' divs.');
      console.log("vdnaDivs (weights): " + JSON.stringify(_this6.vdnaDivs[vdnaRootName][_this6.sorting].map(function (div) {
        return parseInt(div.substr(div.indexOf('vdnaweight') + 12, 2));
      })));
      _this6._appendDivs(vdnaRootName, _this6.sorting);
    });
  },

  _weightSort: function _weightSort(a, b) {
    var vdnaWeightA = parseInt(a.substr(a.indexOf('vdnaweight') + 12, 2));
    var vdnaWeightB = parseInt(b.substr(b.indexOf('vdnaweight') + 12, 2));
    return vdnaWeightB - vdnaWeightA;
  },

  gatherOriginalVdna: function gatherOriginalVdna() {
    var _this7 = this;

    $("*[vdnaroot]").each(function (index, vdnaRootEl) {
      var vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
      _this7.originalVdnaDivs[vdnaRootName] = [];
      $(vdnaRootEl).find("*[vdnaclass]").each(function (index, vdnaClassEl) {
        _this7.originalVdnaDivs[vdnaRootName].push(vdnaClassEl.outerHTML);
      });
    });
  },

  gatherVdna: function gatherVdna() {
    var _this8 = this;

    if (Object.keys(this.originalVdnaDivs) === 0) {
      this.gatherOriginalVdna();
    }

    var minVdnaWeight = (5 - this.privacySlider) * 2;
    var selectedInterests = this.getSelectedInterests();
    var selectedInterestKeys = Object.keys(selectedInterests);
    $("*[vdnaroot]").each(function (index, vdnaRootEl) {
      var vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
      console.log("VdnaRoot: " + vdnaRootName);
      _this8.vdnaDivs[vdnaRootName] = [];
      _this8.vdnaDivs[vdnaRootName][0] = [];
      _this8.vdnaDivs[vdnaRootName][2] = [];
      _this8.vdnaDivs[vdnaRootName][4] = [];
      console.log('originalVdna Count: (' + vdnaRootName + '): ' + _this8.originalVdnaDivs[vdnaRootName].length);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _this8.originalVdnaDivs[vdnaRootName][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var vdnaClassElStr = _step3.value;

          _this8.vdnaDivs[vdnaRootName][0].push(vdnaClassElStr);
          var vdnaClassEl = $.parseHTML(vdnaClassElStr);
          var vdnaWeight = parseInt($(vdnaClassEl).attr('vdnaweight'));
          var show = $(vdnaClassEl).attr('vdnaclass').split(/,/).reduce(function (showOrHide, interest) {
            return showOrHide || selectedInterestKeys.indexOf(interest.trim().toLowerCase()) > -1;
          }, false) && vdnaWeight >= minVdnaWeight;
          if (show) {
            _this8.vdnaDivs[vdnaRootName][2].push(vdnaClassElStr);
            if (_this8.vdnaDivs[vdnaRootName][4].length < _this8.truncateLength) {
              _this8.vdnaDivs[vdnaRootName][4].push(vdnaClassElStr);
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      ;
      // because Array.prototype.sort is DESTRUCTIVE!
      _this8.vdnaDivs[vdnaRootName][1] = _this8.vdnaDivs[vdnaRootName][2].reduce(function (memo, el) {
        memo.push(el);
        return memo;
      }, []).sort(_this8._weightSort);
      _this8.vdnaDivs[vdnaRootName][3] = _this8.vdnaDivs[vdnaRootName][4].reduce(function (memo, el) {
        memo.push(el);
        return memo;
      }, []).sort(_this8._weightSort);
    });
    console.log("vdnaDivs STATISTICS: \n");
    for (var i = 0; i < 5; i++) {
      console.log(i + ": " + this.vdnaDivs["events"][i].length);
    }
  }
};
//# sourceMappingURL=static_data.js.map
