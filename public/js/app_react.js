// --- mozilla simple cookie framework.
var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};
// --- end mozilla simple cookie framework

// --- vdna

/*
["1000000000000000000000000000000000000", 68719476736, "Industrial Music"]
["10000000000000000000000000000000000000", 137438953472, "French Actors"]
["100000000000000000000000000000000000000", 274877906944, "Actors"]
["1000000000000000000000000000000000000000", 549755813888, "La Rioja"]
["10000000000000000000000000000000000000000", 1099511627776, "Castille y León"]
["100000000000000000000000000000000000000000", 2199023255552, "Spain"]
["1000000000000000000000000000000000000000000", 4398046511104, "Spirituality"]
["10000000000000000000000000000000000000000000", 8796093022208, "RIO"]
["100000000000000000000000000000000000000000000", 17592186044416, "Czech Film"]
["1000000000000000000000000000000000000000000000", 35184372088832, "Rock Music"]
["10000000000000000000000000000000000000000000000", 70368744177664, "Jazz"]
["100000000000000000000000000000000000000000000000", 140737488355328, "Technology]
["1000000000000000000000000000000000000000000000000", 281474976710656, "Health"]
["10000000000000000000000000000000000000000000000000", 562949953421312, "Dental"]
["100000000000000000000000000000000000000000000000000", 1125899906842624, "Comics"]
["1000000000000000000000000000000000000000000000000000", 2251799813685248, "Humor"]
["10000000000000000000000000000000000000000000000000000", 4503599627370496, "Literature"]
["100000000000000000000000000000000000000000000000000000", 9007199254740992, "Science"]
["1000000000000000000000000000000000000000000000000000000", 18014398509481984, "Drama"]
["10000000000000000000000000000000000000000000000000000000", 36028797018963968, "Theater"]
["100000000000000000000000000000000000000000000000000000000", 72057594037927940, "Film"]
["1000000000000000000000000000000000000000000000000000000000", 144115188075855870, "Concerts"]
["10000000000000000000000000000000000000000000000000000000000", 288230376151711744, "Contemporary Art"]
["100000000000000000000000000000000000000000000000000000000000", 576460752303423488, "Opera"]
["1000000000000000000000000000000000000000000000000000000000000", 1152921504606846976, "Fitness"]
*/

// --- helper monkeys

var powOf2Arr = function(i) {
  var arr = [];
  for(var j = 0; j < i; j++) {
    arr.push(Math.pow(2, j));
  };
  return arr;
};

// --- split into n (32 for now) bit trozos.
var binStringSplit = function(n, binString) {
  var remString = binString;
  var trozos = [];
  while(remString.length > n) {
    trozos.unshift(remString.substr(remString.length - n));
    remString = remString.substr(0, remString.length - n);
  };
  trozos.unshift(remString);
  return trozos;
};

var binStringToDec = function(binString) {
  var powArr = powOf2Arr(binString.length).reverse();
  var acc = 0;
  for(var i = 0; i < binString.length; i++) {
    acc += powArr[i] * parseInt(binString.charAt(i));
  };
  return acc;
};

var binStringArrToDecArr = function(binStringArr) {
  return binStringArr.map(function(binString) {
    return binStringToDec(binString);
  });
};

// Esto solo funciona con integrales positivos.
var decToBinString = function(dec) {
  if(dec === undefined) {
    return "0";
  }
  var binString = "";
  while(dec >= 1) {
    binString = (dec % 2).toString() + binString;
    dec = Math.floor(dec / 2);
  };
  return binString;
};

// --- end helper monkeys

var arbitraryBinMapping = {
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
};

var reverseBinMapping = Object.keys(arbitraryBinMapping).reduce(function(rMap, key) {
  rMap[arbitraryBinMapping[key]] = key;
  return rMap;
}, {});

// --- everything must be split into two 32 bit thurks.
var arbitraryDecMapping = Object.keys(arbitraryBinMapping).reduce(function(dMap, key) {
  dMap[key] = binStringArrToDecArr(binStringSplit(32, arbitraryBinMapping[key]));
  return dMap;
}, {});

// ---- REMEMBER: All of the keys are strings are must be converted back to Long.
// ---- obsolesced because of multiple 32 bit integers.
// var reverseDecMapping = Object.keys(arbitraryDecMapping).reduce(function(rMap, key) {
//  rMap[arbitraryDecMapping[key]] = key;
//  return rMap;
//}, {});

var vdnaKeywords = {'film': true, 'rock music': true, 'comics': true, 'jazz': true, 'concerts': false, 'music': false, 'opera': false, 'humor': false, 'caberet': false, 'drama': false, 'theater': false, 'contemporary art': false, 'fitness': false, 'spain': false, 'la rioja': true, 'rio': false, 'czech film': false, 'actors': false};

var reMap = function(m1, m2) {
  return Object.keys(m2).reduce(function(m3, key) {
    m3[key] = m2[key];
    return m3;
  }, m1);
};

//----------------------
// In: [Keyword, ....], mapping
// Out: {binString: "1000000.....", dec: 78210...}
//----------------------
var keywordsToBinStringAndDec = function(keywordArr, mapping) {
  return keywordArr.map(function(keyword) {
    return mapping[keyword];
  }).reduce(function(culmination, binString) {
    var dec;
    if(binString === undefined) {
      dec = dec;
    } else {
      dec = culmination['dec'] + binStringToDec(binString);
    }
    culmination['binString'] = decToBinString(dec);
    culmination['dec'] = dec;
    return culmination;
  }, {binString: "", dec: 0});
};

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

// -----------------------
// In [Keyword, ....] (to DecArr) mapping.
// Out: {binString: "10000...", decArr: [ 4194304, 0 ] (example)}
var keywordsToDecArr = function(keywordArr, mapping) {
  var _mapping = mapping === undefined ? arbitraryDecMapping : mapping;
  return keywordArr.map(function(keyword) {
    return mapping[keyword.toLowerCase()];
  }).reduce(function(culmination, decArr) {
    if(decArr !== undefined) {
      culmination = culmination.add(decArr);
    }
    return culmination;
  }, [0]);
};

//----------------------
// In: decimal array
// Out: [Keyword, Keyword, ....]
// For now, I'll always pass arbitraryDecMapping as mapping
// ---------------------
var decArrToKeywords = function(decArr, mapping) {
  return Object.keys(mapping).reduce(function(keywords, keyword) {
    var keywordDecArr = mapping[keyword];
    if(keywordDecArr.length == decArr.length) {
      var match = true;
      for(var i = 0; i < decArr.length; i++) {
        match = match && (decArr[i] == keywordDecArr[i] || (decArr[i] & keywordDecArr[i]) > 0);
      };
      if(match) {
        keywords.push(keyword);
      }
    }
    return keywords;
  }, []);
};

// --- obsolescent
var keywordSpanTitle = function(keyword) {
  var keywordArr = [];
  keywordArr.push(keyword);
  var binStringAndDec = keywordsToBinStringAndDec(keywordArr, arbitraryBinMapping);
  return("Keyword: " + keyword + "; Binary: " + binStringAndDec['binString'] + "; Decimal: " + binStringAndDec['dec']);
};

var VdnaMenu = React.createClass({
  render: function() {
    // ---- facebook likes of the logged on user.
    $.getScript('//connect.facebook.net/en_UK/all.js', function(){
      FB.init({
        appId      : '575682199200822',
        xfbml      : true,
        cookie     : true,
        status     : true,
        version    : 'v2.3'
      });
      FB.login(function(res) {
        var userLikes;
        FB.api('/me/likes', {
          access_token: res.authResponse.accessToken
        }, function(res) {
          userLikes = res.data.slice(0,25).map(function(cl) {
            return cl.name;
          });
          // vdna.setCategories(vdnaclasses); // -- from angular version
          // console.log(JSON.stringify(userLikes));
        });
      }, {scope: 'user_likes'});
    });
    return (
      <div className="r">
        <HideVdna />
        <img src="images/zifter.png" id="zifterlogo" style={{position: 'absolute', top: 20, right: 20, width: '5%'}} />
        <Header />
        <br className="clear" />
        <Aperture />
        <br className="clear" />
        <KeywordGroups vdnaKeywords={this.props.vdnaKeywords} />
      </div>
    );
  }
});

var HideVdna = React.createClass({
  handleClick: function(e) {
    $("#vdnamenu").hide(0);
  },
  render: function() {
    return (
      <span id="hidevdna" style={{cursor: 'pointer', position: 'absolute', top: 5, right: 25}} onClick={this.handleClick}>
        X
      </span>
    );
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <div>
        <div id="header" className="header">
          <span id="title" className="left">Your profile at Ticketpro</span>
          <Weighted />
          <Power />
        </div>
      </div>
    );
  }
});

var Weighted = React.createClass({
  render: function() {
    return (
      <span id="weighted">
        Sort:
        <select ng-model="weighted" ng-change="toggleWeighted()" defaultValue="true">
          <option value="true">By my likes</option>
          <option value="false">Orig sorting</option>
        </select>
      </span>
    );
  }
});

var Power = React.createClass({
  render: function() {
    return (
      <span id="power">
        {'On/Off '}
        <input type="checkbox" ng-model="power" ng-change="hitThatSwitch()" />
      </span>
    );
  }
});

var Aperture = React.createClass({
  render: function() {
    return (
      <div id="aperture">
        <span className="left">Aperture:</span>
      </div>
    );
  }
});

var KeywordGroups = React.createClass({
  saveCookie: function() {
    var that = this;
    var activeKeywords = Object.keys(this.state.vdnaKeywords).filter(function(keyword) {
      return that.state.vdnaKeywords[keyword];
    });
    docCookies.setItem('vdna', keywordsToDecArr(activeKeywords, arbitraryDecMapping).toString(), Infinity);
    console.log('cookie saved');
  },
  deleteCookie: function() {
    docCookies.removeItem('vdna');
    console.log('cookie deleted');
  },
  getInitialState: function() {
    // ---- get cookie info if it exists.
    // ---- the cookie is a string and must be parsed back to integers.
    if(docCookies.hasItem('vdna')) {
      var userKeywords = decArrToKeywords(docCookies.getItem('vdna').split(/,/).map(function(part) {
        return parseInt(part);
      }), arbitraryDecMapping);
      console.log(JSON.stringify(userKeywords));
      var vdnaKeywords = this.props.vdnaKeywords;
      Object.keys(vdnaKeywords).forEach(function(keyword) {
        vdnaKeywords[keyword] = userKeywords.indexOf(keyword) > -1 ? true : false;
      });
      console.log(JSON.stringify(vdnaKeywords));
      return {vdnaKeywords: vdnaKeywords};
    } else {
      return {vdnaKeywords: this.props.vdnaKeywords};
    }
  },
  toggleKeyword: function(keyword) {
    var vdnaKeywords = this.state.vdnaKeywords;
    vdnaKeywords[keyword] = !vdnaKeywords[keyword];
    this.setState({vdnaKeywords: vdnaKeywords});
  },
  render: function() {
    return (
      <div>
        <span title="Save Cookie" style={{color: '#00bb00', cursor: 'pointer', margin: '0 0 20px 100px'}} ref="saveCookie" onClick={this.saveCookie}>
          Save Cookie
        </span>
        {' | ' }
        <span title="Delete Cookie" style={{color: '#00bb00', cursor: 'pointer', margin: '0 50px 0 0'}} ref="saveCookie" onClick={this.deleteCookie}>
          Delete Cookie
        </span>
        <br className="clear" />
        <br className="clear" />
        <Keywords vdnaKeywords={this.props.vdnaKeywords} userKeywords={true} toggleKeyword={this.toggleKeyword} />
        <br className="clear" />
        <Keywords vdnaKeywords={this.props.vdnaKeywords} userKeywords={false} toggleKeyword={this.toggleKeyword} />
      </div>
    );
  }
});

var Keywords = React.createClass({
  render: function() {
    var that = this;
    var vdnaKeywords = Object.keys(this.props.vdnaKeywords).filter(function(keyword) {
      return that.props.userKeywords == that.props.vdnaKeywords[keyword];
    });
    var vdnaKeywordNodes = vdnaKeywords.map(function(keyword) {
      return (
        <Keyword key={keyword} keyword={keyword} toggleKeyword={that.props.toggleKeyword} />
      );
    });
    var heading = this.props.userKeywords ? 'Keywords' : 'Enter a [like]';
    var combinedCode = keywordsToDecArr(vdnaKeywords, arbitraryDecMapping);
    return (
      <div id="keywords">
        <span className="left">{heading}:</span>
        <span id="keyspan" className="middle">
          <ul>
            {vdnaKeywordNodes}
          </ul>
        </span>
        <span id="combinedCode" className="left">
          Code: {combinedCode[0]}
          {', '}
          {combinedCode[1]}
        </span>
      </div>
    );
  }
});

var Keyword = React.createClass({
  handleClick: function() {
    this.props.toggleKeyword(React.findDOMNode(this.refs.keywordSpan).title);
    $('#respuestas').append(keywordSpanTitle(this.props.keyword) + "<br />");
  },
  render: function() {
    return (
      <li>
        <span title={this.props.keyword} style={{cursor: 'pointer'}} ref="keywordSpan" onClick={this.handleClick}>
          {this.props.keyword}{' '}
        </span>
      </li>
    );
  }
});

React.render(
  <VdnaMenu vdnaKeywords={vdnaKeywords} />,
  document.getElementById('vdnamenu')
);
