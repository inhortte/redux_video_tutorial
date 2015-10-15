'use strict';

var Moment = require('moment');
var data = require('./static_data');
var docCookies = require('./cookie');

function reRender() {
  React.render(React.createElement(VdnaMenu, { tabList: tabList }), document.getElementById('vdnamenu'));
};

function addClickEvents() {
  var that = this;
  $("*[vdnaclass]").each(function (index, el) {
    $(el).on('click', function (e) {
      e.preventDefault();
      var interestArr = $(el).attr('vdnaclass').split(/,/);
      console.log('interestArr: ' + JSON.stringify(interestArr));
      interestArr.forEach(function (interest) {
        var trimmed = interest.trim();
        if (data.staticInterests[trimmed]) {
          data.staticInterests[trimmed]['clicks'] += 1;
          data.staticInterests[trimmed]['selected'] = true;
        } else {
          var relatedInterests = interestArr.slice(0, interestArr.indexOf(interest)).add(interestArr.slice(interestArr.indexOf(interest) + 1));
          data.staticInterests[trimmed] = {
            source: 'ticketpro', clicks: 1, added: Date.now(), selected: true,
            related: relatedInterests.map(function (interest) {
              return interest.trim();
            }).join(',')
          };
        }
      });
      reRender();
      return false;
    });
  });
};

function formatDate(rawDate, add_time) {
  var format = add_time !== undefined && add_time ? "DD MMM YYYY HH:mm" : "DD MMM YYYY";
  return Moment(rawDate).format(format);
};

var tabList = [{ id: 1, href: 'profile', text: 'Edit My Profile', selected: true }, { id: 2, href: 'notifications', text: 'View Notifications', selected: false }, { id: 3, href: 'import', text: 'Import and Sync', selected: false }, { id: 4, href: 'settings', text: 'Change Settings', selected: false }, { id: 6, href: 'about', text: 'About', selected: false }];

var VdnaMenu = React.createClass({
  displayName: 'VdnaMenu',

  getInitialState: function getInitialState() {
    return {
      tabList: this.props.tabList,
      currentTab: 1,
      vdnaCount: 0
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
  setVdnaCount: function setVdnaCount() {
    var vdnaCount = $("*[vdnaclass]").size();
    this.setState({ vdnaCount: vdnaCount });
  },
  componentDidMount: function componentDidMount() {
    console.log('something is happening here');
  },
  render: function render() {
    var tabContent;
    switch (this.state.currentTab) {
      case 1:
        tabContent = React.createElement(MyProfile, { changeTab: this.changeTab, vdnaCount: this.state.vdnaCount, setVdnaCount: this.setVdnaCount });
        break;
      case 2:
        tabContent = React.createElement(Notifications, null);
        break;
      case 3:
        tabContent = React.createElement(Import, null);
        break;
      case 4:
        tabContent = React.createElement(Settings, { setVdnaCount: this.setVdnaCount });
        break;
      case 5:
        tabContent = React.createElement(Privacy, null);
        break;
      case 6:
        tabContent = React.createElement(About, null);
        break;
      default:
        tabContent = React.createElement(MyProfile, { changeTab: this.changeTab });
    }
    return React.createElement(
      'section',
      { className: 'vdna' },
      React.createElement(
        'div',
        { className: 'vdna-body' },
        React.createElement(
          'div',
          { className: 'container-fluid' },
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

var OnOff = React.createClass({
  displayName: 'OnOff',

  handleChange: function handleChange() {
    console.log('power change');
    data.power = !data.power;
    if (data.power) {
      data.sorting = 1;
    } else {
      data.sorting = 0;
    }
    this.setState({ power: data.power });
    data.showVdnaDivs();
  },
  getInitialState: function getInitialState() {
    return { power: data.power };
  },
  componentDidMount: function componentDidMount() {
    this.setState({ power: data.power });
    $(React.findDOMNode(this.refs.power)).on('click', function (e) {
      console.log('CLICKED!!!!!!!!!!!!!!!');
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { onClick: this.handleChange },
        React.createElement('input', { id: 'power', name: 'power', ref: 'power', type: 'checkbox', className: 'switch', checked: this.state.power, onChange: this.handleChange })
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
            ' ticketpro.cz'
          )
        )
      )
    );
  }
});

/*
var MyProfileCategories = React.createClass({
  handleChange: function() {
    console.log(React.findDOMNode(this.refs.category).value);
    this.props.getCategoryOnChange(React.findDOMNode(this.refs.category).value);
  },
  getInitialState: function() {
    return {
      categories: this.props.categories
    };
  },
  render: function() {
    var that = this;
    var categoryNodes = this.state.categories.map(function(category) {
      return(
        <MyProfileCategory category={category} />
      );
    });
    return (
      <div className="form-group form-group-sm">
        <label htmlFor="category" className="col-sm-2 control-label">Category</label>
        <div className="col-sm-10">
          <select className="selectpicker" id="category" ref="category" onChange={this.handleChange}>
            {categoryNodes}
          </select>
        </div>
      </div>
    );
  }
});
*/

var MyProfileCategories = React.createClass({
  displayName: 'MyProfileCategories',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'form-group form-group-sm' },
        React.createElement(
          'label',
          { className: 'col-sm-2 control-label' },
          'Category:'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-6' },
          React.createElement(
            'div',
            { className: 'panel' },
            React.createElement(
              'div',
              { className: 'panel-body' },
              'Events (Total: ',
              this.props.vdnaCount,
              ')'
            )
          )
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
    var that = this;
    $("#privacySettingSlider").slider({ min: 1, max: 5, step: 1, value: 3 });
    $("#privacySettingSlider").on("slide", function (n) {
      data.setPrivacySlider(n.value);
      rerender();
      this.props.setVdnaCount();
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
    if (this.state.currentInterest === interest) {
      this.setState({ detailsCollapsed: !this.state.detailsCollapsed });
    } else {
      this.setState({
        currentInterest: interest,
        currentDetails: details,
        detailsCollapsed: false,
        addInterestCollapsed: true
      });
    }
  },
  collapseDetails: function collapseDetails() {
    this.setState({ detailsCollapsed: true });
  },
  getCurrentInterests: function getCurrentInterests() {
    var that = this;
    return Object.keys(this.props.interests).reduce(function (is, i) {
      if (that.props.interests[i]['selected']) {
        is[i] = that.props.interests[i];
      }
      return is;
    }, {});
  },
  getInitialState: function getInitialState() {
    // ---------------------------- is there a cookie?
    // Well, if there is, Sonny, we'd better set all of the
    // static_data 'selected'z to false.
    if (docCookies.hasItem('vdna')) {
      data.unselectAllStaticInterests();
      var cookieEncodedInterests = docCookies.getItem('vdna').split(/,/);
      var cookieInterestArr,
          extraInterests = [];
      if (cookieEncodedInterests.length > 2) {
        cookieInterestArr = cookieEncodedInterests.slice(0, 2);
        extraInterests = cookieEncodedInterests.slice(2)[0].split(/:::/);
      } else {
        cookieInterestArr = cookieEncodedInterests;
      }
      var cookieInterests = data.decArrToInterests(cookieInterestArr.map(function (part) {
        return parseInt(part);
      })).concat(extraInterests);
      console.log('cookie and extra interests: ' + JSON.stringify(cookieInterests));

      cookieInterests.forEach(function (interest) {
        if (data.staticInterests[interest] !== undefined) {
          data.staticInterests[interest]['selected'] = true;
        } else {
          data.staticInterests[interest.toLowerCase()] = {
            source: 'facebook', clicks: 0, added: Date.now(), selected: true, related: ''
          };
        }
      });
    }
    // ----------------------------

    return { currentInterest: null,
      currentDetails: {},
      detailsCollapsed: true,
      addInterestCollapsed: true };
  },
  componentDidMount: function componentDidMount() {
    data.showVdnaDivs();
    this.props.setVdnaCount();
  },
  // ---------- Save the vdna cookie
  componentDidUpdate: function componentDidUpdate() {
    if (data.autosave) {
      var interestKeys = Object.keys(this.getCurrentInterests());
      var decArr = data.interestsToDecArr(interestKeys);
      var decMapping = decArr.toString();
      var extraInterests = data.tallyExtraInterests(interestKeys);
      if (extraInterests.length > 0) {
        decMapping += ',' + extraInterests;
      }
      console.log('dec & extra mapping: ' + decMapping);
      docCookies.setItem('vdna', decMapping, Infinity);
    }
  },
  showHideAddLike: function showHideAddLike() {
    this.setState({ addInterestCollapsed: !this.state.addInterestCollapsed,
      detailsCollapsed: true });
  },
  hideAddLike: function hideAddLike() {
    this.setState({ addInterestCollapsed: true });
  },
  render: function render() {
    var that = this;
    var interestNodes = Object.keys(this.props.interests).filter(function (interest) {
      return that.props.interests[interest]['selected'];
    }).map(function (interest) {
      return React.createElement(MyProfileInterest, { key: interest, interest: interest, showDetails: that.showDetails.bind(that, interest, that.props.interests[interest]) });
    });
    var relatedInterests = (this.state.currentInterest ? this.state.currentDetails['related'].split(/,/) : []).filter(function (relatedInterest) {
      return relatedInterest.length > 0 && Object.keys(that.getCurrentInterests()).indexOf(relatedInterest) === -1;
    });
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
            { id: 'addLike', onClick: this.showHideAddLike, type: 'submit', role: 'button', className: 'btn btn-sm btn-success', 'aria-expanded': 'false', 'aria-controls': 'addLike' },
            React.createElement('span', { className: 'glyphicon glyphicon-plus' }),
            ' Add'
          ),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-sm btn-default', onClick: this.props.changeTab.bind(null, 3) },
            'Import'
          )
        )
      ),
      React.createElement(MyProfileAddAnInterest, { interests: this.getCurrentInterests(), collapse: this.state.addInterestCollapsed, hideAddLike: this.hideAddLike, setVdnaCount: this.props.setVdnaCount }),
      React.createElement(MyProfileLikeDetails, { currentInterest: this.state.currentInterest, currentDetails: this.state.currentDetails, relatedInterests: relatedInterests, collapse: this.state.detailsCollapsed, collapseDetails: this.collapseDetails, setVdnaCount: this.props.setVdnaCount })
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

  render: function render() {
    var that = this;
    var currentInterestKeys = Object.keys(this.props.interests);
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function (interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    var availableInterestNodes = availableInterestKeys.map(function (interest) {
      return React.createElement(MyProfileAvailableInterest, { availableInterest: interest, setVdnaCount: that.props.setVdnaCount });
    });
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if (!this.props.collapse) {
      html = React.createElement(
        'div',
        { className: baseDivStyles.join(' '), id: 'addAnInterest' },
        React.createElement(
          'label',
          { className: 'col-sm-2 control-label' },
          'More on this page'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-6' },
          availableInterestNodes
        )
      );
    } else {
      html = React.createElement('div', { className: baseDivStyles.join(' '), id: 'addAnInterest' });
    }
    return React.createElement(
      'div',
      null,
      html
    );
  }
});

var MyProfileAvailableInterest = React.createClass({
  displayName: 'MyProfileAvailableInterest',

  addInterest: function addInterest() {
    data.addInterest(this.props.availableInterest);
    data.gatherVdna();
    data.showVdnaDivs();
    this.props.setVdnaCount();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.availableInterest, key: this.props.availableInterest, role: 'button', onClick: this.addInterest },
      data.capitalize(this.props.availableInterest)
    );
  }
});

var MyProfileLikeDetails = React.createClass({
  displayName: 'MyProfileLikeDetails',

  removeInterest: function removeInterest() {
    // data.unLikeAnInterest(this.props.category, this.props.currentInterest);
    data.unLikeAnInterest(this.props.currentInterest);
    this.props.collapseDetails();
    reRender();
  },
  render: function render() {
    var that = this;
    var relatedInterestsHtml;
    if (this.props.relatedInterests.length > 0) {
      var relatedInterestNodes = this.props.relatedInterests.map(function (interest) {
        return(
          // <MyProfileRelatedInterest category={that.props.category} relatedInterest={interest} />
          React.createElement(MyProfileRelatedInterest, { relatedInterest: interest, setVdnaCount: that.props.setVdnaCount })
        );
      });
      relatedInterestsHtml = React.createElement(
        'p',
        null,
        React.createElement(
          'strong',
          null,
          'Related interests:'
        ),
        relatedInterestNodes
      );
    } else {
      relatedInterestsHtml = '';
    }

    var baseDivStyles = ['form-group', 'form-group-sm'];
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if (this.props.currentInterest && !this.props.collapse) {
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
                      formatDate(this.props.currentDetails['added'])
                    )
                  )
                )
              )
            )
          ),
          relatedInterestsHtml
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
    data.gatherVdna();
    data.showVdnaDivs();
    this.props.setVdnaCount();
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
        { className: 'container-fluid' },
        React.createElement(MyProfileHeader, null),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(MyProfileCategories, { vdnaCount: this.props.vdnaCount }),
          React.createElement(MyProfilePrivacy, { setVdnaCount: this.props.setVdnaCount }),
          React.createElement(MyProfileInterests, { interests: this.state.interests, setInterests: this.setInterests, changeTab: this.props.changeTab, setVdnaCount: this.props.setVdnaCount })
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
        { className: 'container-fluid' },
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

  importFacebookVariableData: function importFacebookVariableData() {
    if (data.facebook.length > 0) {
      var imported = data.facebook.shift();
      data.totalFacebookSync += Object.keys(imported).length;
      console.log('data to be imported: ' + JSON.stringify(imported));
      // data.staticInterests = data.mergeObjects(data.staticInterests, imported);
      Object.assign(data.staticInterests, imported);
      this.setState({
        facebookAllSyncedInterests: data.totalFacebookSync,
        facebookLastSyncedInterests: Object.keys(imported).length,
        facebookLastSynced: Date.now()
      });
      data.facebookConnect = true;
    } else {
      console.log('none left...');
    }
  },
  facebookConnect: function facebookConnect() {
    // ---------- This needs to be elsewhere.
    // facebook plugin
    // -----------

    var that = this;
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {
      FB.init({
        appId: '575682199200822',
        xfbml: true,
        cookie: true,
        status: true,
        version: 'v2.3'
      });
      FB.login(function (res) {
        // console.log(res);
        FB.api('/me/likes', {
          access_token: res.authResponse.accessToken
        }, function (res) {
          // ------------ Only take the first 10 likes (for now)
          var facebookLikes = res.data.slice(0, 5).map(function (cl) {
            return cl.name;
          });
          console.log('facebookLikes: ' + JSON.stringify(facebookLikes));
          // variableData.facebookImportReset();
          var newInterests = {};
          facebookLikes.forEach(function (like) {
            data.importNewLike(like);
          });
          data.pushNewLikes();
          that.importFacebookVariableData();
        });
      }, { scope: 'user_likes' });
    });
  },
  pinterestImport: function pinterestImport() {
    console.log('PIN ME FUCKING UP!');
    if (data.pinterest.length > 0) {
      var imported = data.pinterest.shift();
      data.totalPinterestSync += Object.keys(imported).length;
      console.log(JSON.stringify(imported));
      //data.staticInterests = data.mergeObjects(data.staticInterests, imported);
      Object.assign(data.staticInterests, imported);
      this.setState({
        pinterestAllSyncedInterests: data.totalPinterestSync,
        pinterestLastSyncedInterests: Object.keys(imported).length,
        pinterestLastSynced: Date.now()
      });
      data.pinterestConnect = true;
    } else {
      console.log('none left...');
    }
  },
  getInitialState: function getInitialState() {
    return {
      facebookAllSyncedInterests: data.totalFacebookSync,
      facebookLastSyncedInterests: 0,
      facebookLastSynced: Date.now(),
      pinterestAllSyncedInterests: data.totalPinterestSync,
      pinterestLastSyncedInterests: 0,
      pinterestLastSynced: Date.now()
    };
  },
  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'import' },
      React.createElement(
        'div',
        { className: 'container-fluid' },
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
          React.createElement(SpecificImport, { importFunction: this.facebookConnect, buttonTitle: 'Connect', allSyncedInterests: this.state.facebookAllSyncedInterests, lastSyncedInterests: this.state.facebookLastSyncedInterests, lastSynced: this.state.facebookLastSynced, title: 'Connect with Facebook!', bootstrapOffset: '' }),
          React.createElement(SpecificImport, { importFunction: this.pinterestImport, buttonTitle: 'Import', allSyncedInterests: this.state.pinterestAllSyncedInterests, lastSyncedInterests: this.state.pinterestLastSyncedInterests, lastSynced: this.state.pinterestLastSynced, title: 'Import your pins from Pinterest!', bootstrapOffset: 'col-lg-offset-1' })
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

var SpecificImport = React.createClass({
  displayName: 'SpecificImport',

  render: function render() {
    var baseDivStyles = "col-xs-6 col-lg-4 " + this.props.bootstrapOffset;
    return React.createElement(
      'div',
      { className: baseDivStyles },
      React.createElement(
        'p',
        { className: 'lead' },
        this.props.title
      ),
      React.createElement(
        'div',
        { className: 'pull-left' },
        React.createElement(
          'strong',
          null,
          'Last sync:'
        ),
        ' ',
        this.props.allSyncedInterests,
        ' interests (',
        this.props.lastSyncedInterests,
        ' new)',
        React.createElement('br', null),
        React.createElement(
          'strong',
          null,
          'Last synced on:'
        ),
        ' ',
        formatDate(this.props.lastSynced, true)
      ),
      React.createElement(
        'button',
        { className: 'btn btn-sm btn-default pull-right', onClick: this.props.importFunction },
        this.props.buttonTitle
      )
    );
  }
});

var Settings = React.createClass({
  displayName: 'Settings',

  deleteCookie: function deleteCookie() {
    docCookies.removeItem('vdna');
    alert('Cookie deleted.');
  },
  swapAutosave: function swapAutosave() {
    data.autosave = !data.autosave;
    console.log('swapping autosave to: ' + data.autosave);
    this.setState({ autosave: data.autosave });
    data.showVdnaDivs();
  },
  sortChange: function sortChange(e) {
    if (data.sorting > 0) {
      data.sorting = parseInt(e.target.value);
      this.setState({ sorting: data.sorting });
      data.gatherVdna();
      data.showVdnaDivs();
      this.props.setVdnaCount();
    } else {
      this.setState({ sorting: 1 });
    }
  },
  // This on/off thing is annoying
  onOff: function onOff() {
    this.setState({ sorting: data.sorting });
  },
  getInitialState: function getInitialState() {
    return {
      autosave: data.autosave,
      sorting: data.sorting
    };
  },
  componentDidMount: function componentDidMount() {
    $(".switch").bootstrapSwitch({ size: "small",
      onColor: "success",
      offColor: "default"
    });
    $("select.selectpicker").selectpicker({ styleBase: "form-control" });
  },
  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'settings' },
      React.createElement(
        'div',
        { className: 'container-fluid' },
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
            ' ticketpro.cz'
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
          React.createElement('hr', null),
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
              React.createElement(OnOff, { onOff: this.onOff })
            )
          ),
          React.createElement('br', null),
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
                { className: 'selectpicker', id: 'sorting', value: this.state.sorting, onChange: this.sortChange },
                React.createElement(
                  'option',
                  { value: 1 },
                  'Your interests'
                ),
                React.createElement(
                  'option',
                  { value: 2 },
                  'Site default'
                ),
                React.createElement(
                  'option',
                  { value: 3 },
                  'Your interests (truncated to 10)'
                ),
                React.createElement(
                  'option',
                  { value: 4 },
                  'Site default (truncated to 10)'
                )
              )
            )
          ),
          React.createElement('br', null),
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
              React.createElement(
                'span',
                { onClick: this.swapAutosave },
                React.createElement('input', { type: 'checkbox', name: 'autosave', className: 'switch', checked: this.state.autosave, onChange: this.swapAutosave })
              )
            )
          ),
          React.createElement('br', null),
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
                'ticketpro.cz'
              )
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'button',
                { className: 'btn btn-sm btn-danger', onClick: this.deleteCookie },
                'Delete'
              )
            )
          ),
          React.createElement('hr', null)
        )
      )
    );
  }
});

var About = React.createClass({
  displayName: 'About',

  fbLogout: function fbLogout() {
    FB.init({
      appId: '575682199200822',
      xfbml: true,
      cookie: true,
      status: true,
      version: 'v2.3'
    });
    FB.logout();
  },
  render: function render() {
    var fbLogoutHtml;
    if (data.totalFacebookSync > 0) {
      fbLogoutHtml = React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'col-xs-2 col-sm-3 col-md-4 col-lg-4' },
          React.createElement(
            'strong',
            null,
            data.totalFacebookSync > 0 ? "YES" : "NO"
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-3 col-sm-4 col-md-4 col-lg-5' },
          React.createElement(
            'button',
            { className: 'btn btn-sm btn-danger', onClick: this.fbLogout },
            'Logout'
          )
        )
      );
    } else {
      fbLogoutHtml = React.createElement(
        'div',
        { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
        React.createElement(
          'strong',
          null,
          data.totalFacebookSync > 0 ? "YES" : "NO"
        )
      );
    }
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'about' },
      React.createElement(
        'div',
        { className: 'container-fluid' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement('img', { src: '/images/logo-zivter.png', alt: '' })
        ),
        React.createElement(
          'p',
          null,
          'Zifter is a private, anonymous plug-in that lets you personalise advertising and content on the internet.'
        ),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'span',
              { htmlFor: 'vdnaVersion', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'VDNA version'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              '0.1b'
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'span',
              { htmlFor: 'vdnaVersion', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Total available VDNA items'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              Object.keys(data.staticInterests).length
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'span',
              { htmlFor: 'vdnaVersion', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Filter stats'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              'No current information'
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'span',
              { htmlFor: 'vdnaVersion', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Facebook connect'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              fbLogoutHtml
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'span',
              { htmlFor: 'vdnaVersion', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Pinterest connect'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'strong',
                null,
                data.totalPinterestSync > 0 ? "YES" : "NO"
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
        { className: 'container-fluid' },
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

data.gatherOriginalVdna();
data.gatherVdna();
reRender();
/* <OpenVdna /> */ /*<strong>Category:</strong> {data.capitalize(this.props.currentDetails['category'])}<br />*/ /*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/ /*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/ /* <OnOff /> */ /* <input type="checkbox" id="personalization" name="personalization" className="switch" /> */
//# sourceMappingURL=flycheck_vdnamenu.js.map
