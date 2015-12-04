Array.prototype.add = function(arr) {
  var res = [];
  for(var i = 0; i < this.length || i < arr.length; i++) {
    if(this[i] === undefined) {
      res.push(arr[i]);
    } else if(arr[i] === undefined) {
      res.push(this[i]);
    } else {
      res.push(this[i] + arr[i]);
    }
  };
  return res;
};

module.exports = {
  staticInterests: {
    music:              { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
                          related: 'rock music,jazz,concerts,opera' },
    "french actors":    { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'drama,film' },
    actors:             { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'czech film, film' },
    spirituality:       { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'literature,music' },
    "czech film":       { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'film,actors' },
    "rock music":       { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'music' },
    "world music":      { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'music' },
    jazz:               { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
                          related: 'music' },
    technology:         { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'health,science' },
    health:             { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
                          related: 'science,dental' },
    dental:             { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'health' },
    comics:             { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'humor,literature' },
    humor:              { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'actors,literature' },
    literature:         { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'theater,comics' },
    science:            { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'technology,health' },
    drama:              { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'theater,film,literature' },
    theater:            { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'drama,literature,opera' },
    film:               { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'drama,literature,comics' },
    concerts:           { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'music,theater' },
    "contemporary art": { source: 'ticketpro', clicks: 0, added: Date.now(), selected: true,
                          related: 'literature,film,theater' },
    opera:              { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'music,theater' },
    fitness:            { source: 'ticketpro', clicks: 0, added: Date.now(), selected: false,
                          related: 'health,science' }
  },

  arbitraryBinMapping: {
    "music":            "1",
    "french actors":    "10",
    "actors":           "100",
    "la rioja":         "1000",
    "castille y león":  "10000",
    "spain":            "100000",
    "spirituality":     "1000000",
    "rio":              "10000000",
    "czech film":       "100000000",
    "rock music":       "1000000000",
    "jazz":             "10000000000",
    "technology":       "100000000000",
    "health":           "1000000000000",
    "dental":           "10000000000000",
    "comics":           "100000000000000",
    "humor":            "1000000000000000",
    "literature":       "10000000000000000",
    "science":          "100000000000000000",
    "drama":            "1000000000000000000",
    "theater":          "10000000000000000000",
    "film":             "100000000000000000000",
    "concerts":         "1000000000000000000000",
    "contemporary art": "10000000000000000000000",
    "opera":            "100000000000000000000000",
    "fitness":          "1000000000000000000000000"
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

  reverseBinMapping() {
    return Object.getOwnPropertyNames(this.arbitraryBinMapping).reduce((rMap, key) => {
      rMap[this.arbitraryBinMapping[key]] = key;
      return rMap;
    }, {});
  },

  // --- everything must be split into two 32 bit thurks.
  arbitraryDecMapping() {
    return Object.getOwnPropertyNames(this.arbitraryBinMapping).reduce((dMap, key) => {
      dMap[key] = this.binStringArrToDecArr(this.binStringSplit(32, this.arbitraryBinMapping[key]));
      return dMap;
    }, {});
  },

  // --- helper monkeys (cookies)

  powOf2Arr(i) {
    let arr = [];
    for(let j = 0; j < i; j++) {
      arr.push(Math.pow(2, j));
    };
    return arr;
  },

  // --- split into n (32 for now) bit trozos.
  binStringSplit(n, binString) {
    let remString = binString;
    let trozos = [];
    while(remString.length > n) {
      trozos.unshift(remString.substr(remString.length - n));
      remString = remString.substr(0, remString.length - n);
    };
    trozos.unshift(remString);
    return trozos;
  },

  binStringToDec(binString) {
    let powArr = this.powOf2Arr(binString.length).reverse();
    let acc = 0;
    for(let i = 0; i < binString.length; i++) {
      acc += powArr[i] * parseInt(binString.charAt(i));
    };
    return acc;
  },

  binStringArrToDecArr(binStringArr) {
    return binStringArr.map(binString => this.binStringToDec(binString));
  },

  // Esto solo funciona con integrales positivos.
  decToBinString(dec) {
    if(dec === undefined) {
      return "0";
    }
    let binString = "";
    while(dec >= 1) {
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
  interestsToBinStringAndDec(keywordArr, mapping) {
    return keywordArr.map(keyword => {
      return mapping[keyword];
    }).reduce((culmination, binString) => {
      console.log('binString: ' + binString);
      let dec;
      if(binString === undefined) {
        dec = dec;
      } else {
        dec = culmination['dec'] + this.binStringToDec(binString);
      }
      culmination['binString'] = this.decToBinString(dec);
      culmination['dec'] = dec;
      return culmination;
    }, {binString: "", dec: 0});
  },

  // -----------------------
  // In [Keyword, ....] (to DecArr) mapping.
  // Out: {binString: "10000...", decArr: [ 4194304, 0 ] (example)}
  interestsToDecArr(interestsArr, mapping) {
    let _mapping = mapping === undefined ? this.arbitraryDecMapping() : mapping;
    return interestsArr.map(interest => {
      return _mapping[interest.toLowerCase()];
    }).reduce((culmination, decArr) => {
      if(decArr !== undefined) {
        culmination = culmination.add(decArr);
      }
      return culmination;
    }, [0]);
  },

  tallyExtraInterests(interestsArr, mapping) {
    let _mapping = mapping === undefined ? this.arbitraryDecMapping() : mapping;
    return interestsArr.filter(interest => {
      return _mapping[interest.toLowerCase()] === undefined;
    }).join(':::');
  },

  //----------------------
  // In: decimal array
  // Out: [Keyword, Keyword, ....]
  // For now, I'll always pass arbitraryDecMapping as mapping
  // ---------------------
  decArrToInterests(decArr, mapping) {
    let _mapping = mapping === undefined ? this.arbitraryDecMapping() : mapping;
    return Object.getOwnPropertyNames(_mapping).reduce((interests, interest) => {
      let interestDecArr = _mapping[interest];
      if(interestDecArr.length == decArr.length) {
        let match = true;
        for(let i = 0; i < decArr.length; i++) {
          match = match && (decArr[i] == interestDecArr[i] || (decArr[i] & interestDecArr[i]) > 0);
        };
        if(match) {
          interests.push(interest);
        }
      }
      return interests;
    }, []);
  },

  capitalize(s) {
    return(s[0].toUpperCase() + s.substr(1));
  },

  getSelectedInterests() {
    return Object.getOwnPropertyNames(this.staticInterests).filter(interest => {
      return this.staticInterests[interest]['selected'];
    }).reduce((is, i) => {
      is[i] = this.staticInterests[i];
      return is;
    }, {});
  },

  unselectAllStaticInterests() {
    for (let interest of Object.getOwnPropertyNames(this.staticInterests)) {
      this.staticInterests[interest]['selected'] = false;
    }
  },

  addInterest(interest) {
    if(typeof this.staticInterests[interest] === 'object') {
      this.staticInterests[interest]['selected'] = true;
      this.gatherVdna();
      this.showVdnaDivs();
      return true;
    } else {
      return false;
    }
  },

  addRelatedInterest(interest) {
    this.staticInterests[interest]['selected'] = true;
    this.gatherVdna();
    this.showVdnaDivs();
  },

  unLikeAnInterest(interest) {
    this.staticInterests[interest]['selected'] = false;
    this.gatherVdna();
    this.showVdnaDivs();
  },

  setPrivacySlider(val) {
    if(typeof val !== 'number') {
      val = parseInt(val);
    }
    if(val !== this.privacySlider) {
      this.privacySlider = val;
      console.log('privacy slider set to: ' + val);
      this.gatherVdna();
      this.showVdnaDivs();
    }
  },

  /* Replaced by Object.assign(...) */
  mergeObjects(obj1, obj2) {
    Object.getOwnPropertyNames(obj2).forEach(function(key) {
      obj1[key] = obj2[key];
    });
    return obj1;
  },

  facebook: [
    {
      cnet:        { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                     related: 'technology,helth,science' },
      "jazz dock": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                     related: 'music,jazz,concerts' }
    },
    {
      "new scientist": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                         related: 'science,literature' },
      "divadlo archa": { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                         related: 'music,theater,concerts' }
    },
    {
      hiking:    { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                   related: 'health,fitness' },
      recycling: { source: 'facebook', clicks: 0, added: Date.now(), selected: true,
                   related: 'technology' }
    }
  ],
  newLikes: {},
  totalFacebookSync: 0,

  pinterest: [
    {
      mammals: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
                 related: 'science' },
      spain:   { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
                 related: 'literature,film,music' }
    },
    {
      prague:  { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
                 related: 'literature,film,music' },
      ferrets: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
                 related: 'humor,science' }
    },
    {
      "avant garde":   { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
                         related: 'music,drama,theater,film' },
      synchronicities: { source: 'pintrest', clicks: 0, added: Date.now(), selected: true,
                         related: 'spirituality,literature,film' }
    }
  ],
  totalPinterestSync: 0,

  facebookImportReset() {
    this.facebook = [];
    this.totalFacebookSync = 0;
  },

  importNewLike(like) {
    this.newLikes[like.toLowerCase()] = { source: 'facebook', clicks: 0, added: Date.now(), selected: true, related: '' };
  },

  pushNewLikes() {
    if(Object.getOwnPropertyNames(this.newLikes).length > 0) {
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

  _appendDivs(vdnaRootName, numero) {
    for (let div of this.vdnaDivs[vdnaRootName][numero]) {
      $("div[vdnaroot='" + vdnaRootName + "']").append(div);
    };
  },

  showVdnaDivs() {
    var that = this;
    $("*[vdnaroot]").each((index, vdnaRootEl) => {
      $(vdnaRootEl).html('');
      let vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
      console.log('Sorting: ' + this.sorting);
      console.log('About to append ' + this.vdnaDivs[vdnaRootName][this.sorting].length + ' divs.');
      console.log("vdnaDivs (weights): " + JSON.stringify(this.vdnaDivs[vdnaRootName][this.sorting].map(function(div) {
        return parseInt(div.substr(div.indexOf('vdnaweight') + 12, 2));
      })));
      this._appendDivs(vdnaRootName, this.sorting);
    });
    $("*[vdnaclass]").each(function(index, el) {
      console.log('got one!');
      $(el).on('click', function(e) {
        e.preventDefault();
        var interestArr = $(el).attr('vdnaclass').split(/,/);
        console.log('interestArr: ' + JSON.stringify(interestArr));
        interestArr.forEach(function(interest) {
          var trimmed = interest.trim();
          if(that.staticInterests[trimmed]) {
            that.staticInterests[trimmed]['clicks'] += 1;
            that.staticInterests[trimmed]['selected'] = true;
          } else {
            var relatedInterests = interestArr.slice(0, interestArr.indexOf(interest)).add(interestArr.slice(interestArr.indexOf(interest) + 1));
            that.staticInterests[trimmed] = {
              source: 'ticketpro', clicks: 1, added: Date.now(), selected: true,
              related: relatedInterests.map(function(interest) {
                return interest.trim();
              }).join(',')
            };
          }
        });
        return false;
      });
    });
  },

  _weightSort(a, b) {
    let vdnaWeightA = parseInt(a.substr(a.indexOf('vdnaweight') + 12, 2));
    let vdnaWeightB = parseInt(b.substr(b.indexOf('vdnaweight') + 12, 2));
    return vdnaWeightB - vdnaWeightA;
  },

  gatherOriginalVdna() {
    $("*[vdnaroot]").each((index, vdnaRootEl) => {
      let vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
      this.originalVdnaDivs[vdnaRootName] = [];

      // original code -- only save child elements with a 'vdnaclass' attribute
      /*
      $(vdnaRootEl).find("*[vdnaclass]").each((index, vdnaClassEl) => {
        this.originalVdnaDivs[vdnaRootName].push(vdnaClassEl.outerHTML);
      });
      */

      // new code -- save all child elements
      $(vdnaRootEl).find("*").each((index, vdnaEl) => {
        this.originalVdnaDivs[vdnaRootName].push(vdnaEl.outerHTML);
      });
    });
  },

  gatherVdna() {
    if(Object.getOwnPropertyNames(this.originalVdnaDivs) === 0) {
      this.gatherOriginalVdna();
    }

    let minVdnaWeight = (5 - this.privacySlider) * 2;
    let selectedInterests = this.getSelectedInterests();
    let selectedInterestKeys = Object.getOwnPropertyNames(selectedInterests);
    $("*[vdnaroot]").each((index, vdnaRootEl) => {
      let vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
      console.log("VdnaRoot: " + vdnaRootName);
      this.vdnaDivs[vdnaRootName] = [];
      this.vdnaDivs[vdnaRootName][0] = [];
      this.vdnaDivs[vdnaRootName][2] = [];
      this.vdnaDivs[vdnaRootName][4] = [];
      console.log('originalVdna Count: (' + vdnaRootName + '): ' + this.originalVdnaDivs[vdnaRootName].length);
      for (let vdnaClassElStr of this.originalVdnaDivs[vdnaRootName]) {
        this.vdnaDivs[vdnaRootName][0].push(vdnaClassElStr);
        let vdnaClassEl = $.parseHTML(vdnaClassElStr);
        let vdnaWeight = parseInt($(vdnaClassEl).attr('vdnaweight'));
        let vdnaClasses = $(vdnaClassEl).attr('vdnaclass').split(/,/).map(c => c.trim()).join(',');
        let show = $(vdnaClassEl).attr('vdnaclass')
                                 .split(/,/)
                                 .reduce(function(showOrHide, interest) {
                                   return showOrHide || selectedInterestKeys.indexOf(interest.trim().toLowerCase()) > -1
                                 }, false) && vdnaWeight >= minVdnaWeight;
        if(show) {
          this.vdnaDivs[vdnaRootName][2].push(vdnaClassElStr);
          if(this.vdnaDivs[vdnaRootName][4].length < this.truncateLength) {
            this.vdnaDivs[vdnaRootName][4].push(vdnaClassElStr);
          }
        }
      };
      // because Array.prototype.sort is DESTRUCTIVE!
      this.vdnaDivs[vdnaRootName][1] = this.vdnaDivs[vdnaRootName][2].reduce((memo, el) => {
        memo.push(el);
        return memo;
      }, []).sort(this._weightSort);
      this.vdnaDivs[vdnaRootName][3] = this.vdnaDivs[vdnaRootName][4].reduce((memo, el) => {
        memo.push(el);
        return memo;
      }, []).sort(this._weightSort);
    });
    console.log("vdnaDivs STATISTICS: \n");
    for(let i = 0; i < 5; i++) {
     console.log(i + ": " + this.vdnaDivs["events"][i].length);
    }
  }
};
