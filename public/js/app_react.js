var vdnaKeywords = ['film', 'rock music', 'science', 'comedy', 'jazz'];
var vdnaAvailableKeywords = ['world music', 'concerts', 'club scene', 'music', 'opera', 'classical music', 'humor', 'caberet', 'dance', 'theater', 'sport', 'ballet', 'children', 'festivals', 'expositions', 'folkmusic', 'health', 'drama', 'blues', 'circus', 'sports', 'exhibitions', 'gastronomy', 'musical'];

var VdnaMenu = React.createClass({
  render: function() {
    return (
      <div class="r">
        <HideVdna />
        <img src="images/zifter.png" id="zifterlogo" style={{position: 'absolute', top: 20, right: 20, width: '5%'}} />
        <Header />
        <br className="clear" />
        <Aperture />
        <br className="clear" />
        <Keywords />
        <br className="clear" />
        <Entries />
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
        <select ng-model="weighted" ng-change="toggleWeighted()">
          <option value="true" selected>By my likes</option>
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
        On/Off
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

// -------------
// implement toggleKeyword
// significa cojer de Keywoards y colocar en Entries
// implement the loop for vdnaKeywords (with map)
// -------------
var Keywords = React.createClass({
  toggleKeyword: function() { },
  getInitialState: function() {
    return {vdnaKeywords: vdnaKeywords};
  },
  render: function() {
    var vdnaKeywordNodes = this.state.vdnaKeywords.map(function(keyword) {
      return (
        <li>
          <span title={keyword} style={{cursor: 'pointer'}} onClick={this.toggleKeyword}>
            {keyword}
          </span>
        </li>
      );
    });
    return (
      <div id="keywords">
        <span className="left">Keywords:</span>
        <span id="keyspan" className="middle">
          <ul>
            {vdnaKeywordNodes}
          </ul>
        </span>
      </div>
    );
  }
});

// -------------
// implement the loop that displays vdnaAvailableKeywords (with map)
// implement toggleAvailableKeyword (see 'Keywords')
// -------------
var Entries = React.createClass({
  toggleAvailableKeyword: function() { },
  getInitialState: function() {
    return {vdnaAvailableKeywords: vdnaAvailableKeywords};
  },
  render: function() {
    var vdnaAvailableKeywordNodes = this.state.vdnaAvailableKeywords.map(function(keyword) {
      return (
        <li>
          <span title={keyword} style={{cursor: 'pointer'}} onClick={this.toggleKeyword}>
            {keyword}
          </span>
        </li>
      );
    });
    return (
      <div id="entries">
        <span className="left">Enter a [like]:</span>
        <span id="like_select" className="middle">
          <ul>
            {vdnaAvailableKeywordNodes}
          </ul>
        </span>
      </div>
    );
  }
});

React.render(
  <VdnaMenu />,
  document.getElementById('vdnamenu')
);
