import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      items:{},
      isLoaded:false,
      countryValue: '',
      outCountries: [],
      isoValue: '',
      isoCountry: ''
    }
  }
  
  componentDidMount(){
    let URL='http://services.groupkt.com/country/get/all';
    /*var myOptions1={
      method: 'GET',
      mode:'no-cors',
      type:'application/json'
    }*/
    fetch(URL)
    
    .then(response =>response.json())
    .then(json => {
      this.setState({
        isLoaded:true,
        items:json.RestResponse.result,
      })
    })
    ;
  }


  handleCountries = (event) => {
    this.setState({countryValue: event.target.value}, () => {
      const countriesArray = [];
      for(var i = 0; i < this.state.items.length; i++) {
        countriesArray.push(this.state.items[i].name);
      }
      let outputCountries = [];
      for(i = 0; i < countriesArray.length; i++) {
        if(countriesArray[i].match(this.state.countryValue))
          outputCountries.push(countriesArray[i]);
      }
      this.setState({outCountries: outputCountries});
    })
  }

  getCountry = (iso) => {
    const BASE_URL = iso.length === 2 ? 'http://services.groupkt.com/country/get/iso2code/' : 'http://services.groupkt.com/country/get/iso3code/';
    let FETCH_URL= BASE_URL + iso.toUpperCase();
    fetch(FETCH_URL)
    .then(response =>response.json())
    .then(json => {
      this.setState({
        isLoaded:true,
        isoCountry:json.RestResponse.result === undefined ? json.RestResponse.messages : json.RestResponse.result.name
      })
    })
  }
  

  handleSearch = () => {
    const {isoValue} = this.state;
    if(isoValue.length < 2)
      window.alert("ISO cannot be less than 2 characters");
    else if(isoValue.length > 3) 
      window.alert("ISO is invalid");
    else
      this.getCountry(isoValue);
  }

  handleKey = (e) => {
    if(e.key === 'Enter')
      this.handleSearch();
  }
  
  
  render() {
    var { isLoaded, outCountries, isoCountry } =this.state;    
    if(!isLoaded){
      return <div>Loading...</div>
    }
    else{
    return (
      <div className="App">
      <span>
          <input type="text"
          placeholder="Country Name"
          onChange={this.handleCountries}
          style={{width: '200px', height: '20px'}}
          />
      </span>
      <span style={{marginLeft: '10px'}}>
      <input type="text"
          placeholder="Country ISO"
          onChange={(event) => this.setState({isoValue: event.target.value})}
          style={{width: '200px', height: '20px'}}
          onKeyPress={this.handleKey}
          />
      </span>
      <span>
        <button style={{width: '100px', height: '28px', marginLeft: '10px', backgroundColor: 'green', color: 'white', fontWeight: 'bold'}} onClick={this.handleSearch}>Enter</button>
      </span>
      <div style={{marginTop: '25px'}}>
         {outCountries.length > 0 ?
            <table style={{fontFamily: 'arial', borderCollapse: 'collapse', width: '50%'}}>
            <thead>
              <tr>
                <th style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>S No.</th>
                <th style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Country Name</th>
              </tr>
              </thead>
              <tbody>
              {outCountries.map((country, index) => {
                return (
                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#dddddd'}}>
                      <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>{index + 1}</td>
                      <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>{country}</td>
                    </tr>
                  )
              })}
              </tbody>
            </table> : null
         }
      </div>
      <span style={{marginLeft: '60%'}}>
      <b>{isoCountry}</b>
      </span>
      </div>
    );
    }
  }
}

export default App;