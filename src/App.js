import React, { Component } from 'react';
import './App.css';

const barWidth = 840;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            buttonsOptions: [],
            bars: [],
            barOptions: [],
            apiMax: barWidth,
            curSelBar: 0,
        }
    }

    componentDidMount() {
        fetch('http://pb-api.herokuapp.com/bars')
            .then((response) =>  response.json())
            .then(myJSON => {
                console.log(myJSON);
                this.setState({
                    apiMax: myJSON.limit,
                    buttons: myJSON.buttons,
                    bars: myJSON.bars,
                    barOptions: myJSON.bars.map((bar, index) => ({ key: index, name: `bar${index+1}`, value: bar})),
                    buttonsOptions: myJSON.buttons.map((btn, index) => ({ key: index, value: btn }))
                });
            })
    }

    handleChange = (event) => {
        const val = event.target.value;
        this.setState({
            curSelBar: parseInt(val, 10)
        });
    }

    getApiWidthInBarWidth = (apiWidth) => {
       console.log((apiWidth * barWidth) / this.state.apiMax);
       return (apiWidth * barWidth) / this.state.apiMax;
    }

    getNewValue = (curVal, changeVal) => {
        const newVal = curVal + changeVal;
        if (newVal < 0) return 0;
        if (newVal > this.state.apiMax) {
          //console.log(this.state.curSelBar.style('background-color':red));
          return this.state.apiMax;
          }
        return newVal;
    }

    onValChange = (val) => {
        const newBarOptions = [ ...this.state.barOptions ].map(bo => {
            if ( bo.key === this.state.curSelBar ) {
                return { ...bo, value: this.getNewValue(bo.value, val) }
            }
            return bo;
        });

        this.setState({
            barOptions: newBarOptions
        })
    }

  render() {
    return (
      <div className="App container">
          <div className="row">
                <svg width={barWidth+20} height={this.state.barOptions.length * 80}>
                    {
                        this.state.barOptions.map((bar, index) => {
                            return (
                                <g key={bar.key}>
                                    <rect x='10' y={(bar.key+1) * 40} width={barWidth} height="30" className={'mysvgrectNoFill'} />
                                    <rect x='10' y={(bar.key+1) * 40} width={this.getApiWidthInBarWidth(bar.value)} height="30" className={(this.getApiWidthInBarWidth(bar.value)>=barWidth ? 'mysvgrectExceed' : 'mysvgrect')} />
                                </g>
                            )
                        })
                    }
                </svg>
          </div>
          <div className="row">
              <div className="col-md-2">
                <select className="form-control" value={this.state.curSelBar} onChange={this.handleChange}>
                    {
                      this.state.barOptions.map((bar) => {
                          return <option key={bar.key} value={bar.key}>{bar.name}</option>
                      })
                    }
                </select>
              </div>  
              <div className="col-md-7 btnGroup01">
              {
                  this.state.buttonsOptions.map(btn => (
                    <button className="btn btn-default" key={btn.key} onClick={() => this.onValChange(btn.value)}>{btn.value}</button>
                  ))
              }
              </div>

          </div>
      </div>
    );
  }
}

export default App;
