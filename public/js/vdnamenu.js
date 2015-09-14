var Moment = require('moment');
var data = require('vdna/static_data');
var variableData = require('vdna/variable_data');
var docCookies = require('vdna/cookie');

function reRender() {
  React.render(
    <VdnaMenu tabList={tabList} />,
    document.getElementById('vdnamenu')
  );
};

function addClickEvents() {
  var that = this;
  $("*[vdnaclass]").each(function(index, el) {
    $(el).on('click', function(e) {
      e.preventDefault();
      var interestArr = $(el).attr('vdnaclass').split(/,/);
      console.log('interestArr: ' + JSON.stringify(interestArr));
      interestArr.forEach(function(interest) {
        var trimmed = interest.trim();
        if(data.staticInterests[trimmed]) {
          data.staticInterests[trimmed]['clicks'] += 1;
          data.staticInterests[trimmed]['selected'] = true;
        } else {
          var relatedInterests = interestArr.slice(0, interestArr.indexOf(interest)).add(interestArr.slice(interestArr.indexOf(interest) + 1));
          data.staticInterests[trimmed] = {
            source: 'ticketpro', clicks: 1, added: Date.now(), selected: true,
            related: relatedInterests.map(function(interest) {
              return interest.trim();
            }).join(',')
          };
        }
      });
      reRender();
      return false;
    });
  });
}

function formatDate(rawDate, add_time) {
  var format = (add_time !== undefined && add_time) ? "DD MMM YYYY HH:mm" : "DD MMM YYYY";
  return Moment(rawDate).format(format);
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
        tabContent = <MyProfile changeTab={this.changeTab} />;
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
        tabContent = <MyProfile changeTab={this.changeTab} />;
    }
    return (
      <section className="vdna">
        <div className="vdna-body">
          <div className="container-fluid">
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

/* -------- this does nothing!
var OpenVdna = React.createClass({
  handleClick: function() {
    console.log('openvdna!');
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
 */

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

var OnOff = React.createClass({
  handleChange: function() {
    data.power = !data.power;
    this.setState({power: data.power});
    data.blinkNodes();
  },
  getInitialState: function() {
    return {power: data.power};
  },
  componentDidMount: function() {
    this.setState({power: data.power});
  },
  render: function() {
    return (
      <div style={{position: 'absolute', top: '10', right: '10'}}>
        <span>
          On/Off
          <input id="power" type="checkbox" checked={this.state.power} onChange={this.handleChange} className="switch" />
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
            <h1 className="media-heading">Your profile <small>at</small> ticketpro.cz</h1>
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
      data.setPrivacySlider(n.value);
      n.value === 1 ?
        $("#privacySettingSliderVal").text("20") :
        n.value === 2 ?
        $("#privacySettingSliderVal").text("40") :
        n.value === 3 ?
        $("#privacySettingSliderVal").text("60") :
        n.value === 4 ?
        $("#privacySettingSliderVal").text("80") :
        n.value === 5 && $("#privacySettingSliderVal").text("100");
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

// ----------- unused class. The code has been moved to MyProfileInterests and Settings.
/*
var CookieButtons = React.createClass({
  saveCookie: function() {
    var interestKeys = Object.keys(this.props.currentInterests);
    var decArr = data.interestsToDecArr(interestKeys);
    console.log("decMapping: " + decArr.toString());
    docCookies.setItem('vdna', decArr.toString(), Infinity);
    alert('Cookie saved.');
  },
  deleteCookie: function() {
    docCookies.removeItem('vdna');
    alert('Cookie deleted.');
  },
  render: function() {
    return (
      <div>
        <button type="submit" role="button" className="btn btn-sm btn-default" onClick={this.deleteCookie}>Delete Cookie</button>
      </div>
    );
  }
});
*/

var MyProfileInterests = React.createClass({
  showDetails: function(interest, details) {
    console.log(interest + ": " + JSON.stringify(details));
    if(this.state.currentInterest === interest) {
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
  collapseDetails: function() {
    this.setState({ detailsCollapsed: true });
  },
  getCurrentInterests: function() {
    var that = this;
    return Object.keys(this.props.interests).reduce(function(is, i) {
      if(that.props.interests[i]['selected']) {
        is[i] = that.props.interests[i];
      }
      return is;
    }, {});
  },
  getInitialState: function() {
    // ---------------------------- is there a cookie?
    if(docCookies.hasItem('vdna')) {
      var cookieInterests = data.decArrToInterests(docCookies.getItem('vdna').split(/,/).map(function(part) {
        return parseInt(part);
      }));
      console.log('cookie interests! ' + JSON.stringify(cookieInterests));
      Object.keys(data.staticInterests).forEach(function(interest) {
        data.staticInterests[interest]['selected'] = cookieInterests.indexOf(interest) !== -1;
      });
    }
    // ----------------------------

    return {currentInterest: null,
            currentDetails: {},
            detailsCollapsed: true,
            addInterestCollapsed: true};
  },
  componentDidMount: function() {
    data.blinkNodes();
  },
  // ---------- Save the vdna cookie
  componentDidUpdate: function() {
    var interestKeys = Object.keys(this.getCurrentInterests());
    var decArr = data.interestsToDecArr(interestKeys);
    console.log("decMapping: " + decArr.toString());
    docCookies.setItem('vdna', decArr.toString(), Infinity);
  },
  showHideAddLike: function() {
    this.setState({ addInterestCollapsed: !this.state.addInterestCollapsed,
                    detailsCollapsed: true});
  },
  hideAddLike: function() {
    this.setState({addInterestCollapsed: true});
  },
  render: function() {
    var that = this;
    var interestNodes = Object.keys(this.props.interests).filter(function(interest) {
      return that.props.interests[interest]['selected'];
    }).map(function(interest) {
      return (
        <MyProfileInterest key={interest} interest={interest} showDetails={that.showDetails.bind(that, interest, that.props.interests[interest])} />
      );
    });
    var relatedInterests =
          (this.state.currentInterest ?
           this.state.currentDetails['related'].split(/,/) :
           []).filter(function(relatedInterest) {
             return(Object.keys(that.getCurrentInterests()).indexOf(relatedInterest) === -1);
           });
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
            <button id="addLike" onClick={this.showHideAddLike} type="submit" role="button" className="btn btn-sm btn-success" aria-expanded="false" aria-controls="addLike"><span className="glyphicon glyphicon-plus"></span> Add</button>
            <button type="submit" className="btn btn-sm btn-default" onClick={this.props.changeTab.bind(null, 3)}>Import</button>
          </div>
        </div>
        <MyProfileAddAnInterest interests={this.getCurrentInterests()} collapse={this.state.addInterestCollapsed} hideAddLike={this.hideAddLike} />
        <MyProfileLikeDetails currentInterest={this.state.currentInterest} currentDetails={this.state.currentDetails} relatedInterests={relatedInterests} collapse={this.state.detailsCollapsed} collapseDetails={this.collapseDetails} />
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
    var html;
    if(!this.props.collapse) {
      html =
        <div className={baseDivStyles.join(' ')} id="addAnInterest">
          <label className="col-sm-2 control-label">More on this page</label>
          <div className="col-sm-6">
            {availableInterestNodes}
          </div>
        </div>;
    } else {
      html = <div className={baseDivStyles.join(' ')} id="addAnInterest"></div>;
    }
    return (
      <div>
        {html}
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

var MyProfileLikeDetails = React.createClass({
  removeInterest: function() {
    // data.unLikeAnInterest(this.props.category, this.props.currentInterest);
    data.unLikeAnInterest(this.props.currentInterest);
    this.props.collapseDetails();
    reRender();
  },
  render: function() {
    var that = this;
    var relatedInterestsHtml;
    if(this.props.relatedInterests.length > 0) {
      var relatedInterestNodes = this.props.relatedInterests.map(function(interest) {
        return (
          // <MyProfileRelatedInterest category={that.props.category} relatedInterest={interest} />
            <MyProfileRelatedInterest relatedInterest={interest} />
        );
      });
      relatedInterestsHtml =
        <p>
          <strong>Related interests:</strong>
          {relatedInterestNodes}
        </p>;
    } else {
      relatedInterestsHtml = '';
    }

    var baseDivStyles = ['form-group', 'form-group-sm'];
    if(this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if(this.props.currentInterest && !this.props.collapse) {
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
                        Added on {formatDate(this.props.currentDetails['added'])}
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {relatedInterestsHtml}
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
        <div className="container-fluid">

          <MyProfileHeader />

          <div className="form-horizontal">

            {/*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/}
            {/*<MyProfilePrivacy />*/}
            {/*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/}
            <MyProfileInterests interests={this.state.interests} setInterests={this.setInterests} changeTab={this.props.changeTab} />

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
        <div className="container-fluid">
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
      // Object.assign(data.staticInterests, imported);
      this.setState({
        facebookAllSyncedInterests: variableData.totalFacebookSync,
        facebookLastSyncedInterests: Object.keys(imported).length,
        facebookLastSynced: Date.now()
      });
    } else {
      console.log('none left...');
    }
  },
  pinterestImport: function() {
    console.log('PIN ME FUCKING UP!');
    if(variableData.pinterest.length > 0) {
      var imported = variableData.pinterest.shift();
      variableData.totalPinterestSync += Object.keys(imported).length;
      console.log(JSON.stringify(imported));
      data.staticInterests = data.mergeObjects(data.staticInterests, imported);
      this.setState({
        pinterestAllSyncedInterests: variableData.totalPinterestSync,
        pinterestLastSyncedInterests: Object.keys(imported).length,
        pinterestLastSynced: Date.now()
      });
    } else {
      console.log('none left...');
    }
  },
  getInitialState: function() {
    return {
      facebookAllSyncedInterests: variableData.totalFacebookSync,
      facebookLastSyncedInterests: 0,
      facebookLastSynced: Date.now(),
      pinterestAllSyncedInterests: variableData.totalPinterestSync,
      pinterestLastSyncedInterests: 0,
      pinterestLastSynced: Date.now()
    };
  },
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="import">
        <div className="container-fluid">
          <header className="page-header">
            <h3>...your interests across apps and devices.</h3>
          </header>
          <div className="row">
            <SpecificImport importFunction={this.facebookConnect} buttonTitle='Connect' allSyncedInterests={this.state.facebookAllSyncedInterests} lastSyncedInterests={this.state.facebookLastSyncedInterests} lastSynced={this.state.facebookLastSynced} title="Connect with Facebook!" bootstrapOffset='' />
            <SpecificImport importFunction={this.pinterestImport} buttonTitle='Import' allSyncedInterests={this.state.pinterestAllSyncedInterests} lastSyncedInterests={this.state.pinterestLastSyncedInterests} lastSynced={this.state.pinterestLastSynced} title="Import your pins from Pinterest!" bootstrapOffset="col-lg-offset-1" />
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

var SpecificImport = React.createClass({
  render: function() {
    var baseDivStyles = "col-xs-6 col-lg-4 " + this.props.bootstrapOffset;
    return (
      <div className={baseDivStyles}>
        <p className="lead">{this.props.title}</p>
        <div className="pull-left">
          <strong>Last sync:</strong> {this.props.allSyncedInterests} interests ({this.props.lastSyncedInterests} new)<br />
          <strong>Last synced on:</strong> {formatDate(this.props.lastSynced, true)}
        </div>
        <button className="btn btn-sm btn-default pull-right" onClick={this.props.importFunction}>{this.props.buttonTitle}</button>
      </div>
    );
  }
});

var Settings = React.createClass({
  deleteCookie: function() {
    docCookies.removeItem('vdna');
    alert('Cookie deleted.');
  },
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="settings">
        <OnOff />
        <div className="container-fluid">
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
                <select className="selectpicker" id="sorting">
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
              <label htmlFor="delete" className="col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label">Delete my profile <small>at</small> <i>ticketpro.cz</i></label>
              <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
                <button className="btn btn-sm btn-danger" onClick={this.deleteCookie}>Delete</button>
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
        <div className="container-fluid">
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

/*
var InfoBalloon = React.createClass({
  dismiss: function() {
    this.setState({infoBalloon: false});
  },
  getInitialState: function() {
    return({infoBalloon: true});
  },
  render: function() {
    var oogleboobie = {
      position: 'fixed',
      top: 210,
      right: 100,
      width: 200,
      background: '#fff',
      border: '1px solid black',
      padding: 10,
      cursor: 'pointer',
      zIndex: 1000
    };
    var html;
    if(this.state.infoBalloon) {
      html =
        <span style={oogleboobie}>Zifter is a private, anonymous plug-in that lets you personalise advertising and content on the internet<br /><small>(click to dismiss)</small></span>;
    } else {
      html = '';
    }
    return (
      <div onClick={this.dismiss} >
        {html}
      </div>
    );
  }
});
 */

var About = React.createClass({
  render: function() {
    return (
      <section role="tabpanel" className="tab-pane fade active in" id="about">
        <div className="container-fluid">
          <header className="page-header">
            <img src="/images/logo-zivter.png" alt="" />
          </header>
        Zifter is a private, anonymous plug-in that lets you personalise advertising and content on the internet.
        </div>
      </section>
    );
  }
});

reRender();
addClickEvents();
