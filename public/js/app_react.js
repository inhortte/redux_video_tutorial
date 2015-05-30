var vdnaKeywords = {'film': true, 'rock music': true, 'science': true, 'comedy': true, 'jazz': true, 'world music': false, 'concerts': false, 'club scene': false, 'music': false, 'opera': false, 'classical music': false, 'humor': false, 'caberet': false, 'dance': false, 'theater': false, 'sport': false, 'ballet': false, 'children': false, 'festivals': false, 'expositions': false, 'folkmusic': false, 'health': false, 'drama': false, 'blues': false, 'circus': false, 'sports': false, 'exhibitions': false, 'gastronomy': false, 'musical': false};

var VdnaMenu = React.createClass({
  render: function() {
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
          {this.props.keyword}
        </span>
      </li>
    );
  }
});

React.render(
  <VdnaMenu vdnaKeywords={vdnaKeywords} />,
  document.getElementById('vdnamenu')
);
