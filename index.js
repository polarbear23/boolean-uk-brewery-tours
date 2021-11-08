let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  pages: 0,
  page: 0,
  filters: {
    type: "",
    city: [],
    search: ""
  }
};

function setState(newState){
  state = {...state, ...newState};
  console.log(state);
}

function getBreweriesByState(){
  const input = state.selectStateInput;
  const newState = {
    breweries:[],
    cities:[],
    pages:0,
    page:0,
    filters:{
      type: "",
      city: [],
      search: ""
    }
  };
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${input}`)
  .then(resp =>{
    return resp.json();
  })
  .then(breweries =>{
    breweries = cleanDataBrewTypes(breweries);
    newState.breweries = [...breweries];
    const cities = breweries.map(element =>{return element.city});
    newState.cities = [...new Set(cities)]; //this is to make sure the cities are only appearing once for our filter choices as set only allows unique values
    //console.log(breweries);
    console.log(newState.cities);
    newState.pages = Math.ceil(newState.breweries.length / 10);
    console.log(newState.pages);
    newState.page = 1;
    setState(newState);
    renderBreweriesList(state);
  }); 
}

function renderBreweryListHeader(){
  const title = document.createElement("h1");
  const searchHeaderEl = document.createElement("header");
  const formSearch = document.createElement("form");
  const labelSearch = document.createElement("label");
  const labelH2El = document.createElement("h2");
  const inputSearch = document.createElement("input");
  title.innerText = "List of Breweries";
  searchHeaderEl.setAttribute("class","search-bar");
  formSearch.setAttribute("id","search-breweries-form");
  formSearch.setAttribute("autocomplete","off");
  labelSearch.setAttribute("for","search-breweries");
  labelH2El.innerText = "Search breweries:";
  inputSearch.setAttribute("id", "search-breweries");
  inputSearch.setAttribute("name", "search-breweries");
  inputSearch.setAttribute("type","text");

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    let newState = {...state,...state}
    newState.filters.search = inputSearch.value;
    setState(newState);
    cleanDataAllFilters();
  });
  //appending
  const main = document.querySelector("main");
  labelSearch.appendChild(labelH2El);
  formSearch.append(labelSearch,inputSearch);
  searchHeaderEl.appendChild(formSearch);
  main.append(title,searchHeaderEl);
}

function renderBreweriesListContainer(){
  const article = document.createElement("article");
  const list = document.createElement("ul");
  list.setAttribute("class", "breweries-list");
  //appending
  const main = document.querySelector("main");
  article.appendChild(list);
  main.appendChild(article);
}

function renderBreweriesListItem(brewery){
  const listEl = document.createElement("li");
  const nameOfBrewery = document.createElement("h2");
  const typeOfBrewery = document.createElement("div");
  const addressSection = renderAddress(brewery);
  const phoneSection = renderPhone(brewery);
  const websiteLinkSection = renderWebsiteLink(brewery);

  nameOfBrewery.innerText = `${brewery.name}`;
  typeOfBrewery.setAttribute("class", "type");
  typeOfBrewery.innerText = `${brewery.brewery_type}`;

  listEl.append(nameOfBrewery, typeOfBrewery, addressSection, phoneSection, websiteLinkSection);
  const listContainer = document.querySelector(".breweries-list");
  listContainer.appendChild(listEl);
}

function renderAddress(brewery){
  const addressSection = document.createElement("section");
  const addressSubtitle = document.createElement("h3");
  const addressRoad = document.createElement("p");
  const addressLine2Container = document.createElement("p");
  const strongAddressLine2 = document.createElement("strong");

  addressSection.setAttribute("class", "address");
  addressSubtitle.innerText = "Address:";
  addressRoad.innerText = `${brewery.street}`;
  strongAddressLine2.innerText = `${brewery.city}, ${brewery.postal_code}`;

  addressLine2Container.appendChild(strongAddressLine2);
  addressSection.append(addressSubtitle, addressRoad, addressLine2Container);
  return addressSection;
}

function renderPhone(brewery){
  const phoneSection = document.createElement("section");
  const phoneSubtitle = document.createElement("h3");
  const phoneNumber = document.createElement("p");

  phoneSubtitle.innerText = "Phone:";
  phoneNumber.innerText = `${brewery.phone}`;

  phoneSection.append(phoneSubtitle, phoneNumber);
  return phoneSection;
}

function renderWebsiteLink(brewery){
  const websiteSection = document.createElement("section");
  const websiteLink = document.createElement("a");
  const bookingFormLink = document.createElement("a");

  websiteSection.setAttribute("class", "link");
  bookingFormLink.innerText = "Book a Tour";
  bookingFormLink.setAttribute("href",`booking.html`);
  websiteLink.setAttribute("href",`${brewery.website_url}`);
  websiteLink.setAttribute("target","_blank");
  websiteLink.innerText = "Visit Website";
  websiteSection.append(bookingFormLink);
  websiteSection.appendChild(websiteLink);
  return websiteSection;
}

function renderPages(){
  const pageBtnContainer = document.createElement("div");
  for(let i = 0; i < state.pages; i++){
    const pageButton = document.createElement("button");
    pageButton.innerText = i + 1;
    pageButton.addEventListener("click", () => {
      const newState = {
        page:i+1
      }
      setState(newState);
      removeOldListElements();
      renderBreweriesListWithoutFilters(state);
    });
    pageBtnContainer.appendChild(pageButton);
  }
  return pageBtnContainer;
}

function renderBreweriesList(state) {
  renderBreweryListHeader();
  renderBreweriesListContainer();
  renderFiltersSection();
  if(state.page === 1){
    console.log("Inside renderBreweriesList: ", state.breweries);
    for (let i = 0; i < (state.page*10); i++) {
      renderBreweriesListItem(state.breweries[i]);
    }
    const listContainer = document.querySelector(".breweries-list");
    listContainer.appendChild(renderPages());
  }
  else if(state.page > 1){
    const start = ((state.page*10)-10);
    const end = ((state.page*10));
    for (let i = start; i < end; i++) {
      renderBreweriesListItem(state.breweries[i]);
    }
    const listContainer = document.querySelector(".breweries-list");
    listContainer.appendChild(renderPages());
  }
}

function renderBreweriesListWithoutFilters(state) {
  renderBreweriesListContainer();
  if(state.page === 1){
    console.log("Inside renderBreweriesList: ", state.breweries);
    for (let i = 0; i < (state.page*10); i++) {
      renderBreweriesListItem(state.breweries[i]);
    }
    const listContainer = document.querySelector(".breweries-list");
    listContainer.appendChild(renderPages());
  }
  else if(state.page > 1){
    const start = ((state.page*10)-10);
    const end = ((state.page*10) - ((state.page*10) - state.breweries.length));
    for (let i = start; i < end; i++) {
      renderBreweriesListItem(state.breweries[i]);
    }
    const listContainer = document.querySelector(".breweries-list");
    listContainer.appendChild(renderPages());
  }
}

function cleanDataAllFilters(){
  const newState = {
    breweries: [...state.breweries],
    pages:0
  }
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${state.selectStateInput}`)
    .then(resp =>{
    return resp.json();
    })
    .then(breweries =>{
      newState.breweries = [...cleanDataBrewTypes(breweries)]
      setState(newState);
      if(state.filters.type.length > 0){
        newState.breweries = newState.breweries.filter(brewery => { 
          if(brewery.brewery_type === state.filters.type){
            return brewery;
          }});
      }
      if(state.filters.city.length > 0){
        //console.log("here");
        newState.breweries = newState.breweries.filter((brewery) => {
            for(let i = 0; i < state.filters.city.length; i++){
              console.log(brewery.city, state.filters.city[i]);
              if(brewery.city === state.filters.city[i]){
                return brewery;
              }
            }
          }
        )
      }
      if(state.filters.search.length > 0){   
        newState.breweries = newState.breweries.filter(brewery => { 
          if(brewery.name.toUpperCase() === state.filters.search.toUpperCase() || brewery.city.toUpperCase() === state.filters.search.toUpperCase()){
            return brewery;
          }
        });
      }
      newState.pages = Math.ceil(newState.breweries.length / 10);
      setState(newState);
      removeOldListElements();
      renderBreweriesListWithoutFilters(state);
  })
}

function renderFiltersSection(){
  const filtersSection = document.createElement("aside");
  const filterHeading = document.createElement("h2");
  const typeForm = renderFilterByTypeForm();
  const filterByCityHeading = renderFilterByCityHeading();
  const filterCityForm = renderFilterByCityForm();

  filtersSection.setAttribute("class", "filters-section");
  filterHeading.innerText = "Filter By:";
  
  const main = document.querySelector("main");
  filtersSection.append(filterHeading, typeForm, filterByCityHeading, filterCityForm);
  main.appendChild(filtersSection);
}

function renderFilterByTypeForm(){
  const typeFilterForm = document.createElement("form");
  const selectLabel = document.createElement("label");
  const labelText = document.createElement("h3");
  const selectType = document.createElement("select");
  const defaultOption = document.createElement("option");
  const microOption = document.createElement("option");
  const regionalOption = document.createElement("option");
  const brewpubOption = document.createElement("option");
  typeFilterForm.setAttribute("id", "filter-by-type-form");
  typeFilterForm.setAttribute("autocomplete", "off");
  selectLabel.setAttribute("for", "filter-by-type");
  labelText.innerText = "Type of Brewery";
  selectType.setAttribute("name", "filter-by-type");
  selectType.setAttribute("id", "filter-by-type");
  defaultOption.setAttribute("value", "");
  defaultOption.innerText = "Select a type...";
  microOption.setAttribute("value", "micro");
  microOption.innerText = "Micro";
  regionalOption.setAttribute("value", "regional");
  regionalOption.innerText = "Regional";
  brewpubOption.setAttribute("value", "brewpub");
  brewpubOption.innerText = "Brewpub"
  typeFilterForm.addEventListener("change", (e) => {
    let newState = {...state, ...state}
    newState.filters.type =  selectType.value;
    setState(newState);
    cleanDataAllFilters();
  })
  selectType.append(defaultOption, microOption, regionalOption, brewpubOption);
  selectLabel.appendChild(labelText);
  typeFilterForm.append(selectLabel,selectType);
  return typeFilterForm;

}


function renderFilterByCityHeading(){
  const filterByCityHeadingSection = document.createElement("div");
  const filterByCityTitle = document.createElement("h3");
  const filterClearAllBtn = document.createElement("button");

  filterByCityHeadingSection.setAttribute("class","filter-by-city-heading");
  filterByCityTitle.innerText = "Cities";
  filterClearAllBtn.setAttribute("class", "clear-all-btn");
  filterClearAllBtn.innerText = "clear all";
  filterClearAllBtn.addEventListener("click", () => {
    const formOfChecks = document.querySelector("#filter-by-city-form");
    const checks = formOfChecks.querySelectorAll("input");
    checks.forEach(element => {
      element.checked = false;
    });
    const newState = {...state, ...state};
    newState.filters.city = []; 
    setState(newState);
    cleanDataAllFilters();
  });
  filterByCityHeadingSection.append(filterByCityTitle,filterClearAllBtn);
  return filterByCityHeadingSection;
}

function renderFilterByCityForm(){
  const filterByCityForm = document.createElement("form");
  filterByCityForm.setAttribute("id", "filter-by-city-form");
  for(let i = 0; i < state.cities.length; i++){
    const filterInput = document.createElement("input");
    const filterInputLabel = document.createElement("label");
    filterInput.addEventListener("change", (e) =>{
      let newState = {...state, ...state}
      if(filterInput.checked === true){
          newState.filters.city.push(filterInput.value);
          setState(newState);
          cleanDataAllFilters();
          //console.log(cleanDataAllFilters());
      }
      if(filterInput.checked === false){
        const index = newState.filters.city.indexOf(filterInput.value);
        newState.filters.city.splice(index,1);
        setState(newState);
        cleanDataAllFilters();
        }
      });
    filterInput.setAttribute("type","checkbox");
    filterInput.setAttribute("name", state.cities[i]);
    filterInput.setAttribute("value", state.cities[i]);
    filterInputLabel.setAttribute("for", state.cities[i]);
    filterInputLabel.innerText = `${state.cities[i]}`;
    filterByCityForm.append(filterInput, filterInputLabel);
  }
  return filterByCityForm;
}

function addEventToForm(){
  const form = document.querySelector("#select-state-form");
  form.addEventListener("submit",(e) => {
    e.preventDefault();
    removeOldElements();
    const input = form.querySelector("input").value;
    const newState = {
      selectStateInput: `${input}`  
    };
    setState(newState);
    getBreweriesByState();
  });
}

function removeOldElements(){
  const listContainer = document.querySelector(".breweries-list");
  const asideFilters = document.querySelector(".filters-section");
  const main = document.querySelector("main");
  const article = main.querySelector("article");
  const h1El = main.querySelector("h1");
  const header = main.querySelector("header");
  if(listContainer){
    const listElementArray = listContainer.querySelectorAll("li");
    for(let i = 0; i < listElementArray.length; i++){
        listElementArray[i].remove();
    }
    h1El.remove();
    header.remove();
    article.remove();
    asideFilters.remove();
  }
}

function removeOldListElements(){
  const listContainer = document.querySelector(".breweries-list");
  const main = document.querySelector("main");
  const article = main.querySelector("article");  
  if(listContainer){
    const listElementArray = listContainer.querySelectorAll("li");
    for(let i = 0; i < listElementArray.length; i++){
        listElementArray[i].remove();
    }
    article.remove();
  }
}

//default filter because we only want micro regional or brewpub by default
function cleanDataBrewTypes(data){
  const newData = data.filter(brewery => {
    if(brewery.brewery_type === "micro" || brewery.brewery_type === "regional" || brewery.brewery_type === "brewpub"){
      return brewery;
    }
  });
  return newData;
}

// type filter
function typeFilter(data, filterToType){
  const newData = data.filter(brewery => { brewery.brewery_type === filterToType});
  return newData;
}

addEventToForm();



