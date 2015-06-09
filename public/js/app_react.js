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
["100000000000000000000000000000000000000000000000000000000", 72057594037927936, "Film"]
["1000000000000000000000000000000000000000000000000000000000", 144115188075855872, "Concerts"]
["10000000000000000000000000000000000000000000000000000000000", 288230376151711744, "Contemporary Art"]
["100000000000000000000000000000000000000000000000000000000000", 576460752303423488, "Opera"]
["1000000000000000000000000000000000000000000000000000000000000", 1152921504606846976, "Fitness"]
*/

var vdnaKeywords = {'film': true, 'rock music': true, 'science': true, 'comedy': true, 'jazz': true, 'world music': false, 'concerts': false, 'club scene': false, 'music': false, 'opera': false, 'classical music': false, 'humor': false, 'caberet': false, 'dance': false, 'theater': false, 'sport': false, 'ballet': false, 'children': false, 'festivals': false, 'expositions': false, 'folkmusic': false, 'health': false, 'drama': false, 'blues': false, 'circus': false, 'sports': false, 'exhibitions': false, 'gastronomy': false, 'musical': false};

var reMap = function(m1, m2) {
  return Object.keys(m2).reduce(function(m3, key) {
    m3[key] = m2[key];
    return m3;
  }, m1);
};

var powOf2Arr = function(i) {
  var arr = [];
  for(var j = 0; j < i; j++) {
    arr.push(Math.pow(2, j));
  };
  return arr;
};

var binStringToDec = function(binString) {
  var powArr = powOf2Arr(binString.length).reverse();
  var acc = 0;
  for(var i = 0; i < binString.length; i++) {
    acc += powArr[i] * parseInt(binString.charAt(i));
  };
  return acc;
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
          console.log(JSON.stringify(userLikes));
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
        <span className="left">Aperture:</span><span className="middle" />
      </div>
    );
  }
});

var KeywordGroups = React.createClass({
  getInitialState: function() {
    return {vdnaKeywords: this.props.vdnaKeywords};
  },
  toggleKeyword: function(keyword) {
    var vdnaKeywords = this.state.vdnaKeywords;
    vdnaKeywords[keyword] = !vdnaKeywords[keyword];
    this.setState({vdnaKeywords: vdnaKeywords});
  },
  render: function() {
    return (
      <div>
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
    var vdnaKeywordNodes = Object.keys(this.props.vdnaKeywords).filter(function(keyword) {
      return that.props.userKeywords == that.props.vdnaKeywords[keyword];
    }).map(function(keyword) {
      return (
        <Keyword key={keyword} keyword={keyword} toggleKeyword={that.props.toggleKeyword} />
      );
    });
    var heading = this.props.userKeywords ? 'Keywords' : 'Enter a [like]';
    return (
      <div id="keywords">
        <span className="left">{heading}:</span>
        <span id="keyspan" className="middle">
          <ul>
            {vdnaKeywordNodes}
          </ul>
        </span>
      </div>
    );
  }
});

var Keyword = React.createClass({
  handleClick: function() {
    this.props.toggleKeyword(React.findDOMNode(this.refs.keywordSpan).title);
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
