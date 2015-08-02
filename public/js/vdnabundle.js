(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// -----------------------------------
// { categoryName:
//   { interestName:
//     { source: 'facebook',
//       clicks: 5,
//       added: Date.now() },
//     ...
// -----------------------------------

module.exports = {
  staticInterests: {
    music:              { source: 'ticketpro', clicks: 31, added: Date.now(), selected: true,
                          related: 'rock music,jazz,concerts,opera' },
    "french actors":    { source: 'ticketpro', clicks: 37, added: Date.now(), selected: false,
                          related: 'drama,film' },
    actors:             { source: 'ticketpro', clicks: 35, added: Date.now(), selected: false,
                          related: 'czech film, film' },
    "la rioja":         { source: 'ticketpro', clicks: 32, added: Date.now(), selected: false,
                          related: 'spain' },
    "castille y león":  { source: 'ticketpro', clicks: 45, added: Date.now(), selected: false,
                          related: 'spain' },
    spain:              { source: 'ticketpro', clicks: 20, added: Date.now(), selected: false,
                          related: 'la rioja,castille y león' },
    spirituality:       { source: 'ticketpro', clicks: 18, added: Date.now(), selected: false,
                          related: 'literature,music' },
    rio:                { source: 'ticketpro', clicks: 21, added: Date.now(), selected: true,
                          related: 'music,rock music' },
    "czech film":       { source: 'ticketpro', clicks: 54, added: Date.now(), selected: false,
                          related: 'film,actors' },
    "rock music":       { source: 'ticketpro', clicks: 12, added: Date.now(), selected: false,
                          related: 'music' },
    "world music":      { source: 'ticketpro', clicks: 10, added: Date.now(), selected: false,
                          related: 'music' },
    jazz:               { source: 'ticketpro', clicks: 16, added: Date.now(), selected: false,
                          related: 'jazz' },
    technology:         { source: 'ticketpro', clicks: 19, added: Date.now(), selected: false,
                          related: 'health,science' },
    health:             { source: 'ticketpro', clicks: 20, added: Date.now(), selected: true,
                          related: 'science,dental' },
    dental:             { source: 'ticketpro', clicks: 21, added: Date.now(), selected: false,
                          related: 'health' },
    comics:             { source: 'ticketpro', clicks: 34, added: Date.now(), selected: false,
                          related: 'humor,literature' },
    humor:              { source: 'ticketpro', clicks: 10, added: Date.now(), selected: false,
                          related: 'actors,literature' },
    literature:         { source: 'ticketpro', clicks: 11, added: Date.now(), selected: false,
                          related: 'theater,comics' },
    science:            { source: 'ticketpro', clicks: 13, added: Date.now(), selected: false,
                          related: 'technology,health' },
    drama:              { source: 'ticketpro', clicks: 19, added: Date.now(), selected: false,
                          related: 'theater,film,literature' },
    theater:            { source: 'ticketpro', clicks: 20, added: Date.now(), selected: false,
                          related: 'drama,literature,opera' },
    film:               { source: 'ticketpro', clicks: 21, added: Date.now(), selected: false,
                          related: 'drama,literature,comics' },
    concerts:           { source: 'ticketpro', clicks: 30, added: Date.now(), selected: false,
                          related: 'music,theater' },
    "contemporary art": { source: 'ticketpro', clicks: 18, added: Date.now(), selected: true,
                          related: 'literature,film,theater' },
    opera:              { source: 'ticketpro', clicks: 25, added: Date.now(), selected: false,
                          related: 'music,theater' },
    fitness:            { source: 'ticketpro', clicks: 16, added: Date.now(), selected: false,
                          related: 'health,science' }
},

  blinkNodes: function() {
    var selectedInterests = Object.keys(data.staticInterests).filter(function(interest) {
      return data.staticInterests[interest]['selected'];
    }).reduce(function(is, i) {
      is[i] = data.staticInterests[i];
      return is;
    }, {});
    var selectedInterestKeys = Object.keys(selectedInterests);
    console.log(JSON.stringify(selectedInterestKeys));

    $("li[vdnaclass]").each(function(index, el) {
      if($(el).attr('vdnaclass').split(/,/).reduce(function(showOrHide, keyword) {
        return showOrHide || (selectedInterestKeys.indexOf(keyword) > -1);
      }, false)) {
        // console.log('showing ' + $(el).attr('vdnaclass'));
        $(el).show();
      } else {
        // console.log('hiding ' + $(el).attr('vdnaclass'));
        $(el).hide();
      }
    });
  },

  capitalize: function(s) {
    return(s[0].toUpperCase() + s.substr(1));
  },

  blinkNodes: function() {
    var that = this;
    var selectedInterests = Object.keys(this.staticInterests).filter(function(interest) {
      return that.staticInterests[interest]['selected'];
    }).reduce(function(is, i) {
      is[i] = that.staticInterests[i];
      return is;
    }, {});
    var selectedInterestKeys = Object.keys(selectedInterests);
    console.log(JSON.stringify(selectedInterestKeys));

    $("li[vdnaclass]").each(function(index, el) {
      if($(el).attr('vdnaclass').split(/,/).reduce(function(showOrHide, keyword) {
        return showOrHide || (selectedInterestKeys.indexOf(keyword) > -1);
      }, false)) {
        // console.log('showing ' + $(el).attr('vdnaclass'));
        $(el).show();
      } else {
        // console.log('hiding ' + $(el).attr('vdnaclass'));
        $(el).hide();
      }
    });
  },

  /*
   addInterest: function(category, interest) {
     staticData[category][interest] = { category: category, source: 'vdna', clicks: 1, added: Date.now(), selected: true };
   },
   */

  addInterest: function(interest) {
    if(this.staticInterests[interest] !== undefined) {
      this.staticInterests[interest]['selected'] = true;
      this.blinkNodes();
      // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
      return true;
    } else {
      return false;
    }
  },

  /*
   var addRelatedInterest = function(category, interest) {
     staticData[category][interest]['selected'] = true;
     React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
   },
   */

  addRelatedInterest: function(interest) {
    this.staticInterests[interest]['selected'] = true;
    this.blinkNodes();
    // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
  },

  /*
   unLikeAnInterest: function(category, interest) {
     staticData[category][interest]['selected'] = false;
     React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
   },
   */

  unLikeAnInterest: function(interest) {
    this.staticInterests[interest]['selected'] = false;
    this.blinkNodes();
    // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
  }
};

},{}],2:[function(require,module,exports){
'use strict';

var data = require('vdna/static_data');
// var Autocomplete = require('react-autocomplete/lib/main.js');
// var Combobox = Autocomplete.Combobox;
// var ComboboxOption = Autocomplete.ComboboxOption;

// -------------------------------------------------
// Autocomplete code
// -------------------------------------------------

var Autocomplete = React.createClass({
  displayName: 'Autocomplete',

  componentDidMount: function componentDidMount() {
    this._setInputFromValue();
    var highlightedIndex;
    var that = this;
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 13:
          // enter.
          console.log('ENTER!');
          that.props.addLikeDone();
          break;
        case 9:
          // tab
          console.log('TAB!');
          that._setFromHighlighted();
          break;
        case 38:
          // up
          highlightedIndex = that._highlightedIndex();
          console.log('UP! ' + highlightedIndex);
          if (highlightedIndex > 0) {
            that.setState({ highlightedValue: that._currentMatches()[highlightedIndex - 1] });
          }
          break;
        case 40:
          // down
          highlightedIndex = that._highlightedIndex();
          console.log('DOWN! ' + highlightedIndex);
          if (highlightedIndex === -1) {
            that.setState({ highlightedValue: that._currentMatches()[0] });
          } else if (highlightedIndex < that._currentMatches().length - 1) {
            that.setState({ highlightedValue: that._currentMatches()[highlightedIndex + 1] });
          }
          break;
      }
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      defaultValue: 'apple',
      limitToList: true,
      maxItemsShown: 8,
      sourceUrl: null,
      defaultList: ['apple', 'banana', 'orange', 'grape', 'cherry'],
      alsoSearchValues: false,
      loadUrlOnce: true,
      selectAllTextOnClick: true,
      onNoMatch: function onNoMatch(state) {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      list: this.props.defaultList,
      currentValue: this.props.defaultValue,
      highlightedValue: this.props.defaultValue,
      showEntries: false
    };
  },
  render: function render() {
    var entries = this.state.showEntries ? React.createElement(
      'ol',
      { style: { position: 'absolute', backgroundColor: 'white', color: 'black', listStyle: 'none', padding: 0, margin: 0 }, onMouseLeave: this._onEntryMouseOut },
      this._renderMatches()
    ) : '';
    return React.createElement(
      'div',
      null,
      React.createElement('input', { id: this.props.inputId, className: this.props.className, ref: 'autoInput', onChange: this._onChange, onFocus: this._onFocus, onBlur: this._onBlur, onClick: this._onInputClick }),
      entries
    );
  },
  _currentMatches: function _currentMatches() {
    var that = this;
    var cm = this.state.list.filter(function (entry) {
      return entry.indexOf(that._input()) > -1;
    });
    return cm;
  },
  _input: function _input() {
    if (!this.isMounted()) {
      return '';
    } else {
      return React.findDOMNode(this.refs.autoInput).value;
    }
  },
  _renderMatches: function _renderMatches() {
    var that = this;
    return this._currentMatches().slice(0, this.props.maxItemsShown).map(function (entry, index) {
      return React.createElement(AutocompleteEntry, { highlighted: entry === that.state.highlightedValue, key: entry, value: entry, onEntryClick: that._onEntryClick, onEntryMouseOver: that._onEntryMouseOver });
    });
  },
  _highlightedIndex: function _highlightedIndex() {
    var that = this;
    var foundIndex = -1;
    this._currentMatches().forEach(function (entry, index) {
      if (entry === that.state.highlightedValue) {
        foundIndex = index;
      }
    });
    return foundIndex;
  },
  _updateHighlightedValue: function _updateHighlightedValue() {
    var newValue;
    var highlightedIndex = this._highlightedIndex();
    if (highlightedIndex < 0) {
      newValue = this.state.list[0];
    } else {
      newValue = this.state.list[highlightedIndex];
    }
    this.setState({ highlightedValue: newValue });
  },
  _setInputFromValue: function _setInputFromValue() {
    React.findDOMNode(this.refs.autoInput).value = this.state.currentValue;
  },
  _setValueFromInput: function _setValueFromInput() {
    var inputText = React.findDOMNode(this.refs.autoInput).value;
    var foundEntries = this.state.list.filter(function (entry) {
      return entry.indexOf(inputText) > -1;
    });
    if (foundEntries.length > 0) {
      this.setState({
        currentValue: foundEntries[0],
        highlightedValue: foundEntries[0]
      });
    } else {
      this.props.onNoMatch(this.state);
      if (this.props.limitToList) {
        this.setState({
          currentValue: this.props.defaultValue,
          highlightedValue: this.props.defaultValue
        });
      }
    }
  },
  _setFromHighlighted: function _setFromHighlighted() {
    this.setState({
      currentValue: this.state.highlightedValue
    }, function () {
      this._setInputFromValue();
    });
  },
  _onChange: function _onChange() {
    this._setValueFromInput();
  },
  _onFocus: function _onFocus() {
    this.setState({ showEntries: true });
  },
  _onBlur: function _onBlur() {
    this._setFromHighlighted();
    this.setState({ showEntries: false });
  },
  _onEntryClick: function _onEntryClick(entry) {
    this.setState({
      currentValue: entry
    }, function () {
      this._setInputFromValue();
    });
  },
  _onEntryMouseOver: function _onEntryMouseOver(entry) {
    this.setState({ highlightedValue: entry });
  },
  _onEntryMouseOut: function _onEntryMouseOut(entry) {
    this.setState({ highlightedValue: this.currentValue });
  },
  _onInputClick: function _onInputClick() {
    React.findDOMNode(this.refs.autoInput).select();
  }
});

var AutocompleteEntry = React.createClass({
  displayName: 'AutocompleteEntry',

  getInitialState: function getInitialState() {
    return { hover: false };
  },
  _onClick: function _onClick() {
    this.props.onEntryClick(this.props.value);
  },
  _onMouseOver: function _onMouseOver() {
    this.props.onEntryMouseOver(this.props.value);
  },
  render: function render() {
    return React.createElement(
      'li',
      { style: { backgroundColor: this.props.highlighted ? 'hsl(90, 50%, 50%)' : '', zIndex: 9999, cursor: 'pointer' }, onMouseDown: this._onClick, onMouseOver: this._onMouseOver },
      this.props.value
    );
  }
});

// ---------------
// end Autocomplete
// ---------------

function reRender() {
  React.render(React.createElement(VdnaMenu, { tabList: tabList }), document.getElementById('vdnamenu'));
};

var tabList = [{ id: 1, href: 'profile', text: 'Edit My Profile', selected: true }, { id: 2, href: 'notifications', text: 'View Notifications', selected: false }, { id: 3, href: 'import', text: 'Import and Sync', selected: false }, { id: 4, href: 'settings', text: 'Change Settings', selected: false }, { id: 5, href: 'privacy', text: 'Privacy', selected: false }, { id: 6, href: 'about', text: 'About', selected: false }];

var VdnaMenu = React.createClass({
  displayName: 'VdnaMenu',

  getInitialState: function getInitialState() {
    return {
      tabList: this.props.tabList,
      currentTab: 1
    };
  },
  changeTab: function changeTab(tabId) {
    var newTabList = tabList.map(function (tab) {
      tab.selected = tab.id === tabId;
      return tab;
    });
    this.setState({
      tabList: newTabList,
      currentTab: tabId
    });
  },
  render: function render() {
    var tabContent;
    switch (this.state.currentTab) {
      case 1:
        tabContent = React.createElement(MyProfile, null);
        break;
      case 2:
        tabContent = React.createElement(Notifications, null);
        break;
      case 3:
        tabContent = React.createElement(Import, null);
        break;
      case 4:
        tabContent = React.createElement(Settings, null);
        break;
      case 5:
        tabContent = React.createElement(Privacy, null);
        break;
      case 6:
        tabContent = React.createElement(About, null);
        break;
      default:
        tabContent = React.createElement(MyProfile, null);
    }
    return React.createElement(
      'section',
      { className: 'vdna' },
      React.createElement(
        'div',
        { className: 'vdna-body' },
        React.createElement(
          'div',
          { className: 'container' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(Tabs, { tabList: this.state.tabList, changeTab: this.changeTab }),
            React.createElement(
              'div',
              { className: 'main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2' },
              React.createElement(
                'div',
                { className: 'tab-content' },
                tabContent
              )
            )
          )
        ),
        React.createElement(CloseVdna, null)
      )
    );
  }
});

var OpenVdna = React.createClass({
  displayName: 'OpenVdna',

  handleClick: function handleClick() {
    $("#vdnamenu").show();
    $("#openVdna").hide();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { 'data-toggle': 'tooltip', title: 'Click to open VDNA', id: 'openVdna', className: 'btn btn-sm btn-primary openVdna', onClick: this.handleClick },
        'Open vDNA'
      )
    );
  }
});

var CloseVdna = React.createClass({
  displayName: 'CloseVdna',

  handleClick: function handleClick() {
    $("#vdnamenu").hide();
    $("#openVdna").show();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { 'data-toggle': 'tooltip', title: 'Click to close', className: 'closeVdna', style: { cursor: 'pointer' }, onClick: this.handleClick },
        React.createElement('span', { className: 'fa fa-power-off' })
      )
    );
  }
});

var Tabs = React.createClass({
  displayName: 'Tabs',

  render: function render() {
    var that = this;
    var tabListNodes = this.props.tabList.map(function (tab, index) {
      return React.createElement(Tab, { changeTab: that.props.changeTab, key: tab.href, id: tab.href, tab: tab });
    });
    return React.createElement(
      'div',
      { className: 'sidebar col-xs-4 col-sm-3 col-lg-2' },
      React.createElement(
        'nav',
        { className: 'navbar navbar-default', role: 'navigation' },
        React.createElement(
          'ul',
          { className: 'nav navbar-nav', role: 'tablist' },
          tabListNodes
        )
      )
    );
  }
});

var Tab = React.createClass({
  displayName: 'Tab',

  handleClick: function handleClick() {
    this.props.changeTab(this.props.tab.id);
  },
  render: function render() {
    return React.createElement(
      'li',
      { role: 'presentation', className: this.props.tab.selected ? 'active' : '' },
      React.createElement(
        'a',
        { href: this.props.tab.href, 'aria-controls': this.props.tab.href, role: 'tab', 'data-toggle': 'tab', onClick: this.handleClick },
        this.props.tab.text
      )
    );
  }
});

var MyProfileHeader = React.createClass({
  displayName: 'MyProfileHeader',

  render: function render() {
    return React.createElement(
      'header',
      { className: 'page-header' },
      React.createElement(
        'div',
        { className: 'media' },
        React.createElement(
          'div',
          { className: 'media-left' },
          React.createElement('span', { className: 'fa fa-2x fa-user' })
        ),
        React.createElement(
          'div',
          { className: 'media-body' },
          React.createElement(
            'h1',
            { className: 'media-heading' },
            'Your profile ',
            React.createElement(
              'small',
              null,
              'at'
            ),
            ' [site.com]'
          )
        )
      )
    );
  }
});

var MyProfileCategories = React.createClass({
  displayName: 'MyProfileCategories',

  handleChange: function handleChange() {
    console.log(React.findDOMNode(this.refs.category).value);
    this.props.getCategoryOnChange(React.findDOMNode(this.refs.category).value);
  },
  getInitialState: function getInitialState() {
    return {
      categories: this.props.categories
    };
  },
  render: function render() {
    var that = this;
    var categoryNodes = this.state.categories.map(function (category) {
      return React.createElement(MyProfileCategory, { category: category });
    });
    return React.createElement(
      'div',
      { className: 'form-group form-group-sm' },
      React.createElement(
        'label',
        { htmlFor: 'category', className: 'col-sm-2 control-label' },
        'Category'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-10' },
        React.createElement(
          'select',
          { className: 'selectpicker', id: 'category', ref: 'category', onChange: this.handleChange },
          categoryNodes
        )
      )
    );
  }
});

var MyProfileCategory = React.createClass({
  displayName: 'MyProfileCategory',

  render: function render() {
    return React.createElement(
      'option',
      { value: this.props.category, ref: this.props.category },
      data.capitalize(this.props.category)
    );
  }
});

var MyProfilePrivacy = React.createClass({
  displayName: 'MyProfilePrivacy',

  componentDidMount: function componentDidMount() {
    $("#privacySettingSlider").slider({ min: 1, max: 5, step: 1, value: 3 });
    $("#privacySettingSlider").on("slide", function (n) {
      n.value === 1 ? $("#privacySettingSliderVal").text("20") : n.value === 2 ? $("#privacySettingSliderVal").text("40") : n.value === 3 ? $("#privacySettingSliderVal").text("60") : n.value === 4 ? $("#privacySettingSliderVal").text("80") : n.value === 5 && $("#privacySettingSliderVal").text("100");
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'form-group form-group-sm' },
      React.createElement(
        'label',
        { htmlFor: 'inputEmail3', className: 'col-sm-2 control-label' },
        'Privacy'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6' },
        React.createElement('input', { id: 'privacySettingSlider', type: 'text' })
      ),
      React.createElement(
        'div',
        { className: 'col-sm-2' },
        'Sharing ',
        React.createElement(
          'span',
          { id: 'privacySettingSliderVal' },
          '60'
        ),
        '%'
      )
    );
  }
});

var MyProfileInterests = React.createClass({
  displayName: 'MyProfileInterests',

  showDetails: function showDetails(interest, details) {
    console.log(interest + ": " + JSON.stringify(details));
    this.setState({ currentInterest: interest, currentDetails: details });
  },
  getInitialState: function getInitialState() {
    return { currentInterest: null,
      currentDetails: {},
      addInterestCollapsed: true };
  },
  componentDidMount: function componentDidMount() {
    data.blinkNodes();
  },
  showAddLike: function showAddLike() {
    this.setState({ addInterestCollapsed: false });
  },
  hideAddLike: function hideAddLike() {
    this.setState({ addInterestCollapsed: true });
  },
  render: function render() {
    var that = this;
    var currentInterests = Object.keys(this.props.interests).reduce(function (is, i) {
      if (that.props.interests[i]['selected']) {
        is[i] = that.props.interests[i];
      }
      return is;
    }, {});
    var interestNodes = Object.keys(this.props.interests).filter(function (interest) {
      return that.props.interests[interest]['selected'];
    }).map(function (interest) {
      return React.createElement(MyProfileInterest, { key: interest, interest: interest, showDetails: that.showDetails.bind(that, interest, that.props.interests[interest]) });
    });
    /*
    var relatedInterests = Object.keys(this.props.interests).filter(function(interest) {
      return !that.props.interests[interest]['selected'];
    });
     */
    var relatedInterests = this.state.currentInterest ? this.state.currentDetails['related'].split(/,/) : [];
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'form-group form-group-sm' },
        React.createElement(
          'label',
          { className: 'col-sm-2 control-label' },
          'Interests'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-6' },
          React.createElement(
            'div',
            { className: 'panel panel-interests' },
            React.createElement(
              'div',
              { className: 'panel-body' },
              interestNodes
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-sm-4 col-bottom' },
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-sm btn-default' },
            'Import'
          ),
          React.createElement(
            'button',
            { id: 'addLike', onClick: this.showAddLike, type: 'submit', role: 'button', className: 'btn btn-sm btn-success', 'aria-expanded': 'false', 'aria-controls': 'addLike' },
            React.createElement('span', { className: 'glyphicon glyphicon-plus' }),
            ' Add'
          )
        )
      ),
      React.createElement(MyProfileAddAnInterest, { interests: currentInterests, collapse: this.state.addInterestCollapsed, hideAddLike: this.hideAddLike }),
      React.createElement(MyProfileLikeDetails, { currentInterest: this.state.currentInterest, currentDetails: this.state.currentDetails, relatedInterests: relatedInterests, collapse: false })
    );
  }
});

var MyProfileInterest = React.createClass({
  displayName: 'MyProfileInterest',

  handleClick: function handleClick() {
    this.props.showDetails();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.interest, key: this.props.interest, role: 'button', onClick: this.handleClick },
      data.capitalize(this.props.interest)
    );
  }
});

var MyProfileAddAnInterest = React.createClass({
  displayName: 'MyProfileAddAnInterest',

  addLikeDone: function addLikeDone() {
    console.log($("#addInterestInput").val());
    if (data.addInterest($("#addInterestInput").val())) {
      this.props.hideAddLike();
    }
    $("#addInterestInput").val("");
    reRender();
  },
  render: function render() {
    var currentInterestKeys = Object.keys(this.props.interests);
    console.log('current interests: ' + JSON.stringify(currentInterestKeys));
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function (interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    console.log('available interests: ' + JSON.stringify(availableInterestKeys));
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    console.log('Add a like: "' + baseDivStyles.join(' ') + '"');
    return React.createElement(
      'div',
      { className: baseDivStyles.join(' '), id: 'addAnInterest' },
      React.createElement(
        'label',
        { className: 'col-sm-2 control-label' },
        'Add a like'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6' },
        React.createElement(Autocomplete, { inputId: 'addInterestInput', defaultValue: '', defaultList: availableInterestKeys, className: 'form-control', addLikeDone: this.addLikeDone })
      ),
      React.createElement(
        'div',
        { className: 'col-sm-2' },
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-sm btn-default', onClick: this.addLikeDone },
          'Done'
        )
      )
    );
  }
});

var MyProfileLikeDetails = React.createClass({
  displayName: 'MyProfileLikeDetails',

  removeInterest: function removeInterest() {
    // data.unLikeAnInterest(this.props.category, this.props.currentInterest);
    data.unLikeAnInterest(this.props.currentInterest);
    reRender();
  },
  render: function render() {
    var that = this;
    var relatedInterestNodes = this.props.relatedInterests.map(function (interest) {
      return(
        // <MyProfileRelatedInterest category={that.props.category} relatedInterest={interest} />
        React.createElement(MyProfileRelatedInterest, { relatedInterest: interest })
      );
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if (this.props.currentInterest) {
      html = React.createElement(
        'div',
        { className: baseDivStyles.join(' '), id: 'likeDetails' },
        React.createElement(
          'div',
          { className: 'col-sm-6 col-sm-offset-2' },
          React.createElement(
            'div',
            { className: 'well well-sm' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col-xs-4' },
                React.createElement(
                  'button',
                  { type: 'button', className: 'btn btn-sm btn-primary' },
                  this.props.currentInterest
                )
              ),
              React.createElement(
                'div',
                { className: 'col-xs-8' },
                React.createElement(
                  'ul',
                  { className: 'list-inline' },
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      'small',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Total clicks:'
                      ),
                      ' ',
                      this.props.currentDetails['clicks']
                    )
                  ),
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      'small',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Source:'
                      ),
                      ' Imported from ',
                      data.capitalize(this.props.currentDetails['source']),
                      React.createElement('br', null),
                      'Added on ',
                      this.props.currentDetails['added']
                    )
                  )
                )
              )
            )
          ),
          React.createElement(
            'p',
            null,
            React.createElement(
              'strong',
              null,
              'Related interests:'
            ),
            relatedInterestNodes
          )
        ),
        React.createElement(
          'div',
          { className: 'col-sm-4' },
          React.createElement(
            'button',
            { type: 'submit', role: 'button', className: 'btn btn-sm btn-default remove-like', 'aria-expanded': 'true', 'aria-controls': 'removeLike', onClick: this.removeInterest },
            'Remove'
          )
        )
      );
    } else {
      html = React.createElement('div', { className: baseDivStyles.join(' '), id: 'likeDetails' });
    }
    return React.createElement(
      'div',
      null,
      html
    );
  }
});

var MyProfileRelatedInterest = React.createClass({
  displayName: 'MyProfileRelatedInterest',

  addInterest: function addInterest() {
    // data.addRelatedInterest(this.props.category, this.props.relatedInterest);
    data.addRelatedInterest(this.props.relatedInterest);
    reRender();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.relatedInterest, key: this.props.relatedInterest, role: 'button', onClick: this.addInterest },
      data.capitalize(this.props.relatedInterest)
    );
  }
});

var MyProfile = React.createClass({
  displayName: 'MyProfile',

  getInitialState: function getInitialState() {
    return {
      // category: Object.keys(staticData)[0],
      // interests: staticData[Object.keys(staticData)[0]]
      interests: data.staticInterests
    };
  },
  getCategoryOnChange: function getCategoryOnChange(category) {
    console.log(JSON.stringify(data.staticData[category]));
    this.setState({ category: category,
      interests: data.staticData[category] });
  },
  render: function render() {
    return React.createElement(
      'div',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'profile' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(MyProfileHeader, null),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(MyProfilePrivacy, null),
          React.createElement(MyProfileInterests, { interests: this.state.interests, setInterests: this.setInterests })
        )
      )
    );
  }
});

var Notifications = React.createClass({
  displayName: 'Notifications',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'notifications' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Notifications ',
            React.createElement(
              'small',
              null,
              'from'
            ),
            ' [site.com]'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            React.createElement(
              'table',
              { className: 'table table-notifications' },
              React.createElement(
                'thead',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { colSpan: '2' },
                    React.createElement(
                      'p',
                      null,
                      'Site.com has requested to add following interests to your profile.',
                      React.createElement('br', null),
                      React.createElement(
                        'small',
                        null,
                        'See ',
                        React.createElement(
                          'a',
                          { href: '#' },
                          'settings'
                        ),
                        ' to change the default behavior for this window.'
                      )
                    )
                  ),
                  React.createElement(
                    'th',
                    null,
                    React.createElement(
                      'nav',
                      { className: 'table-filter text-right' },
                      React.createElement(
                        'ul',
                        { className: 'list-inline' },
                        React.createElement(
                          'li',
                          { className: 'text-muted' },
                          'Show:'
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Pending'
                          )
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Accepted'
                          )
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Rejected'
                          )
                        ),
                        React.createElement(
                          'li',
                          { className: 'active' },
                          React.createElement(
                            'a',
                            { href: '#' },
                            'All'
                          )
                        )
                      )
                    )
                  )
                )
              ),
              React.createElement(
                'tbody',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn btn-sm btn-default' },
                      'Tennis'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn-sm btn-default' },
                      'Skiing'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn btn-sm btn-default' },
                      'Windsurfing'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'nav',
              { className: 'text-right' },
              React.createElement(
                'ul',
                { className: 'pagination' },
                React.createElement(
                  'li',
                  { className: 'disabled' },
                  React.createElement(
                    'a',
                    { 'aria-label': 'Previous', href: '#' },
                    React.createElement(
                      'span',
                      { 'aria-hidden': 'true' },
                      '« Previous'
                    )
                  )
                ),
                React.createElement(
                  'li',
                  { className: 'active' },
                  React.createElement(
                    'a',
                    { href: '#' },
                    '1 ',
                    React.createElement(
                      'span',
                      { className: 'sr-only' },
                      '(current)'
                    )
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '2'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '3'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '4'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '5'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { 'aria-label': 'Next', href: '#' },
                    React.createElement(
                      'span',
                      { 'aria-hidden': 'true' },
                      'Next »'
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

var Import = React.createClass({
  displayName: 'Import',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'import' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h3',
            null,
            '...your interests across apps and devices.'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-6 col-lg-4' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Connect with Facebook!'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'strong',
                null,
                'Last sync:'
              ),
              ' 25 interests (5 new)',
              React.createElement('br', null),
              React.createElement(
                'strong',
                null,
                'Last synced on:'
              ),
              ' @DateTime.Now'
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn btn-sm btn-default pull-right' },
              'Connect'
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6 col-lg-4 col-lg-offset-1' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Import your pins from Pinterest!'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'strong',
                null,
                'Last sync:'
              ),
              ' 25 interests (5 new)',
              React.createElement('br', null),
              React.createElement(
                'strong',
                null,
                'Last synced on:'
              ),
              ' @DateTime.Now'
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn btn-sm btn-default pull-right' },
              'Import'
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12 col-lg-9' },
            React.createElement(
              'h3',
              null,
              'Try your app!'
            ),
            React.createElement(
              'p',
              null,
              'Like controlling the web??? We thought so. Our nifty app lets you take it to the next level and puts all your internet-wide preferences in one central place so you can quickly and easily view and accept your notifications with a few steps.'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'download for android'
              ),
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'download for iphone'
              )
            ),
            React.createElement(
              'div',
              { className: 'pull-right' },
              'Got an app? Now ',
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'Generate a sync code!'
              )
            )
          )
        )
      )
    );
  }
});

var Settings = React.createClass({
  displayName: 'Settings',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'settings' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Settings ',
            React.createElement(
              'small',
              null,
              'on'
            ),
            ' [site.com]'
          ),
          React.createElement(
            'p',
            null,
            'You are in control! Change your settings here.'
          )
        ),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'personalization', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Personalization'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement('input', { type: 'checkbox', name: 'personalization', className: 'switch' })
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'sorting', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Sorting'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'select',
                { 'class': 'selectpicker', id: 'sorting' },
                React.createElement(
                  'option',
                  null,
                  'Your interests'
                ),
                React.createElement(
                  'option',
                  null,
                  'Site default'
                )
              )
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'autosave', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Autosave'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement('input', { type: 'checkbox', name: 'autosave', className: 'switch' })
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'delete', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Delete my profile ',
              React.createElement(
                'small',
                null,
                'at'
              ),
              ' ',
              React.createElement(
                'i',
                null,
                '[site.com]'
              )
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-danger' },
                'Delete'
              )
            )
          )
        )
      )
    );
  }
});

var Privacy = React.createClass({
  displayName: 'Privacy',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'privacy' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Privacy'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-10' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'
            ),
            React.createElement(
              'p',
              null,
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'
            )
          )
        )
      )
    );
  }
});

var About = React.createClass({
  displayName: 'About',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'about' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement('img', { src: '/images/logo-zivter.png', alt: '' })
        )
      )
    );
  }
});

reRender();

/*
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" type="text/css" href="Content/vdna.min.css">
    <script type="text/javascript" src="Scripts/modernizr-2.6.2.js"></script>
  </head>
  <body>

    <!-- vdna app -->
    <section class="vdna">
      <div class="vdna-body">

	<!-- container -->
	<div class="container">
	  <div class="row">

	    <!-- sidebar ----------------------------------------------------------------------------------------->
	    <div class="sidebar col-xs-4 col-sm-3 col-lg-2">

	    </div><!-- /sidebar ---------------------------------------------------------------------------------->

	    <!-- main content -->
	    <div class="main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2">
	      <div class="tab-content">

		<!-- section: my profile ------------------------------------------------------>

		    </div><!-- /my profile form -->

		  </div>
		</section><!-- /section: my profile -------------------------------------------->

		<!-- section: notifications ------------------------------------------------------>
                <!-- /section: notifications ----------------------------------------------------->

		<!-- section: import ----------------------------------------------------------------->
                <!-- /section: import ---------------------------------------------------------------->

		<!-- section: settings ------------------------------------------------------------------>
                <!-- section: settings ------------------------------------------------------------------>

		<!-- section: privacy ---------------------------------------------------------------------->
                <!-- /section: privacy ------------------------------------------------------------------->

		<!-- section: about ------------------------------------------------------------------------->
                <!-- /section: about ---------------------------------------------------------------------->

	      </div>
	    </div><!-- /main content -->

	  </div>

	  <!-- close app -->
	  <a href="#closeVdna" data-toggle="tooltip" title="Click to close" class="closeVdna"><span class="fa fa-power-off"></span></a>

	</div><!-- /container -->

	<!-- open app -->
	<a href="#openVdna" data-toggle="tooltip" title="Click to open VDNA" class="btn btn-sm btn-primary openVdna">Open vDNA</a>
      </div>
    </section><!-- /vdna app -->

    <!-- Website placeholder -->
    <img src="Content/images/ticketpro.png" alt="" />

    <!-- Scripts -->
    <script type="text/javascript" src="Scripts/bundles/jquery.js"></script>
    <script type="text/javascript" src="Scripts/bundles/bootstrap.js"></script>
    <script type="text/javascript" src="Scripts/bundles/vdna.js"></script>

  </body>
</html>
*/
/* <OpenVdna /> */ /* <input type="text" className="form-control" ref="addAnInterestInput" id="addAnInterestInput" /> */ /*<strong>Category:</strong> {data.capitalize(this.props.currentDetails['category'])}<br />*/ /*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/ /*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/


},{"vdna/static_data":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3BvbGFyaXMvcnVtbWFnaW5nX3JvdW5kL25vZGUuanMvdHAtcmVhY3Qvbm9kZV9tb2R1bGVzL3ZkbmEvc3RhdGljX2RhdGEuanMiLCIvaG9tZS9wb2xhcmlzL3J1bW1hZ2luZ19yb3VuZC9ub2RlLmpzL3RwLXJlYWN0L3B1YmxpYy9qcy92ZG5hbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLHNDQUFzQztBQUN0QyxrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QixtQkFBbUI7QUFDbkIsNkJBQTZCO0FBQzdCLFVBQVU7QUFDVixzQ0FBc0M7O0FBRXRDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7RUFDZixlQUFlLEVBQUU7SUFDZixLQUFLLGVBQWUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSTswQkFDbEUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFO0lBQ2pFLGVBQWUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLOzBCQUNuRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0lBQzdDLE1BQU0sY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLOzBCQUNuRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUU7SUFDbkQsVUFBVSxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxN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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUU7QUFDRixrQkFBa0IsQ0FBQyxxR0FBcUcsQ0FBQyw2RkFBNkYsQ0FBQyxvSEFBb0gsQ0FBQywySEFBMkg7QUFDdmMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHsgY2F0ZWdvcnlOYW1lOlxuLy8gICB7IGludGVyZXN0TmFtZTpcbi8vICAgICB7IHNvdXJjZTogJ2ZhY2Vib29rJyxcbi8vICAgICAgIGNsaWNrczogNSxcbi8vICAgICAgIGFkZGVkOiBEYXRlLm5vdygpIH0sXG4vLyAgICAgLi4uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3RhdGljSW50ZXJlc3RzOiB7XG4gICAgbXVzaWM6ICAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3JvY2sgbXVzaWMsamF6eixjb25jZXJ0cyxvcGVyYScgfSxcbiAgICBcImZyZW5jaCBhY3RvcnNcIjogICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDM3LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZHJhbWEsZmlsbScgfSxcbiAgICBhY3RvcnM6ICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAzNSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2N6ZWNoIGZpbG0sIGZpbG0nIH0sXG4gICAgXCJsYSByaW9qYVwiOiAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAzMiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3NwYWluJyB9LFxuICAgIFwiY2FzdGlsbGUgeSBsZcOzblwiOiAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDQ1LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnc3BhaW4nIH0sXG4gICAgc3BhaW46ICAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdsYSByaW9qYSxjYXN0aWxsZSB5IGxlw7NuJyB9LFxuICAgIHNwaXJpdHVhbGl0eTogICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDE4LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbGl0ZXJhdHVyZSxtdXNpYycgfSxcbiAgICByaW86ICAgICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAyMSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbXVzaWMscm9jayBtdXNpYycgfSxcbiAgICBcImN6ZWNoIGZpbG1cIjogICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDU0LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZmlsbSxhY3RvcnMnIH0sXG4gICAgXCJyb2NrIG11c2ljXCI6ICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxMiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ211c2ljJyB9LFxuICAgIFwid29ybGQgbXVzaWNcIjogICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdtdXNpYycgfSxcbiAgICBqYXp6OiAgICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxNiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2phenonIH0sXG4gICAgdGVjaG5vbG9neTogICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTksIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdoZWFsdGgsc2NpZW5jZScgfSxcbiAgICBoZWFsdGg6ICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAyMCwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnc2NpZW5jZSxkZW50YWwnIH0sXG4gICAgZGVudGFsOiAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdoZWFsdGgnIH0sXG4gICAgY29taWNzOiAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzQsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdodW1vcixsaXRlcmF0dXJlJyB9LFxuICAgIGh1bW9yOiAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDEwLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnYWN0b3JzLGxpdGVyYXR1cmUnIH0sXG4gICAgbGl0ZXJhdHVyZTogICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICd0aGVhdGVyLGNvbWljcycgfSxcbiAgICBzY2llbmNlOiAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxMywgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3RlY2hub2xvZ3ksaGVhbHRoJyB9LFxuICAgIGRyYW1hOiAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDE5LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAndGhlYXRlcixmaWxtLGxpdGVyYXR1cmUnIH0sXG4gICAgdGhlYXRlcjogICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdkcmFtYSxsaXRlcmF0dXJlLG9wZXJhJyB9LFxuICAgIGZpbG06ICAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDIxLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZHJhbWEsbGl0ZXJhdHVyZSxjb21pY3MnIH0sXG4gICAgY29uY2VydHM6ICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdtdXNpYyx0aGVhdGVyJyB9LFxuICAgIFwiY29udGVtcG9yYXJ5IGFydFwiOiB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTgsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2xpdGVyYXR1cmUsZmlsbSx0aGVhdGVyJyB9LFxuICAgIG9wZXJhOiAgICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDI1LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbXVzaWMsdGhlYXRlcicgfSxcbiAgICBmaXRuZXNzOiAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxNiwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2hlYWx0aCxzY2llbmNlJyB9XG59LFxuXG4gIGJsaW5rTm9kZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxlY3RlZEludGVyZXN0cyA9IE9iamVjdC5rZXlzKGRhdGEuc3RhdGljSW50ZXJlc3RzKS5maWx0ZXIoZnVuY3Rpb24oaW50ZXJlc3QpIHtcbiAgICAgIHJldHVybiBkYXRhLnN0YXRpY0ludGVyZXN0c1tpbnRlcmVzdF1bJ3NlbGVjdGVkJ107XG4gICAgfSkucmVkdWNlKGZ1bmN0aW9uKGlzLCBpKSB7XG4gICAgICBpc1tpXSA9IGRhdGEuc3RhdGljSW50ZXJlc3RzW2ldO1xuICAgICAgcmV0dXJuIGlzO1xuICAgIH0sIHt9KTtcbiAgICB2YXIgc2VsZWN0ZWRJbnRlcmVzdEtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RlZEludGVyZXN0cyk7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRJbnRlcmVzdEtleXMpKTtcblxuICAgICQoXCJsaVt2ZG5hY2xhc3NdXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICBpZigkKGVsKS5hdHRyKCd2ZG5hY2xhc3MnKS5zcGxpdCgvLC8pLnJlZHVjZShmdW5jdGlvbihzaG93T3JIaWRlLCBrZXl3b3JkKSB7XG4gICAgICAgIHJldHVybiBzaG93T3JIaWRlIHx8IChzZWxlY3RlZEludGVyZXN0S2V5cy5pbmRleE9mKGtleXdvcmQpID4gLTEpO1xuICAgICAgfSwgZmFsc2UpKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzaG93aW5nICcgKyAkKGVsKS5hdHRyKCd2ZG5hY2xhc3MnKSk7XG4gICAgICAgICQoZWwpLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdoaWRpbmcgJyArICQoZWwpLmF0dHIoJ3ZkbmFjbGFzcycpKTtcbiAgICAgICAgJChlbCkuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4oc1swXS50b1VwcGVyQ2FzZSgpICsgcy5zdWJzdHIoMSkpO1xuICB9LFxuXG4gIGJsaW5rTm9kZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgc2VsZWN0ZWRJbnRlcmVzdHMgPSBPYmplY3Qua2V5cyh0aGlzLnN0YXRpY0ludGVyZXN0cykuZmlsdGVyKGZ1bmN0aW9uKGludGVyZXN0KSB7XG4gICAgICByZXR1cm4gdGhhdC5zdGF0aWNJbnRlcmVzdHNbaW50ZXJlc3RdWydzZWxlY3RlZCddO1xuICAgIH0pLnJlZHVjZShmdW5jdGlvbihpcywgaSkge1xuICAgICAgaXNbaV0gPSB0aGF0LnN0YXRpY0ludGVyZXN0c1tpXTtcbiAgICAgIHJldHVybiBpcztcbiAgICB9LCB7fSk7XG4gICAgdmFyIHNlbGVjdGVkSW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0ZWRJbnRlcmVzdHMpO1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkSW50ZXJlc3RLZXlzKSk7XG5cbiAgICAkKFwibGlbdmRuYWNsYXNzXVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgaWYoJChlbCkuYXR0cigndmRuYWNsYXNzJykuc3BsaXQoLywvKS5yZWR1Y2UoZnVuY3Rpb24oc2hvd09ySGlkZSwga2V5d29yZCkge1xuICAgICAgICByZXR1cm4gc2hvd09ySGlkZSB8fCAoc2VsZWN0ZWRJbnRlcmVzdEtleXMuaW5kZXhPZihrZXl3b3JkKSA+IC0xKTtcbiAgICAgIH0sIGZhbHNlKSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2hvd2luZyAnICsgJChlbCkuYXR0cigndmRuYWNsYXNzJykpO1xuICAgICAgICAkKGVsKS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnaGlkaW5nICcgKyAkKGVsKS5hdHRyKCd2ZG5hY2xhc3MnKSk7XG4gICAgICAgICQoZWwpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKlxuICAgYWRkSW50ZXJlc3Q6IGZ1bmN0aW9uKGNhdGVnb3J5LCBpbnRlcmVzdCkge1xuICAgICBzdGF0aWNEYXRhW2NhdGVnb3J5XVtpbnRlcmVzdF0gPSB7IGNhdGVnb3J5OiBjYXRlZ29yeSwgc291cmNlOiAndmRuYScsIGNsaWNrczogMSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlIH07XG4gICB9LFxuICAgKi9cblxuICBhZGRJbnRlcmVzdDogZnVuY3Rpb24oaW50ZXJlc3QpIHtcbiAgICBpZih0aGlzLnN0YXRpY0ludGVyZXN0c1tpbnRlcmVzdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zdGF0aWNJbnRlcmVzdHNbaW50ZXJlc3RdWydzZWxlY3RlZCddID0gdHJ1ZTtcbiAgICAgIHRoaXMuYmxpbmtOb2RlcygpO1xuICAgICAgLy8gUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLypcbiAgIHZhciBhZGRSZWxhdGVkSW50ZXJlc3QgPSBmdW5jdGlvbihjYXRlZ29yeSwgaW50ZXJlc3QpIHtcbiAgICAgc3RhdGljRGF0YVtjYXRlZ29yeV1baW50ZXJlc3RdWydzZWxlY3RlZCddID0gdHJ1ZTtcbiAgICAgUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICAgfSxcbiAgICovXG5cbiAgYWRkUmVsYXRlZEludGVyZXN0OiBmdW5jdGlvbihpbnRlcmVzdCkge1xuICAgIHRoaXMuc3RhdGljSW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXSA9IHRydWU7XG4gICAgdGhpcy5ibGlua05vZGVzKCk7XG4gICAgLy8gUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICB9LFxuXG4gIC8qXG4gICB1bkxpa2VBbkludGVyZXN0OiBmdW5jdGlvbihjYXRlZ29yeSwgaW50ZXJlc3QpIHtcbiAgICAgc3RhdGljRGF0YVtjYXRlZ29yeV1baW50ZXJlc3RdWydzZWxlY3RlZCddID0gZmFsc2U7XG4gICAgIFJlYWN0LnJlbmRlcig8VmRuYU1lbnUgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbiAgIH0sXG4gICAqL1xuXG4gIHVuTGlrZUFuSW50ZXJlc3Q6IGZ1bmN0aW9uKGludGVyZXN0KSB7XG4gICAgdGhpcy5zdGF0aWNJbnRlcmVzdHNbaW50ZXJlc3RdWydzZWxlY3RlZCddID0gZmFsc2U7XG4gICAgdGhpcy5ibGlua05vZGVzKCk7XG4gICAgLy8gUmVhY3QucmVuZGVyKDxWZG5hTWVudSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGF0YSA9IHJlcXVpcmUoJ3ZkbmEvc3RhdGljX2RhdGEnKTtcbi8vIHZhciBBdXRvY29tcGxldGUgPSByZXF1aXJlKCdyZWFjdC1hdXRvY29tcGxldGUvbGliL21haW4uanMnKTtcbi8vIHZhciBDb21ib2JveCA9IEF1dG9jb21wbGV0ZS5Db21ib2JveDtcbi8vIHZhciBDb21ib2JveE9wdGlvbiA9IEF1dG9jb21wbGV0ZS5Db21ib2JveE9wdGlvbjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXV0b2NvbXBsZXRlIGNvZGVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEF1dG9jb21wbGV0ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdBdXRvY29tcGxldGUnLFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXRJbnB1dEZyb21WYWx1ZSgpO1xuICAgIHZhciBoaWdobGlnaHRlZEluZGV4O1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAvLyBlbnRlci5cbiAgICAgICAgICBjb25zb2xlLmxvZygnRU5URVIhJyk7XG4gICAgICAgICAgdGhhdC5wcm9wcy5hZGRMaWtlRG9uZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgLy8gdGFiXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RBQiEnKTtcbiAgICAgICAgICB0aGF0Ll9zZXRGcm9tSGlnaGxpZ2h0ZWQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAvLyB1cFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSB0aGF0Ll9oaWdobGlnaHRlZEluZGV4KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1VQISAnICsgaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPiAwKSB7XG4gICAgICAgICAgICB0aGF0LnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhhdC5fY3VycmVudE1hdGNoZXMoKVtoaWdobGlnaHRlZEluZGV4IC0gMV0gfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgIC8vIGRvd25cbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gdGhhdC5faGlnaGxpZ2h0ZWRJbmRleCgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdET1dOISAnICsgaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGF0LnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhhdC5fY3VycmVudE1hdGNoZXMoKVswXSB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGhpZ2hsaWdodGVkSW5kZXggPCB0aGF0Ll9jdXJyZW50TWF0Y2hlcygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRoYXQuc2V0U3RhdGUoeyBoaWdobGlnaHRlZFZhbHVlOiB0aGF0Ll9jdXJyZW50TWF0Y2hlcygpW2hpZ2hsaWdodGVkSW5kZXggKyAxXSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogJ2FwcGxlJyxcbiAgICAgIGxpbWl0VG9MaXN0OiB0cnVlLFxuICAgICAgbWF4SXRlbXNTaG93bjogOCxcbiAgICAgIHNvdXJjZVVybDogbnVsbCxcbiAgICAgIGRlZmF1bHRMaXN0OiBbJ2FwcGxlJywgJ2JhbmFuYScsICdvcmFuZ2UnLCAnZ3JhcGUnLCAnY2hlcnJ5J10sXG4gICAgICBhbHNvU2VhcmNoVmFsdWVzOiBmYWxzZSxcbiAgICAgIGxvYWRVcmxPbmNlOiB0cnVlLFxuICAgICAgc2VsZWN0QWxsVGV4dE9uQ2xpY2s6IHRydWUsXG4gICAgICBvbk5vTWF0Y2g6IGZ1bmN0aW9uIG9uTm9NYXRjaChzdGF0ZSkge31cbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGlzdDogdGhpcy5wcm9wcy5kZWZhdWx0TGlzdCxcbiAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICBoaWdobGlnaHRlZFZhbHVlOiB0aGlzLnByb3BzLmRlZmF1bHRWYWx1ZSxcbiAgICAgIHNob3dFbnRyaWVzOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBlbnRyaWVzID0gdGhpcy5zdGF0ZS5zaG93RW50cmllcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnb2wnLFxuICAgICAgeyBzdHlsZTogeyBwb3NpdGlvbjogJ2Fic29sdXRlJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCBjb2xvcjogJ2JsYWNrJywgbGlzdFN0eWxlOiAnbm9uZScsIHBhZGRpbmc6IDAsIG1hcmdpbjogMCB9LCBvbk1vdXNlTGVhdmU6IHRoaXMuX29uRW50cnlNb3VzZU91dCB9LFxuICAgICAgdGhpcy5fcmVuZGVyTWF0Y2hlcygpXG4gICAgKSA6ICcnO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IGlkOiB0aGlzLnByb3BzLmlucHV0SWQsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsIHJlZjogJ2F1dG9JbnB1dCcsIG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgb25Gb2N1czogdGhpcy5fb25Gb2N1cywgb25CbHVyOiB0aGlzLl9vbkJsdXIsIG9uQ2xpY2s6IHRoaXMuX29uSW5wdXRDbGljayB9KSxcbiAgICAgIGVudHJpZXNcbiAgICApO1xuICB9LFxuICBfY3VycmVudE1hdGNoZXM6IGZ1bmN0aW9uIF9jdXJyZW50TWF0Y2hlcygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGNtID0gdGhpcy5zdGF0ZS5saXN0LmZpbHRlcihmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiBlbnRyeS5pbmRleE9mKHRoYXQuX2lucHV0KCkpID4gLTE7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNtO1xuICB9LFxuICBfaW5wdXQ6IGZ1bmN0aW9uIF9pbnB1dCgpIHtcbiAgICBpZiAoIXRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRvSW5wdXQpLnZhbHVlO1xuICAgIH1cbiAgfSxcbiAgX3JlbmRlck1hdGNoZXM6IGZ1bmN0aW9uIF9yZW5kZXJNYXRjaGVzKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudE1hdGNoZXMoKS5zbGljZSgwLCB0aGlzLnByb3BzLm1heEl0ZW1zU2hvd24pLm1hcChmdW5jdGlvbiAoZW50cnksIGluZGV4KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChBdXRvY29tcGxldGVFbnRyeSwgeyBoaWdobGlnaHRlZDogZW50cnkgPT09IHRoYXQuc3RhdGUuaGlnaGxpZ2h0ZWRWYWx1ZSwga2V5OiBlbnRyeSwgdmFsdWU6IGVudHJ5LCBvbkVudHJ5Q2xpY2s6IHRoYXQuX29uRW50cnlDbGljaywgb25FbnRyeU1vdXNlT3ZlcjogdGhhdC5fb25FbnRyeU1vdXNlT3ZlciB9KTtcbiAgICB9KTtcbiAgfSxcbiAgX2hpZ2hsaWdodGVkSW5kZXg6IGZ1bmN0aW9uIF9oaWdobGlnaHRlZEluZGV4KCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xO1xuICAgIHRoaXMuX2N1cnJlbnRNYXRjaGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoZW50cnksIGluZGV4KSB7XG4gICAgICBpZiAoZW50cnkgPT09IHRoYXQuc3RhdGUuaGlnaGxpZ2h0ZWRWYWx1ZSkge1xuICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvdW5kSW5kZXg7XG4gIH0sXG4gIF91cGRhdGVIaWdobGlnaHRlZFZhbHVlOiBmdW5jdGlvbiBfdXBkYXRlSGlnaGxpZ2h0ZWRWYWx1ZSgpIHtcbiAgICB2YXIgbmV3VmFsdWU7XG4gICAgdmFyIGhpZ2hsaWdodGVkSW5kZXggPSB0aGlzLl9oaWdobGlnaHRlZEluZGV4KCk7XG4gICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPCAwKSB7XG4gICAgICBuZXdWYWx1ZSA9IHRoaXMuc3RhdGUubGlzdFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLmxpc3RbaGlnaGxpZ2h0ZWRJbmRleF07XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBoaWdobGlnaHRlZFZhbHVlOiBuZXdWYWx1ZSB9KTtcbiAgfSxcbiAgX3NldElucHV0RnJvbVZhbHVlOiBmdW5jdGlvbiBfc2V0SW5wdXRGcm9tVmFsdWUoKSB7XG4gICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmF1dG9JbnB1dCkudmFsdWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRWYWx1ZTtcbiAgfSxcbiAgX3NldFZhbHVlRnJvbUlucHV0OiBmdW5jdGlvbiBfc2V0VmFsdWVGcm9tSW5wdXQoKSB7XG4gICAgdmFyIGlucHV0VGV4dCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRvSW5wdXQpLnZhbHVlO1xuICAgIHZhciBmb3VuZEVudHJpZXMgPSB0aGlzLnN0YXRlLmxpc3QuZmlsdGVyKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgcmV0dXJuIGVudHJ5LmluZGV4T2YoaW5wdXRUZXh0KSA+IC0xO1xuICAgIH0pO1xuICAgIGlmIChmb3VuZEVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRWYWx1ZTogZm91bmRFbnRyaWVzWzBdLFxuICAgICAgICBoaWdobGlnaHRlZFZhbHVlOiBmb3VuZEVudHJpZXNbMF1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uTm9NYXRjaCh0aGlzLnN0YXRlKTtcbiAgICAgIGlmICh0aGlzLnByb3BzLmxpbWl0VG9MaXN0KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBfc2V0RnJvbUhpZ2hsaWdodGVkOiBmdW5jdGlvbiBfc2V0RnJvbUhpZ2hsaWdodGVkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFZhbHVlOiB0aGlzLnN0YXRlLmhpZ2hsaWdodGVkVmFsdWVcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9zZXRJbnB1dEZyb21WYWx1ZSgpO1xuICAgIH0pO1xuICB9LFxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLl9zZXRWYWx1ZUZyb21JbnB1dCgpO1xuICB9LFxuICBfb25Gb2N1czogZnVuY3Rpb24gX29uRm9jdXMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dFbnRyaWVzOiB0cnVlIH0pO1xuICB9LFxuICBfb25CbHVyOiBmdW5jdGlvbiBfb25CbHVyKCkge1xuICAgIHRoaXMuX3NldEZyb21IaWdobGlnaHRlZCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93RW50cmllczogZmFsc2UgfSk7XG4gIH0sXG4gIF9vbkVudHJ5Q2xpY2s6IGZ1bmN0aW9uIF9vbkVudHJ5Q2xpY2soZW50cnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRWYWx1ZTogZW50cnlcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9zZXRJbnB1dEZyb21WYWx1ZSgpO1xuICAgIH0pO1xuICB9LFxuICBfb25FbnRyeU1vdXNlT3ZlcjogZnVuY3Rpb24gX29uRW50cnlNb3VzZU92ZXIoZW50cnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogZW50cnkgfSk7XG4gIH0sXG4gIF9vbkVudHJ5TW91c2VPdXQ6IGZ1bmN0aW9uIF9vbkVudHJ5TW91c2VPdXQoZW50cnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhpcy5jdXJyZW50VmFsdWUgfSk7XG4gIH0sXG4gIF9vbklucHV0Q2xpY2s6IGZ1bmN0aW9uIF9vbklucHV0Q2xpY2soKSB7XG4gICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmF1dG9JbnB1dCkuc2VsZWN0KCk7XG4gIH1cbn0pO1xuXG52YXIgQXV0b2NvbXBsZXRlRW50cnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQXV0b2NvbXBsZXRlRW50cnknLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGhvdmVyOiBmYWxzZSB9O1xuICB9LFxuICBfb25DbGljazogZnVuY3Rpb24gX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5vbkVudHJ5Q2xpY2sodGhpcy5wcm9wcy52YWx1ZSk7XG4gIH0sXG4gIF9vbk1vdXNlT3ZlcjogZnVuY3Rpb24gX29uTW91c2VPdmVyKCkge1xuICAgIHRoaXMucHJvcHMub25FbnRyeU1vdXNlT3Zlcih0aGlzLnByb3BzLnZhbHVlKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnbGknLFxuICAgICAgeyBzdHlsZTogeyBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuaGlnaGxpZ2h0ZWQgPyAnaHNsKDkwLCA1MCUsIDUwJSknIDogJycsIHpJbmRleDogOTk5OSwgY3Vyc29yOiAncG9pbnRlcicgfSwgb25Nb3VzZURvd246IHRoaXMuX29uQ2xpY2ssIG9uTW91c2VPdmVyOiB0aGlzLl9vbk1vdXNlT3ZlciB9LFxuICAgICAgdGhpcy5wcm9wcy52YWx1ZVxuICAgICk7XG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS1cbi8vIGVuZCBBdXRvY29tcGxldGVcbi8vIC0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiByZVJlbmRlcigpIHtcbiAgUmVhY3QucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmRuYU1lbnUsIHsgdGFiTGlzdDogdGFiTGlzdCB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZkbmFtZW51JykpO1xufTtcblxudmFyIHRhYkxpc3QgPSBbeyBpZDogMSwgaHJlZjogJ3Byb2ZpbGUnLCB0ZXh0OiAnRWRpdCBNeSBQcm9maWxlJywgc2VsZWN0ZWQ6IHRydWUgfSwgeyBpZDogMiwgaHJlZjogJ25vdGlmaWNhdGlvbnMnLCB0ZXh0OiAnVmlldyBOb3RpZmljYXRpb25zJywgc2VsZWN0ZWQ6IGZhbHNlIH0sIHsgaWQ6IDMsIGhyZWY6ICdpbXBvcnQnLCB0ZXh0OiAnSW1wb3J0IGFuZCBTeW5jJywgc2VsZWN0ZWQ6IGZhbHNlIH0sIHsgaWQ6IDQsIGhyZWY6ICdzZXR0aW5ncycsIHRleHQ6ICdDaGFuZ2UgU2V0dGluZ3MnLCBzZWxlY3RlZDogZmFsc2UgfSwgeyBpZDogNSwgaHJlZjogJ3ByaXZhY3knLCB0ZXh0OiAnUHJpdmFjeScsIHNlbGVjdGVkOiBmYWxzZSB9LCB7IGlkOiA2LCBocmVmOiAnYWJvdXQnLCB0ZXh0OiAnQWJvdXQnLCBzZWxlY3RlZDogZmFsc2UgfV07XG5cbnZhciBWZG5hTWVudSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdWZG5hTWVudScsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhYkxpc3Q6IHRoaXMucHJvcHMudGFiTGlzdCxcbiAgICAgIGN1cnJlbnRUYWI6IDFcbiAgICB9O1xuICB9LFxuICBjaGFuZ2VUYWI6IGZ1bmN0aW9uIGNoYW5nZVRhYih0YWJJZCkge1xuICAgIHZhciBuZXdUYWJMaXN0ID0gdGFiTGlzdC5tYXAoZnVuY3Rpb24gKHRhYikge1xuICAgICAgdGFiLnNlbGVjdGVkID0gdGFiLmlkID09PSB0YWJJZDtcbiAgICAgIHJldHVybiB0YWI7XG4gICAgfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0YWJMaXN0OiBuZXdUYWJMaXN0LFxuICAgICAgY3VycmVudFRhYjogdGFiSWRcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHRhYkNvbnRlbnQ7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLmN1cnJlbnRUYWIpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGFiQ29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KE5vdGlmaWNhdGlvbnMsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgdGFiQ29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW1wb3J0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFNldHRpbmdzLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFByaXZhY3ksIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNjpcbiAgICAgICAgdGFiQ29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWJvdXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZSwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyBjbGFzc05hbWU6ICd2ZG5hJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAndmRuYS1ib2R5JyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJzLCB7IHRhYkxpc3Q6IHRoaXMuc3RhdGUudGFiTGlzdCwgY2hhbmdlVGFiOiB0aGlzLmNoYW5nZVRhYiB9KSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ21haW4tY29udGVudCBjb2wteHMtOCBjb2wteHMtb2Zmc2V0LTQgY29sLXNtLTkgY29sLXNtLW9mZnNldC0zIGNvbC1sZy0xMCBjb2wtbGctb2Zmc2V0LTInIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0YWItY29udGVudCcgfSxcbiAgICAgICAgICAgICAgICB0YWJDb250ZW50XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2xvc2VWZG5hLCBudWxsKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgT3BlblZkbmEgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnT3BlblZkbmEnLFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAkKFwiI3ZkbmFtZW51XCIpLnNob3coKTtcbiAgICAkKFwiI29wZW5WZG5hXCIpLmhpZGUoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnc3BhbicsXG4gICAgICAgIHsgJ2RhdGEtdG9nZ2xlJzogJ3Rvb2x0aXAnLCB0aXRsZTogJ0NsaWNrIHRvIG9wZW4gVkROQScsIGlkOiAnb3BlblZkbmEnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1wcmltYXJ5IG9wZW5WZG5hJywgb25DbGljazogdGhpcy5oYW5kbGVDbGljayB9LFxuICAgICAgICAnT3BlbiB2RE5BJ1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQ2xvc2VWZG5hID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0Nsb3NlVmRuYScsXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgICQoXCIjdmRuYW1lbnVcIikuaGlkZSgpO1xuICAgICQoXCIjb3BlblZkbmFcIikuc2hvdygpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdzcGFuJyxcbiAgICAgICAgeyAnZGF0YS10b2dnbGUnOiAndG9vbHRpcCcsIHRpdGxlOiAnQ2xpY2sgdG8gY2xvc2UnLCBjbGFzc05hbWU6ICdjbG9zZVZkbmEnLCBzdHlsZTogeyBjdXJzb3I6ICdwb2ludGVyJyB9LCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLXBvd2VyLW9mZicgfSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIFRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFicycsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciB0YWJMaXN0Tm9kZXMgPSB0aGlzLnByb3BzLnRhYkxpc3QubWFwKGZ1bmN0aW9uICh0YWIsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUYWIsIHsgY2hhbmdlVGFiOiB0aGF0LnByb3BzLmNoYW5nZVRhYiwga2V5OiB0YWIuaHJlZiwgaWQ6IHRhYi5ocmVmLCB0YWI6IHRhYiB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdzaWRlYmFyIGNvbC14cy00IGNvbC1zbS0zIGNvbC1sZy0yJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ25hdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbmF2YmFyIG5hdmJhci1kZWZhdWx0Jywgcm9sZTogJ25hdmlnYXRpb24nIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3VsJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ25hdiBuYXZiYXItbmF2Jywgcm9sZTogJ3RhYmxpc3QnIH0sXG4gICAgICAgICAgdGFiTGlzdE5vZGVzXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIFRhYiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWInLFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICB0aGlzLnByb3BzLmNoYW5nZVRhYih0aGlzLnByb3BzLnRhYi5pZCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2xpJyxcbiAgICAgIHsgcm9sZTogJ3ByZXNlbnRhdGlvbicsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy50YWIuc2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnYScsXG4gICAgICAgIHsgaHJlZjogdGhpcy5wcm9wcy50YWIuaHJlZiwgJ2FyaWEtY29udHJvbHMnOiB0aGlzLnByb3BzLnRhYi5ocmVmLCByb2xlOiAndGFiJywgJ2RhdGEtdG9nZ2xlJzogJ3RhYicsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2xpY2sgfSxcbiAgICAgICAgdGhpcy5wcm9wcy50YWIudGV4dFxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUhlYWRlcicsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnaGVhZGVyJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdtZWRpYScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWxlZnQnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtMnggZmEtdXNlcicgfSlcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWJvZHknIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWhlYWRpbmcnIH0sXG4gICAgICAgICAgICAnWW91ciBwcm9maWxlICcsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnYXQnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgJyBbc2l0ZS5jb21dJ1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlQ2F0ZWdvcmllcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVDYXRlZ29yaWVzJyxcblxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIGhhbmRsZUNoYW5nZSgpIHtcbiAgICBjb25zb2xlLmxvZyhSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2F0ZWdvcnkpLnZhbHVlKTtcbiAgICB0aGlzLnByb3BzLmdldENhdGVnb3J5T25DaGFuZ2UoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmNhdGVnb3J5KS52YWx1ZSk7XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjYXRlZ29yaWVzOiB0aGlzLnByb3BzLmNhdGVnb3JpZXNcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGNhdGVnb3J5Tm9kZXMgPSB0aGlzLnN0YXRlLmNhdGVnb3JpZXMubWFwKGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlQ2F0ZWdvcnksIHsgY2F0ZWdvcnk6IGNhdGVnb3J5IH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgIHsgaHRtbEZvcjogJ2NhdGVnb3J5JywgY2xhc3NOYW1lOiAnY29sLXNtLTIgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgJ0NhdGVnb3J5J1xuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS0xMCcgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc2VsZWN0JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3NlbGVjdHBpY2tlcicsIGlkOiAnY2F0ZWdvcnknLCByZWY6ICdjYXRlZ29yeScsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSB9LFxuICAgICAgICAgIGNhdGVnb3J5Tm9kZXNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlQ2F0ZWdvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlQ2F0ZWdvcnknLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ29wdGlvbicsXG4gICAgICB7IHZhbHVlOiB0aGlzLnByb3BzLmNhdGVnb3J5LCByZWY6IHRoaXMucHJvcHMuY2F0ZWdvcnkgfSxcbiAgICAgIGRhdGEuY2FwaXRhbGl6ZSh0aGlzLnByb3BzLmNhdGVnb3J5KVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlUHJpdmFjeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVQcml2YWN5JyxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclwiKS5zbGlkZXIoeyBtaW46IDEsIG1heDogNSwgc3RlcDogMSwgdmFsdWU6IDMgfSk7XG4gICAgJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclwiKS5vbihcInNsaWRlXCIsIGZ1bmN0aW9uIChuKSB7XG4gICAgICBuLnZhbHVlID09PSAxID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiMjBcIikgOiBuLnZhbHVlID09PSAyID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiNDBcIikgOiBuLnZhbHVlID09PSAzID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiNjBcIikgOiBuLnZhbHVlID09PSA0ID8gJChcIiNwcml2YWN5U2V0dGluZ1NsaWRlclZhbFwiKS50ZXh0KFwiODBcIikgOiBuLnZhbHVlID09PSA1ICYmICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJWYWxcIikudGV4dChcIjEwMFwiKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgeyBodG1sRm9yOiAnaW5wdXRFbWFpbDMnLCBjbGFzc05hbWU6ICdjb2wtc20tMiBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAnUHJpdmFjeSdcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tNicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IGlkOiAncHJpdmFjeVNldHRpbmdTbGlkZXInLCB0eXBlOiAndGV4dCcgfSlcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tMicgfSxcbiAgICAgICAgJ1NoYXJpbmcgJyxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgeyBpZDogJ3ByaXZhY3lTZXR0aW5nU2xpZGVyVmFsJyB9LFxuICAgICAgICAgICc2MCdcbiAgICAgICAgKSxcbiAgICAgICAgJyUnXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVJbnRlcmVzdHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlSW50ZXJlc3RzJyxcblxuICBzaG93RGV0YWlsczogZnVuY3Rpb24gc2hvd0RldGFpbHMoaW50ZXJlc3QsIGRldGFpbHMpIHtcbiAgICBjb25zb2xlLmxvZyhpbnRlcmVzdCArIFwiOiBcIiArIEpTT04uc3RyaW5naWZ5KGRldGFpbHMpKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEludGVyZXN0OiBpbnRlcmVzdCwgY3VycmVudERldGFpbHM6IGRldGFpbHMgfSk7XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGN1cnJlbnRJbnRlcmVzdDogbnVsbCxcbiAgICAgIGN1cnJlbnREZXRhaWxzOiB7fSxcbiAgICAgIGFkZEludGVyZXN0Q29sbGFwc2VkOiB0cnVlIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBkYXRhLmJsaW5rTm9kZXMoKTtcbiAgfSxcbiAgc2hvd0FkZExpa2U6IGZ1bmN0aW9uIHNob3dBZGRMaWtlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhZGRJbnRlcmVzdENvbGxhcHNlZDogZmFsc2UgfSk7XG4gIH0sXG4gIGhpZGVBZGRMaWtlOiBmdW5jdGlvbiBoaWRlQWRkTGlrZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWRkSW50ZXJlc3RDb2xsYXBzZWQ6IHRydWUgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgY3VycmVudEludGVyZXN0cyA9IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuaW50ZXJlc3RzKS5yZWR1Y2UoZnVuY3Rpb24gKGlzLCBpKSB7XG4gICAgICBpZiAodGhhdC5wcm9wcy5pbnRlcmVzdHNbaV1bJ3NlbGVjdGVkJ10pIHtcbiAgICAgICAgaXNbaV0gPSB0aGF0LnByb3BzLmludGVyZXN0c1tpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpcztcbiAgICB9LCB7fSk7XG4gICAgdmFyIGludGVyZXN0Tm9kZXMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmludGVyZXN0cykuZmlsdGVyKGZ1bmN0aW9uIChpbnRlcmVzdCkge1xuICAgICAgcmV0dXJuIHRoYXQucHJvcHMuaW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXTtcbiAgICB9KS5tYXAoZnVuY3Rpb24gKGludGVyZXN0KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVJbnRlcmVzdCwgeyBrZXk6IGludGVyZXN0LCBpbnRlcmVzdDogaW50ZXJlc3QsIHNob3dEZXRhaWxzOiB0aGF0LnNob3dEZXRhaWxzLmJpbmQodGhhdCwgaW50ZXJlc3QsIHRoYXQucHJvcHMuaW50ZXJlc3RzW2ludGVyZXN0XSkgfSk7XG4gICAgfSk7XG4gICAgLypcclxuICAgIHZhciByZWxhdGVkSW50ZXJlc3RzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpLmZpbHRlcihmdW5jdGlvbihpbnRlcmVzdCkge1xyXG4gICAgICByZXR1cm4gIXRoYXQucHJvcHMuaW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXTtcclxuICAgIH0pO1xyXG4gICAgICovXG4gICAgdmFyIHJlbGF0ZWRJbnRlcmVzdHMgPSB0aGlzLnN0YXRlLmN1cnJlbnRJbnRlcmVzdCA/IHRoaXMuc3RhdGUuY3VycmVudERldGFpbHNbJ3JlbGF0ZWQnXS5zcGxpdCgvLC8pIDogW107XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS0yIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICAgJ0ludGVyZXN0cydcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS02JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZWwgcGFuZWwtaW50ZXJlc3RzJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZWwtYm9keScgfSxcbiAgICAgICAgICAgICAgaW50ZXJlc3ROb2Rlc1xuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS00IGNvbC1ib3R0b20nIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICdJbXBvcnQnXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICB7IGlkOiAnYWRkTGlrZScsIG9uQ2xpY2s6IHRoaXMuc2hvd0FkZExpa2UsIHR5cGU6ICdzdWJtaXQnLCByb2xlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tc3VjY2VzcycsICdhcmlhLWV4cGFuZGVkJzogJ2ZhbHNlJywgJ2FyaWEtY29udHJvbHMnOiAnYWRkTGlrZScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2dseXBoaWNvbiBnbHlwaGljb24tcGx1cycgfSksXG4gICAgICAgICAgICAnIEFkZCdcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUFkZEFuSW50ZXJlc3QsIHsgaW50ZXJlc3RzOiBjdXJyZW50SW50ZXJlc3RzLCBjb2xsYXBzZTogdGhpcy5zdGF0ZS5hZGRJbnRlcmVzdENvbGxhcHNlZCwgaGlkZUFkZExpa2U6IHRoaXMuaGlkZUFkZExpa2UgfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUxpa2VEZXRhaWxzLCB7IGN1cnJlbnRJbnRlcmVzdDogdGhpcy5zdGF0ZS5jdXJyZW50SW50ZXJlc3QsIGN1cnJlbnREZXRhaWxzOiB0aGlzLnN0YXRlLmN1cnJlbnREZXRhaWxzLCByZWxhdGVkSW50ZXJlc3RzOiByZWxhdGVkSW50ZXJlc3RzLCBjb2xsYXBzZTogZmFsc2UgfSlcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUludGVyZXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUludGVyZXN0JyxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5zaG93RGV0YWlscygpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzcGFuJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcsIHJlZjogJ2ludGVyZXN0U3BhbicsIHRpdGxlOiB0aGlzLnByb3BzLmludGVyZXN0LCBrZXk6IHRoaXMucHJvcHMuaW50ZXJlc3QsIHJvbGU6ICdidXR0b24nLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrIH0sXG4gICAgICBkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5pbnRlcmVzdClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUFkZEFuSW50ZXJlc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlQWRkQW5JbnRlcmVzdCcsXG5cbiAgYWRkTGlrZURvbmU6IGZ1bmN0aW9uIGFkZExpa2VEb25lKCkge1xuICAgIGNvbnNvbGUubG9nKCQoXCIjYWRkSW50ZXJlc3RJbnB1dFwiKS52YWwoKSk7XG4gICAgaWYgKGRhdGEuYWRkSW50ZXJlc3QoJChcIiNhZGRJbnRlcmVzdElucHV0XCIpLnZhbCgpKSkge1xuICAgICAgdGhpcy5wcm9wcy5oaWRlQWRkTGlrZSgpO1xuICAgIH1cbiAgICAkKFwiI2FkZEludGVyZXN0SW5wdXRcIikudmFsKFwiXCIpO1xuICAgIHJlUmVuZGVyKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBjdXJyZW50SW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpO1xuICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IGludGVyZXN0czogJyArIEpTT04uc3RyaW5naWZ5KGN1cnJlbnRJbnRlcmVzdEtleXMpKTtcbiAgICB2YXIgYXZhaWxhYmxlSW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXMoZGF0YS5zdGF0aWNJbnRlcmVzdHMpLmZpbHRlcihmdW5jdGlvbiAoaW50ZXJlc3RLZXkpIHtcbiAgICAgIHJldHVybiBjdXJyZW50SW50ZXJlc3RLZXlzLmluZGV4T2YoaW50ZXJlc3RLZXkpID09IC0xO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdhdmFpbGFibGUgaW50ZXJlc3RzOiAnICsgSlNPTi5zdHJpbmdpZnkoYXZhaWxhYmxlSW50ZXJlc3RLZXlzKSk7XG4gICAgdmFyIGJhc2VEaXZTdHlsZXMgPSBbJ2Zvcm0tZ3JvdXAnLCAnZm9ybS1ncm91cC1zbSddO1xuICAgIGlmICh0aGlzLnByb3BzLmNvbGxhcHNlKSB7XG4gICAgICBiYXNlRGl2U3R5bGVzLnB1c2goJ2NvbGxhcHNlJyk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdBZGQgYSBsaWtlOiBcIicgKyBiYXNlRGl2U3R5bGVzLmpvaW4oJyAnKSArICdcIicpO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogYmFzZURpdlN0eWxlcy5qb2luKCcgJyksIGlkOiAnYWRkQW5JbnRlcmVzdCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTIgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgJ0FkZCBhIGxpa2UnXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTYnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXV0b2NvbXBsZXRlLCB7IGlucHV0SWQ6ICdhZGRJbnRlcmVzdElucHV0JywgZGVmYXVsdFZhbHVlOiAnJywgZGVmYXVsdExpc3Q6IGF2YWlsYWJsZUludGVyZXN0S2V5cywgY2xhc3NOYW1lOiAnZm9ybS1jb250cm9sJywgYWRkTGlrZURvbmU6IHRoaXMuYWRkTGlrZURvbmUgfSlcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tMicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0Jywgb25DbGljazogdGhpcy5hZGRMaWtlRG9uZSB9LFxuICAgICAgICAgICdEb25lJ1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVMaWtlRGV0YWlscyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVMaWtlRGV0YWlscycsXG5cbiAgcmVtb3ZlSW50ZXJlc3Q6IGZ1bmN0aW9uIHJlbW92ZUludGVyZXN0KCkge1xuICAgIC8vIGRhdGEudW5MaWtlQW5JbnRlcmVzdCh0aGlzLnByb3BzLmNhdGVnb3J5LCB0aGlzLnByb3BzLmN1cnJlbnRJbnRlcmVzdCk7XG4gICAgZGF0YS51bkxpa2VBbkludGVyZXN0KHRoaXMucHJvcHMuY3VycmVudEludGVyZXN0KTtcbiAgICByZVJlbmRlcigpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHJlbGF0ZWRJbnRlcmVzdE5vZGVzID0gdGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3RzLm1hcChmdW5jdGlvbiAoaW50ZXJlc3QpIHtcbiAgICAgIHJldHVybihcbiAgICAgICAgLy8gPE15UHJvZmlsZVJlbGF0ZWRJbnRlcmVzdCBjYXRlZ29yeT17dGhhdC5wcm9wcy5jYXRlZ29yeX0gcmVsYXRlZEludGVyZXN0PXtpbnRlcmVzdH0gLz5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVSZWxhdGVkSW50ZXJlc3QsIHsgcmVsYXRlZEludGVyZXN0OiBpbnRlcmVzdCB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgICB2YXIgYmFzZURpdlN0eWxlcyA9IFsnZm9ybS1ncm91cCcsICdmb3JtLWdyb3VwLXNtJ107XG4gICAgaWYgKHRoaXMucHJvcHMuY29sbGFwc2UpIHtcbiAgICAgIGJhc2VEaXZTdHlsZXMucHVzaCgnY29sbGFwc2UnKTtcbiAgICB9XG4gICAgdmFyIGh0bWw7XG4gICAgaWYgKHRoaXMucHJvcHMuY3VycmVudEludGVyZXN0KSB7XG4gICAgICBodG1sID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiBiYXNlRGl2U3R5bGVzLmpvaW4oJyAnKSwgaWQ6ICdsaWtlRGV0YWlscycgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS02IGNvbC1zbS1vZmZzZXQtMicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3dlbGwgd2VsbC1zbScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy00JyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLXByaW1hcnknIH0sXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmN1cnJlbnRJbnRlcmVzdFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy04JyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWlubGluZScgfSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAnVG90YWwgY2xpY2tzOidcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmN1cnJlbnREZXRhaWxzWydjbGlja3MnXVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdTb3VyY2U6J1xuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgJyBJbXBvcnRlZCBmcm9tICcsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXBpdGFsaXplKHRoaXMucHJvcHMuY3VycmVudERldGFpbHNbJ3NvdXJjZSddKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIG51bGwpLFxuICAgICAgICAgICAgICAgICAgICAgICdBZGRlZCBvbiAnLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY3VycmVudERldGFpbHNbJ2FkZGVkJ11cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ1JlbGF0ZWQgaW50ZXJlc3RzOidcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICByZWxhdGVkSW50ZXJlc3ROb2Rlc1xuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS00JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgIHsgdHlwZTogJ3N1Ym1pdCcsIHJvbGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0IHJlbW92ZS1saWtlJywgJ2FyaWEtZXhwYW5kZWQnOiAndHJ1ZScsICdhcmlhLWNvbnRyb2xzJzogJ3JlbW92ZUxpa2UnLCBvbkNsaWNrOiB0aGlzLnJlbW92ZUludGVyZXN0IH0sXG4gICAgICAgICAgICAnUmVtb3ZlJ1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaHRtbCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiBiYXNlRGl2U3R5bGVzLmpvaW4oJyAnKSwgaWQ6ICdsaWtlRGV0YWlscycgfSk7XG4gICAgfVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgaHRtbFxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlUmVsYXRlZEludGVyZXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZVJlbGF0ZWRJbnRlcmVzdCcsXG5cbiAgYWRkSW50ZXJlc3Q6IGZ1bmN0aW9uIGFkZEludGVyZXN0KCkge1xuICAgIC8vIGRhdGEuYWRkUmVsYXRlZEludGVyZXN0KHRoaXMucHJvcHMuY2F0ZWdvcnksIHRoaXMucHJvcHMucmVsYXRlZEludGVyZXN0KTtcbiAgICBkYXRhLmFkZFJlbGF0ZWRJbnRlcmVzdCh0aGlzLnByb3BzLnJlbGF0ZWRJbnRlcmVzdCk7XG4gICAgcmVSZW5kZXIoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc3BhbicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnLCByZWY6ICdpbnRlcmVzdFNwYW4nLCB0aXRsZTogdGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3QsIGtleTogdGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3QsIHJvbGU6ICdidXR0b24nLCBvbkNsaWNrOiB0aGlzLmFkZEludGVyZXN0IH0sXG4gICAgICBkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3QpXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlJyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gY2F0ZWdvcnk6IE9iamVjdC5rZXlzKHN0YXRpY0RhdGEpWzBdLFxuICAgICAgLy8gaW50ZXJlc3RzOiBzdGF0aWNEYXRhW09iamVjdC5rZXlzKHN0YXRpY0RhdGEpWzBdXVxuICAgICAgaW50ZXJlc3RzOiBkYXRhLnN0YXRpY0ludGVyZXN0c1xuICAgIH07XG4gIH0sXG4gIGdldENhdGVnb3J5T25DaGFuZ2U6IGZ1bmN0aW9uIGdldENhdGVnb3J5T25DaGFuZ2UoY2F0ZWdvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhLnN0YXRpY0RhdGFbY2F0ZWdvcnldKSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGNhdGVnb3J5OiBjYXRlZ29yeSxcbiAgICAgIGludGVyZXN0czogZGF0YS5zdGF0aWNEYXRhW2NhdGVnb3J5XSB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgcm9sZTogJ3RhYnBhbmVsJywgY2xhc3NOYW1lOiAndGFiLXBhbmUgZmFkZSBhY3RpdmUgaW4nLCBpZDogJ3Byb2ZpbGUnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb250YWluZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlSGVhZGVyLCBudWxsKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0taG9yaXpvbnRhbCcgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZVByaXZhY3ksIG51bGwpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlSW50ZXJlc3RzLCB7IGludGVyZXN0czogdGhpcy5zdGF0ZS5pbnRlcmVzdHMsIHNldEludGVyZXN0czogdGhpcy5zZXRJbnRlcmVzdHMgfSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTm90aWZpY2F0aW9ucyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdOb3RpZmljYXRpb25zJyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzZWN0aW9uJyxcbiAgICAgIHsgcm9sZTogJ3RhYnBhbmVsJywgY2xhc3NOYW1lOiAndGFiLXBhbmUgZmFkZSBhY3RpdmUgaW4nLCBpZDogJ25vdGlmaWNhdGlvbnMnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb250YWluZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdwYWdlLWhlYWRlcicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2gxJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAnTm90aWZpY2F0aW9ucyAnLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ2Zyb20nXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgJyBbc2l0ZS5jb21dJ1xuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy0xMicgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICd0YWJsZScsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGFibGUgdGFibGUtbm90aWZpY2F0aW9ucycgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAndGhlYWQnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICd0cicsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgeyBjb2xTcGFuOiAnMicgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAnU2l0ZS5jb20gaGFzIHJlcXVlc3RlZCB0byBhZGQgZm9sbG93aW5nIGludGVyZXN0cyB0byB5b3VyIHByb2ZpbGUuJyxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIG51bGwpLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdTZWUgJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICcgdG8gY2hhbmdlIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciB0aGlzIHdpbmRvdy4nXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnbmF2JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RhYmxlLWZpbHRlciB0ZXh0LXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWlubGluZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGV4dC1tdXRlZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1Nob3c6J1xuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BlbmRpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHRlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlamVjdGVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdhY3RpdmUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FsbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAndGJvZHknLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICd0cicsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgeyBzY29wZTogJ3JvdycgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidG4gYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnVGVubmlzJ1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1pbmxpbmUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NhdGVnb3J5OiAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1Nwb3J0cydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NvdXJjZTogSW1wb3J0ZWQgZnJvbSAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhY2Vib29rJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVxdWVzdGVkIG9uIEBEYXRlVGltZS5Ob3cnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0ZXh0LXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYnRuLWdyb3VwJywgcm9sZTogJ2dyb3VwJywgJ2FyaWEtbGFiZWwnOiAnLi4uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tbGluayBidG4tc3VjY2VzcycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLWNoZWNrJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdoaWRkZW4teHMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcHByb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1saW5rIGJ0bi1kYW5nZXInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1yZW1vdmUnIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hpZGRlbi14cycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlbW92ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAndHInLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgICAgICAgIHsgc2NvcGU6ICdyb3cnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnU2tpaW5nJ1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1pbmxpbmUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NhdGVnb3J5OiAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1Nwb3J0cydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NvdXJjZTogSW1wb3J0ZWQgZnJvbSAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhY2Vib29rJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVxdWVzdGVkIG9uIEBEYXRlVGltZS5Ob3cnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0ZXh0LXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYnRuLWdyb3VwJywgcm9sZTogJ2dyb3VwJywgJ2FyaWEtbGFiZWwnOiAnLi4uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tbGluayBidG4tc3VjY2VzcycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLWNoZWNrJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdoaWRkZW4teHMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcHByb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1saW5rIGJ0bi1kYW5nZXInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1yZW1vdmUnIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hpZGRlbi14cycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlbW92ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAndHInLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgICAgICAgIHsgc2NvcGU6ICdyb3cnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYnRuIGJ0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJ1dpbmRzdXJmaW5nJ1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1pbmxpbmUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NhdGVnb3J5OiAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1Nwb3J0cydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NvdXJjZTogSW1wb3J0ZWQgZnJvbSAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhY2Vib29rJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVxdWVzdGVkIG9uIEBEYXRlVGltZS5Ob3cnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ3RkJyxcbiAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0ZXh0LXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYnRuLWdyb3VwJywgcm9sZTogJ2dyb3VwJywgJ2FyaWEtbGFiZWwnOiAnLi4uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tbGluayBidG4tc3VjY2VzcycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLWNoZWNrJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdoaWRkZW4teHMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcHByb3ZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1saW5rIGJ0bi1kYW5nZXInIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1yZW1vdmUnIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2hpZGRlbi14cycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlbW92ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnbmF2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0ZXh0LXJpZ2h0JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICd1bCcsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdwYWdpbmF0aW9uJyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdkaXNhYmxlZCcgfSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyAnYXJpYS1sYWJlbCc6ICdQcmV2aW91cycsIGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdhcmlhLWhpZGRlbic6ICd0cnVlJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICfCqyBQcmV2aW91cydcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2FjdGl2ZScgfSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgJzEgJyxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdzci1vbmx5JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICcoY3VycmVudCknXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgJzInXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICczJ1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAnNCdcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgJzUnXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgJ2FyaWEtbGFiZWwnOiAnTmV4dCcsIGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdhcmlhLWhpZGRlbic6ICd0cnVlJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICdOZXh0IMK7J1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBJbXBvcnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnSW1wb3J0JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzZWN0aW9uJyxcbiAgICAgIHsgcm9sZTogJ3RhYnBhbmVsJywgY2xhc3NOYW1lOiAndGFiLXBhbmUgZmFkZSBhY3RpdmUgaW4nLCBpZDogJ2ltcG9ydCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhZ2UtaGVhZGVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnaDMnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICcuLi55b3VyIGludGVyZXN0cyBhY3Jvc3MgYXBwcyBhbmQgZGV2aWNlcy4nXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTYgY29sLWxnLTQnIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGVhZCcgfSxcbiAgICAgICAgICAgICAgJ0Nvbm5lY3Qgd2l0aCBGYWNlYm9vayEnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncHVsbC1sZWZ0JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ0xhc3Qgc3luYzonXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICcgMjUgaW50ZXJlc3RzICg1IG5ldyknLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIG51bGwpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ0xhc3Qgc3luY2VkIG9uOidcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgJyBARGF0ZVRpbWUuTm93J1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgeyBocmVmOiAnIycsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQgcHVsbC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgJ0Nvbm5lY3QnXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy02IGNvbC1sZy00IGNvbC1sZy1vZmZzZXQtMScgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsZWFkJyB9LFxuICAgICAgICAgICAgICAnSW1wb3J0IHlvdXIgcGlucyBmcm9tIFBpbnRlcmVzdCEnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncHVsbC1sZWZ0JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ0xhc3Qgc3luYzonXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICcgMjUgaW50ZXJlc3RzICg1IG5ldyknLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIG51bGwpLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ0xhc3Qgc3luY2VkIG9uOidcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgJyBARGF0ZVRpbWUuTm93J1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgeyBocmVmOiAnIycsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQgcHVsbC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgJ0ltcG9ydCdcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2hyJywgbnVsbCksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdyb3cnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtMTIgY29sLWxnLTknIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnaDMnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnVHJ5IHlvdXIgYXBwISdcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICdMaWtlIGNvbnRyb2xsaW5nIHRoZSB3ZWI/Pz8gV2UgdGhvdWdodCBzby4gT3VyIG5pZnR5IGFwcCBsZXRzIHlvdSB0YWtlIGl0IHRvIHRoZSBuZXh0IGxldmVsIGFuZCBwdXRzIGFsbCB5b3VyIGludGVybmV0LXdpZGUgcHJlZmVyZW5jZXMgaW4gb25lIGNlbnRyYWwgcGxhY2Ugc28geW91IGNhbiBxdWlja2x5IGFuZCBlYXNpbHkgdmlldyBhbmQgYWNjZXB0IHlvdXIgbm90aWZpY2F0aW9ucyB3aXRoIGEgZmV3IHN0ZXBzLidcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdwdWxsLWxlZnQnIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JyB9LFxuICAgICAgICAgICAgICAgICdkb3dubG9hZCBmb3IgYW5kcm9pZCdcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgeyBocmVmOiAnIycsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAgICAgJ2Rvd25sb2FkIGZvciBpcGhvbmUnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdwdWxsLXJpZ2h0JyB9LFxuICAgICAgICAgICAgICAnR290IGFuIGFwcD8gTm93ICcsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JyB9LFxuICAgICAgICAgICAgICAgICdHZW5lcmF0ZSBhIHN5bmMgY29kZSEnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIFNldHRpbmdzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1NldHRpbmdzJyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzZWN0aW9uJyxcbiAgICAgIHsgcm9sZTogJ3RhYnBhbmVsJywgY2xhc3NOYW1lOiAndGFiLXBhbmUgZmFkZSBhY3RpdmUgaW4nLCBpZDogJ3NldHRpbmdzJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoZWFkZXInLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ1NldHRpbmdzICcsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnb24nXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgJyBbc2l0ZS5jb21dJ1xuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAnWW91IGFyZSBpbiBjb250cm9sISBDaGFuZ2UgeW91ciBzZXR0aW5ncyBoZXJlLidcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWhvcml6b250YWwnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgICB7IGh0bWxGb3I6ICdwZXJzb25hbGl6YXRpb24nLCBjbGFzc05hbWU6ICdjb2wteHMtNyBjb2wtc20tNSBjb2wtbWQtNCBjb2wtbGctMyBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAgICAgICAnUGVyc29uYWxpemF0aW9uJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy01IGNvbC1zbS03IGNvbC1tZC04IGNvbC1sZy05JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ2NoZWNrYm94JywgbmFtZTogJ3BlcnNvbmFsaXphdGlvbicsIGNsYXNzTmFtZTogJ3N3aXRjaCcgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2hyJywgbnVsbCksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgICB7IGh0bWxGb3I6ICdzb3J0aW5nJywgY2xhc3NOYW1lOiAnY29sLXhzLTcgY29sLXNtLTUgY29sLW1kLTQgY29sLWxnLTMgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgICAgICAgJ1NvcnRpbmcnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTUgY29sLXNtLTcgY29sLW1kLTggY29sLWxnLTknIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3NlbGVjdCcsXG4gICAgICAgICAgICAgICAgeyAnY2xhc3MnOiAnc2VsZWN0cGlja2VyJywgaWQ6ICdzb3J0aW5nJyB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnb3B0aW9uJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAnWW91ciBpbnRlcmVzdHMnXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ29wdGlvbicsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgJ1NpdGUgZGVmYXVsdCdcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2hyJywgbnVsbCksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgICB7IGh0bWxGb3I6ICdhdXRvc2F2ZScsIGNsYXNzTmFtZTogJ2NvbC14cy03IGNvbC1zbS01IGNvbC1tZC00IGNvbC1sZy0zIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICAgICAgICdBdXRvc2F2ZSdcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtNSBjb2wtc20tNyBjb2wtbWQtOCBjb2wtbGctOScgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6ICdjaGVja2JveCcsIG5hbWU6ICdhdXRvc2F2ZScsIGNsYXNzTmFtZTogJ3N3aXRjaCcgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2hyJywgbnVsbCksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgICB7IGh0bWxGb3I6ICdkZWxldGUnLCBjbGFzc05hbWU6ICdjb2wteHMtNyBjb2wtc20tNSBjb2wtbWQtNCBjb2wtbGctMyBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAgICAgICAnRGVsZXRlIG15IHByb2ZpbGUgJyxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ2F0J1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAnICcsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2knLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ1tzaXRlLmNvbV0nXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtNSBjb2wtc20tNyBjb2wtbWQtOCBjb2wtbGctOScgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgeyBocmVmOiAnIycsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRhbmdlcicgfSxcbiAgICAgICAgICAgICAgICAnRGVsZXRlJ1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBQcml2YWN5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1ByaXZhY3knLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyByb2xlOiAndGFicGFuZWwnLCBjbGFzc05hbWU6ICd0YWItcGFuZSBmYWRlIGFjdGl2ZSBpbicsIGlkOiAncHJpdmFjeScgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhZ2UtaGVhZGVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICdQcml2YWN5J1xuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy0xMCcgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdwJyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdsZWFkJyB9LFxuICAgICAgICAgICAgICAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBuZWMgb2Rpby4gUHJhZXNlbnQgbGliZXJvLiBTZWQgY3Vyc3VzIGFudGUgZGFwaWJ1cyBkaWFtLiBTZWQgbmlzaS4gTnVsbGEgcXVpcyBzZW0gYXQgbmliaCBlbGVtZW50dW0gaW1wZXJkaWV0LidcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBJbnRlZ2VyIG5lYyBvZGlvLiBQcmFlc2VudCBsaWJlcm8uIFNlZCBjdXJzdXMgYW50ZSBkYXBpYnVzIGRpYW0uIFNlZCBuaXNpLiBOdWxsYSBxdWlzIHNlbSBhdCBuaWJoIGVsZW1lbnR1bSBpbXBlcmRpZXQuJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQWJvdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQWJvdXQnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NlY3Rpb24nLFxuICAgICAgeyByb2xlOiAndGFicGFuZWwnLCBjbGFzc05hbWU6ICd0YWItcGFuZSBmYWRlIGFjdGl2ZSBpbicsIGlkOiAnYWJvdXQnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb250YWluZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdwYWdlLWhlYWRlcicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbWcnLCB7IHNyYzogJy9pbWFnZXMvbG9nby16aXZ0ZXIucG5nJywgYWx0OiAnJyB9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnJlUmVuZGVyKCk7XG5cbi8qXHJcbjwhRE9DVFlQRSBodG1sPlxyXG48aHRtbD5cclxuICA8aGVhZD5cclxuICAgIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiIC8+XHJcbiAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiPlxyXG4gICAgPHRpdGxlPjwvdGl0bGU+XHJcbiAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgaHJlZj1cIkNvbnRlbnQvdmRuYS5taW4uY3NzXCI+XHJcbiAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJTY3JpcHRzL21vZGVybml6ci0yLjYuMi5qc1wiPjwvc2NyaXB0PlxyXG4gIDwvaGVhZD5cclxuICA8Ym9keT5cclxuXHJcbiAgICA8IS0tIHZkbmEgYXBwIC0tPlxyXG4gICAgPHNlY3Rpb24gY2xhc3M9XCJ2ZG5hXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ2ZG5hLWJvZHlcIj5cclxuXHJcblx0PCEtLSBjb250YWluZXIgLS0+XHJcblx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG5cdCAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG5cclxuXHQgICAgPCEtLSBzaWRlYmFyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cdCAgICA8ZGl2IGNsYXNzPVwic2lkZWJhciBjb2wteHMtNCBjb2wtc20tMyBjb2wtbGctMlwiPlxyXG5cclxuXHQgICAgPC9kaXY+PCEtLSAvc2lkZWJhciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHQgICAgPCEtLSBtYWluIGNvbnRlbnQgLS0+XHJcblx0ICAgIDxkaXYgY2xhc3M9XCJtYWluLWNvbnRlbnQgY29sLXhzLTggY29sLXhzLW9mZnNldC00IGNvbC1zbS05IGNvbC1zbS1vZmZzZXQtMyBjb2wtbGctMTAgY29sLWxnLW9mZnNldC0yXCI+XHJcblx0ICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XHJcblxyXG5cdFx0PCEtLSBzZWN0aW9uOiBteSBwcm9maWxlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0XHQgICAgPC9kaXY+PCEtLSAvbXkgcHJvZmlsZSBmb3JtIC0tPlxyXG5cclxuXHRcdCAgPC9kaXY+XHJcblx0XHQ8L3NlY3Rpb24+PCEtLSAvc2VjdGlvbjogbXkgcHJvZmlsZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0XHQ8IS0tIHNlY3Rpb246IG5vdGlmaWNhdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG4gICAgICAgICAgICAgICAgPCEtLSAvc2VjdGlvbjogbm90aWZpY2F0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0XHQ8IS0tIHNlY3Rpb246IGltcG9ydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuICAgICAgICAgICAgICAgIDwhLS0gL3NlY3Rpb246IGltcG9ydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHRcdDwhLS0gc2VjdGlvbjogc2V0dGluZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG4gICAgICAgICAgICAgICAgPCEtLSBzZWN0aW9uOiBzZXR0aW5ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdFx0PCEtLSBzZWN0aW9uOiBwcml2YWN5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcbiAgICAgICAgICAgICAgICA8IS0tIC9zZWN0aW9uOiBwcml2YWN5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdFx0PCEtLSBzZWN0aW9uOiBhYm91dCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG4gICAgICAgICAgICAgICAgPCEtLSAvc2VjdGlvbjogYWJvdXQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0ICAgICAgPC9kaXY+XHJcblx0ICAgIDwvZGl2PjwhLS0gL21haW4gY29udGVudCAtLT5cclxuXHJcblx0ICA8L2Rpdj5cclxuXHJcblx0ICA8IS0tIGNsb3NlIGFwcCAtLT5cclxuXHQgIDxhIGhyZWY9XCIjY2xvc2VWZG5hXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgdGl0bGU9XCJDbGljayB0byBjbG9zZVwiIGNsYXNzPVwiY2xvc2VWZG5hXCI+PHNwYW4gY2xhc3M9XCJmYSBmYS1wb3dlci1vZmZcIj48L3NwYW4+PC9hPlxyXG5cclxuXHQ8L2Rpdj48IS0tIC9jb250YWluZXIgLS0+XHJcblxyXG5cdDwhLS0gb3BlbiBhcHAgLS0+XHJcblx0PGEgaHJlZj1cIiNvcGVuVmRuYVwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIHRpdGxlPVwiQ2xpY2sgdG8gb3BlbiBWRE5BXCIgY2xhc3M9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5IG9wZW5WZG5hXCI+T3BlbiB2RE5BPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvc2VjdGlvbj48IS0tIC92ZG5hIGFwcCAtLT5cclxuXHJcbiAgICA8IS0tIFdlYnNpdGUgcGxhY2Vob2xkZXIgLS0+XHJcbiAgICA8aW1nIHNyYz1cIkNvbnRlbnQvaW1hZ2VzL3RpY2tldHByby5wbmdcIiBhbHQ9XCJcIiAvPlxyXG5cclxuICAgIDwhLS0gU2NyaXB0cyAtLT5cclxuICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIlNjcmlwdHMvYnVuZGxlcy9qcXVlcnkuanNcIj48L3NjcmlwdD5cclxuICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIlNjcmlwdHMvYnVuZGxlcy9ib290c3RyYXAuanNcIj48L3NjcmlwdD5cclxuICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIlNjcmlwdHMvYnVuZGxlcy92ZG5hLmpzXCI+PC9zY3JpcHQ+XHJcblxyXG4gIDwvYm9keT5cclxuPC9odG1sPlxyXG4qL1xuLyogPE9wZW5WZG5hIC8+ICovIC8qIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHJlZj1cImFkZEFuSW50ZXJlc3RJbnB1dFwiIGlkPVwiYWRkQW5JbnRlcmVzdElucHV0XCIgLz4gKi8gLyo8c3Ryb25nPkNhdGVnb3J5Ojwvc3Ryb25nPiB7ZGF0YS5jYXBpdGFsaXplKHRoaXMucHJvcHMuY3VycmVudERldGFpbHNbJ2NhdGVnb3J5J10pfTxiciAvPiovIC8qPE15UHJvZmlsZUNhdGVnb3JpZXMgY2F0ZWdvcmllcz17T2JqZWN0LmtleXMoZGF0YS5zdGF0aWNEYXRhKX0gZ2V0Q2F0ZWdvcnlPbkNoYW5nZT17dGhpcy5nZXRDYXRlZ29yeU9uQ2hhbmdlfSAvPiovIC8qPE15UHJvZmlsZUludGVyZXN0cyBjYXRlZ29yeT17dGhpcy5zdGF0ZS5jYXRlZ29yeX0gaW50ZXJlc3RzPXt0aGlzLnN0YXRlLmludGVyZXN0c30gc2V0SW50ZXJlc3RzPXt0aGlzLnNldEludGVyZXN0c30gLz4qL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDNCdmJHRnlhWE12Y25WdGJXRm5hVzVuWDNKdmRXNWtMMjV2WkdVdWFuTXZkSEF0Y21WaFkzUXZjSFZpYkdsakwycHpMM1prYm1GdFpXNTFMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3TzBGQlFVRXNTVUZCU1N4SlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNN096czdPenM3T3p0QlFWTjJReXhKUVVGSkxGbEJRVmtzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRGJrTXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc1VVRkJTU3hEUVVGRExHdENRVUZyUWl4RlFVRkZMRU5CUVVNN1FVRkRNVUlzVVVGQlNTeG5Ra0ZCWjBJc1EwRkJRenRCUVVOeVFpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRhRUlzV1VGQlVTeERRVUZETEZOQlFWTXNSMEZCUnl4VlFVRlRMRU5CUVVNc1JVRkJSVHRCUVVNdlFpeGpRVUZQTEVOQlFVTXNRMEZCUXl4UFFVRlBPMEZCUTJRc1lVRkJTeXhGUVVGRk96dEJRVU5NTEdsQ1FVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzUkNMR05CUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdRVUZEZWtJc1owSkJRVTA3UVVGQlFTeEJRVU5TTEdGQlFVc3NRMEZCUXpzN1FVRkRTaXhwUWtGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVOd1FpeGpRVUZKTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzUTBGQlF6dEJRVU16UWl4blFrRkJUVHRCUVVGQkxFRkJRMUlzWVVGQlN5eEZRVUZGT3p0QlFVTk1MREJDUVVGblFpeEhRVUZITEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUlVGQlJTeERRVUZETzBGQlF6VkRMR2xDUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNSMEZCUnl4blFrRkJaMElzUTBGQlF5eERRVUZETzBGQlEzWkRMR05CUVVjc1owSkJRV2RDTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNaQ0xHZENRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc1owSkJRV2RDTEVWQlFVVXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1JVRkJSU3hEUVVGRExHZENRVUZuUWl4SFFVRkhMRU5CUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUTBGQlF6dFhRVU5xUmp0QlFVTkVMR2RDUVVGTk8wRkJRVUVzUVVGRFVpeGhRVUZMTEVWQlFVVTdPMEZCUTB3c01FSkJRV2RDTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdRVUZETlVNc2FVSkJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4SFFVRkhMR2RDUVVGblFpeERRVUZETEVOQlFVTTdRVUZEZWtNc1kwRkJSeXhuUWtGQlowSXNTMEZCU3l4RFFVRkRMRU5CUVVNc1JVRkJSVHRCUVVNeFFpeG5Ra0ZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRExHZENRVUZuUWl4RlFVRkZMRWxCUVVrc1EwRkJReXhsUVVGbExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRU5CUVVNN1YwRkRPVVFzVFVGQlRTeEpRVUZITEdkQ1FVRm5RaXhIUVVGSExFbEJRVWtzUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhGUVVGRk8wRkJRemxFTEdkQ1FVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVU1zWjBKQlFXZENMRVZCUVVVc1NVRkJTU3hEUVVGRExHVkJRV1VzUlVGQlJTeERRVUZETEdkQ1FVRm5RaXhIUVVGSExFTkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNRMEZCUXp0WFFVTnFSanRCUVVORUxHZENRVUZOTzBGQlFVRXNUMEZEVkR0TFFVTkdMRU5CUVVNN1IwRkRTRHRCUVVORUxHbENRVUZsTEVWQlFVVXNNa0pCUVZjN1FVRkRNVUlzVjBGQlR6dEJRVU5NTEd0Q1FVRlpMRVZCUVVVc1QwRkJUenRCUVVOeVFpeHBRa0ZCVnl4RlFVRkZMRWxCUVVrN1FVRkRha0lzYlVKQlFXRXNSVUZCUlN4RFFVRkRPMEZCUTJoQ0xHVkJRVk1zUlVGQlJTeEpRVUZKTzBGQlEyWXNhVUpCUVZjc1JVRkJSU3hEUVVGRkxFOUJRVThzUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RlFVRkZMRTlCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVVU3UVVGREwwUXNjMEpCUVdkQ0xFVkJRVVVzUzBGQlN6dEJRVU4yUWl4cFFrRkJWeXhGUVVGRkxFbEJRVWs3UVVGRGFrSXNNRUpCUVc5Q0xFVkJRVVVzU1VGQlNUdEJRVU14UWl4bFFVRlRMRVZCUVVVc2JVSkJRVk1zUzBGQlN5eEZRVUZGTEVWQlFVVTdTMEZET1VJc1EwRkJRenRIUVVOSU8wRkJRMFFzYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQTzBGQlEwd3NWVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVjBGQlZ6dEJRVU0xUWl4clFrRkJXU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNXVUZCV1R0QlFVTnlReXh6UWtGQlowSXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGbEJRVms3UVVGRGVrTXNhVUpCUVZjc1JVRkJSU3hMUVVGTE8wdEJRMjVDTEVOQlFVTTdSMEZEU0R0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZkQlFWY3NSMEZET1VJN08xRkJRVWtzUzBGQlN5eEZRVUZGTEVWQlFVTXNVVUZCVVN4RlFVRkZMRlZCUVZVc1JVRkJSU3hsUVVGbExFVkJRVVVzVDBGQlR5eEZRVUZGTEV0QlFVc3NSVUZCUlN4UFFVRlBMRVZCUVVVc1UwRkJVeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFBRVUZQTEVWQlFVVXNRMEZCUXl4RlFVRkZMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVU1zUVVGQlF5eEZRVUZETEZsQlFWa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVGQlFVTTdUVUZCUlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRk8wdEJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEY0Uwc1YwRkRSVHM3TzAxQlEwVXNLMEpCUVU4c1JVRkJSU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4QlFVRkRMRVZCUVVNc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4QlFVRkRMRVZCUVVNc1IwRkJSeXhGUVVGRExGZEJRVmNzUlVGQlF5eFJRVUZSTEVWQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1FVRkJReXhGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNVVUZCVVN4QlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVGQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExHRkJRV0VzUVVGQlF5eEhRVUZITzAxQlEzUk1MRTlCUVU4N1MwRkRTaXhEUVVOT08wZEJRMGc3UVVGRFJDeHBRa0ZCWlN4RlFVRkZMREpDUVVGWE8wRkJRekZDTEZGQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOb1FpeFJRVUZKTEVWQlFVVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCVXl4TFFVRkxMRVZCUVVVN1FVRkRPVU1zWVVGQlR5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpGRExFTkJRVU1zUTBGQlF6dEJRVU5JTEZkQlFVOHNSVUZCUlN4RFFVRkRPMGRCUTFnN1FVRkRSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1VVRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVXNSVUZCUlR0QlFVTndRaXhoUVVGUExFVkJRVVVzUTBGQlF6dExRVU5ZTEUxQlFVMDdRVUZEVEN4aFFVRlBMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03UzBGRGNrUTdSMEZEUmp0QlFVTkVMR2RDUVVGakxFVkJRVVVzTUVKQlFWYzdRVUZEZWtJc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyaENMRmRCUVU4c1NVRkJTU3hEUVVGRExHVkJRV1VzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJVeXhMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlF6RkdMR0ZCUTBVc2IwSkJRVU1zYVVKQlFXbENMRWxCUVVNc1YwRkJWeXhGUVVGRkxFdEJRVXNzUzBGQlN5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR2RDUVVGblFpeEJRVUZETEVWQlFVTXNSMEZCUnl4RlFVRkZMRXRCUVVzc1FVRkJReXhGUVVGRExFdEJRVXNzUlVGQlJTeExRVUZMTEVGQlFVTXNSVUZCUXl4WlFVRlpMRVZCUVVVc1NVRkJTU3hEUVVGRExHRkJRV0VzUVVGQlF5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRkxFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1FVRkJReXhIUVVGSExFTkJReTlMTzB0QlEwZ3NRMEZCUXl4RFFVRkRPMGRCUTBvN1FVRkRSQ3h0UWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRhRUlzVVVGQlNTeFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRjRUlzVVVGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVExFdEJRVXNzUlVGQlJTeExRVUZMTEVWQlFVVTdRVUZEY0VRc1ZVRkJSeXhMUVVGTExFdEJRVXNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4blFrRkJaMElzUlVGQlJUdEJRVU40UXl4clFrRkJWU3hIUVVGSExFdEJRVXNzUTBGQlF6dFBRVU53UWp0TFFVTkdMRU5CUVVNc1EwRkJRenRCUVVOSUxGZEJRVThzVlVGQlZTeERRVUZETzBkQlEyNUNPMEZCUTBRc2VVSkJRWFZDTEVWQlFVVXNiVU5CUVZjN1FVRkRiRU1zVVVGQlNTeFJRVUZSTEVOQlFVTTdRVUZEWWl4UlFVRkpMR2RDUVVGblFpeEhRVUZITEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUlVGQlJTeERRVUZETzBGQlEyaEVMRkZCUVVjc1owSkJRV2RDTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNaQ0xHTkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU12UWl4TlFVRk5PMEZCUTB3c1kwRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEVOQlFVTTdTMEZET1VNN1FVRkRSQ3hSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVWQlFVTXNaMEpCUVdkQ0xFVkJRVVVzVVVGQlVTeEZRVUZETEVOQlFVTXNRMEZCUXp0SFFVTTNRenRCUVVORUxHOUNRVUZyUWl4RlFVRkZMRGhDUVVGWE8wRkJRemRDTEZOQlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTTdSMEZEZUVVN1FVRkRSQ3h2UWtGQmEwSXNSVUZCUlN3NFFrRkJWenRCUVVNM1FpeFJRVUZKTEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRemRFTEZGQlFVa3NXVUZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlRMRXRCUVVzc1JVRkJSVHRCUVVONFJDeGhRVUZQTEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdTMEZEZEVNc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlJ5eFpRVUZaTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVNeFFpeFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc2IwSkJRVmtzUlVGQlJTeFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xIZENRVUZuUWl4RlFVRkZMRmxCUVZrc1EwRkJReXhEUVVGRExFTkJRVU03VDBGRGJFTXNRMEZCUXl4RFFVRkRPMHRCUTBvc1RVRkJUVHRCUVVOTUxGVkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4VlFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVjBGQlZ5eEZRVUZGTzBGQlEzcENMRmxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeHpRa0ZCV1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zV1VGQldUdEJRVU55UXl3d1FrRkJaMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmxCUVZrN1UwRkRNVU1zUTBGQlF5eERRVUZETzA5QlEwbzdTMEZEUmp0SFFVTkdPMEZCUTBRc2NVSkJRVzFDTEVWQlFVVXNLMEpCUVZjN1FVRkRPVUlzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR3RDUVVGWkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4blFrRkJaMEk3UzBGRE1VTXNSVUZCUlN4WlFVRlhPMEZCUTFvc1ZVRkJTU3hEUVVGRExHdENRVUZyUWl4RlFVRkZMRU5CUVVNN1MwRkRNMElzUTBGQlF5eERRVUZETzBkQlEwbzdRVUZEUkN4WFFVRlRMRVZCUVVVc2NVSkJRVmM3UVVGRGNFSXNVVUZCU1N4RFFVRkRMR3RDUVVGclFpeEZRVUZGTEVOQlFVTTdSMEZETTBJN1FVRkRSQ3hWUVVGUkxFVkJRVVVzYjBKQlFWYzdRVUZEYmtJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZETEZkQlFWY3NSVUZCUlN4SlFVRkpMRVZCUVVNc1EwRkJReXhEUVVGRE8wZEJRM0JETzBGQlEwUXNVMEZCVHl4RlFVRkZMRzFDUVVGWE8wRkJRMnhDTEZGQlFVa3NRMEZCUXl4dFFrRkJiVUlzUlVGQlJTeERRVUZETzBGQlF6TkNMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlF5eFhRVUZYTEVWQlFVVXNTMEZCU3l4RlFVRkRMRU5CUVVNc1EwRkJRenRIUVVOeVF6dEJRVU5FTEdWQlFXRXNSVUZCUlN4MVFrRkJVeXhMUVVGTExFVkJRVVU3UVVGRE4wSXNVVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOYUxHdENRVUZaTEVWQlFVVXNTMEZCU3p0TFFVTndRaXhGUVVGRkxGbEJRVmM3UVVGRFdpeFZRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFVkJRVVVzUTBGQlF6dExRVU16UWl4RFFVRkRMRU5CUVVNN1IwRkRTanRCUVVORUxHMUNRVUZwUWl4RlFVRkZMREpDUVVGVExFdEJRVXNzUlVGQlJUdEJRVU5xUXl4UlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVU1zWjBKQlFXZENMRVZCUVVVc1MwRkJTeXhGUVVGRExFTkJRVU1zUTBGQlF6dEhRVU14UXp0QlFVTkVMR3RDUVVGblFpeEZRVUZGTERCQ1FVRlRMRXRCUVVzc1JVRkJSVHRCUVVOb1F5eFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc1owSkJRV2RDTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVZrc1JVRkJReXhEUVVGRExFTkJRVU03UjBGRGRFUTdRVUZEUkN4bFFVRmhMRVZCUVVVc2VVSkJRVmM3UVVGRGVFSXNVMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wZEJRMnBFTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVWtzYVVKQlFXbENMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTNoRExHbENRVUZsTEVWQlFVVXNNa0pCUVZjN1FVRkRNVUlzVjBGQlR5eEZRVUZETEV0QlFVc3NSVUZCUlN4TFFVRkxMRVZCUVVNc1EwRkJRenRIUVVOMlFqdEJRVU5FTEZWQlFWRXNSVUZCUlN4dlFrRkJWenRCUVVOdVFpeFJRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmxCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMGRCUXpORE8wRkJRMFFzWTBGQldTeEZRVUZGTEhkQ1FVRlhPMEZCUTNaQ0xGRkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRIUVVNdlF6dEJRVU5FTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRkpMRXRCUVVzc1JVRkJSU3hGUVVGRExHVkJRV1VzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1IwRkJSeXh0UWtGQmJVSXNSMEZCUnl4RlFVRkZMRVZCUVVVc1RVRkJUU3hGUVVGRkxFbEJRVWtzUlVGQlJTeE5RVUZOTEVWQlFVVXNVMEZCVXl4RlFVRkRMRUZCUVVNc1JVRkJReXhYUVVGWExFVkJRVVVzU1VGQlNTeERRVUZETEZGQlFWRXNRVUZCUXl4RlFVRkRMRmRCUVZjc1JVRkJSU3hKUVVGSkxFTkJRVU1zV1VGQldTeEJRVUZETzAxQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTE8wdEJRVTBzUTBGRGNrMDdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3T3pzN08wRkJUVWdzVTBGQlV5eFJRVUZSTEVkQlFVYzdRVUZEYkVJc1QwRkJTeXhEUVVGRExFMUJRVTBzUTBGRFZpeHZRa0ZCUXl4UlFVRlJMRWxCUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUVVGQlF5eEhRVUZITEVWQlF6bENMRkZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlEzQkRMRU5CUVVNN1EwRkRTQ3hEUVVGRE96dEJRVVZHTEVsQlFVa3NUMEZCVHl4SFFVRkhMRU5CUTFvc1JVRkJSU3hGUVVGRkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVsQlFVa3NSVUZCUlN4VFFVRlRMRVZCUVVVc1NVRkJTU3hGUVVGRkxHbENRVUZwUWl4RlFVRkZMRkZCUVZFc1JVRkJSU3hKUVVGSkxFVkJRVVVzUlVGRGJrVXNSVUZCUlN4RlFVRkZMRVZCUVVVc1EwRkJReXhGUVVGRkxFbEJRVWtzUlVGQlJTeGxRVUZsTEVWQlFVVXNTVUZCU1N4RlFVRkZMRzlDUVVGdlFpeEZRVUZGTEZGQlFWRXNSVUZCUlN4TFFVRkxMRVZCUVVVc1JVRkROMFVzUlVGQlJTeEZRVUZGTEVWQlFVVXNRMEZCUXl4RlFVRkZMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVVzU1VGQlNTeEZRVUZGTEdsQ1FVRnBRaXhGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVXNSVUZEYmtVc1JVRkJSU3hGUVVGRkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVsQlFVa3NSVUZCUlN4VlFVRlZMRVZCUVVVc1NVRkJTU3hGUVVGRkxHbENRVUZwUWl4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVVzUlVGRGNrVXNSVUZCUlN4RlFVRkZMRVZCUVVVc1EwRkJReXhGUVVGRkxFbEJRVWtzUlVGQlJTeFRRVUZUTEVWQlFVVXNTVUZCU1N4RlFVRkZMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVWQlF6VkVMRVZCUVVVc1JVRkJSU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEpRVUZKTEVWQlFVVXNUMEZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSU3hQUVVGUExFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlN4RFFVTjZSQ3hEUVVGRE96dEJRVVZHTEVsQlFVa3NVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTXZRaXhwUWtGQlpTeEZRVUZGTERKQ1FVRlhPMEZCUXpGQ0xGZEJRVTg3UVVGRFRDeGhRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUE8wRkJRek5DTEdkQ1FVRlZMRVZCUVVVc1EwRkJRenRMUVVOa0xFTkJRVU03UjBGRFNEdEJRVU5FTEZkQlFWTXNSVUZCUlN4dFFrRkJVeXhMUVVGTExFVkJRVVU3UVVGRGVrSXNVVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZUTEVkQlFVY3NSVUZCUlR0QlFVTjZReXhUUVVGSExFTkJRVU1zVVVGQlVTeEhRVUZITEVkQlFVY3NRMEZCUXl4RlFVRkZMRXRCUVVzc1MwRkJTeXhEUVVGRE8wRkJRMmhETEdGQlFVOHNSMEZCUnl4RFFVRkRPMHRCUTFvc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR0ZCUVU4c1JVRkJSU3hWUVVGVk8wRkJRMjVDTEdkQ1FVRlZMRVZCUVVVc1MwRkJTenRMUVVOc1FpeERRVUZETEVOQlFVTTdSMEZEU2p0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRlZCUVZVc1EwRkJRenRCUVVObUxGbEJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZPMEZCUXpGQ0xGZEJRVXNzUTBGQlF6dEJRVU5LTEd0Q1FVRlZMRWRCUVVjc2IwSkJRVU1zVTBGQlV5eFBRVUZITEVOQlFVTTdRVUZETTBJc1kwRkJUVHRCUVVGQkxFRkJRMUlzVjBGQlN5eERRVUZETzBGQlEwb3NhMEpCUVZVc1IwRkJSeXh2UWtGQlF5eGhRVUZoTEU5QlFVY3NRMEZCUXp0QlFVTXZRaXhqUVVGTk8wRkJRVUVzUVVGRFVpeFhRVUZMTEVOQlFVTTdRVUZEU2l4clFrRkJWU3hIUVVGSExHOUNRVUZETEUxQlFVMHNUMEZCUnl4RFFVRkRPMEZCUTNoQ0xHTkJRVTA3UVVGQlFTeEJRVU5TTEZkQlFVc3NRMEZCUXp0QlFVTktMR3RDUVVGVkxFZEJRVWNzYjBKQlFVTXNVVUZCVVN4UFFVRkhMRU5CUVVNN1FVRkRNVUlzWTBGQlRUdEJRVUZCTEVGQlExSXNWMEZCU3l4RFFVRkRPMEZCUTBvc2EwSkJRVlVzUjBGQlJ5eHZRa0ZCUXl4UFFVRlBMRTlCUVVjc1EwRkJRenRCUVVONlFpeGpRVUZOTzBGQlFVRXNRVUZEVWl4WFFVRkxMRU5CUVVNN1FVRkRTaXhyUWtGQlZTeEhRVUZITEc5Q1FVRkRMRXRCUVVzc1QwRkJSeXhEUVVGRE8wRkJRM1pDTEdOQlFVMDdRVUZCUVN4QlFVTlNPMEZCUTBVc2EwSkJRVlVzUjBGQlJ5eHZRa0ZCUXl4VFFVRlRMRTlCUVVjc1EwRkJRenRCUVVGQkxFdEJRemxDTzBGQlEwUXNWMEZEUlRzN1VVRkJVeXhUUVVGVExFVkJRVU1zVFVGQlRUdE5RVU4yUWpzN1ZVRkJTeXhUUVVGVExFVkJRVU1zVjBGQlZ6dFJRVU40UWpzN1dVRkJTeXhUUVVGVExFVkJRVU1zVjBGQlZ6dFZRVU40UWpzN1kwRkJTeXhUUVVGVExFVkJRVU1zUzBGQlN6dFpRVU5zUWl4dlFrRkJReXhKUVVGSkxFbEJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhCUVVGRExFVkJRVU1zVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4VFFVRlRMRUZCUVVNc1IwRkJSenRaUVVOb1JUczdaMEpCUVVzc1UwRkJVeXhGUVVGRExEQkdRVUV3Ump0alFVTjJSenM3YTBKQlFVc3NVMEZCVXl4RlFVRkRMR0ZCUVdFN1owSkJRM3BDTEZWQlFWVTdaVUZEVUR0aFFVTkdPMWRCUTBZN1UwRkRSanRSUVVOT0xHOUNRVUZETEZOQlFWTXNUMEZCUnp0UFFVVlVPMHRCUTBVc1EwRkRWanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc1VVRkJVU3hIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVNdlFpeGhRVUZYTEVWQlFVVXNkVUpCUVZjN1FVRkRkRUlzUzBGQlF5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRE8wRkJRM1JDTEV0QlFVTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6dEhRVU4yUWp0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenM3VFVGRFREczdWVUZCVFN4bFFVRlpMRk5CUVZNc1JVRkJReXhMUVVGTExFVkJRVU1zYjBKQlFXOUNMRVZCUVVNc1JVRkJSU3hGUVVGRExGVkJRVlVzUlVGQlF5eFRRVUZUTEVWQlFVTXNhVU5CUVdsRExFVkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4WFFVRlhMRUZCUVVNN08wOUJSVGRJTzB0QlEwZ3NRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVa3NVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTm9ReXhoUVVGWExFVkJRVVVzZFVKQlFWYzdRVUZEZEVJc1MwRkJReXhEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRPMEZCUTNSQ0xFdEJRVU1zUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJRenRIUVVOMlFqdEJRVU5FTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3pzN1RVRkRURHM3VlVGQlRTeGxRVUZaTEZOQlFWTXNSVUZCUXl4TFFVRkxMRVZCUVVNc1owSkJRV2RDTEVWQlFVTXNVMEZCVXl4RlFVRkRMRmRCUVZjc1JVRkJReXhMUVVGTExFVkJRVVVzUlVGQlF5eE5RVUZOTEVWQlFVVXNVMEZCVXl4RlFVRkRMRUZCUVVNc1JVRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEZkQlFWY3NRVUZCUXp0UlFVTjBTQ3c0UWtGQlRTeFRRVUZUTEVWQlFVTXNhVUpCUVdsQ0xFZEJRVkU3VDBGRGNFTTdTMEZEU0N4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCU1N4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUXpOQ0xGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEYUVJc1VVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVk1zUjBGQlJ5eEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTTNSQ3hoUVVORkxHOUNRVUZETEVkQlFVY3NTVUZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVGQlFVTXNSVUZCUXl4SFFVRkhMRVZCUVVVc1IwRkJSeXhEUVVGRExFbEJRVWtzUVVGQlF5eEZRVUZETEVWQlFVVXNSVUZCUlN4SFFVRkhMRU5CUVVNc1NVRkJTU3hCUVVGRExFVkJRVU1zUjBGQlJ5eEZRVUZGTEVkQlFVY3NRVUZCUXl4SFFVRkhMRU5CUXk5Rk8wdEJRMGdzUTBGQlF5eERRVUZETzBGQlEwZ3NWMEZEUlRzN1VVRkJTeXhUUVVGVExFVkJRVU1zYjBOQlFXOURPMDFCUTJwRU96dFZRVUZMTEZOQlFWTXNSVUZCUXl4MVFrRkJkVUlzUlVGQlF5eEpRVUZKTEVWQlFVTXNXVUZCV1R0UlFVTjBSRHM3V1VGQlNTeFRRVUZUTEVWQlFVTXNaMEpCUVdkQ0xFVkJRVU1zU1VGQlNTeEZRVUZETEZOQlFWTTdWVUZETVVNc1dVRkJXVHRUUVVOV08wOUJRMFE3UzBGRFJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeEhRVUZITEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6RkNMR0ZCUVZjc1JVRkJSU3gxUWtGQlZ6dEJRVU4wUWl4UlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU42UXp0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGSkxFbEJRVWtzUlVGQlF5eGpRVUZqTEVWQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSMEZCUnl4UlFVRlJMRWRCUVVjc1JVRkJSU3hCUVVGRE8wMUJRM3BGT3p0VlFVRkhMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRUZCUVVNc1JVRkJReXhwUWtGQlpTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFRkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVTXNTMEZCU3l4RlFVRkRMR1ZCUVZrc1MwRkJTeXhGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4QlFVRkRPMUZCUTNSSUxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrN1QwRkRiRUk3UzBGRFJDeERRVU5NTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeGxRVUZsTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEzUkRMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGUkxGTkJRVk1zUlVGQlF5eGhRVUZoTzAxQlF6ZENPenRWUVVGTExGTkJRVk1zUlVGQlF5eFBRVUZQTzFGQlEzQkNPenRaUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzFWQlEzcENMRGhDUVVGTkxGTkJRVk1zUlVGQlF5eHJRa0ZCYTBJc1IwRkJVVHRUUVVOMFF6dFJRVU5PT3p0WlFVRkxMRk5CUVZNc1JVRkJReXhaUVVGWk8xVkJRM3BDT3p0alFVRkpMRk5CUVZNc1JVRkJReXhsUVVGbE96dFpRVUZqT3pzN08yRkJRV2xDT3p0WFFVRm5RanRUUVVONFJUdFBRVU5HTzB0QlEwTXNRMEZEVkR0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVa3NiVUpCUVcxQ0xFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRekZETEdOQlFWa3NSVUZCUlN4M1FrRkJWenRCUVVOMlFpeFhRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU42UkN4UlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVU0zUlR0QlFVTkVMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUenRCUVVOTUxHZENRVUZWTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVk8wdEJRMnhETEVOQlFVTTdSMEZEU0R0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGFFSXNVVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJReTlFTEdGQlEwVXNiMEpCUVVNc2FVSkJRV2xDTEVsQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFc1FVRkJReXhIUVVGSExFTkJRM3BETzB0QlEwZ3NRMEZCUXl4RFFVRkRPMEZCUTBnc1YwRkRSVHM3VVVGQlN5eFRRVUZUTEVWQlFVTXNNRUpCUVRCQ08wMUJRM1pET3p0VlFVRlBMRTlCUVU4c1JVRkJReXhWUVVGVkxFVkJRVU1zVTBGQlV5eEZRVUZETEhkQ1FVRjNRanM3VDBGQmFVSTdUVUZETjBVN08xVkJRVXNzVTBGQlV5eEZRVUZETEZkQlFWYzdVVUZEZUVJN08xbEJRVkVzVTBGQlV5eEZRVUZETEdOQlFXTXNSVUZCUXl4RlFVRkZMRVZCUVVNc1ZVRkJWU3hGUVVGRExFZEJRVWNzUlVGQlF5eFZRVUZWTEVWQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhaUVVGWkxFRkJRVU03VlVGRGRrWXNZVUZCWVR0VFFVTlFPMDlCUTB3N1MwRkRSaXhEUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJTU3hwUWtGQmFVSXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZEZUVNc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVkVzUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hCUVVGRExFVkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hCUVVGRE8wMUJRekZFTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTTdTMEZET1VJc1EwRkRWRHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc1owSkJRV2RDTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEzWkRMRzFDUVVGcFFpeEZRVUZGTERaQ1FVRlhPMEZCUXpWQ0xFdEJRVU1zUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZETEVkQlFVY3NSVUZCUXl4RFFVRkRMRVZCUVVNc1IwRkJSeXhGUVVGRExFTkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVTXNRMEZCUXl4RlFVRkRMRXRCUVVzc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzBGQlEyaEZMRXRCUVVNc1EwRkJReXgxUWtGQmRVSXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhQUVVGUExFVkJRVVVzVlVGQlV5eERRVUZETEVWQlFVVTdRVUZEYWtRc1QwRkJReXhEUVVGRExFdEJRVXNzUzBGQlN5eERRVUZETEVkQlExZ3NRMEZCUXl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVONFF5eERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkhMRU5CUVVNc1IwRkRXQ3hEUVVGRExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlEzaERMRU5CUVVNc1EwRkJReXhMUVVGTExFdEJRVWNzUTBGQlF5eEhRVU5ZTEVOQlFVTXNRMEZCUXl3d1FrRkJNRUlzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkRlRU1zUTBGQlF5eERRVUZETEV0QlFVc3NTMEZCUnl4RFFVRkRMRWRCUTFnc1EwRkJReXhEUVVGRExEQkNRVUV3UWl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVU40UXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhMUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1MwRkROVVFzUTBGQlF5eERRVUZETzBkQlEwbzdRVUZEUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN1VVRkJTeXhUUVVGVExFVkJRVU1zTUVKQlFUQkNPMDFCUTNaRE96dFZRVUZQTEU5QlFVOHNSVUZCUXl4aFFVRmhMRVZCUVVNc1UwRkJVeXhGUVVGRExIZENRVUYzUWpzN1QwRkJaMEk3VFVGREwwVTdPMVZCUVVzc1UwRkJVeXhGUVVGRExGVkJRVlU3VVVGRGRrSXNLMEpCUVU4c1JVRkJSU3hGUVVGRExITkNRVUZ6UWl4RlFVRkRMRWxCUVVrc1JVRkJReXhOUVVGTkxFZEJRVWM3VDBGRE0wTTdUVUZEVGpzN1ZVRkJTeXhUUVVGVExFVkJRVU1zVlVGQlZUczdVVUZCVXpzN1dVRkJUU3hGUVVGRkxFVkJRVU1zZVVKQlFYbENPenRUUVVGVk96dFBRVUZQTzB0QlEycEdMRU5CUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMR3RDUVVGclFpeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU42UXl4aFFVRlhMRVZCUVVVc2NVSkJRVk1zVVVGQlVTeEZRVUZGTEU5QlFVOHNSVUZCUlR0QlFVTjJReXhYUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSMEZCUnl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNaRUxGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUXl4bFFVRmxMRVZCUVVVc1VVRkJVU3hGUVVGRkxHTkJRV01zUlVGQlJTeFBRVUZQTEVWQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTNKRk8wRkJRMFFzYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQTEVWQlFVTXNaVUZCWlN4RlFVRkZMRWxCUVVrN1FVRkRja0lzYjBKQlFXTXNSVUZCUlN4RlFVRkZPMEZCUTJ4Q0xEQkNRVUZ2UWl4RlFVRkZMRWxCUVVrc1JVRkJReXhEUVVGRE8wZEJRM0pETzBGQlEwUXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc1VVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBkQlEyNUNPMEZCUTBRc1lVRkJWeXhGUVVGRkxIVkNRVUZYTzBGQlEzUkNMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlF5eHZRa0ZCYjBJc1JVRkJSU3hMUVVGTExFVkJRVU1zUTBGQlF5eERRVUZETzBkQlF6bERPMEZCUTBRc1lVRkJWeXhGUVVGRkxIVkNRVUZYTzBGQlEzUkNMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlF5eHZRa0ZCYjBJc1JVRkJSU3hKUVVGSkxFVkJRVU1zUTBGQlF5eERRVUZETzBkQlF6ZERPMEZCUTBRc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRkZCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU5vUWl4UlFVRkpMR2RDUVVGblFpeEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJVeXhGUVVGRkxFVkJRVVVzUTBGQlF5eEZRVUZGTzBGQlF6bEZMRlZCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1ZVRkJWU3hEUVVGRExFVkJRVVU3UVVGRGRFTXNWVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRMnBETzBGQlEwUXNZVUZCVHl4RlFVRkZMRU5CUVVNN1MwRkRXQ3hGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBGQlExQXNVVUZCU1N4aFFVRmhMRWRCUVVjc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZUTEZGQlFWRXNSVUZCUlR0QlFVTTVSU3hoUVVGUExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzB0QlEyNUVMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlV5eFJRVUZSTEVWQlFVVTdRVUZEZUVJc1lVRkRSU3h2UWtGQlF5eHBRa0ZCYVVJc1NVRkJReXhIUVVGSExFVkJRVVVzVVVGQlVTeEJRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFc1FVRkJReXhGUVVGRExGZEJRVmNzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVGQlFVTXNSMEZCUnl4RFFVTTFTVHRMUVVOSUxFTkJRVU1zUTBGQlF6czdPenM3TzBGQlRVZ3NVVUZCU1N4blFrRkJaMElzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdOQlFXTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTNwSExGZEJRMFU3T3p0TlFVTkZPenRWUVVGTExGTkJRVk1zUlVGQlF5d3dRa0ZCTUVJN1VVRkRka003TzFsQlFVOHNVMEZCVXl4RlFVRkRMSGRDUVVGM1FqczdVMEZCYTBJN1VVRkRNMFE3TzFsQlFVc3NVMEZCVXl4RlFVRkRMRlZCUVZVN1ZVRkRka0k3TzJOQlFVc3NVMEZCVXl4RlFVRkRMSFZDUVVGMVFqdFpRVU53UXpzN1owSkJRVXNzVTBGQlV5eEZRVUZETEZsQlFWazdZMEZEZWtJc1lVRkJZVHRoUVVOVU8xZEJRMFk3VTBGRFJqdFJRVU5PT3p0WlFVRkxMRk5CUVZNc1JVRkJReXh4UWtGQmNVSTdWVUZEYkVNN08yTkJRVkVzU1VGQlNTeEZRVUZETEZGQlFWRXNSVUZCUXl4VFFVRlRMRVZCUVVNc2QwSkJRWGRDT3p0WFFVRm5RanRWUVVONFJUczdZMEZCVVN4RlFVRkZMRVZCUVVNc1UwRkJVeXhGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4QlFVRkRMRVZCUVVNc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eEpRVUZKTEVWQlFVTXNVVUZCVVN4RlFVRkRMRk5CUVZNc1JVRkJReXgzUWtGQmQwSXNSVUZCUXl4cFFrRkJZeXhQUVVGUExFVkJRVU1zYVVKQlFXTXNVMEZCVXp0WlFVRkRMRGhDUVVGTkxGTkJRVk1zUlVGQlF5d3dRa0ZCTUVJc1IwRkJVVHM3VjBGQllUdFRRVU40VGp0UFFVTkdPMDFCUTA0c2IwSkJRVU1zYzBKQlFYTkNMRWxCUVVNc1UwRkJVeXhGUVVGRkxHZENRVUZuUWl4QlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNiMEpCUVc5Q0xFRkJRVU1zUlVGQlF5eFhRVUZYTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmRCUVZjc1FVRkJReXhIUVVGSE8wMUJRMnBKTEc5Q1FVRkRMRzlDUVVGdlFpeEpRVUZETEdWQlFXVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUVVGQlF5eEZRVUZETEdOQlFXTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHTkJRV01zUVVGQlF5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRkxHZENRVUZuUWl4QlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRkxFdEJRVXNzUVVGQlF5eEhRVUZITzB0QlEycExMRU5CUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMR2xDUVVGcFFpeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU40UXl4aFFVRlhMRVZCUVVVc2RVSkJRVmM3UVVGRGRFSXNVVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dEhRVU14UWp0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGTkxGTkJRVk1zUlVGQlF5eDNRa0ZCZDBJc1JVRkJReXhIUVVGSExFVkJRVU1zWTBGQll5eEZRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUVVGQlF5eEZRVUZETEVkQlFVY3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUVVGQlF5eEZRVUZETEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVGQlFVTTdUVUZEZGtvc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJRenRMUVVOb1F5eERRVU5RTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeHpRa0ZCYzBJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkROME1zWVVGQlZ5eEZRVUZGTEhWQ1FVRlhPMEZCUTNSQ0xGZEJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVNeFF5eFJRVUZITEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlJUdEJRVU5xUkN4VlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzB0QlF6RkNPMEZCUTBRc1MwRkJReXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzBGQlF5OUNMRmxCUVZFc1JVRkJSU3hEUVVGRE8wZEJRMW83UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeHRRa0ZCYlVJc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE5VUXNWMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXh4UWtGQmNVSXNSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVONlJTeFJRVUZKTEhGQ1FVRnhRaXhIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZUTEZkQlFWY3NSVUZCUlR0QlFVTjZSaXhoUVVGUExHMUNRVUZ0UWl4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTjJSQ3hEUVVGRExFTkJRVU03UVVGRFNDeFhRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMSFZDUVVGMVFpeEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpkRkxGRkJRVWtzWVVGQllTeEhRVUZITEVOQlFVTXNXVUZCV1N4RlFVRkZMR1ZCUVdVc1EwRkJReXhEUVVGRE8wRkJRM0JFTEZGQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRGRFSXNiVUpCUVdFc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdTMEZEYUVNN1FVRkRSQ3hYUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEdWQlFXVXNSMEZCUnl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXpkRUxGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkZMR0ZCUVdFc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVGQlFVTXNSVUZCUXl4RlFVRkZMRVZCUVVNc1pVRkJaVHROUVVONlJEczdWVUZCVHl4VFFVRlRMRVZCUVVNc2QwSkJRWGRDT3p0UFFVRnRRanROUVVNMVJEczdWVUZCU3l4VFFVRlRMRVZCUVVNc1ZVRkJWVHRSUVVWMlFpeHZRa0ZCUXl4WlFVRlpMRWxCUVVNc1QwRkJUeXhGUVVGRExHdENRVUZyUWl4RlFVRkRMRmxCUVZrc1JVRkJSU3hGUVVGRkxFRkJRVU1zUlVGQlF5eFhRVUZYTEVWQlFVVXNjVUpCUVhGQ0xFRkJRVU1zUlVGQlF5eFRRVUZUTEVWQlFVTXNZMEZCWXl4RlFVRkRMRmRCUVZjc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEJRVUZETEVkQlFVYzdUMEZEY2tvN1RVRkRUanM3VlVGQlN5eFRRVUZUTEVWQlFVTXNWVUZCVlR0UlFVTjJRanM3V1VGQlVTeEpRVUZKTEVWQlFVTXNVVUZCVVN4RlFVRkRMRk5CUVZNc1JVRkJReXgzUWtGQmQwSXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUVVGQlF6czdVMEZCWXp0UFFVTTNSanRMUVVOR0xFTkJRMDQ3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxHOUNRVUZ2UWl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTXpReXhuUWtGQll5eEZRVUZGTERCQ1FVRlhPenRCUVVWNlFpeFJRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenRCUVVOc1JDeFpRVUZSTEVWQlFVVXNRMEZCUXp0SFFVTmFPMEZCUTBRc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRkZCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU5vUWl4UlFVRkpMRzlDUVVGdlFpeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRelZGT3p0QlFVVkpMRFJDUVVGRExIZENRVUYzUWl4SlFVRkRMR1ZCUVdVc1JVRkJSU3hSUVVGUkxFRkJRVU1zUjBGQlJ6dFJRVU42UkR0TFFVTklMRU5CUVVNc1EwRkJRenRCUVVOSUxGRkJRVWtzWVVGQllTeEhRVUZITEVOQlFVTXNXVUZCV1N4RlFVRkZMR1ZCUVdVc1EwRkJReXhEUVVGRE8wRkJRM0JFTEZGQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRGRFSXNiVUpCUVdFc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdTMEZEYUVNN1FVRkRSQ3hSUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5VTEZGQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhsUVVGbExFVkJRVVU3UVVGRE4wSXNWVUZCU1N4SFFVTkdPenRWUVVGTExGTkJRVk1zUlVGQlJTeGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhCUVVGRExFVkJRVU1zUlVGQlJTeEZRVUZETEdGQlFXRTdVVUZEZGtRN08xbEJRVXNzVTBGQlV5eEZRVUZETERCQ1FVRXdRanRWUVVOMlF6czdZMEZCU3l4VFFVRlRMRVZCUVVNc1kwRkJZenRaUVVNelFqczdaMEpCUVVzc1UwRkJVeXhGUVVGRExFdEJRVXM3WTBGRGJFSTdPMnRDUVVGTExGTkJRVk1zUlVGQlF5eFZRVUZWTzJkQ1FVTjJRanM3YjBKQlFWRXNTVUZCU1N4RlFVRkRMRkZCUVZFc1JVRkJReXhUUVVGVExFVkJRVU1zZDBKQlFYZENPMnRDUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNaVUZCWlR0cFFrRkJWVHRsUVVNeFJqdGpRVU5PT3p0clFrRkJTeXhUUVVGVExFVkJRVU1zVlVGQlZUdG5Ra0ZEZGtJN08yOUNRVUZKTEZOQlFWTXNSVUZCUXl4aFFVRmhPMnRDUVVONlFqczdPMjlDUVVORk96czdjMEpCUlVVN096czdkVUpCUVRoQ096dHpRa0ZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHTkJRV01zUTBGQlF5eFJRVUZSTEVOQlFVTTdjVUpCUXpkRU8yMUNRVU5NTzJ0Q1FVTk1PenM3YjBKQlEwVTdPenR6UWtGRFJUczdPenQxUWtGQmQwSTdPM05DUVVGblFpeEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWTBGQll5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPM05DUVVGRExDdENRVUZOT3p0elFrRkRla1lzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJUeXhEUVVGRE8zRkNRVU4wUXp0dFFrRkRURHRwUWtGRFJqdGxRVU5FTzJGQlEwWTdWMEZEUmp0VlFVTk9PenM3V1VGRFJUczdPenRoUVVGdFF6dFpRVU5zUXl4dlFrRkJiMEk3VjBGRGJrSTdVMEZEUVR0UlFVTk9PenRaUVVGTExGTkJRVk1zUlVGQlF5eFZRVUZWTzFWQlEzWkNPenRqUVVGUkxFbEJRVWtzUlVGQlF5eFJRVUZSTEVWQlFVTXNTVUZCU1N4RlFVRkRMRkZCUVZFc1JVRkJReXhUUVVGVExFVkJRVU1zYjBOQlFXOURMRVZCUVVNc2FVSkJRV01zVFVGQlRTeEZRVUZETEdsQ1FVRmpMRmxCUVZrc1JVRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEdOQlFXTXNRVUZCUXpzN1YwRkJaMEk3VTBGRE5VczdUMEZEUml4RFFVRkRPMHRCUTFZc1RVRkJUVHRCUVVOTUxGVkJRVWtzUjBGQlJ5dzJRa0ZCU3l4VFFVRlRMRVZCUVVVc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRVUZCUXl4RlFVRkRMRVZCUVVVc1JVRkJReXhoUVVGaExFZEJRVThzUTBGQlF6dExRVU42UlR0QlFVTkVMRmRCUTBVN096dE5RVU5ITEVsQlFVazdTMEZEUml4RFFVTk1PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCU1N4M1FrRkJkMElzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGREwwTXNZVUZCVnl4RlFVRkZMSFZDUVVGWE96dEJRVVYwUWl4UlFVRkpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU53UkN4WlFVRlJMRVZCUVVVc1EwRkJRenRIUVVOYU8wRkJRMFFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFVMHNVMEZCVXl4RlFVRkRMSGRDUVVGM1FpeEZRVUZETEVkQlFVY3NSVUZCUXl4alFVRmpMRVZCUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNaVUZCWlN4QlFVRkRMRVZCUVVNc1IwRkJSeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNaVUZCWlN4QlFVRkRMRVZCUVVNc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmRCUVZjc1FVRkJRenROUVVOeVN5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWlVGQlpTeERRVUZETzB0QlEzWkRMRU5CUTFBN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRhRU1zYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQT3pzN1FVRkhUQ3hsUVVGVExFVkJRVVVzU1VGQlNTeERRVUZETEdWQlFXVTdTMEZEYUVNc1EwRkJRenRIUVVOSU8wRkJRMFFzY1VKQlFXMUNMRVZCUVVVc05rSkJRVk1zVVVGQlVTeEZRVUZGTzBGQlEzUkRMRmRCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTjJSQ3hSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFN1FVRkRiRUlzWlVGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzBkQlEzWkVPMEZCUTBRc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVXNzU1VGQlNTeEZRVUZETEZWQlFWVXNSVUZCUXl4VFFVRlRMRVZCUVVNc2VVSkJRWGxDTEVWQlFVTXNSVUZCUlN4RlFVRkRMRk5CUVZNN1RVRkRia1U3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1VVRkZlRUlzYjBKQlFVTXNaVUZCWlN4UFFVRkhPMUZCUlc1Q096dFpRVUZMTEZOQlFWTXNSVUZCUXl4cFFrRkJhVUk3VlVGSE9VSXNiMEpCUVVNc1owSkJRV2RDTEU5QlFVYzdWVUZGY0VJc2IwSkJRVU1zYTBKQlFXdENMRWxCUVVNc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4QlFVRkRMRVZCUVVNc1dVRkJXU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVGQlFVTXNSMEZCUnp0VFFVVndSanRQUVVOR08wdEJRMFlzUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVWtzWVVGQllTeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU53UXl4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN1VVRkJVeXhKUVVGSkxFVkJRVU1zVlVGQlZTeEZRVUZETEZOQlFWTXNSVUZCUXl4NVFrRkJlVUlzUlVGQlF5eEZRVUZGTEVWQlFVTXNaVUZCWlR0TlFVTTNSVHM3VlVGQlN5eFRRVUZUTEVWQlFVTXNWMEZCVnp0UlFVTjRRanM3V1VGQlVTeFRRVUZUTEVWQlFVTXNZVUZCWVR0VlFVTTNRanM3T3p0WlFVRnJRanM3T3p0aFFVRnRRanM3VjBGQlowSTdVMEZET1VNN1VVRkRWRHM3V1VGQlN5eFRRVUZUTEVWQlFVTXNTMEZCU3p0VlFVTnNRanM3WTBGQlN5eFRRVUZUTEVWQlFVTXNWMEZCVnp0WlFVTjRRanM3WjBKQlFVOHNVMEZCVXl4RlFVRkRMREpDUVVFeVFqdGpRVU14UXpzN08yZENRVU5GT3pzN2EwSkJRMFU3TzNOQ1FVRkpMRTlCUVU4c1JVRkJReXhIUVVGSE8yOUNRVU5pT3pzN08zTkNRVU52UlN3clFrRkJUVHR6UWtGRGVFVTdPenM3ZDBKQlFWYzdPelJDUVVGSExFbEJRVWtzUlVGQlF5eEhRVUZIT3p0NVFrRkJZVHM3ZFVKQlFYZEVPM0ZDUVVONlJqdHRRa0ZEUkR0clFrRkRURHM3TzI5Q1FVTkZPenQzUWtGQlN5eFRRVUZUTEVWQlFVTXNlVUpCUVhsQ08zTkNRVU4wUXpzN01FSkJRVWtzVTBGQlV5eEZRVUZETEdGQlFXRTdkMEpCUTNwQ096czBRa0ZCU1N4VFFVRlRMRVZCUVVNc1dVRkJXVHM3ZVVKQlFWYzdkMEpCUTNKRE96czdNRUpCUVVrN096aENRVUZITEVsQlFVa3NSVUZCUXl4SFFVRkhPenN5UWtGQldUdDVRa0ZCU3p0M1FrRkRhRU03T3pzd1FrRkJTVHM3T0VKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjN096SkNRVUZoTzNsQ1FVRkxPM2RDUVVOcVF6czdPekJDUVVGSk96czRRa0ZCUnl4SlFVRkpMRVZCUVVNc1IwRkJSenM3TWtKQlFXRTdlVUpCUVVzN2QwSkJRMnBET3pzMFFrRkJTU3hUUVVGVExFVkJRVU1zVVVGQlVUc3dRa0ZCUXpzN09FSkJRVWNzU1VGQlNTeEZRVUZETEVkQlFVYzdPekpDUVVGUk8zbENRVUZMTzNWQ1FVTTFRenR4UWtGRFJEdHRRa0ZEU0R0cFFrRkRSanRsUVVORE8yTkJRMUk3T3p0blFrRkRSVHM3TzJ0Q1FVTkZPenR6UWtGQlNTeExRVUZMTEVWQlFVTXNTMEZCU3p0dlFrRkRZanM3ZDBKQlFVMHNVMEZCVXl4RlFVRkRMRFJDUVVFMFFqczdjVUpCUVdNN2JVSkJRM1pFTzJ0Q1FVTk1PenM3YjBKQlEwVTdPM2RDUVVGSkxGTkJRVk1zUlVGQlF5eGhRVUZoTzNOQ1FVTjZRanM3TzNkQ1FVTkZPenM3T3pCQ1FVTlpPenM3T3pKQ1FVRjFRanQ1UWtGRE0wSTdkVUpCUTB3N2MwSkJRMHc3T3p0M1FrRkRSVHM3T3pzd1FrRkRkMEk3T3pzN01rSkJRWGxDTzNsQ1FVTjZRenQxUWtGRFREdHpRa0ZEVERzN08zZENRVU5GT3pzN08zbENRVVZSTzNWQ1FVTk1PM0ZDUVVOR08yMUNRVU5HTzJ0Q1FVTk1PenR6UWtGQlNTeFRRVUZUTEVWQlFVTXNXVUZCV1R0dlFrRkRlRUk3TzNkQ1FVRkxMRk5CUVZNc1JVRkJReXhYUVVGWExFVkJRVU1zU1VGQlNTeEZRVUZETEU5QlFVOHNSVUZCUXl4alFVRlhMRXRCUVVzN2MwSkJRM1JFT3pzd1FrRkJVU3hKUVVGSkxFVkJRVU1zVVVGQlVTeEZRVUZETEZOQlFWTXNSVUZCUXl3d1FrRkJNRUk3ZDBKQlEzaEVMRGhDUVVGTkxGTkJRVk1zUlVGQlF5eGhRVUZoTEVkQlFWRTdkMEpCUTNKRE96czBRa0ZCVFN4VFFVRlRMRVZCUVVNc1YwRkJWenM3ZVVKQlFXVTdkVUpCUTI1RE8zTkNRVU5VT3pzd1FrRkJVU3hKUVVGSkxFVkJRVU1zVVVGQlVTeEZRVUZETEZOQlFWTXNSVUZCUXl4NVFrRkJlVUk3ZDBKQlEzWkVMRGhDUVVGTkxGTkJRVk1zUlVGQlF5eGpRVUZqTEVkQlFWRTdkMEpCUTNSRE96czBRa0ZCVFN4VFFVRlRMRVZCUVVNc1YwRkJWenM3ZVVKQlFXTTdkVUpCUTJ4RE8zRkNRVU5NTzIxQ1FVTklPMmxDUVVOR08yZENRVU5NT3pzN2EwSkJRMFU3TzNOQ1FVRkpMRXRCUVVzc1JVRkJReXhMUVVGTE8yOUNRVU5pT3p0M1FrRkJUU3hUUVVGVExFVkJRVU1zZDBKQlFYZENPenR4UWtGQll6dHRRa0ZEYmtRN2EwSkJRMHc3T3p0dlFrRkRSVHM3ZDBKQlFVa3NVMEZCVXl4RlFVRkRMR0ZCUVdFN2MwSkJRM3BDT3pzN2QwSkJRMFU3T3pzN01FSkJRMWs3T3pzN01rSkJRWFZDTzNsQ1FVTXpRanQxUWtGRFREdHpRa0ZEVERzN08zZENRVU5GT3pzN096QkNRVU4zUWpzN096c3lRa0ZCZVVJN2VVSkJRM3BETzNWQ1FVTk1PM05DUVVOTU96czdkMEpCUTBVN096czdlVUpCUlZFN2RVSkJRMHc3Y1VKQlEwWTdiVUpCUTBZN2EwSkJRMHc3TzNOQ1FVRkpMRk5CUVZNc1JVRkJReXhaUVVGWk8yOUNRVU40UWpzN2QwSkJRVXNzVTBGQlV5eEZRVUZETEZkQlFWY3NSVUZCUXl4SlFVRkpMRVZCUVVNc1QwRkJUeXhGUVVGRExHTkJRVmNzUzBGQlN6dHpRa0ZEZEVRN096QkNRVUZSTEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1UwRkJVeXhGUVVGRExEQkNRVUV3UWp0M1FrRkRlRVFzT0VKQlFVMHNVMEZCVXl4RlFVRkRMR0ZCUVdFc1IwRkJVVHQzUWtGRGNrTTdPelJDUVVGTkxGTkJRVk1zUlVGQlF5eFhRVUZYT3p0NVFrRkJaVHQxUWtGRGJrTTdjMEpCUTFRN096QkNRVUZSTEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1UwRkJVeXhGUVVGRExIbENRVUY1UWp0M1FrRkRka1FzT0VKQlFVMHNVMEZCVXl4RlFVRkRMR05CUVdNc1IwRkJVVHQzUWtGRGRFTTdPelJDUVVGTkxGTkJRVk1zUlVGQlF5eFhRVUZYT3p0NVFrRkJZenQxUWtGRGJFTTdjVUpCUTB3N2JVSkJRMGc3YVVKQlEwWTdaMEpCUTB3N096dHJRa0ZEUlRzN2MwSkJRVWtzUzBGQlN5eEZRVUZETEV0QlFVczdiMEpCUTJJN08zZENRVUZOTEZOQlFWTXNSVUZCUXl3MFFrRkJORUk3TzNGQ1FVRnRRanR0UWtGRE5VUTdhMEpCUTB3N096dHZRa0ZEUlRzN2QwSkJRVWtzVTBGQlV5eEZRVUZETEdGQlFXRTdjMEpCUTNwQ096czdkMEpCUTBVN096czdNRUpCUTFrN096czdNa0pCUVhWQ08zbENRVU16UWp0MVFrRkRURHR6UWtGRFREczdPM2RDUVVORk96czdPekJDUVVOM1FqczdPenN5UWtGQmVVSTdlVUpCUTNwRE8zVkNRVU5NTzNOQ1FVTk1PenM3ZDBKQlEwVTdPenM3ZVVKQlJWRTdkVUpCUTB3N2NVSkJRMFk3YlVKQlEwWTdhMEpCUTB3N08zTkNRVUZKTEZOQlFWTXNSVUZCUXl4WlFVRlpPMjlDUVVONFFqczdkMEpCUVVzc1UwRkJVeXhGUVVGRExGZEJRVmNzUlVGQlF5eEpRVUZKTEVWQlFVTXNUMEZCVHl4RlFVRkRMR05CUVZjc1MwRkJTenR6UWtGRGRFUTdPekJDUVVGUkxFbEJRVWtzUlVGQlF5eFJRVUZSTEVWQlFVTXNVMEZCVXl4RlFVRkRMREJDUVVFd1FqdDNRa0ZEZUVRc09FSkJRVTBzVTBGQlV5eEZRVUZETEdGQlFXRXNSMEZCVVR0M1FrRkRja003T3pSQ1FVRk5MRk5CUVZNc1JVRkJReXhYUVVGWE96dDVRa0ZCWlR0MVFrRkRia003YzBKQlExUTdPekJDUVVGUkxFbEJRVWtzUlVGQlF5eFJRVUZSTEVWQlFVTXNVMEZCVXl4RlFVRkRMSGxDUVVGNVFqdDNRa0ZEZGtRc09FSkJRVTBzVTBGQlV5eEZRVUZETEdOQlFXTXNSMEZCVVR0M1FrRkRkRU03T3pSQ1FVRk5MRk5CUVZNc1JVRkJReXhYUVVGWE96dDVRa0ZCWXp0MVFrRkRiRU03Y1VKQlEwdzdiVUpCUTBnN2FVSkJRMFk3WlVGRFF6dGhRVU5HTzFsQlExSTdPMmRDUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzJOQlEzcENPenRyUWtGQlNTeFRRVUZUTEVWQlFVTXNXVUZCV1R0blFrRkRlRUk3TzI5Q1FVRkpMRk5CUVZNc1JVRkJReXhWUVVGVk8ydENRVUZET3p0elFrRkJSeXhqUVVGWExGVkJRVlVzUlVGQlF5eEpRVUZKTEVWQlFVTXNSMEZCUnp0dlFrRkJRenM3ZDBKQlFVMHNaVUZCV1N4TlFVRk5PenR4UWtGQmEwSTdiVUpCUVVrN2FVSkJRVXM3WjBKQlF6bEhPenR2UWtGQlNTeFRRVUZUTEVWQlFVTXNVVUZCVVR0clFrRkJRenM3YzBKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjN08yOUNRVUZIT3p0M1FrRkJUU3hUUVVGVExFVkJRVU1zVTBGQlV6czdjVUpCUVdsQ08yMUNRVUZKTzJsQ1FVRkxPMmRDUVVONFJqczdPMnRDUVVGSk96dHpRa0ZCUnl4SlFVRkpMRVZCUVVNc1IwRkJSenM3YlVKQlFVMDdhVUpCUVVzN1owSkJRekZDT3pzN2EwSkJRVWs3TzNOQ1FVRkhMRWxCUVVrc1JVRkJReXhIUVVGSE96dHRRa0ZCVFR0cFFrRkJTenRuUWtGRE1VSTdPenRyUWtGQlNUczdjMEpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWM3TzIxQ1FVRk5PMmxDUVVGTE8yZENRVU14UWpzN08ydENRVUZKT3p0elFrRkJSeXhKUVVGSkxFVkJRVU1zUjBGQlJ6czdiVUpCUVUwN2FVSkJRVXM3WjBKQlF6RkNPenM3YTBKQlFVazdPM05DUVVGSExHTkJRVmNzVFVGQlRTeEZRVUZETEVsQlFVa3NSVUZCUXl4SFFVRkhPMjlDUVVGRE96dDNRa0ZCVFN4bFFVRlpMRTFCUVUwN08zRkNRVUZqTzIxQ1FVRkpPMmxDUVVGTE8yVkJRemxGTzJGQlEwUTdWMEZEUmp0VFFVTkdPMDlCUTBZN1MwRkRSU3hEUVVOV08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJTU3hOUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRemRDTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRlRMRWxCUVVrc1JVRkJReXhWUVVGVkxFVkJRVU1zVTBGQlV5eEZRVUZETEhsQ1FVRjVRaXhGUVVGRExFVkJRVVVzUlVGQlF5eFJRVUZSTzAxQlEzUkZPenRWUVVGTExGTkJRVk1zUlVGQlF5eFhRVUZYTzFGQlEzaENPenRaUVVGUkxGTkJRVk1zUlVGQlF5eGhRVUZoTzFWQlF6ZENPenM3TzFkQlFXMUVPMU5CUXpWRE8xRkJRMVE3TzFsQlFVc3NVMEZCVXl4RlFVRkRMRXRCUVVzN1ZVRkRiRUk3TzJOQlFVc3NVMEZCVXl4RlFVRkRMRzFDUVVGdFFqdFpRVU5vUXpzN1owSkJRVWNzVTBGQlV5eEZRVUZETEUxQlFVMDdPMkZCUVRKQ08xbEJRemxET3p0blFrRkJTeXhUUVVGVExFVkJRVU1zVjBGQlZ6dGpRVU40UWpzN096dGxRVUV5UWpzN1kwRkJjVUlzSzBKQlFVMDdZMEZEZEVRN096czdaVUZCWjBNN08yRkJRelZDTzFsQlEwNDdPMmRDUVVGSExFbEJRVWtzUlVGQlF5eEhRVUZITEVWQlFVTXNVMEZCVXl4RlFVRkRMRzFEUVVGdFF6czdZVUZCV1R0WFFVTnFSVHRWUVVOT096dGpRVUZMTEZOQlFWTXNSVUZCUXl4dFEwRkJiVU03V1VGRGFFUTdPMmRDUVVGSExGTkJRVk1zUlVGQlF5eE5RVUZOT3p0aFFVRnhRenRaUVVONFJEczdaMEpCUVVzc1UwRkJVeXhGUVVGRExGZEJRVmM3WTBGRGVFSTdPenM3WlVGQk1rSTdPMk5CUVhGQ0xDdENRVUZOTzJOQlEzUkVPenM3TzJWQlFXZERPenRoUVVNMVFqdFpRVU5PT3p0blFrRkJSeXhKUVVGSkxFVkJRVU1zUjBGQlJ5eEZRVUZETEZOQlFWTXNSVUZCUXl4dFEwRkJiVU03TzJGQlFWYzdWMEZEYUVVN1UwRkRSanRSUVVOT0xDdENRVUZOTzFGQlEwNDdPMWxCUVVzc1UwRkJVeXhGUVVGRExFdEJRVXM3VlVGRGJFSTdPMk5CUVVzc1UwRkJVeXhGUVVGRExHOUNRVUZ2UWp0WlFVTnFRenM3T3p0aFFVRnpRanRaUVVOMFFqczdPenRoUVVGelVEdFpRVU4wVURzN1owSkJRVXNzVTBGQlV5eEZRVUZETEZkQlFWYzdZMEZEZUVJN08ydENRVUZITEVsQlFVa3NSVUZCUXl4SFFVRkhMRVZCUVVNc1UwRkJVeXhGUVVGRExIZENRVUYzUWpzN1pVRkJlVUk3WTBGRGRrVTdPMnRDUVVGSExFbEJRVWtzUlVGQlF5eEhRVUZITEVWQlFVTXNVMEZCVXl4RlFVRkRMSGRDUVVGM1FqczdaVUZCZDBJN1lVRkRiRVU3V1VGRFRqczdaMEpCUVVzc1UwRkJVeXhGUVVGRExGbEJRVms3TzJOQlExUTdPMnRDUVVGSExFbEJRVWtzUlVGQlF5eEhRVUZITEVWQlFVTXNVMEZCVXl4RlFVRkRMSGRDUVVGM1FqczdaVUZCTUVJN1lVRkRjRVk3VjBGRFJqdFRRVU5HTzA5QlEwWTdTMEZEUlN4RFFVTldPMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUXk5Q0xGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhYUVVORk96dFJRVUZUTEVsQlFVa3NSVUZCUXl4VlFVRlZMRVZCUVVNc1UwRkJVeXhGUVVGRExIbENRVUY1UWl4RlFVRkRMRVZCUVVVc1JVRkJReXhWUVVGVk8wMUJRM2hGT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8xRkJRM2hDT3p0WlFVRlJMRk5CUVZNc1JVRkJReXhoUVVGaE8xVkJRemRDT3pzN08xbEJRV0U3T3pzN1lVRkJhVUk3TzFkQlFXZENPMVZCUXpsRE96czdPMWRCUVhGRU8xTkJRemxETzFGQlExUTdPMWxCUVVzc1UwRkJVeXhGUVVGRExHbENRVUZwUWp0VlFVTTVRanM3WTBGQlN5eFRRVUZUTEVWQlFVTXNNRUpCUVRCQ08xbEJRM1pET3p0blFrRkJUeXhQUVVGUExFVkJRVU1zYVVKQlFXbENMRVZCUVVNc1UwRkJVeXhGUVVGRExHMUVRVUZ0UkRzN1lVRkJkMEk3V1VGRGRFZzdPMmRDUVVGTExGTkJRVk1zUlVGQlF5eHhRMEZCY1VNN1kwRkRiRVFzSzBKQlFVOHNTVUZCU1N4RlFVRkRMRlZCUVZVc1JVRkJReXhKUVVGSkxFVkJRVU1zYVVKQlFXbENMRVZCUVVNc1UwRkJVeXhGUVVGRExGRkJRVkVzUjBGQlJ6dGhRVU12UkR0WFFVTkdPMVZCUTA0c0swSkJRVTA3VlVGRFRqczdZMEZCU3l4VFFVRlRMRVZCUVVNc01FSkJRVEJDTzFsQlEzWkRPenRuUWtGQlR5eFBRVUZQTEVWQlFVTXNVMEZCVXl4RlFVRkRMRk5CUVZNc1JVRkJReXh0UkVGQmJVUTdPMkZCUVdkQ08xbEJRM1JIT3p0blFrRkJTeXhUUVVGVExFVkJRVU1zY1VOQlFYRkRPMk5CUTJ4RU96dHJRa0ZCVVN4VFFVRk5MR05CUVdNc1JVRkJReXhGUVVGRkxFVkJRVU1zVTBGQlV6dG5Ra0ZEZGtNN096czdhVUpCUVN0Q08yZENRVU12UWpzN096dHBRa0ZCTmtJN1pVRkRkRUk3WVVGRFREdFhRVU5HTzFWQlEwNHNLMEpCUVUwN1ZVRkRUanM3WTBGQlN5eFRRVUZUTEVWQlFVTXNNRUpCUVRCQ08xbEJRM1pET3p0blFrRkJUeXhQUVVGUExFVkJRVU1zVlVGQlZTeEZRVUZETEZOQlFWTXNSVUZCUXl4dFJFRkJiVVE3TzJGQlFXbENPMWxCUTNoSE96dG5Ra0ZCU3l4VFFVRlRMRVZCUVVNc2NVTkJRWEZETzJOQlEyeEVMQ3RDUVVGUExFbEJRVWtzUlVGQlF5eFZRVUZWTEVWQlFVTXNTVUZCU1N4RlFVRkRMRlZCUVZVc1JVRkJReXhUUVVGVExFVkJRVU1zVVVGQlVTeEhRVUZITzJGQlEzaEVPMWRCUTBZN1ZVRkRUaXdyUWtGQlRUdFZRVU5PT3p0alFVRkxMRk5CUVZNc1JVRkJReXd3UWtGQk1FSTdXVUZEZGtNN08yZENRVUZQTEU5QlFVOHNSVUZCUXl4UlFVRlJMRVZCUVVNc1UwRkJVeXhGUVVGRExHMUVRVUZ0UkRzN1kwRkJiVUk3T3pzN1pVRkJhVUk3TzJOQlFVTTdPenM3WlVGQmFVSTdZVUZCVVR0WlFVTnVTanM3WjBKQlFVc3NVMEZCVXl4RlFVRkRMSEZEUVVGeFF6dGpRVU5zUkRzN2EwSkJRVWNzU1VGQlNTeEZRVUZETEVkQlFVY3NSVUZCUXl4VFFVRlRMRVZCUVVNc2RVSkJRWFZDT3p0bFFVRlhPMkZCUTNCRU8xZEJRMFk3VTBGRFJqdFBRVU5HTzB0QlEwVXNRMEZEVmp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVa3NUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTTVRaXhSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3VVVGQlV5eEpRVUZKTEVWQlFVTXNWVUZCVlN4RlFVRkRMRk5CUVZNc1JVRkJReXg1UWtGQmVVSXNSVUZCUXl4RlFVRkZMRVZCUVVNc1UwRkJVenROUVVOMlJUczdWVUZCU3l4VFFVRlRMRVZCUVVNc1YwRkJWenRSUVVONFFqczdXVUZCVVN4VFFVRlRMRVZCUVVNc1lVRkJZVHRWUVVNM1FqczdPenRYUVVGblFqdFRRVU5VTzFGQlExUTdPMWxCUVVzc1UwRkJVeXhGUVVGRExFdEJRVXM3VlVGRGJFSTdPMk5CUVVzc1UwRkJVeXhGUVVGRExGZEJRVmM3V1VGRGVFSTdPMmRDUVVGSExGTkJRVk1zUlVGQlF5eE5RVUZOT3p0aFFVRnZURHRaUVVOMlRUczdPenRoUVVGelREdFhRVU5zVER0VFFVTkdPMDlCUTBZN1MwRkRSU3hEUVVOV08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJTU3hMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRelZDTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRlRMRWxCUVVrc1JVRkJReXhWUVVGVkxFVkJRVU1zVTBGQlV5eEZRVUZETEhsQ1FVRjVRaXhGUVVGRExFVkJRVVVzUlVGQlF5eFBRVUZQTzAxQlEzSkZPenRWUVVGTExGTkJRVk1zUlVGQlF5eFhRVUZYTzFGQlEzaENPenRaUVVGUkxGTkJRVk1zUlVGQlF5eGhRVUZoTzFWQlF6ZENMRFpDUVVGTExFZEJRVWNzUlVGQlF5eDVRa0ZCZVVJc1JVRkJReXhIUVVGSExFVkJRVU1zUlVGQlJTeEhRVUZITzFOQlEzSkRPMDlCUTB3N1MwRkRSU3hEUVVOV08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1VVRkJVU3hGUVVGRkxFTkJRVU1pTENKbWFXeGxJam9pTDJodmJXVXZjRzlzWVhKcGN5OXlkVzF0WVdkcGJtZGZjbTkxYm1RdmJtOWtaUzVxY3k5MGNDMXlaV0ZqZEM5d2RXSnNhV012YW5NdmRtUnVZVzFsYm5VdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUoyWVhJZ1pHRjBZU0E5SUhKbGNYVnBjbVVvSjNaa2JtRXZjM1JoZEdsalgyUmhkR0VuS1R0Y2NseHVMeThnZG1GeUlFRjFkRzlqYjIxd2JHVjBaU0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBMV0YxZEc5amIyMXdiR1YwWlM5c2FXSXZiV0ZwYmk1cWN5Y3BPMXh5WEc0dkx5QjJZWElnUTI5dFltOWliM2dnUFNCQmRYUnZZMjl0Y0d4bGRHVXVRMjl0WW05aWIzZzdYSEpjYmk4dklIWmhjaUJEYjIxaWIySnZlRTl3ZEdsdmJpQTlJRUYxZEc5amIyMXdiR1YwWlM1RGIyMWliMkp2ZUU5d2RHbHZianRjY2x4dVhISmNiaTh2SUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNjbHh1THk4Z1FYVjBiMk52YlhCc1pYUmxJR052WkdWY2NseHVMeThnTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHlYRzVjY2x4dWRtRnlJRUYxZEc5amIyMXdiR1YwWlNBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNjbHh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5elpYUkpibkIxZEVaeWIyMVdZV3gxWlNncE8xeHlYRzRnSUNBZ2RtRnlJR2hwWjJoc2FXZG9kR1ZrU1c1a1pYZzdYSEpjYmlBZ0lDQjJZWElnZEdoaGRDQTlJSFJvYVhNN1hISmNiaUFnSUNCa2IyTjFiV1Z1ZEM1dmJtdGxlV1J2ZDI0Z1BTQm1kVzVqZEdsdmJpaGxLU0I3WEhKY2JpQWdJQ0FnSUhOM2FYUmphQ2hsTG10bGVVTnZaR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpZWE5sSURFek9pQXZMeUJsYm5SbGNpNWNjbHh1SUNBZ0lDQWdJQ0FnSUdOdmJuTnZiR1V1Ykc5bktDZEZUbFJGVWlFbktUdGNjbHh1SUNBZ0lDQWdJQ0FnSUhSb1lYUXVjSEp2Y0hNdVlXUmtUR2xyWlVSdmJtVW9LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lHSnlaV0ZyTzF4eVhHNGdJQ0FnSUNBZ0lHTmhjMlVnT1RvZ0x5OGdkR0ZpWEhKY2JpQWdJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExteHZaeWduVkVGQ0lTY3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ2RHaGhkQzVmYzJWMFJuSnZiVWhwWjJoc2FXZG9kR1ZrS0NrN1hISmNiaUFnSUNBZ0lDQWdJQ0JpY21WaGF6dGNjbHh1SUNBZ0lDQWdJQ0JqWVhObElETTRPaUF2THlCMWNGeHlYRzRnSUNBZ0lDQWdJQ0FnYUdsbmFHeHBaMmgwWldSSmJtUmxlQ0E5SUhSb1lYUXVYMmhwWjJoc2FXZG9kR1ZrU1c1a1pYZ29LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lHTnZibk52YkdVdWJHOW5LQ2RWVUNFZ0p5QXJJR2hwWjJoc2FXZG9kR1ZrU1c1a1pYZ3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ2FXWW9hR2xuYUd4cFoyaDBaV1JKYm1SbGVDQStJREFwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoaGRDNXpaWFJUZEdGMFpTaDdhR2xuYUd4cFoyaDBaV1JXWVd4MVpUb2dkR2hoZEM1ZlkzVnljbVZ1ZEUxaGRHTm9aWE1vS1Z0b2FXZG9iR2xuYUhSbFpFbHVaR1Y0SUMwZ01WMTlLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUdOaGMyVWdOREE2SUM4dklHUnZkMjVjY2x4dUlDQWdJQ0FnSUNBZ0lHaHBaMmhzYVdkb2RHVmtTVzVrWlhnZ1BTQjBhR0YwTGw5b2FXZG9iR2xuYUhSbFpFbHVaR1Y0S0NrN1hISmNiaUFnSUNBZ0lDQWdJQ0JqYjI1emIyeGxMbXh2WnlnblJFOVhUaUVnSnlBcklHaHBaMmhzYVdkb2RHVmtTVzVrWlhncE8xeHlYRzRnSUNBZ0lDQWdJQ0FnYVdZb2FHbG5hR3hwWjJoMFpXUkpibVJsZUNBOVBUMGdMVEVwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoaGRDNXpaWFJUZEdGMFpTaDdhR2xuYUd4cFoyaDBaV1JXWVd4MVpUb2dkR2hoZEM1ZlkzVnljbVZ1ZEUxaGRHTm9aWE1vS1Zzd1hYMHBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUtHaHBaMmhzYVdkb2RHVmtTVzVrWlhnZ1BDQjBhR0YwTGw5amRYSnlaVzUwVFdGMFkyaGxjeWdwTG14bGJtZDBhQ0F0SURFcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaGhkQzV6WlhSVGRHRjBaU2g3YUdsbmFHeHBaMmgwWldSV1lXeDFaVG9nZEdoaGRDNWZZM1Z5Y21WdWRFMWhkR05vWlhNb0tWdG9hV2RvYkdsbmFIUmxaRWx1WkdWNElDc2dNVjE5S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNBZ0lHSnlaV0ZyTzF4eVhHNGdJQ0FnSUNCOVhISmNiaUFnSUNCOU8xeHlYRzRnSUgwc1hISmNiaUFnWjJWMFJHVm1ZWFZzZEZCeWIzQnpPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUI3WEhKY2JpQWdJQ0FnSUdSbFptRjFiSFJXWVd4MVpUb2dKMkZ3Y0d4bEp5eGNjbHh1SUNBZ0lDQWdiR2x0YVhSVWIweHBjM1E2SUhSeWRXVXNYSEpjYmlBZ0lDQWdJRzFoZUVsMFpXMXpVMmh2ZDI0NklEZ3NYSEpjYmlBZ0lDQWdJSE52ZFhKalpWVnliRG9nYm5Wc2JDeGNjbHh1SUNBZ0lDQWdaR1ZtWVhWc2RFeHBjM1E2SUZzZ0oyRndjR3hsSnl3Z0oySmhibUZ1WVNjc0lDZHZjbUZ1WjJVbkxDQW5aM0poY0dVbkxDQW5ZMmhsY25KNUp5QmRMRnh5WEc0Z0lDQWdJQ0JoYkhOdlUyVmhjbU5vVm1Gc2RXVnpPaUJtWVd4elpTeGNjbHh1SUNBZ0lDQWdiRzloWkZWeWJFOXVZMlU2SUhSeWRXVXNYSEpjYmlBZ0lDQWdJSE5sYkdWamRFRnNiRlJsZUhSUGJrTnNhV05yT2lCMGNuVmxMRnh5WEc0Z0lDQWdJQ0J2Yms1dlRXRjBZMmc2SUdaMWJtTjBhVzl1S0hOMFlYUmxLU0I3ZlZ4eVhHNGdJQ0FnZlR0Y2NseHVJQ0I5TEZ4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdJQ0JzYVhOME9pQjBhR2x6TG5CeWIzQnpMbVJsWm1GMWJIUk1hWE4wTEZ4eVhHNGdJQ0FnSUNCamRYSnlaVzUwVm1Gc2RXVTZJSFJvYVhNdWNISnZjSE11WkdWbVlYVnNkRlpoYkhWbExGeHlYRzRnSUNBZ0lDQm9hV2RvYkdsbmFIUmxaRlpoYkhWbE9pQjBhR2x6TG5CeWIzQnpMbVJsWm1GMWJIUldZV3gxWlN4Y2NseHVJQ0FnSUNBZ2MyaHZkMFZ1ZEhKcFpYTTZJR1poYkhObFhISmNiaUFnSUNCOU8xeHlYRzRnSUgwc1hISmNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhaaGNpQmxiblJ5YVdWeklEMGdkR2hwY3k1emRHRjBaUzV6YUc5M1JXNTBjbWxsY3lBL1hISmNiaUFnSUNBZ0lDQWdJQ0E4YjJ3Z2MzUjViR1U5ZTN0d2IzTnBkR2x2YmpvZ0oyRmljMjlzZFhSbEp5d2dZbUZqYTJkeWIzVnVaRU52Ykc5eU9pQW5kMmhwZEdVbkxDQmpiMnh2Y2pvZ0oySnNZV05ySnl3Z2JHbHpkRk4wZVd4bE9pQW5ibTl1WlNjc0lIQmhaR1JwYm1jNklEQXNJRzFoY21kcGJqb2dNSDE5SUc5dVRXOTFjMlZNWldGMlpUMTdkR2hwY3k1ZmIyNUZiblJ5ZVUxdmRYTmxUM1YwZlQ1N2RHaHBjeTVmY21WdVpHVnlUV0YwWTJobGN5Z3BmVHd2YjJ3K0lEb2dKeWM3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHhwYm5CMWRDQnBaRDE3ZEdocGN5NXdjbTl3Y3k1cGJuQjFkRWxrZlNCamJHRnpjMDVoYldVOWUzUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxmU0J5WldZOVhDSmhkWFJ2U1c1d2RYUmNJaUJ2YmtOb1lXNW5aVDE3ZEdocGN5NWZiMjVEYUdGdVoyVjlJRzl1Um05amRYTTllM1JvYVhNdVgyOXVSbTlqZFhOOUlHOXVRbXgxY2oxN2RHaHBjeTVmYjI1Q2JIVnlmU0J2YmtOc2FXTnJQWHQwYUdsekxsOXZia2x1Y0hWMFEyeHBZMnQ5SUM4K1hISmNiaUFnSUNBZ0lDQWdlMlZ1ZEhKcFpYTjlYSEpjYmlBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOUxGeHlYRzRnSUY5amRYSnlaVzUwVFdGMFkyaGxjem9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdkR2hoZENBOUlIUm9hWE03WEhKY2JpQWdJQ0IyWVhJZ1kyMGdQU0IwYUdsekxuTjBZWFJsTG14cGMzUXVabWxzZEdWeUtHWjFibU4wYVc5dUtHVnVkSEo1S1NCN1hISmNiaUFnSUNBZ0lISmxkSFZ5YmlCbGJuUnllUzVwYm1SbGVFOW1LSFJvWVhRdVgybHVjSFYwS0NrcElENGdMVEU3WEhKY2JpQWdJQ0I5S1R0Y2NseHVJQ0FnSUhKbGRIVnliaUJqYlR0Y2NseHVJQ0I5TEZ4eVhHNGdJRjlwYm5CMWREb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JwWmlnaGRHaHBjeTVwYzAxdmRXNTBaV1FvS1NrZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z0p5YzdYSEpjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z1VtVmhZM1F1Wm1sdVpFUlBUVTV2WkdVb2RHaHBjeTV5WldaekxtRjFkRzlKYm5CMWRDa3VkbUZzZFdVN1hISmNiaUFnSUNCOVhISmNiaUFnZlN4Y2NseHVJQ0JmY21WdVpHVnlUV0YwWTJobGN6b2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IyWVhJZ2RHaGhkQ0E5SUhSb2FYTTdYSEpjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmWTNWeWNtVnVkRTFoZEdOb1pYTW9LUzV6YkdsalpTZ3dMQ0IwYUdsekxuQnliM0J6TG0xaGVFbDBaVzF6VTJodmQyNHBMbTFoY0NobWRXNWpkR2x2YmlobGJuUnllU3dnYVc1a1pYZ3BJSHRjY2x4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnSUNBOFFYVjBiMk52YlhCc1pYUmxSVzUwY25rZ2FHbG5hR3hwWjJoMFpXUTllMlZ1ZEhKNUlEMDlQU0IwYUdGMExuTjBZWFJsTG1ocFoyaHNhV2RvZEdWa1ZtRnNkV1Y5SUd0bGVUMTdaVzUwY25sOUlIWmhiSFZsUFh0bGJuUnllWDBnYjI1RmJuUnllVU5zYVdOclBYdDBhR0YwTGw5dmJrVnVkSEo1UTJ4cFkydDlJRzl1Ulc1MGNubE5iM1Z6WlU5MlpYSTllM1JvWVhRdVgyOXVSVzUwY25sTmIzVnpaVTkyWlhKOUlDOCtYSEpjYmlBZ0lDQWdJQ2s3WEhKY2JpQWdJQ0I5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJRjlvYVdkb2JHbG5hSFJsWkVsdVpHVjRPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhaaGNpQjBhR0YwSUQwZ2RHaHBjenRjY2x4dUlDQWdJSFpoY2lCbWIzVnVaRWx1WkdWNElEMGdMVEU3WEhKY2JpQWdJQ0IwYUdsekxsOWpkWEp5Wlc1MFRXRjBZMmhsY3lncExtWnZja1ZoWTJnb1puVnVZM1JwYjI0b1pXNTBjbmtzSUdsdVpHVjRLU0I3WEhKY2JpQWdJQ0FnSUdsbUtHVnVkSEo1SUQwOVBTQjBhR0YwTG5OMFlYUmxMbWhwWjJoc2FXZG9kR1ZrVm1Gc2RXVXBJSHRjY2x4dUlDQWdJQ0FnSUNCbWIzVnVaRWx1WkdWNElEMGdhVzVrWlhnN1hISmNiaUFnSUNBZ0lIMWNjbHh1SUNBZ0lIMHBPMXh5WEc0Z0lDQWdjbVYwZFhKdUlHWnZkVzVrU1c1a1pYZzdYSEpjYmlBZ2ZTeGNjbHh1SUNCZmRYQmtZWFJsU0dsbmFHeHBaMmgwWldSV1lXeDFaVG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdibVYzVm1Gc2RXVTdYSEpjYmlBZ0lDQjJZWElnYUdsbmFHeHBaMmgwWldSSmJtUmxlQ0E5SUhSb2FYTXVYMmhwWjJoc2FXZG9kR1ZrU1c1a1pYZ29LVHRjY2x4dUlDQWdJR2xtS0docFoyaHNhV2RvZEdWa1NXNWtaWGdnUENBd0tTQjdYSEpjYmlBZ0lDQWdJRzVsZDFaaGJIVmxJRDBnZEdocGN5NXpkR0YwWlM1c2FYTjBXekJkTzF4eVhHNGdJQ0FnZlNCbGJITmxJSHRjY2x4dUlDQWdJQ0FnYm1WM1ZtRnNkV1VnUFNCMGFHbHpMbk4wWVhSbExteHBjM1JiYUdsbmFHeHBaMmgwWldSSmJtUmxlRjA3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdG9hV2RvYkdsbmFIUmxaRlpoYkhWbE9pQnVaWGRXWVd4MVpYMHBPMXh5WEc0Z0lIMHNYSEpjYmlBZ1gzTmxkRWx1Y0hWMFJuSnZiVlpoYkhWbE9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJRkpsWVdOMExtWnBibVJFVDAxT2IyUmxLSFJvYVhNdWNtVm1jeTVoZFhSdlNXNXdkWFFwTG5aaGJIVmxJRDBnZEdocGN5NXpkR0YwWlM1amRYSnlaVzUwVm1Gc2RXVTdYSEpjYmlBZ2ZTeGNjbHh1SUNCZmMyVjBWbUZzZFdWR2NtOXRTVzV3ZFhRNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkbUZ5SUdsdWNIVjBWR1Y0ZENBOUlGSmxZV04wTG1acGJtUkVUMDFPYjJSbEtIUm9hWE11Y21WbWN5NWhkWFJ2U1c1d2RYUXBMblpoYkhWbE8xeHlYRzRnSUNBZ2RtRnlJR1p2ZFc1a1JXNTBjbWxsY3lBOUlIUm9hWE11YzNSaGRHVXViR2x6ZEM1bWFXeDBaWElvWm5WdVkzUnBiMjRvWlc1MGNua3BJSHRjY2x4dUlDQWdJQ0FnY21WMGRYSnVJR1Z1ZEhKNUxtbHVaR1Y0VDJZb2FXNXdkWFJVWlhoMEtTQStJQzB4TzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnSUNCcFppaG1iM1Z1WkVWdWRISnBaWE11YkdWdVozUm9JRDRnTUNrZ2UxeHlYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2NseHVJQ0FnSUNBZ0lDQmpkWEp5Wlc1MFZtRnNkV1U2SUdadmRXNWtSVzUwY21sbGMxc3dYU3hjY2x4dUlDQWdJQ0FnSUNCb2FXZG9iR2xuYUhSbFpGWmhiSFZsT2lCbWIzVnVaRVZ1ZEhKcFpYTmJNRjFjY2x4dUlDQWdJQ0FnZlNrN1hISmNiaUFnSUNCOUlHVnNjMlVnZTF4eVhHNGdJQ0FnSUNCMGFHbHpMbkJ5YjNCekxtOXVUbTlOWVhSamFDaDBhR2x6TG5OMFlYUmxLVHRjY2x4dUlDQWdJQ0FnYVdZb2RHaHBjeTV3Y205d2N5NXNhVzFwZEZSdlRHbHpkQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdZM1Z5Y21WdWRGWmhiSFZsT2lCMGFHbHpMbkJ5YjNCekxtUmxabUYxYkhSV1lXeDFaU3hjY2x4dUlDQWdJQ0FnSUNBZ0lHaHBaMmhzYVdkb2RHVmtWbUZzZFdVNklIUm9hWE11Y0hKdmNITXVaR1ZtWVhWc2RGWmhiSFZsWEhKY2JpQWdJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dUlDQjlMRnh5WEc0Z0lGOXpaWFJHY205dFNHbG5hR3hwWjJoMFpXUTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYSEpjYmlBZ0lDQWdJR04xY25KbGJuUldZV3gxWlRvZ2RHaHBjeTV6ZEdGMFpTNW9hV2RvYkdsbmFIUmxaRlpoYkhWbFhISmNiaUFnSUNCOUxDQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnZEdocGN5NWZjMlYwU1c1d2RYUkdjbTl0Vm1Gc2RXVW9LVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJSDBzWEhKY2JpQWdYMjl1UTJoaGJtZGxPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhSb2FYTXVYM05sZEZaaGJIVmxSbkp2YlVsdWNIVjBLQ2s3WEhKY2JpQWdmU3hjY2x4dUlDQmZiMjVHYjJOMWN6b2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdHphRzkzUlc1MGNtbGxjem9nZEhKMVpYMHBPMXh5WEc0Z0lIMHNYSEpjYmlBZ1gyOXVRbXgxY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5elpYUkdjbTl0U0dsbmFHeHBaMmgwWldRb0tUdGNjbHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTNOb2IzZEZiblJ5YVdWek9pQm1ZV3h6WlgwcE8xeHlYRzRnSUgwc1hISmNiaUFnWDI5dVJXNTBjbmxEYkdsamF6b2dablZ1WTNScGIyNG9aVzUwY25rcElIdGNjbHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4eVhHNGdJQ0FnSUNCamRYSnlaVzUwVm1Gc2RXVTZJR1Z1ZEhKNVhISmNiaUFnSUNCOUxDQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnZEdocGN5NWZjMlYwU1c1d2RYUkdjbTl0Vm1Gc2RXVW9LVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJSDBzWEhKY2JpQWdYMjl1Ulc1MGNubE5iM1Z6WlU5MlpYSTZJR1oxYm1OMGFXOXVLR1Z1ZEhKNUtTQjdYSEpjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0b2FXZG9iR2xuYUhSbFpGWmhiSFZsT2lCbGJuUnllWDBwTzF4eVhHNGdJSDBzWEhKY2JpQWdYMjl1Ulc1MGNubE5iM1Z6WlU5MWREb2dablZ1WTNScGIyNG9aVzUwY25rcElIdGNjbHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJocFoyaHNhV2RvZEdWa1ZtRnNkV1U2SUhSb2FYTXVZM1Z5Y21WdWRGWmhiSFZsZlNrN1hISmNiaUFnZlN4Y2NseHVJQ0JmYjI1SmJuQjFkRU5zYVdOck9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJRkpsWVdOMExtWnBibVJFVDAxT2IyUmxLSFJvYVhNdWNtVm1jeTVoZFhSdlNXNXdkWFFwTG5ObGJHVmpkQ2dwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnUVhWMGIyTnZiWEJzWlhSbFJXNTBjbmtnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hISmNiaUFnWjJWMFNXNXBkR2xoYkZOMFlYUmxPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUI3YUc5MlpYSTZJR1poYkhObGZUdGNjbHh1SUNCOUxGeHlYRzRnSUY5dmJrTnNhV05yT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11Y0hKdmNITXViMjVGYm5SeWVVTnNhV05yS0hSb2FYTXVjSEp2Y0hNdWRtRnNkV1VwTzF4eVhHNGdJSDBzWEhKY2JpQWdYMjl1VFc5MWMyVlBkbVZ5T2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11Y0hKdmNITXViMjVGYm5SeWVVMXZkWE5sVDNabGNpaDBhR2x6TG5CeWIzQnpMblpoYkhWbEtUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOGJHa2djM1I1YkdVOWUzdGlZV05yWjNKdmRXNWtRMjlzYjNJNklIUm9hWE11Y0hKdmNITXVhR2xuYUd4cFoyaDBaV1FnUHlBbmFITnNLRGt3TENBMU1DVXNJRFV3SlNrbklEb2dKeWNzSUhwSmJtUmxlRG9nT1RrNU9Td2dZM1Z5YzI5eU9pQW5jRzlwYm5SbGNpZDlmU0J2YmsxdmRYTmxSRzkzYmoxN2RHaHBjeTVmYjI1RGJHbGphMzBnYjI1TmIzVnpaVTkyWlhJOWUzUm9hWE11WDI5dVRXOTFjMlZQZG1WeWZUNTdkR2hwY3k1d2NtOXdjeTUyWVd4MVpYMDhMMnhwUGx4eVhHNGdJQ0FnS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc1Y2NseHVMeThnTFMwdExTMHRMUzB0TFMwdExTMHRYSEpjYmk4dklHVnVaQ0JCZFhSdlkyOXRjR3hsZEdWY2NseHVMeThnTFMwdExTMHRMUzB0TFMwdExTMHRYSEpjYmx4eVhHNW1kVzVqZEdsdmJpQnlaVkpsYm1SbGNpZ3BJSHRjY2x4dUlDQlNaV0ZqZEM1eVpXNWtaWElvWEhKY2JpQWdJQ0E4Vm1SdVlVMWxiblVnZEdGaVRHbHpkRDE3ZEdGaVRHbHpkSDBnTHo0c1hISmNiaUFnSUNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duZG1SdVlXMWxiblVuS1Z4eVhHNGdJQ2s3WEhKY2JuMDdYSEpjYmx4eVhHNTJZWElnZEdGaVRHbHpkQ0E5SUZ0Y2NseHVJQ0I3SUdsa09pQXhMQ0JvY21WbU9pQW5jSEp2Wm1sc1pTY3NJSFJsZUhRNklDZEZaR2wwSUUxNUlGQnliMlpwYkdVbkxDQnpaV3hsWTNSbFpEb2dkSEoxWlNCOUxGeHlYRzRnSUhzZ2FXUTZJRElzSUdoeVpXWTZJQ2R1YjNScFptbGpZWFJwYjI1ekp5d2dkR1Y0ZERvZ0oxWnBaWGNnVG05MGFXWnBZMkYwYVc5dWN5Y3NJSE5sYkdWamRHVmtPaUJtWVd4elpTQjlMRnh5WEc0Z0lIc2dhV1E2SURNc0lHaHlaV1k2SUNkcGJYQnZjblFuTENCMFpYaDBPaUFuU1cxd2IzSjBJR0Z1WkNCVGVXNWpKeXdnYzJWc1pXTjBaV1E2SUdaaGJITmxJSDBzWEhKY2JpQWdleUJwWkRvZ05Dd2dhSEpsWmpvZ0ozTmxkSFJwYm1kekp5d2dkR1Y0ZERvZ0owTm9ZVzVuWlNCVFpYUjBhVzVuY3ljc0lITmxiR1ZqZEdWa09pQm1ZV3h6WlNCOUxGeHlYRzRnSUhzZ2FXUTZJRFVzSUdoeVpXWTZJQ2R3Y21sMllXTjVKeXdnZEdWNGREb2dKMUJ5YVhaaFkza25MQ0J6Wld4bFkzUmxaRG9nWm1Gc2MyVWdmU3hjY2x4dUlDQjdJR2xrT2lBMkxDQm9jbVZtT2lBbllXSnZkWFFuTENCMFpYaDBPaUFuUVdKdmRYUW5MQ0J6Wld4bFkzUmxaRG9nWm1Gc2MyVWdmVnh5WEc1ZE8xeHlYRzVjY2x4dWRtRnlJRlprYm1GTlpXNTFJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdJQ0IwWVdKTWFYTjBPaUIwYUdsekxuQnliM0J6TG5SaFlreHBjM1FzWEhKY2JpQWdJQ0FnSUdOMWNuSmxiblJVWVdJNklERmNjbHh1SUNBZ0lIMDdYSEpjYmlBZ2ZTeGNjbHh1SUNCamFHRnVaMlZVWVdJNklHWjFibU4wYVc5dUtIUmhZa2xrS1NCN1hISmNiaUFnSUNCMllYSWdibVYzVkdGaVRHbHpkQ0E5SUhSaFlreHBjM1F1YldGd0tHWjFibU4wYVc5dUtIUmhZaWtnZTF4eVhHNGdJQ0FnSUNCMFlXSXVjMlZzWldOMFpXUWdQU0IwWVdJdWFXUWdQVDA5SUhSaFlrbGtPMXh5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR0ZpTzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjY2x4dUlDQWdJQ0FnZEdGaVRHbHpkRG9nYm1WM1ZHRmlUR2x6ZEN4Y2NseHVJQ0FnSUNBZ1kzVnljbVZ1ZEZSaFlqb2dkR0ZpU1dSY2NseHVJQ0FnSUgwcE8xeHlYRzRnSUgwc1hISmNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhaaGNpQjBZV0pEYjI1MFpXNTBPMXh5WEc0Z0lDQWdjM2RwZEdOb0tIUm9hWE11YzNSaGRHVXVZM1Z5Y21WdWRGUmhZaWtnZTF4eVhHNGdJQ0FnSUNCallYTmxJREU2WEhKY2JpQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDQTlJRHhOZVZCeWIyWnBiR1VnTHo0N1hISmNiaUFnSUNBZ0lDQWdZbkpsWVdzN1hISmNiaUFnSUNBZ0lHTmhjMlVnTWpwY2NseHVJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBJRDBnUEU1dmRHbG1hV05oZEdsdmJuTWdMejQ3WEhKY2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEhKY2JpQWdJQ0FnSUdOaGMyVWdNenBjY2x4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MElEMGdQRWx0Y0c5eWRDQXZQanRjY2x4dUlDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnWTJGelpTQTBPbHh5WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RZ1BTQThVMlYwZEdsdVozTWdMejQ3WEhKY2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEhKY2JpQWdJQ0FnSUdOaGMyVWdOVHBjY2x4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MElEMGdQRkJ5YVhaaFkza2dMejQ3WEhKY2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEhKY2JpQWdJQ0FnSUdOaGMyVWdOanBjY2x4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MElEMGdQRUZpYjNWMElDOCtPMXh5WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0JrWldaaGRXeDBPbHh5WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RZ1BTQThUWGxRY205bWFXeGxJQzgrTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEhObFkzUnBiMjRnWTJ4aGMzTk9ZVzFsUFZ3aWRtUnVZVndpUGx4eVhHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWRtUnVZUzFpYjJSNVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJuUmhhVzVsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5KdmQxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhVWVdKeklIUmhZa3hwYzNROWUzUm9hWE11YzNSaGRHVXVkR0ZpVEdsemRIMGdZMmhoYm1kbFZHRmlQWHQwYUdsekxtTm9ZVzVuWlZSaFluMGdMejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbTFoYVc0dFkyOXVkR1Z1ZENCamIyd3RlSE10T0NCamIyd3RlSE10YjJabWMyVjBMVFFnWTI5c0xYTnRMVGtnWTI5c0xYTnRMVzltWm5ObGRDMHpJR052YkMxc1p5MHhNQ0JqYjJ3dGJHY3RiMlptYzJWMExUSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpZEdGaUxXTnZiblJsYm5SY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZTNSaFlrTnZiblJsYm5SOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4RGJHOXpaVlprYm1FZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUhzdktpQThUM0JsYmxaa2JtRWdMejRnS2k5OVhISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lEd3ZjMlZqZEdsdmJqNWNjbHh1SUNBZ0lDazdYSEpjYmlBZ2ZWeHlYRzU5S1R0Y2NseHVYSEpjYm5aaGNpQlBjR1Z1Vm1SdVlTQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQm9ZVzVrYkdWRGJHbGphem9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBa0tGd2lJM1prYm1GdFpXNTFYQ0lwTG5Ob2IzY29LVHRjY2x4dUlDQWdJQ1FvWENJamIzQmxibFprYm1GY0lpa3VhR2xrWlNncE8xeHlYRzRnSUgwc1hISmNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUR4a2FYWStYSEpjYmx4MFBITndZVzRnWkdGMFlTMTBiMmRuYkdVOVhDSjBiMjlzZEdsd1hDSWdkR2wwYkdVOVhDSkRiR2xqYXlCMGJ5QnZjR1Z1SUZaRVRrRmNJaUJwWkQxY0ltOXdaVzVXWkc1aFhDSWdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRjSEpwYldGeWVTQnZjR1Z1Vm1SdVlWd2lJRzl1UTJ4cFkyczllM1JvYVhNdWFHRnVaR3hsUTJ4cFkydDlQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1QzQmxiaUIyUkU1QlhISmNiaUFnSUNBZ0lDQWdQQzl6Y0dGdVBseHlYRzRnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCRGJHOXpaVlprYm1FZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYSEpjYmlBZ2FHRnVaR3hsUTJ4cFkyczZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSkNoY0lpTjJaRzVoYldWdWRWd2lLUzVvYVdSbEtDazdYSEpjYmlBZ0lDQWtLRndpSTI5d1pXNVdaRzVoWENJcExuTm9iM2NvS1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4WkdsMlBseHlYRzVjZER4emNHRnVJR1JoZEdFdGRHOW5aMnhsUFZ3aWRHOXZiSFJwY0Z3aUlIUnBkR3hsUFZ3aVEyeHBZMnNnZEc4Z1kyeHZjMlZjSWlCamJHRnpjMDVoYldVOVhDSmpiRzl6WlZaa2JtRmNJaUJ6ZEhsc1pUMTdlMk4xY25OdmNqb2dKM0J2YVc1MFpYSW5mWDBnYjI1RGJHbGphejE3ZEdocGN5NW9ZVzVrYkdWRGJHbGphMzArWEhKY2JpQWdJQ0FnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSm1ZU0JtWVMxd2IzZGxjaTF2Wm1aY0lqNDhMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdQQzl6Y0dGdVBseHlYRzRnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCVVlXSnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IyWVhJZ2RHaGhkQ0E5SUhSb2FYTTdYSEpjYmlBZ0lDQjJZWElnZEdGaVRHbHpkRTV2WkdWeklEMGdkR2hwY3k1d2NtOXdjeTUwWVdKTWFYTjBMbTFoY0NobWRXNWpkR2x2YmloMFlXSXNJR2x1WkdWNEtTQjdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJQ0FnUEZSaFlpQmphR0Z1WjJWVVlXSTllM1JvWVhRdWNISnZjSE11WTJoaGJtZGxWR0ZpZlNCclpYazllM1JoWWk1b2NtVm1mU0JwWkQxN2RHRmlMbWh5WldaOUlIUmhZajE3ZEdGaWZTQXZQbHh5WEc0Z0lDQWdJQ0FwTzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5OcFpHVmlZWElnWTI5c0xYaHpMVFFnWTI5c0xYTnRMVE1nWTI5c0xXeG5MVEpjSWo1Y2NseHVJQ0FnSUNBZ0lDQThibUYySUdOc1lYTnpUbUZ0WlQxY0ltNWhkbUpoY2lCdVlYWmlZWEl0WkdWbVlYVnNkRndpSUhKdmJHVTlYQ0p1WVhacFoyRjBhVzl1WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0E4ZFd3Z1kyeGhjM05PWVcxbFBWd2libUYySUc1aGRtSmhjaTF1WVhaY0lpQnliMnhsUFZ3aWRHRmliR2x6ZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCN2RHRmlUR2x6ZEU1dlpHVnpmVnh5WEc0Z0lDQWdJQ0FnSUNBZ1BDOTFiRDVjY2x4dUlDQWdJQ0FnSUNBOEwyNWhkajVjY2x4dUlDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdWR0ZpSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUdoaGJtUnNaVU5zYVdOck9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFJvYVhNdWNISnZjSE11WTJoaGJtZGxWR0ZpS0hSb2FYTXVjSEp2Y0hNdWRHRmlMbWxrS1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YkdrZ2NtOXNaVDFjSW5CeVpYTmxiblJoZEdsdmJsd2lJR05zWVhOelRtRnRaVDE3ZEdocGN5NXdjbTl3Y3k1MFlXSXVjMlZzWldOMFpXUWdQeUFuWVdOMGFYWmxKeUE2SUNjbmZUNWNjbHh1SUNBZ0lDQWdJQ0E4WVNCb2NtVm1QWHQwYUdsekxuQnliM0J6TG5SaFlpNW9jbVZtZlNCaGNtbGhMV052Ym5SeWIyeHpQWHQwYUdsekxuQnliM0J6TG5SaFlpNW9jbVZtZlNCeWIyeGxQVndpZEdGaVhDSWdaR0YwWVMxMGIyZG5iR1U5WENKMFlXSmNJaUJ2YmtOc2FXTnJQWHQwYUdsekxtaGhibVJzWlVOc2FXTnJmVDVjY2x4dUlDQWdJQ0FnSUNBZ0lIdDBhR2x6TG5CeWIzQnpMblJoWWk1MFpYaDBmVnh5WEc0Z0lDQWdJQ0FnSUR3dllUNWNjbHh1SUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCTmVWQnliMlpwYkdWSVpXRmtaWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hISmNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUR4b1pXRmtaWElnWTJ4aGMzTk9ZVzFsUFZ3aWNHRm5aUzFvWldGa1pYSmNJajVjY2x4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xbFpHbGhYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltMWxaR2xoTFd4bFpuUmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2labUVnWm1FdE1uZ2dabUV0ZFhObGNsd2lQand2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdFpXUnBZUzFpYjJSNVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeG9NU0JqYkdGemMwNWhiV1U5WENKdFpXUnBZUzFvWldGa2FXNW5YQ0krV1c5MWNpQndjbTltYVd4bElEeHpiV0ZzYkQ1aGREd3ZjMjFoYkd3K0lGdHphWFJsTG1OdmJWMDhMMmd4UGx4eVhHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lEd3ZhR1ZoWkdWeVBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOVhISmNibjBwTzF4eVhHNWNjbHh1ZG1GeUlFMTVVSEp2Wm1sc1pVTmhkR1ZuYjNKcFpYTWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEhKY2JpQWdhR0Z1Wkd4bFEyaGhibWRsT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHTnZibk52YkdVdWJHOW5LRkpsWVdOMExtWnBibVJFVDAxT2IyUmxLSFJvYVhNdWNtVm1jeTVqWVhSbFoyOXllU2t1ZG1Gc2RXVXBPMXh5WEc0Z0lDQWdkR2hwY3k1d2NtOXdjeTVuWlhSRFlYUmxaMjl5ZVU5dVEyaGhibWRsS0ZKbFlXTjBMbVpwYm1SRVQwMU9iMlJsS0hSb2FYTXVjbVZtY3k1allYUmxaMjl5ZVNrdWRtRnNkV1VwTzF4eVhHNGdJSDBzWEhKY2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQjdYSEpjYmlBZ0lDQWdJR05oZEdWbmIzSnBaWE02SUhSb2FYTXVjSEp2Y0hNdVkyRjBaV2R2Y21sbGMxeHlYRzRnSUNBZ2ZUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdkR2hoZENBOUlIUm9hWE03WEhKY2JpQWdJQ0IyWVhJZ1kyRjBaV2R2Y25sT2IyUmxjeUE5SUhSb2FYTXVjM1JoZEdVdVkyRjBaV2R2Y21sbGN5NXRZWEFvWm5WdVkzUnBiMjRvWTJGMFpXZHZjbmtwSUh0Y2NseHVJQ0FnSUNBZ2NtVjBkWEp1S0Z4eVhHNGdJQ0FnSUNBZ0lEeE5lVkJ5YjJacGJHVkRZWFJsWjI5eWVTQmpZWFJsWjI5eWVUMTdZMkYwWldkdmNubDlJQzgrWEhKY2JpQWdJQ0FnSUNrN1hISmNiaUFnSUNCOUtUdGNjbHh1SUNBZ0lISmxkSFZ5YmlBb1hISmNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVptOXliUzFuY205MWNDQm1iM0p0TFdkeWIzVndMWE50WENJK1hISmNiaUFnSUNBZ0lDQWdQR3hoWW1Wc0lHaDBiV3hHYjNJOVhDSmpZWFJsWjI5eWVWd2lJR05zWVhOelRtRnRaVDFjSW1OdmJDMXpiUzB5SUdOdmJuUnliMnd0YkdGaVpXeGNJajVEWVhSbFoyOXllVHd2YkdGaVpXdytYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGMyMHRNVEJjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHh6Wld4bFkzUWdZMnhoYzNOT1lXMWxQVndpYzJWc1pXTjBjR2xqYTJWeVhDSWdhV1E5WENKallYUmxaMjl5ZVZ3aUlISmxaajFjSW1OaGRHVm5iM0o1WENJZ2IyNURhR0Z1WjJVOWUzUm9hWE11YUdGdVpHeGxRMmhoYm1kbGZUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2UyTmhkR1ZuYjNKNVRtOWtaWE45WEhKY2JpQWdJQ0FnSUNBZ0lDQThMM05sYkdWamRENWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1RYbFFjbTltYVd4bFEyRjBaV2R2Y25rZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYSEpjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lISmxkSFZ5YmlBb1hISmNiaUFnSUNBZ0lEeHZjSFJwYjI0Z2RtRnNkV1U5ZTNSb2FYTXVjSEp2Y0hNdVkyRjBaV2R2Y25sOUlISmxaajE3ZEdocGN5NXdjbTl3Y3k1allYUmxaMjl5ZVgwK1hISmNiaUFnSUNBZ0lDQWdlMlJoZEdFdVkyRndhWFJoYkdsNlpTaDBhR2x6TG5CeWIzQnpMbU5oZEdWbmIzSjVLWDFjY2x4dUlDQWdJQ0FnUEM5dmNIUnBiMjQrWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnVFhsUWNtOW1hV3hsVUhKcGRtRmplU0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBa0tGd2lJM0J5YVhaaFkzbFRaWFIwYVc1blUyeHBaR1Z5WENJcExuTnNhV1JsY2loN2JXbHVPakVzYldGNE9qVXNjM1JsY0RveExIWmhiSFZsT2pOOUtUdGNjbHh1SUNBZ0lDUW9YQ0lqY0hKcGRtRmplVk5sZEhScGJtZFRiR2xrWlhKY0lpa3ViMjRvWENKemJHbGtaVndpTENCbWRXNWpkR2x2YmlodUtTQjdYSEpjYmlBZ0lDQWdJRzR1ZG1Gc2RXVWdQVDA5SURFZ1AxeHlYRzRnSUNBZ0lDQWdJQ1FvWENJamNISnBkbUZqZVZObGRIUnBibWRUYkdsa1pYSldZV3hjSWlrdWRHVjRkQ2hjSWpJd1hDSXBJRHBjY2x4dUlDQWdJQ0FnSUNCdUxuWmhiSFZsUFQwOU1pQS9YSEpjYmlBZ0lDQWdJQ0FnSkNoY0lpTndjbWwyWVdONVUyVjBkR2x1WjFOc2FXUmxjbFpoYkZ3aUtTNTBaWGgwS0Z3aU5EQmNJaWtnT2x4eVhHNGdJQ0FnSUNBZ0lHNHVkbUZzZFdVOVBUMHpJRDljY2x4dUlDQWdJQ0FnSUNBa0tGd2lJM0J5YVhaaFkzbFRaWFIwYVc1blUyeHBaR1Z5Vm1Gc1hDSXBMblJsZUhRb1hDSTJNRndpS1NBNlhISmNiaUFnSUNBZ0lDQWdiaTUyWVd4MVpUMDlQVFFnUDF4eVhHNGdJQ0FnSUNBZ0lDUW9YQ0lqY0hKcGRtRmplVk5sZEhScGJtZFRiR2xrWlhKV1lXeGNJaWt1ZEdWNGRDaGNJamd3WENJcElEcGNjbHh1SUNBZ0lDQWdJQ0J1TG5aaGJIVmxQVDA5TlNBbUppQWtLRndpSTNCeWFYWmhZM2xUWlhSMGFXNW5VMnhwWkdWeVZtRnNYQ0lwTG5SbGVIUW9YQ0l4TURCY0lpazdYSEpjYmlBZ0lDQjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltWnZjbTB0WjNKdmRYQWdabTl5YlMxbmNtOTFjQzF6YlZ3aVBseHlYRzRnSUNBZ0lDQWdJRHhzWVdKbGJDQm9kRzFzUm05eVBWd2lhVzV3ZFhSRmJXRnBiRE5jSWlCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE1pQmpiMjUwY205c0xXeGhZbVZzWENJK1VISnBkbUZqZVR3dmJHRmlaV3crWEhKY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyd3RjMjB0Tmx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdsdWNIVjBJR2xrUFZ3aWNISnBkbUZqZVZObGRIUnBibWRUYkdsa1pYSmNJaUIwZVhCbFBWd2lkR1Y0ZEZ3aUlDOCtYSEpjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGMyMHRNbHdpUGxOb1lYSnBibWNnUEhOd1lXNGdhV1E5WENKd2NtbDJZV041VTJWMGRHbHVaMU5zYVdSbGNsWmhiRndpUGpZd1BDOXpjR0Z1UGlVOEwyUnBkajVjY2x4dUlDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdUWGxRY205bWFXeGxTVzUwWlhKbGMzUnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSE5vYjNkRVpYUmhhV3h6T2lCbWRXNWpkR2x2YmlocGJuUmxjbVZ6ZEN3Z1pHVjBZV2xzY3lrZ2UxeHlYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29hVzUwWlhKbGMzUWdLeUJjSWpvZ1hDSWdLeUJLVTA5T0xuTjBjbWx1WjJsbWVTaGtaWFJoYVd4ektTazdYSEpjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0amRYSnlaVzUwU1c1MFpYSmxjM1E2SUdsdWRHVnlaWE4wTENCamRYSnlaVzUwUkdWMFlXbHNjem9nWkdWMFlXbHNjMzBwTzF4eVhHNGdJSDBzWEhKY2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQjdZM1Z5Y21WdWRFbHVkR1Z5WlhOME9pQnVkV3hzTEZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqZFhKeVpXNTBSR1YwWVdsc2N6b2dlMzBzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR0ZrWkVsdWRHVnlaWE4wUTI5c2JHRndjMlZrT2lCMGNuVmxmVHRjY2x4dUlDQjlMRnh5WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRTF2ZFc1ME9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJR1JoZEdFdVlteHBibXRPYjJSbGN5Z3BPMXh5WEc0Z0lIMHNYSEpjYmlBZ2MyaHZkMEZrWkV4cGEyVTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdZV1JrU1c1MFpYSmxjM1JEYjJ4c1lYQnpaV1E2SUdaaGJITmxmU2s3WEhKY2JpQWdmU3hjY2x4dUlDQm9hV1JsUVdSa1RHbHJaVG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRoWkdSSmJuUmxjbVZ6ZEVOdmJHeGhjSE5sWkRvZ2RISjFaWDBwTzF4eVhHNGdJSDBzWEhKY2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFpoY2lCMGFHRjBJRDBnZEdocGN6dGNjbHh1SUNBZ0lIWmhjaUJqZFhKeVpXNTBTVzUwWlhKbGMzUnpJRDBnVDJKcVpXTjBMbXRsZVhNb2RHaHBjeTV3Y205d2N5NXBiblJsY21WemRITXBMbkpsWkhWalpTaG1kVzVqZEdsdmJpaHBjeXdnYVNrZ2UxeHlYRzRnSUNBZ0lDQnBaaWgwYUdGMExuQnliM0J6TG1sdWRHVnlaWE4wYzF0cFhWc25jMlZzWldOMFpXUW5YU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHbHpXMmxkSUQwZ2RHaGhkQzV3Y205d2N5NXBiblJsY21WemRITmJhVjA3WEhKY2JpQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ2NtVjBkWEp1SUdsek8xeHlYRzRnSUNBZ2ZTd2dlMzBwTzF4eVhHNGdJQ0FnZG1GeUlHbHVkR1Z5WlhOMFRtOWtaWE1nUFNCUFltcGxZM1F1YTJWNWN5aDBhR2x6TG5CeWIzQnpMbWx1ZEdWeVpYTjBjeWt1Wm1sc2RHVnlLR1oxYm1OMGFXOXVLR2x1ZEdWeVpYTjBLU0I3WEhKY2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdGMExuQnliM0J6TG1sdWRHVnlaWE4wYzF0cGJuUmxjbVZ6ZEYxYkozTmxiR1ZqZEdWa0oxMDdYSEpjYmlBZ0lDQjlLUzV0WVhBb1puVnVZM1JwYjI0b2FXNTBaWEpsYzNRcElIdGNjbHh1SUNBZ0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdJQ0E4VFhsUWNtOW1hV3hsU1c1MFpYSmxjM1FnYTJWNVBYdHBiblJsY21WemRIMGdhVzUwWlhKbGMzUTllMmx1ZEdWeVpYTjBmU0J6YUc5M1JHVjBZV2xzY3oxN2RHaGhkQzV6YUc5M1JHVjBZV2xzY3k1aWFXNWtLSFJvWVhRc0lHbHVkR1Z5WlhOMExDQjBhR0YwTG5CeWIzQnpMbWx1ZEdWeVpYTjBjMXRwYm5SbGNtVnpkRjBwZlNBdlBseHlYRzRnSUNBZ0lDQXBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JpQWdJQ0F2S2x4eVhHNGdJQ0FnZG1GeUlISmxiR0YwWldSSmJuUmxjbVZ6ZEhNZ1BTQlBZbXBsWTNRdWEyVjVjeWgwYUdsekxuQnliM0J6TG1sdWRHVnlaWE4wY3lrdVptbHNkR1Z5S0daMWJtTjBhVzl1S0dsdWRHVnlaWE4wS1NCN1hISmNiaUFnSUNBZ0lISmxkSFZ5YmlBaGRHaGhkQzV3Y205d2N5NXBiblJsY21WemRITmJhVzUwWlhKbGMzUmRXeWR6Wld4bFkzUmxaQ2RkTzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIWmhjaUJ5Wld4aGRHVmtTVzUwWlhKbGMzUnpJRDBnZEdocGN5NXpkR0YwWlM1amRYSnlaVzUwU1c1MFpYSmxjM1FnUHlCMGFHbHpMbk4wWVhSbExtTjFjbkpsYm5SRVpYUmhhV3h6V3lkeVpXeGhkR1ZrSjEwdWMzQnNhWFFvTHl3dktTQTZJRnRkTzF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEdScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbVp2Y20wdFozSnZkWEFnWm05eWJTMW5jbTkxY0MxemJWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHeGhZbVZzSUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzF6YlMweUlHTnZiblJ5YjJ3dGJHRmlaV3hjSWo1SmJuUmxjbVZ6ZEhNOEwyeGhZbVZzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE5sd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQmhibVZzSUhCaGJtVnNMV2x1ZEdWeVpYTjBjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY0dGdVpXd3RZbTlrZVZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjdhVzUwWlhKbGMzUk9iMlJsYzMxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYTnRMVFFnWTI5c0xXSnZkSFJ2YlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFluVjBkRzl1SUhSNWNHVTlYQ0p6ZFdKdGFYUmNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFhOdElHSjBiaTFrWldaaGRXeDBYQ0krU1cxd2IzSjBQQzlpZFhSMGIyNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2FXUTlYQ0poWkdSTWFXdGxYQ0lnYjI1RGJHbGphejE3ZEdocGN5NXphRzkzUVdSa1RHbHJaWDBnZEhsd1pUMWNJbk4xWW0xcGRGd2lJSEp2YkdVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMWE50SUdKMGJpMXpkV05qWlhOelhDSWdZWEpwWVMxbGVIQmhibVJsWkQxY0ltWmhiSE5sWENJZ1lYSnBZUzFqYjI1MGNtOXNjejFjSW1Ga1pFeHBhMlZjSWo0OGMzQmhiaUJqYkdGemMwNWhiV1U5WENKbmJIbHdhR2xqYjI0Z1oyeDVjR2hwWTI5dUxYQnNkWE5jSWo0OEwzTndZVzQrSUVGa1pEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnUEUxNVVISnZabWxzWlVGa1pFRnVTVzUwWlhKbGMzUWdhVzUwWlhKbGMzUnpQWHRqZFhKeVpXNTBTVzUwWlhKbGMzUnpmU0JqYjJ4c1lYQnpaVDE3ZEdocGN5NXpkR0YwWlM1aFpHUkpiblJsY21WemRFTnZiR3hoY0hObFpIMGdhR2xrWlVGa1pFeHBhMlU5ZTNSb2FYTXVhR2xrWlVGa1pFeHBhMlY5SUM4K1hISmNiaUFnSUNBZ0lDQWdQRTE1VUhKdlptbHNaVXhwYTJWRVpYUmhhV3h6SUdOMWNuSmxiblJKYm5SbGNtVnpkRDE3ZEdocGN5NXpkR0YwWlM1amRYSnlaVzUwU1c1MFpYSmxjM1I5SUdOMWNuSmxiblJFWlhSaGFXeHpQWHQwYUdsekxuTjBZWFJsTG1OMWNuSmxiblJFWlhSaGFXeHpmU0J5Wld4aGRHVmtTVzUwWlhKbGMzUnpQWHR5Wld4aGRHVmtTVzUwWlhKbGMzUnpmU0JqYjJ4c1lYQnpaVDE3Wm1Gc2MyVjlJQzgrWEhKY2JpQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRTE1VUhKdlptbHNaVWx1ZEdWeVpYTjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR2hoYm1Sc1pVTnNhV05yT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11Y0hKdmNITXVjMmh2ZDBSbGRHRnBiSE1vS1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMWE50SUdKMGJpMWtaV1poZFd4MFhDSWdjbVZtUFZ3aWFXNTBaWEpsYzNSVGNHRnVYQ0lnZEdsMGJHVTllM1JvYVhNdWNISnZjSE11YVc1MFpYSmxjM1I5SUd0bGVUMTdkR2hwY3k1d2NtOXdjeTVwYm5SbGNtVnpkSDBnY205c1pUMWNJbUoxZEhSdmJsd2lJRzl1UTJ4cFkyczllM1JvYVhNdWFHRnVaR3hsUTJ4cFkydDlQbHh5WEc0Z0lDQWdJQ0FnSUh0a1lYUmhMbU5oY0dsMFlXeHBlbVVvZEdocGN5NXdjbTl3Y3k1cGJuUmxjbVZ6ZENsOVhISmNiaUFnSUNBZ0lEd3ZjM0JoYmo1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCTmVWQnliMlpwYkdWQlpHUkJia2x1ZEdWeVpYTjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR0ZrWkV4cGEyVkViMjVsT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHTnZibk52YkdVdWJHOW5LQ1FvWENJallXUmtTVzUwWlhKbGMzUkpibkIxZEZ3aUtTNTJZV3dvS1NrN1hISmNiaUFnSUNCcFppaGtZWFJoTG1Ga1pFbHVkR1Z5WlhOMEtDUW9YQ0lqWVdSa1NXNTBaWEpsYzNSSmJuQjFkRndpS1M1MllXd29LU2twSUh0Y2NseHVJQ0FnSUNBZ2RHaHBjeTV3Y205d2N5NW9hV1JsUVdSa1RHbHJaU2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnSkNoY0lpTmhaR1JKYm5SbGNtVnpkRWx1Y0hWMFhDSXBMblpoYkNoY0lsd2lLVHRjY2x4dUlDQWdJSEpsVW1WdVpHVnlLQ2s3WEhKY2JpQWdmU3hjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblJKYm5SbGNtVnpkRXRsZVhNZ1BTQlBZbXBsWTNRdWEyVjVjeWgwYUdsekxuQnliM0J6TG1sdWRHVnlaWE4wY3lrN1hISmNiaUFnSUNCamIyNXpiMnhsTG14dlp5Z25ZM1Z5Y21WdWRDQnBiblJsY21WemRITTZJQ2NnS3lCS1UwOU9Mbk4wY21sdVoybG1lU2hqZFhKeVpXNTBTVzUwWlhKbGMzUkxaWGx6S1NrN1hISmNiaUFnSUNCMllYSWdZWFpoYVd4aFlteGxTVzUwWlhKbGMzUkxaWGx6SUQwZ1QySnFaV04wTG10bGVYTW9aR0YwWVM1emRHRjBhV05KYm5SbGNtVnpkSE1wTG1acGJIUmxjaWhtZFc1amRHbHZiaWhwYm5SbGNtVnpkRXRsZVNrZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z1kzVnljbVZ1ZEVsdWRHVnlaWE4wUzJWNWN5NXBibVJsZUU5bUtHbHVkR1Z5WlhOMFMyVjVLU0E5UFNBdE1UdGNjbHh1SUNBZ0lIMHBPMXh5WEc0Z0lDQWdZMjl1YzI5c1pTNXNiMmNvSjJGMllXbHNZV0pzWlNCcGJuUmxjbVZ6ZEhNNklDY2dLeUJLVTA5T0xuTjBjbWx1WjJsbWVTaGhkbUZwYkdGaWJHVkpiblJsY21WemRFdGxlWE1wS1R0Y2NseHVJQ0FnSUhaaGNpQmlZWE5sUkdsMlUzUjViR1Z6SUQwZ1d5ZG1iM0p0TFdkeWIzVndKeXdnSjJadmNtMHRaM0p2ZFhBdGMyMG5YVHRjY2x4dUlDQWdJR2xtS0hSb2FYTXVjSEp2Y0hNdVkyOXNiR0Z3YzJVcElIdGNjbHh1SUNBZ0lDQWdZbUZ6WlVScGRsTjBlV3hsY3k1d2RYTm9LQ2RqYjJ4c1lYQnpaU2NwTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnWTI5dWMyOXNaUzVzYjJjb0owRmtaQ0JoSUd4cGEyVTZJRndpSnlBcklHSmhjMlZFYVhaVGRIbHNaWE11YW05cGJpZ25JQ2NwSUNzZ0oxd2lKeWs3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMTdZbUZ6WlVScGRsTjBlV3hsY3k1cWIybHVLQ2NnSnlsOUlHbGtQVndpWVdSa1FXNUpiblJsY21WemRGd2lQbHh5WEc0Z0lDQWdJQ0FnSUR4c1lXSmxiQ0JqYkdGemMwNWhiV1U5WENKamIyd3RjMjB0TWlCamIyNTBjbTlzTFd4aFltVnNYQ0krUVdSa0lHRWdiR2xyWlR3dmJHRmlaV3crWEhKY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyd3RjMjB0Tmx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnZXk4cUlEeHBibkIxZENCMGVYQmxQVndpZEdWNGRGd2lJR05zWVhOelRtRnRaVDFjSW1admNtMHRZMjl1ZEhKdmJGd2lJSEpsWmoxY0ltRmtaRUZ1U1c1MFpYSmxjM1JKYm5CMWRGd2lJR2xrUFZ3aVlXUmtRVzVKYm5SbGNtVnpkRWx1Y0hWMFhDSWdMejRnS2k5OVhISmNiaUFnSUNBZ0lDQWdJQ0E4UVhWMGIyTnZiWEJzWlhSbElHbHVjSFYwU1dROVhDSmhaR1JKYm5SbGNtVnpkRWx1Y0hWMFhDSWdaR1ZtWVhWc2RGWmhiSFZsUFhzbkozMGdaR1ZtWVhWc2RFeHBjM1E5ZTJGMllXbHNZV0pzWlVsdWRHVnlaWE4wUzJWNWMzMGdZMnhoYzNOT1lXMWxQVndpWm05eWJTMWpiMjUwY205c1hDSWdZV1JrVEdsclpVUnZibVU5ZTNSb2FYTXVZV1JrVEdsclpVUnZibVY5SUM4K1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE1sd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHSjFkSFJ2YmlCMGVYQmxQVndpWW5WMGRHOXVYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkRndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVZV1JrVEdsclpVUnZibVY5UGtSdmJtVThMMkoxZEhSdmJqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1RYbFFjbTltYVd4bFRHbHJaVVJsZEdGcGJITWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEhKY2JpQWdjbVZ0YjNabFNXNTBaWEpsYzNRNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdMeThnWkdGMFlTNTFia3hwYTJWQmJrbHVkR1Z5WlhOMEtIUm9hWE11Y0hKdmNITXVZMkYwWldkdmNua3NJSFJvYVhNdWNISnZjSE11WTNWeWNtVnVkRWx1ZEdWeVpYTjBLVHRjY2x4dUlDQWdJR1JoZEdFdWRXNU1hV3RsUVc1SmJuUmxjbVZ6ZENoMGFHbHpMbkJ5YjNCekxtTjFjbkpsYm5SSmJuUmxjbVZ6ZENrN1hISmNiaUFnSUNCeVpWSmxibVJsY2lncE8xeHlYRzRnSUgwc1hISmNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhaaGNpQjBhR0YwSUQwZ2RHaHBjenRjY2x4dUlDQWdJSFpoY2lCeVpXeGhkR1ZrU1c1MFpYSmxjM1JPYjJSbGN5QTlJSFJvYVhNdWNISnZjSE11Y21Wc1lYUmxaRWx1ZEdWeVpYTjBjeTV0WVhBb1puVnVZM1JwYjI0b2FXNTBaWEpsYzNRcElIdGNjbHh1SUNBZ0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdJQ0F2THlBOFRYbFFjbTltYVd4bFVtVnNZWFJsWkVsdWRHVnlaWE4wSUdOaGRHVm5iM0o1UFh0MGFHRjBMbkJ5YjNCekxtTmhkR1ZuYjNKNWZTQnlaV3hoZEdWa1NXNTBaWEpsYzNROWUybHVkR1Z5WlhOMGZTQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BFMTVVSEp2Wm1sc1pWSmxiR0YwWldSSmJuUmxjbVZ6ZENCeVpXeGhkR1ZrU1c1MFpYSmxjM1E5ZTJsdWRHVnlaWE4wZlNBdlBseHlYRzRnSUNBZ0lDQXBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JpQWdJQ0IyWVhJZ1ltRnpaVVJwZGxOMGVXeGxjeUE5SUZzblptOXliUzFuY205MWNDY3NJQ2RtYjNKdExXZHliM1Z3TFhOdEoxMDdYSEpjYmlBZ0lDQnBaaWgwYUdsekxuQnliM0J6TG1OdmJHeGhjSE5sS1NCN1hISmNiaUFnSUNBZ0lHSmhjMlZFYVhaVGRIbHNaWE11Y0hWemFDZ25ZMjlzYkdGd2MyVW5LVHRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJSFpoY2lCb2RHMXNPMXh5WEc0Z0lDQWdhV1lvZEdocGN5NXdjbTl3Y3k1amRYSnlaVzUwU1c1MFpYSmxjM1FwSUh0Y2NseHVJQ0FnSUNBZ2FIUnRiQ0E5WEhKY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5ZTJKaGMyVkVhWFpUZEhsc1pYTXVhbTlwYmlnbklDY3BmU0JwWkQxY0lteHBhMlZFWlhSaGFXeHpYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzF6YlMwMklHTnZiQzF6YlMxdlptWnpaWFF0TWx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5kbGJHd2dkMlZzYkMxemJWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2ljbTkzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzE0Y3kwMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YzIwZ1luUnVMWEJ5YVcxaGNubGNJajU3ZEdocGN5NXdjbTl3Y3k1amRYSnlaVzUwU1c1MFpYSmxjM1I5UEM5aWRYUjBiMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYaHpMVGhjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0YVc1c2FXNWxYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOdFlXeHNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3THlvOGMzUnliMjVuUGtOaGRHVm5iM0o1T2p3dmMzUnliMjVuUGlCN1pHRjBZUzVqWVhCcGRHRnNhWHBsS0hSb2FYTXVjSEp2Y0hNdVkzVnljbVZ1ZEVSbGRHRnBiSE5iSjJOaGRHVm5iM0o1SjEwcGZUeGljaUF2UGlvdmZWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1J5YjI1blBsUnZkR0ZzSUdOc2FXTnJjem84TDNOMGNtOXVaejRnZTNSb2FYTXVjSEp2Y0hNdVkzVnljbVZ1ZEVSbGRHRnBiSE5iSjJOc2FXTnJjeWRkZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMnhwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMGNtOXVaejVUYjNWeVkyVTZQQzl6ZEhKdmJtYytJRWx0Y0c5eWRHVmtJR1p5YjIwZ2UyUmhkR0V1WTJGd2FYUmhiR2w2WlNoMGFHbHpMbkJ5YjNCekxtTjFjbkpsYm5SRVpYUmhhV3h6V3lkemIzVnlZMlVuWFNsOVBHSnlJQzgrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUVGa1pHVmtJRzl1SUh0MGFHbHpMbkJ5YjNCekxtTjFjbkpsYm5SRVpYUmhhV3h6V3lkaFpHUmxaQ2RkZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMnhwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM1ZzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUnliMjVuUGxKbGJHRjBaV1FnYVc1MFpYSmxjM1J6T2p3dmMzUnliMjVuUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUh0eVpXeGhkR1ZrU1c1MFpYSmxjM1JPYjJSbGMzMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOXdQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzF6YlMwMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW5OMVltMXBkRndpSUhKdmJHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFhOdElHSjBiaTFrWldaaGRXeDBJSEpsYlc5MlpTMXNhV3RsWENJZ1lYSnBZUzFsZUhCaGJtUmxaRDFjSW5SeWRXVmNJaUJoY21saExXTnZiblJ5YjJ4elBWd2ljbVZ0YjNabFRHbHJaVndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVjbVZ0YjNabFNXNTBaWEpsYzNSOVBsSmxiVzkyWlR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK08xeHlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2NseHVJQ0FnSUNBZ2FIUnRiQ0E5SUR4a2FYWWdZMnhoYzNOT1lXMWxQWHRpWVhObFJHbDJVM1I1YkdWekxtcHZhVzRvSnlBbktYMGdhV1E5WENKc2FXdGxSR1YwWVdsc2Mxd2lQand2WkdsMlBqdGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lISmxkSFZ5YmlBb1hISmNiaUFnSUNBZ0lEeGthWFkrWEhKY2JpQWdJQ0FnSUNBZ2UyaDBiV3g5WEhKY2JpQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdUWGxRY205bWFXeGxVbVZzWVhSbFpFbHVkR1Z5WlhOMElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lHRmtaRWx1ZEdWeVpYTjBPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUM4dklHUmhkR0V1WVdSa1VtVnNZWFJsWkVsdWRHVnlaWE4wS0hSb2FYTXVjSEp2Y0hNdVkyRjBaV2R2Y25rc0lIUm9hWE11Y0hKdmNITXVjbVZzWVhSbFpFbHVkR1Z5WlhOMEtUdGNjbHh1SUNBZ0lHUmhkR0V1WVdSa1VtVnNZWFJsWkVsdWRHVnlaWE4wS0hSb2FYTXVjSEp2Y0hNdWNtVnNZWFJsWkVsdWRHVnlaWE4wS1R0Y2NseHVJQ0FnSUhKbFVtVnVaR1Z5S0NrN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRaR1ZtWVhWc2RGd2lJSEpsWmoxY0ltbHVkR1Z5WlhOMFUzQmhibHdpSUhScGRHeGxQWHQwYUdsekxuQnliM0J6TG5KbGJHRjBaV1JKYm5SbGNtVnpkSDBnYTJWNVBYdDBhR2x6TG5CeWIzQnpMbkpsYkdGMFpXUkpiblJsY21WemRIMGdjbTlzWlQxY0ltSjFkSFJ2Ymx3aUlHOXVRMnhwWTJzOWUzUm9hWE11WVdSa1NXNTBaWEpsYzNSOVBseHlYRzRnSUNBZ0lDQWdJSHRrWVhSaExtTmhjR2wwWVd4cGVtVW9kR2hwY3k1d2NtOXdjeTV5Wld4aGRHVmtTVzUwWlhKbGMzUXBmVnh5WEc0Z0lDQWdJQ0E4TDNOd1lXNCtYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdUWGxRY205bWFXeGxJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdJQ0F2THlCallYUmxaMjl5ZVRvZ1QySnFaV04wTG10bGVYTW9jM1JoZEdsalJHRjBZU2xiTUYwc1hISmNiaUFnSUNBZ0lDOHZJR2x1ZEdWeVpYTjBjem9nYzNSaGRHbGpSR0YwWVZ0UFltcGxZM1F1YTJWNWN5aHpkR0YwYVdORVlYUmhLVnN3WFYxY2NseHVJQ0FnSUNBZ2FXNTBaWEpsYzNSek9pQmtZWFJoTG5OMFlYUnBZMGx1ZEdWeVpYTjBjMXh5WEc0Z0lDQWdmVHRjY2x4dUlDQjlMRnh5WEc0Z0lHZGxkRU5oZEdWbmIzSjVUMjVEYUdGdVoyVTZJR1oxYm1OMGFXOXVLR05oZEdWbmIzSjVLU0I3WEhKY2JpQWdJQ0JqYjI1emIyeGxMbXh2WnloS1UwOU9Mbk4wY21sdVoybG1lU2hrWVhSaExuTjBZWFJwWTBSaGRHRmJZMkYwWldkdmNubGRLU2s3WEhKY2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGpZWFJsWjI5eWVUb2dZMkYwWldkdmNua3NYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJuUmxjbVZ6ZEhNNklHUmhkR0V1YzNSaGRHbGpSR0YwWVZ0allYUmxaMjl5ZVYxOUtUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOFpHbDJJSEp2YkdVOVhDSjBZV0p3WVc1bGJGd2lJR05zWVhOelRtRnRaVDFjSW5SaFlpMXdZVzVsSUdaaFpHVWdZV04wYVhabElHbHVYQ0lnYVdROVhDSndjbTltYVd4bFhDSStYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFlXbHVaWEpjSWo1Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBOFRYbFFjbTltYVd4bFNHVmhaR1Z5SUM4K1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV2h2Y21sNmIyNTBZV3hjSWo1Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIc3ZLanhOZVZCeWIyWnBiR1ZEWVhSbFoyOXlhV1Z6SUdOaGRHVm5iM0pwWlhNOWUwOWlhbVZqZEM1clpYbHpLR1JoZEdFdWMzUmhkR2xqUkdGMFlTbDlJR2RsZEVOaGRHVm5iM0o1VDI1RGFHRnVaMlU5ZTNSb2FYTXVaMlYwUTJGMFpXZHZjbmxQYmtOb1lXNW5aWDBnTHo0cUwzMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BFMTVVSEp2Wm1sc1pWQnlhWFpoWTNrZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2V5OHFQRTE1VUhKdlptbHNaVWx1ZEdWeVpYTjBjeUJqWVhSbFoyOXllVDE3ZEdocGN5NXpkR0YwWlM1allYUmxaMjl5ZVgwZ2FXNTBaWEpsYzNSelBYdDBhR2x6TG5OMFlYUmxMbWx1ZEdWeVpYTjBjMzBnYzJWMFNXNTBaWEpsYzNSelBYdDBhR2x6TG5ObGRFbHVkR1Z5WlhOMGMzMGdMejRxTDMxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEUxNVVISnZabWxzWlVsdWRHVnlaWE4wY3lCcGJuUmxjbVZ6ZEhNOWUzUm9hWE11YzNSaGRHVXVhVzUwWlhKbGMzUnpmU0J6WlhSSmJuUmxjbVZ6ZEhNOWUzUm9hWE11YzJWMFNXNTBaWEpsYzNSemZTQXZQbHh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCT2IzUnBabWxqWVhScGIyNXpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2libTkwYVdacFkyRjBhVzl1YzF3aVBseHlYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjl1ZEdGcGJtVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQThhR1ZoWkdWeUlHTnNZWE56VG1GdFpUMWNJbkJoWjJVdGFHVmhaR1Z5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4b01UNU9iM1JwWm1sallYUnBiMjV6SUR4emJXRnNiRDVtY205dFBDOXpiV0ZzYkQ0Z1czTnBkR1V1WTI5dFhUd3ZhREUrWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY205M1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRFeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFJoWW14bElHTnNZWE56VG1GdFpUMWNJblJoWW14bElIUmhZbXhsTFc1dmRHbG1hV05oZEdsdmJuTmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFHVmhaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIUnlQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBhQ0JqYjJ4VGNHRnVQVndpTWx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRk5wZEdVdVkyOXRJR2hoY3lCeVpYRjFaWE4wWldRZ2RHOGdZV1JrSUdadmJHeHZkMmx1WnlCcGJuUmxjbVZ6ZEhNZ2RHOGdlVzkxY2lCd2NtOW1hV3hsTGp4aWNpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzIxaGJHdytVMlZsSUR4aElHaHlaV1k5WENJalhDSStjMlYwZEdsdVozTThMMkUrSUhSdklHTm9ZVzVuWlNCMGFHVWdaR1ZtWVhWc2RDQmlaV2hoZG1sdmNpQm1iM0lnZEdocGN5QjNhVzVrYjNjdVBDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBhRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh1WVhZZ1kyeGhjM05PWVcxbFBWd2lkR0ZpYkdVdFptbHNkR1Z5SUhSbGVIUXRjbWxuYUhSY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0YVc1c2FXNWxYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBJR05zWVhOelRtRnRaVDFjSW5SbGVIUXRiWFYwWldSY0lqNVRhRzkzT2p3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJR2h5WldZOVhDSWpYQ0krVUdWdVpHbHVaend2WVQ0OEwyeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FUNDhZU0JvY21WbVBWd2lJMXdpUGtGalkyVndkR1ZrUEM5aFBqd3ZiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQanhoSUdoeVpXWTlYQ0lqWENJK1VtVnFaV04wWldROEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2tnWTJ4aGMzTk9ZVzFsUFZ3aVlXTjBhWFpsWENJK1BHRWdhSEpsWmoxY0lpTmNJajVCYkd3OEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTFiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Ym1GMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRISStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNSb1pXRmtQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSaWIyUjVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGRISStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIUm9JSE5qYjNCbFBWd2ljbTkzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZEZ3aVBsUmxibTVwY3p3dmMzQmhiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM1JvUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MWJDQmpiR0Z6YzA1aGJXVTlYQ0pzYVhOMExXbHViR2x1WlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITnRZV3hzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdRMkYwWldkdmNuazZJRHh6ZEhKdmJtYytVM0J2Y25SelBDOXpkSEp2Ym1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGTnZkWEpqWlRvZ1NXMXdiM0owWldRZ1puSnZiU0E4YzNSeWIyNW5Qa1poWTJWaWIyOXJQQzl6ZEhKdmJtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRkpsY1hWbGMzUmxaQ0J2YmlCQVJHRjBaVlJwYldVdVRtOTNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZkV3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4ZEdRZ1kyeGhjM05PWVcxbFBWd2lkR1Y0ZEMxeWFXZG9kRndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0dFozSnZkWEJjSWlCeWIyeGxQVndpWjNKdmRYQmNJaUJoY21saExXeGhZbVZzUFZ3aUxpNHVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YkdsdWF5QmlkRzR0YzNWalkyVnpjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFdOb1pXTnJYQ0krUEM5emNHRnVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1ocFpHUmxiaTE0YzF3aVBrRndjSEp2ZG1VOEwzTndZVzQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFluVjBkRzl1SUhSNWNHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFd4cGJtc2dZblJ1TFdSaGJtZGxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFhKbGJXOTJaVndpUGp3dmMzQmhiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKb2FXUmtaVzR0ZUhOY0lqNVNaVzF2ZG1VOEwzTndZVzQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBjajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIUnlQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBhQ0J6WTI5d1pUMWNJbkp2ZDF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkRndpUGxOcmFXbHVaend2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSnNhWE4wTFdsdWJHbHVaVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOdFlXeHNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1EyRjBaV2R2Y25rNklEeHpkSEp2Ym1jK1UzQnZjblJ6UEM5emRISnZibWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZOdmRYSmpaVG9nU1cxd2IzSjBaV1FnWm5KdmJTQThjM1J5YjI1blBrWmhZMlZpYjI5clBDOXpkSEp2Ym1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGSmxjWFZsYzNSbFpDQnZiaUJBUkdGMFpWUnBiV1V1VG05M1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRXdytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThkR1FnWTJ4aGMzTk9ZVzFsUFZ3aWRHVjRkQzF5YVdkb2RGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmlkRzR0WjNKdmRYQmNJaUJ5YjJ4bFBWd2laM0p2ZFhCY0lpQmhjbWxoTFd4aFltVnNQVndpTGk0dVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbUowYmlCaWRHNHRiR2x1YXlCaWRHNHRjM1ZqWTJWemMxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1aaElHWmhMV05vWldOclhDSStQQzl6Y0dGdVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbWhwWkdSbGJpMTRjMXdpUGtGd2NISnZkbVU4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WW5WMGRHOXVJSFI1Y0dVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMV3hwYm1zZ1luUnVMV1JoYm1kbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1aaElHWmhMWEpsYlc5MlpWd2lQand2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0pvYVdSa1pXNHRlSE5jSWo1U1pXMXZkbVU4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSeVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFDQnpZMjl3WlQxY0luSnZkMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaUJpZEc0dGMyMGdZblJ1TFdSbFptRjFiSFJjSWo1WGFXNWtjM1Z5Wm1sdVp6d3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNSb1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDFiQ0JqYkdGemMwNWhiV1U5WENKc2FYTjBMV2x1YkdsdVpWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE50WVd4c1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUTJGMFpXZHZjbms2SUR4emRISnZibWMrVTNCdmNuUnpQQzl6ZEhKdmJtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRk52ZFhKalpUb2dTVzF3YjNKMFpXUWdabkp2YlNBOGMzUnliMjVuUGtaaFkyVmliMjlyUEM5emRISnZibWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZKbGNYVmxjM1JsWkNCdmJpQkFSR0YwWlZScGJXVXVUbTkzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2ZFd3K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGRHUWdZMnhoYzNOT1lXMWxQVndpZEdWNGRDMXlhV2RvZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKaWRHNHRaM0p2ZFhCY0lpQnliMnhsUFZ3aVozSnZkWEJjSWlCaGNtbGhMV3hoWW1Wc1BWd2lMaTR1WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGJHbHVheUJpZEc0dGMzVmpZMlZ6YzF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExXTm9aV05yWENJK1BDOXpjR0Z1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltaHBaR1JsYmkxNGMxd2lQa0Z3Y0hKdmRtVThMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxXeHBibXNnWW5SdUxXUmhibWRsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExYSmxiVzkyWlZ3aVBqd3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSm9hV1JrWlc0dGVITmNJajVTWlcxdmRtVThMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwY2o1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZkR0p2WkhrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBZV0pzWlQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJtRjJJR05zWVhOelRtRnRaVDFjSW5SbGVIUXRjbWxuYUhSY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSndZV2RwYm1GMGFXOXVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHNhU0JqYkdGemMwNWhiV1U5WENKa2FYTmhZbXhsWkZ3aVBqeGhJR0Z5YVdFdGJHRmlaV3c5WENKUWNtVjJhVzkxYzF3aUlHaHlaV1k5WENJalhDSStQSE53WVc0Z1lYSnBZUzFvYVdSa1pXNDlYQ0owY25WbFhDSSt3cXNnVUhKbGRtbHZkWE04TDNOd1lXNCtQQzloUGp3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FTQmpiR0Z6YzA1aGJXVTlYQ0poWTNScGRtVmNJajQ4WVNCb2NtVm1QVndpSTF3aVBqRWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2ljM0l0YjI1c2VWd2lQaWhqZFhKeVpXNTBLVHd2YzNCaGJqNDhMMkUrUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJR2h5WldZOVhDSWpYQ0krTWp3dllUNDhMMnhwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2srUEdFZ2FISmxaajFjSWlOY0lqNHpQQzloUGp3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FUNDhZU0JvY21WbVBWd2lJMXdpUGpROEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGp4aElHaHlaV1k5WENJalhDSStOVHd2WVQ0OEwyeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytQR0VnWVhKcFlTMXNZV0psYkQxY0lrNWxlSFJjSWlCb2NtVm1QVndpSTF3aVBqeHpjR0Z1SUdGeWFXRXRhR2xrWkdWdVBWd2lkSEoxWlZ3aVBrNWxlSFFnd3JzOEwzTndZVzQrUEM5aFBqd3ZiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzVnNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Ym1GMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwzTmxZM1JwYjI0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1NXMXdiM0owSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOGMyVmpkR2x2YmlCeWIyeGxQVndpZEdGaWNHRnVaV3hjSWlCamJHRnpjMDVoYldVOVhDSjBZV0l0Y0dGdVpTQm1ZV1JsSUdGamRHbDJaU0JwYmx3aUlHbGtQVndpYVcxd2IzSjBYQ0krWEhKY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBZV2x1WlhKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4b1pXRmtaWElnWTJ4aGMzTk9ZVzFsUFZ3aWNHRm5aUzFvWldGa1pYSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR2d6UGk0dUxubHZkWElnYVc1MFpYSmxjM1J6SUdGamNtOXpjeUJoY0hCeklHRnVaQ0JrWlhacFkyVnpMand2YURNK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJobFlXUmxjajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNtOTNYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhoekxUWWdZMjlzTFd4bkxUUmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0NCamJHRnpjMDVoYldVOVhDSnNaV0ZrWENJK1EyOXVibVZqZENCM2FYUm9JRVpoWTJWaWIyOXJJVHd2Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CMWJHd3RiR1ZtZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wY205dVp6NU1ZWE4wSUhONWJtTTZQQzl6ZEhKdmJtYytJREkxSUdsdWRHVnlaWE4wY3lBb05TQnVaWGNwUEdKeUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSeWIyNW5Qa3hoYzNRZ2MzbHVZMlZrSUc5dU9qd3ZjM1J5YjI1blBpQkFSR0YwWlZScGJXVXVUbTkzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0VnYUhKbFpqMWNJaU5jSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxYTnRJR0owYmkxa1pXWmhkV3gwSUhCMWJHd3RjbWxuYUhSY0lqNURiMjV1WldOMFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROaUJqYjJ3dGJHY3ROQ0JqYjJ3dGJHY3RiMlptYzJWMExURmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0NCamJHRnpjMDVoYldVOVhDSnNaV0ZrWENJK1NXMXdiM0owSUhsdmRYSWdjR2x1Y3lCbWNtOXRJRkJwYm5SbGNtVnpkQ0U4TDNBK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKd2RXeHNMV3hsWm5SY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEhKdmJtYytUR0Z6ZENCemVXNWpPand2YzNSeWIyNW5QaUF5TlNCcGJuUmxjbVZ6ZEhNZ0tEVWdibVYzS1R4aWNpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMGNtOXVaejVNWVhOMElITjVibU5sWkNCdmJqbzhMM04wY205dVp6NGdRRVJoZEdWVWFXMWxMazV2ZDF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhoSUdoeVpXWTlYQ0lqWENJZ1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZENCd2RXeHNMWEpwWjJoMFhDSStTVzF3YjNKMFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdoeUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5KdmQxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzE0Y3kweE1pQmpiMnd0YkdjdE9Wd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhvTXo1VWNua2dlVzkxY2lCaGNIQWhQQzlvTXo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNENU1hV3RsSUdOdmJuUnliMnhzYVc1bklIUm9aU0IzWldJL1B6OGdWMlVnZEdodmRXZG9kQ0J6Ynk0Z1QzVnlJRzVwWm5SNUlHRndjQ0JzWlhSeklIbHZkU0IwWVd0bElHbDBJSFJ2SUhSb1pTQnVaWGgwSUd4bGRtVnNJR0Z1WkNCd2RYUnpJR0ZzYkNCNWIzVnlJR2x1ZEdWeWJtVjBMWGRwWkdVZ2NISmxabVZ5Wlc1alpYTWdhVzRnYjI1bElHTmxiblJ5WVd3Z2NHeGhZMlVnYzI4Z2VXOTFJR05oYmlCeGRXbGphMng1SUdGdVpDQmxZWE5wYkhrZ2RtbGxkeUJoYm1RZ1lXTmpaWEIwSUhsdmRYSWdibTkwYVdacFkyRjBhVzl1Y3lCM2FYUm9JR0VnWm1WM0lITjBaWEJ6TGp3dmNENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQjFiR3d0YkdWbWRGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdFZ2FISmxaajFjSWlOY0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMWE50SUdKMGJpMWtaV1poZFd4MFhDSStaRzkzYm14dllXUWdabTl5SUdGdVpISnZhV1E4TDJFK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThZU0JvY21WbVBWd2lJMXdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGMyMGdZblJ1TFdSbFptRjFiSFJjSWo1a2IzZHViRzloWkNCbWIzSWdhWEJvYjI1bFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNIVnNiQzF5YVdkb2RGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUjI5MElHRnVJR0Z3Y0Q4Z1RtOTNJRHhoSUdoeVpXWTlYQ0lqWENJZ1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZEZ3aVBrZGxibVZ5WVhSbElHRWdjM2x1WXlCamIyUmxJVHd2WVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdQQzl6WldOMGFXOXVQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRk5sZEhScGJtZHpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2ljMlYwZEdsdVozTmNJajVjY2x4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJuUmhhVzVsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdobFlXUmxjaUJqYkdGemMwNWhiV1U5WENKd1lXZGxMV2hsWVdSbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThhREUrVTJWMGRHbHVaM01nUEhOdFlXeHNQbTl1UEM5emJXRnNiRDRnVzNOcGRHVXVZMjl0WFR3dmFERStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHdQbGx2ZFNCaGNtVWdhVzRnWTI5dWRISnZiQ0VnUTJoaGJtZGxJSGx2ZFhJZ2MyVjBkR2x1WjNNZ2FHVnlaUzQ4TDNBK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJobFlXUmxjajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVptOXliUzFvYjNKcGVtOXVkR0ZzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm05eWJTMW5jbTkxY0NCbWIzSnRMV2R5YjNWd0xYTnRYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4aFltVnNJR2gwYld4R2IzSTlYQ0p3WlhKemIyNWhiR2w2WVhScGIyNWNJaUJqYkdGemMwNWhiV1U5WENKamIyd3RlSE10TnlCamIyd3RjMjB0TlNCamIyd3RiV1F0TkNCamIyd3RiR2N0TXlCamIyNTBjbTlzTFd4aFltVnNYQ0krVUdWeWMyOXVZV3hwZW1GMGFXOXVQQzlzWVdKbGJENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzE0Y3kwMUlHTnZiQzF6YlMwM0lHTnZiQzF0WkMwNElHTnZiQzFzWnkwNVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YVc1d2RYUWdkSGx3WlQxY0ltTm9aV05yWW05NFhDSWdibUZ0WlQxY0luQmxjbk52Ym1Gc2FYcGhkR2x2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbk4zYVhSamFGd2lJQzgrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4YUhJZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV2R5YjNWd0lHWnZjbTB0WjNKdmRYQXRjMjFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHRmlaV3dnYUhSdGJFWnZjajFjSW5OdmNuUnBibWRjSWlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE55QmpiMnd0YzIwdE5TQmpiMnd0YldRdE5DQmpiMnd0YkdjdE15QmpiMjUwY205c0xXeGhZbVZzWENJK1UyOXlkR2x1Wnp3dmJHRmlaV3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROU0JqYjJ3dGMyMHROeUJqYjJ3dGJXUXRPQ0JqYjJ3dGJHY3RPVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITmxiR1ZqZENCamJHRnpjejFjSW5ObGJHVmpkSEJwWTJ0bGNsd2lJR2xrUFZ3aWMyOXlkR2x1WjF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YjNCMGFXOXVQbGx2ZFhJZ2FXNTBaWEpsYzNSelBDOXZjSFJwYjI0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh2Y0hScGIyNCtVMmwwWlNCa1pXWmhkV3gwUEM5dmNIUnBiMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTmxiR1ZqZEQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4b2NpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltWnZjbTB0WjNKdmRYQWdabTl5YlMxbmNtOTFjQzF6YlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHNZV0psYkNCb2RHMXNSbTl5UFZ3aVlYVjBiM05oZG1WY0lpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROeUJqYjJ3dGMyMHROU0JqYjJ3dGJXUXROQ0JqYjJ3dGJHY3RNeUJqYjI1MGNtOXNMV3hoWW1Wc1hDSStRWFYwYjNOaGRtVThMMnhoWW1Wc1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRVZ1kyOXNMWE50TFRjZ1kyOXNMVzFrTFRnZ1kyOXNMV3huTFRsY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhwYm5CMWRDQjBlWEJsUFZ3aVkyaGxZMnRpYjNoY0lpQnVZVzFsUFZ3aVlYVjBiM05oZG1WY0lpQmpiR0Z6YzA1aGJXVTlYQ0p6ZDJsMFkyaGNJaUF2UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdoeUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVptOXliUzFuY205MWNDQm1iM0p0TFdkeWIzVndMWE50WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHeGhZbVZzSUdoMGJXeEdiM0k5WENKa1pXeGxkR1ZjSWlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE55QmpiMnd0YzIwdE5TQmpiMnd0YldRdE5DQmpiMnd0YkdjdE15QmpiMjUwY205c0xXeGhZbVZzWENJK1JHVnNaWFJsSUcxNUlIQnliMlpwYkdVZ1BITnRZV3hzUG1GMFBDOXpiV0ZzYkQ0Z1BHaytXM05wZEdVdVkyOXRYVHd2YVQ0OEwyeGhZbVZzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYaHpMVFVnWTI5c0xYTnRMVGNnWTI5c0xXMWtMVGdnWTI5c0xXeG5MVGxjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGhJR2h5WldZOVhDSWpYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdGdVoyVnlYQ0krUkdWc1pYUmxQQzloUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQThMM05sWTNScGIyNCtYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdVSEpwZG1GamVTQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQSE5sWTNScGIyNGdjbTlzWlQxY0luUmhZbkJoYm1Wc1hDSWdZMnhoYzNOT1lXMWxQVndpZEdGaUxYQmhibVVnWm1Ga1pTQmhZM1JwZG1VZ2FXNWNJaUJwWkQxY0luQnlhWFpoWTNsY0lqNWNjbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52Ym5SaGFXNWxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR2hsWVdSbGNpQmpiR0Z6YzA1aGJXVTlYQ0p3WVdkbExXaGxZV1JsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFERStVSEpwZG1GamVUd3ZhREUrWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY205M1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRFd1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEFnWTJ4aGMzTk9ZVzFsUFZ3aWJHVmhaRndpUGt4dmNtVnRJR2x3YzNWdElHUnZiRzl5SUhOcGRDQmhiV1YwTENCamIyNXpaV04wWlhSMWNpQmhaR2x3YVhOamFXNW5JR1ZzYVhRdUlFbHVkR1ZuWlhJZ2JtVmpJRzlrYVc4dUlGQnlZV1Z6Wlc1MElHeHBZbVZ5Ynk0Z1UyVmtJR04xY25OMWN5QmhiblJsSUdSaGNHbGlkWE1nWkdsaGJTNGdVMlZrSUc1cGMya3VJRTUxYkd4aElIRjFhWE1nYzJWdElHRjBJRzVwWW1nZ1pXeGxiV1Z1ZEhWdElHbHRjR1Z5WkdsbGRDNDhMM0ErWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhBK1RHOXlaVzBnYVhCemRXMGdaRzlzYjNJZ2MybDBJR0Z0WlhRc0lHTnZibk5sWTNSbGRIVnlJR0ZrYVhCcGMyTnBibWNnWld4cGRDNGdTVzUwWldkbGNpQnVaV01nYjJScGJ5NGdVSEpoWlhObGJuUWdiR2xpWlhKdkxpQlRaV1FnWTNWeWMzVnpJR0Z1ZEdVZ1pHRndhV0oxY3lCa2FXRnRMaUJUWldRZ2JtbHphUzRnVG5Wc2JHRWdjWFZwY3lCelpXMGdZWFFnYm1saWFDQmxiR1Z0Wlc1MGRXMGdhVzF3WlhKa2FXVjBMand2Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnUEM5elpXTjBhVzl1UGx4eVhHNGdJQ0FnS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc1Y2NseHVkbUZ5SUVGaWIzVjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2lZV0p2ZFhSY0lqNWNjbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52Ym5SaGFXNWxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR2hsWVdSbGNpQmpiR0Z6YzA1aGJXVTlYQ0p3WVdkbExXaGxZV1JsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFXMW5JSE55WXoxY0lpOXBiV0ZuWlhNdmJHOW5ieTE2YVhaMFpYSXVjRzVuWENJZ1lXeDBQVndpWENJZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUR3dmFHVmhaR1Z5UGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwzTmxZM1JwYjI0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzV5WlZKbGJtUmxjaWdwTzF4eVhHNWNjbHh1THlwY2NseHVQQ0ZFVDBOVVdWQkZJR2gwYld3K1hISmNianhvZEcxc1BseHlYRzRnSUR4b1pXRmtQbHh5WEc0Z0lDQWdQRzFsZEdFZ1kyaGhjbk5sZEQxY0luVjBaaTA0WENJZ0x6NWNjbHh1SUNBZ0lEeHRaWFJoSUc1aGJXVTlYQ0oyYVdWM2NHOXlkRndpSUdOdmJuUmxiblE5WENKM2FXUjBhRDFrWlhacFkyVXRkMmxrZEdnc0lHbHVhWFJwWVd3dGMyTmhiR1U5TVM0d1hDSStYSEpjYmlBZ0lDQThkR2wwYkdVK1BDOTBhWFJzWlQ1Y2NseHVJQ0FnSUR4c2FXNXJJSEpsYkQxY0luTjBlV3hsYzJobFpYUmNJaUIwZVhCbFBWd2lkR1Y0ZEM5amMzTmNJaUJvY21WbVBWd2lRMjl1ZEdWdWRDOTJaRzVoTG0xcGJpNWpjM05jSWo1Y2NseHVJQ0FnSUR4elkzSnBjSFFnZEhsd1pUMWNJblJsZUhRdmFtRjJZWE5qY21sd2RGd2lJSE55WXoxY0lsTmpjbWx3ZEhNdmJXOWtaWEp1YVhweUxUSXVOaTR5TG1welhDSStQQzl6WTNKcGNIUStYSEpjYmlBZ1BDOW9aV0ZrUGx4eVhHNGdJRHhpYjJSNVBseHlYRzVjY2x4dUlDQWdJRHdoTFMwZ2RtUnVZU0JoY0hBZ0xTMCtYSEpjYmlBZ0lDQThjMlZqZEdsdmJpQmpiR0Z6Y3oxY0luWmtibUZjSWo1Y2NseHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJblprYm1FdFltOWtlVndpUGx4eVhHNWNjbHh1WEhROElTMHRJR052Ym5SaGFXNWxjaUF0TFQ1Y2NseHVYSFE4WkdsMklHTnNZWE56UFZ3aVkyOXVkR0ZwYm1WeVhDSStYSEpjYmx4MElDQThaR2wySUdOc1lYTnpQVndpY205M1hDSStYSEpjYmx4eVhHNWNkQ0FnSUNBOElTMHRJSE5wWkdWaVlYSWdMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMCtYSEpjYmx4MElDQWdJRHhrYVhZZ1kyeGhjM005WENKemFXUmxZbUZ5SUdOdmJDMTRjeTAwSUdOdmJDMXpiUzB6SUdOdmJDMXNaeTB5WENJK1hISmNibHh5WEc1Y2RDQWdJQ0E4TDJScGRqNDhJUzB0SUM5emFXUmxZbUZ5SUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwK1hISmNibHh5WEc1Y2RDQWdJQ0E4SVMwdElHMWhhVzRnWTI5dWRHVnVkQ0F0TFQ1Y2NseHVYSFFnSUNBZ1BHUnBkaUJqYkdGemN6MWNJbTFoYVc0dFkyOXVkR1Z1ZENCamIyd3RlSE10T0NCamIyd3RlSE10YjJabWMyVjBMVFFnWTI5c0xYTnRMVGtnWTI5c0xYTnRMVzltWm5ObGRDMHpJR052YkMxc1p5MHhNQ0JqYjJ3dGJHY3RiMlptYzJWMExUSmNJajVjY2x4dVhIUWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lkR0ZpTFdOdmJuUmxiblJjSWo1Y2NseHVYSEpjYmx4MFhIUThJUzB0SUhObFkzUnBiMjQ2SUcxNUlIQnliMlpwYkdVZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzVjY2x4dVhIUmNkQ0FnSUNBOEwyUnBkajQ4SVMwdElDOXRlU0J3Y205bWFXeGxJR1p2Y20wZ0xTMCtYSEpjYmx4eVhHNWNkRngwSUNBOEwyUnBkajVjY2x4dVhIUmNkRHd2YzJWamRHbHZiajQ4SVMwdElDOXpaV04wYVc5dU9pQnRlU0J3Y205bWFXeGxJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRQbHh5WEc1Y2NseHVYSFJjZER3aExTMGdjMlZqZEdsdmJqb2dibTkwYVdacFkyRjBhVzl1Y3lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThJUzB0SUM5elpXTjBhVzl1T2lCdWIzUnBabWxqWVhScGIyNXpJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRQbHh5WEc1Y2NseHVYSFJjZER3aExTMGdjMlZqZEdsdmJqb2dhVzF3YjNKMElDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUENFdExTQXZjMlZqZEdsdmJqb2dhVzF3YjNKMElDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMCtYSEpjYmx4eVhHNWNkRngwUENFdExTQnpaV04wYVc5dU9pQnpaWFIwYVc1bmN5QXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzArWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOElTMHRJSE5sWTNScGIyNDZJSE5sZEhScGJtZHpJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFQ1Y2NseHVYSEpjYmx4MFhIUThJUzB0SUhObFkzUnBiMjQ2SUhCeWFYWmhZM2tnTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3aExTMGdMM05sWTNScGIyNDZJSEJ5YVhaaFkza2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFQ1Y2NseHVYSEpjYmx4MFhIUThJUzB0SUhObFkzUnBiMjQ2SUdGaWIzVjBJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzArWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOElTMHRJQzl6WldOMGFXOXVPaUJoWW05MWRDQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzVjY2x4dVhIUWdJQ0FnSUNBOEwyUnBkajVjY2x4dVhIUWdJQ0FnUEM5a2FYWStQQ0V0TFNBdmJXRnBiaUJqYjI1MFpXNTBJQzB0UGx4eVhHNWNjbHh1WEhRZ0lEd3ZaR2wyUGx4eVhHNWNjbHh1WEhRZ0lEd2hMUzBnWTJ4dmMyVWdZWEJ3SUMwdFBseHlYRzVjZENBZ1BHRWdhSEpsWmoxY0lpTmpiRzl6WlZaa2JtRmNJaUJrWVhSaExYUnZaMmRzWlQxY0luUnZiMngwYVhCY0lpQjBhWFJzWlQxY0lrTnNhV05ySUhSdklHTnNiM05sWENJZ1kyeGhjM005WENKamJHOXpaVlprYm1GY0lqNDhjM0JoYmlCamJHRnpjejFjSW1aaElHWmhMWEJ2ZDJWeUxXOW1abHdpUGp3dmMzQmhiajQ4TDJFK1hISmNibHh5WEc1Y2REd3ZaR2wyUGp3aExTMGdMMk52Ym5SaGFXNWxjaUF0TFQ1Y2NseHVYSEpjYmx4MFBDRXRMU0J2Y0dWdUlHRndjQ0F0TFQ1Y2NseHVYSFE4WVNCb2NtVm1QVndpSTI5d1pXNVdaRzVoWENJZ1pHRjBZUzEwYjJkbmJHVTlYQ0owYjI5c2RHbHdYQ0lnZEdsMGJHVTlYQ0pEYkdsamF5QjBieUJ2Y0dWdUlGWkVUa0ZjSWlCamJHRnpjejFjSW1KMGJpQmlkRzR0YzIwZ1luUnVMWEJ5YVcxaGNua2diM0JsYmxaa2JtRmNJajVQY0dWdUlIWkVUa0U4TDJFK1hISmNiaUFnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnUEM5elpXTjBhVzl1UGp3aExTMGdMM1prYm1FZ1lYQndJQzB0UGx4eVhHNWNjbHh1SUNBZ0lEd2hMUzBnVjJWaWMybDBaU0J3YkdGalpXaHZiR1JsY2lBdExUNWNjbHh1SUNBZ0lEeHBiV2NnYzNKalBWd2lRMjl1ZEdWdWRDOXBiV0ZuWlhNdmRHbGphMlYwY0hKdkxuQnVaMXdpSUdGc2REMWNJbHdpSUM4K1hISmNibHh5WEc0Z0lDQWdQQ0V0TFNCVFkzSnBjSFJ6SUMwdFBseHlYRzRnSUNBZ1BITmpjbWx3ZENCMGVYQmxQVndpZEdWNGRDOXFZWFpoYzJOeWFYQjBYQ0lnYzNKalBWd2lVMk55YVhCMGN5OWlkVzVrYkdWekwycHhkV1Z5ZVM1cWMxd2lQand2YzJOeWFYQjBQbHh5WEc0Z0lDQWdQSE5qY21sd2RDQjBlWEJsUFZ3aWRHVjRkQzlxWVhaaGMyTnlhWEIwWENJZ2MzSmpQVndpVTJOeWFYQjBjeTlpZFc1a2JHVnpMMkp2YjNSemRISmhjQzVxYzF3aVBqd3ZjMk55YVhCMFBseHlYRzRnSUNBZ1BITmpjbWx3ZENCMGVYQmxQVndpZEdWNGRDOXFZWFpoYzJOeWFYQjBYQ0lnYzNKalBWd2lVMk55YVhCMGN5OWlkVzVrYkdWekwzWmtibUV1YW5OY0lqNDhMM05qY21sd2RENWNjbHh1WEhKY2JpQWdQQzlpYjJSNVBseHlYRzQ4TDJoMGJXdytYSEpjYmlvdlhISmNiaUpkZlE9PSJdfQ==
