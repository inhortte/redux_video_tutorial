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
