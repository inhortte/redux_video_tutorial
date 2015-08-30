var Moment = require('moment');
var data = require('vdna/static_data');
var variableData = require('vdna/variable_data');
// var Autocomplete = require('react-autocomplete/lib/main.js');
// var Combobox = Autocomplete.Combobox;
// var ComboboxOption = Autocomplete.ComboboxOption;

// -------------------------------------------------
// Autocomplete code
// -------------------------------------------------

var Autocomplete = React.createClass({
  componentDidMount: function() {
    this._setInputFromValue();
    var highlightedIndex;
    var that = this;
    document.onkeydown = function(e) {
      switch(e.keyCode) {
        case 13: // enter.
          console.log('ENTER!');
          that.props.addLikeDone();
          break;
        case 9: // tab
          console.log('TAB!');
          that._setFromHighlighted();
          break;
        case 38: // up
          highlightedIndex = that._highlightedIndex();
          console.log('UP! ' + highlightedIndex);
          if(highlightedIndex > 0) {
            that.setState({highlightedValue: that._currentMatches()[highlightedIndex - 1]});
          }
          break;
        case 40: // down
          highlightedIndex = that._highlightedIndex();
          console.log('DOWN! ' + highlightedIndex);
          if(highlightedIndex === -1) {
            that.setState({highlightedValue: that._currentMatches()[0]});
          } else if(highlightedIndex < that._currentMatches().length - 1) {
            that.setState({highlightedValue: that._currentMatches()[highlightedIndex + 1]});
          }
          break;
      }
    };
  },
  getDefaultProps: function() {
    return {
      defaultValue: 'apple',
      limitToList: true,
      maxItemsShown: 8,
      sourceUrl: null,
      defaultList: [ 'apple', 'banana', 'orange', 'grape', 'cherry' ],
      alsoSearchValues: false,
      loadUrlOnce: true,
      selectAllTextOnClick: true,
      onNoMatch: function(state) {}
    };
  },
  getInitialState: function() {
    return {
      list: this.props.defaultList,
      currentValue: this.props.defaultValue,
      highlightedValue: this.props.defaultValue,
      showEntries: false
    };
  },
  render: function() {
    var entries = this.state.showEntries ?
          <ol style={{position: 'absolute', backgroundColor: 'white', color: 'black', listStyle: 'none', padding: 0, margin: 0}} onMouseLeave={this._onEntryMouseOut}>{this._renderMatches()}</ol> : '';
    return (
      <div>
        <input id={this.props.inputId} className={this.props.className} ref="autoInput" onChange={this._onChange} onFocus={this._onFocus} onBlur={this._onBlur} onClick={this._onInputClick} />
        {entries}
      </div>
    );
  },
  _currentMatches: function() {
    var that = this;
    var cm = this.state.list.filter(function(entry) {
      return entry.indexOf(that._input()) > -1;
    });
    return cm;
  },
  _input: function() {
    if(!this.isMounted()) {
      return '';
    } else {
      return React.findDOMNode(this.refs.autoInput).value;
    }
  },
  _renderMatches: function() {
    var that = this;
    return this._currentMatches().slice(0, this.props.maxItemsShown).map(function(entry, index) {
      return (
        <AutocompleteEntry highlighted={entry === that.state.highlightedValue} key={entry} value={entry} onEntryClick={that._onEntryClick} onEntryMouseOver={that._onEntryMouseOver} />
      );
    });
  },
  _highlightedIndex: function() {
    var that = this;
    var foundIndex = -1;
    this._currentMatches().forEach(function(entry, index) {
      if(entry === that.state.highlightedValue) {
        foundIndex = index;
      }
    });
    return foundIndex;
  },
  _updateHighlightedValue: function() {
    var newValue;
    var highlightedIndex = this._highlightedIndex();
    if(highlightedIndex < 0) {
      newValue = this.state.list[0];
    } else {
      newValue = this.state.list[highlightedIndex];
    }
    this.setState({highlightedValue: newValue});
  },
  _setInputFromValue: function() {
    React.findDOMNode(this.refs.autoInput).value = this.state.currentValue;
  },
  _setValueFromInput: function() {
    var inputText = React.findDOMNode(this.refs.autoInput).value;
    var foundEntries = this.state.list.filter(function(entry) {
      return entry.indexOf(inputText) > -1;
    });
    if(foundEntries.length > 0) {
      this.setState({
        currentValue: foundEntries[0],
        highlightedValue: foundEntries[0]
      });
    } else {
      this.props.onNoMatch(this.state);
      if(this.props.limitToList) {
        this.setState({
          currentValue: this.props.defaultValue,
          highlightedValue: this.props.defaultValue
        });
      }
    }
  },
  _setFromHighlighted: function() {
    this.setState({
      currentValue: this.state.highlightedValue
    }, function() {
      this._setInputFromValue();
    });
  },
  _onChange: function() {
    this._setValueFromInput();
  },
  _onFocus: function() {
    this.setState({showEntries: true});
  },
  _onBlur: function() {
    this._setFromHighlighted();
    this.setState({showEntries: false});
  },
  _onEntryClick: function(entry) {
    this.setState({
      currentValue: entry
    }, function() {
      this._setInputFromValue();
    });
  },
  _onEntryMouseOver: function(entry) {
    this.setState({highlightedValue: entry});
  },
  _onEntryMouseOut: function(entry) {
    this.setState({highlightedValue: this.currentValue});
  },
  _onInputClick: function() {
    React.findDOMNode(this.refs.autoInput).select();
  }
});

var AutocompleteEntry = React.createClass({
  getInitialState: function() {
    return {hover: false};
  },
  _onClick: function() {
    this.props.onEntryClick(this.props.value);
  },
  _onMouseOver: function() {
    this.props.onEntryMouseOver(this.props.value);
  },
  render: function() {
    return (
      <li style={{backgroundColor: this.props.highlighted ? 'hsl(90, 50%, 50%)' : '', zIndex: 9999, cursor: 'pointer'}} onMouseDown={this._onClick} onMouseOver={this._onMouseOver}>{this.props.value}</li>
    );
  }
});

// ---------------
// end Autocomplete
// ---------------

function reRender() {
  React.render(
    <VdnaMenu tabList={tabList} />,
    document.getElementById('vdnamenu')
  );
};

function formatDate(rawDate) {
  return Moment(rawDate).format("DD MMM YYYY");
};

var tabList = [
  { id: 1, href: 'profile', text: 'Edit My Profile', selected: true },
  { id: 2, href: 'notifications', text: 'View Notifications', selected: false },
  { id: 3, href: 'import', text: 'Import and Sync', selected: false },
  { id: 4, href: 'settings', text: 'Change Settings', selected: false },
  { id: 5, href: 'privacy', text: 'Privacy', selected: false },
  { id: 6, href: 'about', text: 'About', selected: false }
];

var VdnaMenu = React.createClass({
  getInitialState: function() {
    return {
      tabList: this.props.tabList,
      currentTab: 1
    };
  },
  changeTab: function(tabId) {
    var newTabList = tabList.map(function(tab) {
      tab.selected = tab.id === tabId;
      return tab;
    });
    this.setState({
      tabList: newTabList,
      currentTab: tabId
    });
  },
  render: function() {
    var tabContent;
    switch(this.state.currentTab) {
      case 1:
        tabContent = <MyProfile />;
        break;
      case 2:
        tabContent = <Notifications />;
        break;
      case 3:
        tabContent = <Import />;
        break;
      case 4:
        tabContent = <Settings />;
        break;
      case 5:
        tabContent = <Privacy />;
        break;
      case 6:
        tabContent = <About />;
        break;
      default:
        tabContent = <MyProfile />;
    }
    return (
      <section className="vdna">
        <div className="vdna-body">
          <div className="container">
            <div className="row">
              <Tabs tabList={this.state.tabList} changeTab={this.changeTab} />
              <div className="main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2">
                <div className="tab-content">
                  {tabContent}
                </div>
              </div>
            </div>
          </div>
          <CloseVdna />
          {/* <OpenVdna /> */}
        </div>
      </section>
    );
  }
});

var OpenVdna = React.createClass({
  handleClick: function() {
    $("#vdnamenu").show();
    $("#openVdna").hide();
  },
  render: function() {
    return (
      <div>
	<span data-toggle="tooltip" title="Click to open VDNA" id="openVdna" className="btn btn-sm btn-primary openVdna" onClick={this.handleClick}>
          Open vDNA
        </span>
      </div>
    );
  }
});

var CloseVdna = React.createClass({
  handleClick: function() {
    $("#vdnamenu").hide();
    $("#openVdna").show();
  },
  render: function() {
    return (
      <div>
	<span data-toggle="tooltip" title="Click to close" className="closeVdna" style={{cursor: 'pointer'}} onClick={this.handleClick}>
          <span className="fa fa-power-off"></span>
        </span>
      </div>
    );
  }
});

var Tabs = React.createClass({
  render: function() {
    var that = this;
    var tabListNodes = this.props.tabList.map(function(tab, index) {
      return (
        <Tab changeTab={that.props.changeTab} key={tab.href} id={tab.href} tab={tab} />
      );
    });
    return (
      <div className="sidebar col-xs-4 col-sm-3 col-lg-2">
        <nav className="navbar navbar-default" role="navigation">
          <ul className="nav navbar-nav" role="tablist">
            {tabListNodes}
          </ul>
        </nav>
      </div>
    );
  }
});

var Tab = React.createClass({
  handleClick: function() {
    this.props.changeTab(this.props.tab.id);
  },
  render: function() {
    return (
      <li role="presentation" className={this.props.tab.selected ? 'active' : ''}>
        <a href={this.props.tab.href} aria-controls={this.props.tab.href} role="tab" data-toggle="tab" onClick={this.handleClick}>
          {this.props.tab.text}
        </a>
      </li>
    );
  }
});

var MyProfileHeader = React.createClass({
  render: function() {
    return (
      <header className="page-header">
        <div className="media">
          <div className="media-left">
            <span className="fa fa-2x fa-user"></span>
          </div>
          <div className="media-body">
            <h1 className="media-heading">Your profile <small>at</small> [site.com]</h1>
          </div>
        </div>
      </header>
    );
  }
});

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

var MyProfileCategory = React.createClass({
  render: function() {
    return (
      <option value={this.props.category} ref={this.props.category}>
        {data.capitalize(this.props.category)}
      </option>
    );
  }
});

var MyProfilePrivacy = React.createClass({
  componentDidMount: function() {
    $("#privacySettingSlider").slider({min:1,max:5,step:1,value:3});
    $("#privacySettingSlider").on("slide", function(n) {
      n.value === 1 ?
        $("#privacySettingSliderVal").text("20") :
        n.value===2 ?
        $("#privacySettingSliderVal").text("40") :
        n.value===3 ?
        $("#privacySettingSliderVal").text("60") :
        n.value===4 ?
        $("#privacySettingSliderVal").text("80") :
        n.value===5 && $("#privacySettingSliderVal").text("100");
    });
  },
  render: function() {
    return (
      <div className="form-group form-group-sm">
        <label htmlFor="inputEmail3" className="col-sm-2 control-label">Privacy</label>
        <div className="col-sm-6">
          <input id="privacySettingSlider" type="text" />
        </div>
        <div className="col-sm-2">Sharing <span id="privacySettingSliderVal">60</span>%</div>
      </div>
    );
  }
});

var MyProfileInterests = React.createClass({
  showDetails: function(interest, details) {
    console.log(interest + ": " + JSON.stringify(details));
    this.setState({currentInterest: interest, currentDetails: details});
  },
  getInitialState: function() {
    return {currentInterest: null,
            currentDetails: {},
            addInterestCollapsed: true};
  },
  componentDidMount: function() {
    data.blinkNodes();
  },
  showAddLike: function() {
    this.setState({addInterestCollapsed: false});
  },
  hideAddLike: function() {
    this.setState({addInterestCollapsed: true});
  },
  render: function() {
    var that = this;
    var currentInterests = Object.keys(this.props.interests).reduce(function(is, i) {
      if(that.props.interests[i]['selected']) {
        is[i] = that.props.interests[i];
      }
      return is;
    }, {});
    var interestNodes = Object.keys(this.props.interests).filter(function(interest) {
      return that.props.interests[interest]['selected'];
    }).map(function(interest) {
      return (
        <MyProfileInterest key={interest} interest={interest} showDetails={that.showDetails.bind(that, interest, that.props.interests[interest])} />
      );
    });
    /*
    var relatedInterests = Object.keys(this.props.interests).filter(function(interest) {
      return !that.props.interests[interest]['selected'];
    });
     */
    var relatedInterests = this.state.currentInterest ? this.state.currentDetails['related'].split(/,/) : [];
    return (
      <div>
        <div className="form-group form-group-sm">
          <label className="col-sm-2 control-label">Interests</label>
          <div className="col-sm-6">
            <div className="panel panel-interests">
              <div className="panel-body">
               {interestNodes}
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-bottom">
            <button type="submit" className="btn btn-sm btn-default">Import</button>
            <button id="addLike" onClick={this.showAddLike} type="submit" role="button" className="btn btn-sm btn-success" aria-expanded="false" aria-controls="addLike"><span className="glyphicon glyphicon-plus"></span> Add</button>
          </div>
        </div>
        <MyProfileAddAnInterest interests={currentInterests} collapse={this.state.addInterestCollapsed} hideAddLike={this.hideAddLike} />
        <MyProfileLikeDetails currentInterest={this.state.currentInterest} currentDetails={this.state.currentDetails} relatedInterests={relatedInterests} collapse={false} />
      </div>
    );
  }
});

var MyProfileInterest = React.createClass({
  handleClick: function() {
    this.props.showDetails();
  },
  render: function() {
    return (
      <span className="btn btn-sm btn-default" ref="interestSpan" title={this.props.interest} key={this.props.interest} role="button" onClick={this.handleClick}>
        {data.capitalize(this.props.interest)}
      </span>
    );
  }
});

var MyProfileAddAnInterest = React.createClass({
  render: function() {
    var currentInterestKeys = Object.keys(this.props.interests);
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function(interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    var availableInterestNodes = availableInterestKeys.map(function(interest) {
      return (
        <MyProfileAvailableInterest availableInterest={interest} />
      );
    });
    if(this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    return (
      <div className={baseDivStyles.join(' ')} id="addAnInterest">
        <label className="col-sm-2 control-label">Add a like</label>
        <div className="col-sm-6">
          {availableInterestNodes}
        </div>
      </div>
    );
  }
});

var MyProfileAvailableInterest = React.createClass({
  addInterest: function() {
    data.addInterest(this.props.availableInterest);
    reRender();
  },
  render: function() {
    return (
      <span className="btn btn-sm btn-default" ref="interestSpan" title={this.props.availableInterest} key={this.props.availableInterest} role="button" onClick={this.addInterest}>
        {data.capitalize(this.props.availableInterest)}
      </span>
    );
  }
});

/* It's quite a pity to have to comment this out...
var MyProfileAddAnInterest = React.createClass({
  addLikeDone: function() {
    console.log($("#addInterestInput").val());
    if(data.addInterest($("#addInterestInput").val())) {
      this.props.hideAddLike();
    }
    $("#addInterestInput").val("");
    reRender();
  },
  render: function() {
    var currentInterestKeys = Object.keys(this.props.interests);
    console.log('current interests: ' + JSON.stringify(currentInterestKeys));
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function(interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    console.log('available interests: ' + JSON.stringify(availableInterestKeys));
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if(this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    console.log('Add a like: "' + baseDivStyles.join(' ') + '"');
    return (
      <div className={baseDivStyles.join(' ')} id="addAnInterest">
        <label className="col-sm-2 control-label">Add a like</label>
        <div className="col-sm-6">
          <Autocomplete inputId="addInterestInput" defaultValue={''} defaultList={availableInterestKeys} className="form-control" addLikeDone={this.addLikeDone} />
        </div>
        <div className="col-sm-2">
          <button type="button" className="btn btn-sm btn-default" onClick={this.addLikeDone}>Done</button>
        </div>
      </div>
    );
  }
});
*/

var MyProfileLikeDetails = React.createClass({
  removeInterest: function() {
    // data.unLikeAnInterest(this.props.category, this.props.currentInterest);
    data.unLikeAnInterest(this.props.currentInterest);
    reRender();
  },
  render: function() {
    var that = this;
    var relatedInterestNodes = this.props.relatedInterests.map(function(interest) {
      return (
        // <MyProfileRelatedInterest category={that.props.category} relatedInterest={interest} />
          <MyProfileRelatedInterest relatedInterest={interest} />
      );
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if(this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if(this.props.currentInterest) {
      html =
        <div className={baseDivStyles.join(' ')} id="likeDetails">
          <div className="col-sm-6 col-sm-offset-2">
            <div className="well well-sm">
              <div className="row">
                <div className="col-xs-4">
                  <button type="button" className="btn btn-sm btn-primary">{this.props.currentInterest}</button>
                </div>
                <div className="col-xs-8">
                  <ul className="list-inline">
                    <li>
                      <small>
                        {/*<strong>Category:</strong> {data.capitalize(this.props.currentDetails['category'])}<br />*/}
                        <strong>Total clicks:</strong> {this.props.currentDetails['clicks']}
                      </small>
                    </li>
                    <li>
                      <small>
                        <strong>Source:</strong> Imported from {data.capitalize(this.props.currentDetails['source'])}<br />
                        Added on {formateDate(this.props.currentDetails['added'])}
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <p>
              <strong>Related interests:</strong>
              {relatedInterestNodes}
            </p>
          </div>
          <div className="col-sm-4">
            <button type="submit" role="button" className="btn btn-sm btn-default remove-like" aria-expanded="true" aria-controls="removeLike" onClick={this.removeInterest}>Remove</button>
          </div>
        </div>;
    } else {
      html = <div className={baseDivStyles.join(' ')} id="likeDetails"></div>;
    }
    return (
      <div>
        {html}
     </div>
    );
  }
});

var MyProfileRelatedInterest = React.createClass({
  addInterest: function() {
    // data.addRelatedInterest(this.props.category, this.props.relatedInterest);
    data.addRelatedInterest(this.props.relatedInterest);
    reRender();
  },
  render: function() {
    return (
      <span className="btn btn-sm btn-default" ref="interestSpan" title={this.props.relatedInterest} key={this.props.relatedInterest} role="button" onClick={this.addInterest}>
        {data.capitalize(this.props.relatedInterest)}
      </span>
    );
  }
});

var MyProfile = React.createClass({
  getInitialState: function() {
    return {
      // category: Object.keys(staticData)[0],
      // interests: staticData[Object.keys(staticData)[0]]
      interests: data.staticInterests
    };
  },
  getCategoryOnChange: function(category) {
    console.log(JSON.stringify(data.staticData[category]));
    this.setState({category: category,
                   interests: data.staticData[category]});
  },
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane fade active in" id="profile">
        <div className="container">

          <MyProfileHeader />

          <div className="form-horizontal">

            {/*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/}
            <MyProfilePrivacy />
            {/*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/}
            <MyProfileInterests interests={this.state.interests} setInterests={this.setInterests} />

          </div>
        </div>
      </div>
    );
  }
});

var Notifications = React.createClass({
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="notifications">
        <div className="container">
          <header className="page-header">
            <h1>Notifications <small>from</small> [site.com]</h1>
          </header>
          <div className="row">
            <div className="col-xs-12">
              <table className="table table-notifications">
                <thead>
                  <tr>
                    <th colSpan="2">
                      <p>
                        Site.com has requested to add following interests to your profile.<br />
                        <small>See <a href="#">settings</a> to change the default behavior for this window.</small>
                      </p>
                    </th>
                    <th>
                      <nav className="table-filter text-right">
                        <ul className="list-inline">
                          <li className="text-muted">Show:</li>
                          <li><a href="#">Pending</a></li>
                          <li><a href="#">Accepted</a></li>
                          <li><a href="#">Rejected</a></li>
                          <li className="active"><a href="#">All</a></li>
                        </ul>
                      </nav>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <span className="btn btn btn-sm btn-default">Tennis</span>
                    </th>
                    <td>
                      <ul className="list-inline">
                        <li>
                          <small>
                            Category: <strong>Sports</strong>
                          </small>
                        </li>
                        <li>
                          <small>
                            Source: Imported from <strong>Facebook</strong>
                          </small>
                        </li>
                        <li>
                          <small>
                            Requested on @DateTime.Now
                          </small>
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-link btn-success">
                          <span className="fa fa-check"></span>
                          <span className="hidden-xs">Approve</span>
                        </button>
                        <button type="button" className="btn btn-link btn-danger">
                          <span className="fa fa-remove"></span>
                          <span className="hidden-xs">Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <span className="btn btn-sm btn-default">Skiing</span>
                    </th>
                    <td>
                      <ul className="list-inline">
                        <li>
                          <small>
                            Category: <strong>Sports</strong>
                          </small>
                        </li>
                        <li>
                          <small>
                            Source: Imported from <strong>Facebook</strong>
                          </small>
                        </li>
                        <li>
                          <small>
                            Requested on @DateTime.Now
                          </small>
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-link btn-success">
                          <span className="fa fa-check"></span>
                          <span className="hidden-xs">Approve</span>
                        </button>
                        <button type="button" className="btn btn-link btn-danger">
                          <span className="fa fa-remove"></span>
                          <span className="hidden-xs">Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <span className="btn btn btn-sm btn-default">Windsurfing</span>
                    </th>
                    <td>
                      <ul className="list-inline">
                        <li>
                          <small>
                            Category: <strong>Sports</strong>
                          </small>
                        </li>
                        <li>
                          <small>
                            Source: Imported from <strong>Facebook</strong>
                          </small>
                        </li>
                        <li>
                          <small>
                            Requested on @DateTime.Now
                          </small>
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-link btn-success">
                          <span className="fa fa-check"></span>
                          <span className="hidden-xs">Approve</span>
                        </button>
                        <button type="button" className="btn btn-link btn-danger">
                          <span className="fa fa-remove"></span>
                          <span className="hidden-xs">Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <nav className="text-right">
                <ul className="pagination">
                  <li className="disabled"><a aria-label="Previous" href="#"><span aria-hidden="true">« Previous</span></a></li>
                  <li className="active"><a href="#">1 <span className="sr-only">(current)</span></a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a aria-label="Next" href="#"><span aria-hidden="true">Next »</span></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

var Import = React.createClass({
  facebookConnect: function() {
    if(variableData.facebook.length > 0) {
      var imported = variableData.facebook.shift();
      variableData.totalFacebookSync += Object.keys(imported).length;
      console.log(JSON.stringify(imported));
      data.staticInterests = data.mergeObjects(data.staticInterests, imported);
      this.setState({
        facebookAllSyncedInterests: variableData.totalFacebookSync,
        facebookLastSyncedInterests: Object.keys(imported).length,
        facebookLastSynced: Date.now()
      });
    } else {
      console.log('none left...');
    }
  },
  updateFacebookSyncCount: function() {
  },
  getInitialState: function() {
    return {
      facebookAllSyncedInterests: 0,
      facebookLastSyncedInterests: 0,
      facebookLastSynced: Date.now()
    };
  },
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="import">
        <div className="container">
          <header className="page-header">
            <h3>...your interests across apps and devices.</h3>
          </header>
          <div className="row">
            <FacebookConnect facebookConnect={this.facebookConnect} allSyncedInterests={this.state.facebookAllSyncedInterests} lastSyncedInterests={this.state.facebookLastSyncedInterests} lastSynced={this.state.facebookLastSynced} />
            <div className="col-xs-6 col-lg-4 col-lg-offset-1">
              <p className="lead">Import your pins from Pinterest!</p>
              <div className="pull-left">
                <strong>Last sync:</strong> 25 interests (5 new)<br />
                <strong>Last synced on:</strong> @DateTime.Now
              </div>
              <a href="#" className="btn btn-sm btn-default pull-right">Import</a>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-xs-12 col-lg-9">
              <h3>Try your app!</h3>
              <p>Like controlling the web??? We thought so. Our nifty app lets you take it to the next level and puts all your internet-wide preferences in one central place so you can quickly and easily view and accept your notifications with a few steps.</p>
              <div className="pull-left">
                <a href="#" className="btn btn-sm btn-default">download for android</a>
                <a href="#" className="btn btn-sm btn-default">download for iphone</a>
              </div>
              <div className="pull-right">
                Got an app? Now <a href="#" className="btn btn-sm btn-default">Generate a sync code!</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

var FacebookConnect = React.createClass({
  render: function() {
    return (
      <div className="col-xs-6 col-lg-4">
        <p className="lead">Connect with Facebook!</p>
        <div className="pull-left">
          <strong>Last sync:</strong> {this.props.allSyncedInterests} interests ({this.props.lastSyncedInterests} new)<br />
          <strong>Last synced on:</strong> {formatDate(this.props.lastSynced)}
        </div>
        <button className="btn btn-sm btn-default pull-right" onClick={this.props.facebookConnect}>Connect</button>
      </div>
    );
  }
});

var Settings = React.createClass({
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="settings">
        <div className="container">
          <header className="page-header">
            <h1>Settings <small>on</small> [site.com]</h1>
            <p>You are in control! Change your settings here.</p>
          </header>
          <div className="form-horizontal">
            <div className="form-group form-group-sm">
              <label htmlFor="personalization" className="col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label">Personalization</label>
              <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
                <input type="checkbox" name="personalization" className="switch" />
              </div>
            </div>
            <hr />
            <div className="form-group form-group-sm">
              <label htmlFor="sorting" className="col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label">Sorting</label>
              <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
                <select class="selectpicker" id="sorting">
                  <option>Your interests</option>
                  <option>Site default</option>
                </select>
              </div>
            </div>
            <hr />
            <div className="form-group form-group-sm">
              <label htmlFor="autosave" className="col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label">Autosave</label>
              <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
                <input type="checkbox" name="autosave" className="switch" />
              </div>
            </div>
            <hr />
            <div className="form-group form-group-sm">
              <label htmlFor="delete" className="col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label">Delete my profile <small>at</small> <i>[site.com]</i></label>
              <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
                <a href="#" className="btn btn-sm btn-danger">Delete</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

var Privacy = React.createClass({
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="privacy">
        <div className="container">
          <header className="page-header">
            <h1>Privacy</h1>
          </header>
          <div className="row">
            <div className="col-xs-10">
              <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

var About = React.createClass({
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="about">
        <div className="container">
          <header className="page-header">
            <img src="/images/logo-zivter.png" alt="" />
          </header>
        </div>
      </section>
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
