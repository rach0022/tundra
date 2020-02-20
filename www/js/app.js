
/*************************
*
*  @description iOS and Android App called Tundra, its a cold climate dating app
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Feb 15, 2020
*
***********************/

const tundra = {
    active: 'home',
    pages: [],
    baseUrl: null,
    appTextSource: {
        welcome: "Welcome to the Tundra Dating App",
        error: "Something Funky Happened, lets reload",
        confirm: "Would you like to delete profile?",
        retrievalIssue: "We are sorry, we could not recover your saved profiles at this time, click home to start swiping on new profiles"
    },
    profilesApiUrl: 'http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=',
    imgBaseUrl: null, //will be loaded in everytime we make a call to the steve api
    genderParameter: null, //the gender parameter for the query in the url above
    currentProfiles: [], //the current loaded profiles, max is 11 (8 at first and then reload when 3 remaining)
    savedProfiles: [], //these are the saved profiles for the user that are stored in session storage
    sessionKey: null, //the session key that will be used to read and write to the session storage, based on device uuid
    PROFILE_MIN: 3, //profileMin is used to set the minimum number of profiles we can have before we load new ones
    //init function for app, runs after Device Ready or DOMContentLoaded
    init: () => {
        tundra.pages = document.querySelectorAll('.page');
        let links = document.querySelectorAll('[data-href]');

        links.forEach(link =>{
            link.addEventListener('click', tundra.nav);
        });

        //get the base url for the app
        tundra.baseUrl = location.href.split('#')[0];
        let hash = location.hash;

        //check for the current url hash
        if(hash &&  hash != '#'){
            //there is an id in the url
            tundra.active = hash.replace('#', '');
            tundra.showPage(tundra.active);
        } else {
            //no url so use our default url (home)
            history.replaceState({}, tundra.active, `${tundra.baseUrl}#${tundra.active}`);
            tundra.showPage(tundra.active);
        }

        //run the initialize tundra function 
        tundra.initTundra();
        console.log('happens');
    },

    //function to initialize all tundra based variables, this is run during init
    initTundra: () =>{
        //start of tundra based initilization code

        //defining the session key
        //set key based on device id
        tundra.sessionKey = "device" in window ? "REVIEW" + device.uuid : "REVIEWTEMPKEY";

        tundra.genderParameter = 'female';
        tundra.getNewProfiles(); //running this at initilization so the user has profiles to swipe

        //now we add the event listener for the build profile page callback
        document.querySelector('[data-href="profiles"]').addEventListener('click', tundra.buildProfilesPage);

        //add event listeners for the buttons to switch gender paramter:
        let genBtns = document.querySelectorAll('.gender');
        genBtns.forEach(btn =>{
            btn.addEventListener('click', tundra.switchGender);
        });

        //now lets initialize the a new instance of Tiny$hell on the profiles sections and home section
        // let home_sect = document.getElementById('home-section');
        // let profile_sect = document.getElementById('profile-section');

        //testtimeout:
        //REMOVED tundra.testTimeOut();



    },

    nav: ev =>{
        //stop the event from preforming default operations or 
        //prevent it from bubbling up to parents
        ev.preventDefault();
        ev.stopPropagation();

        let link = ev.target;
        let target = link.getAttribute('data-href');

        //update the url
        history.pushState({}, target, `${tundra.baseUrl}#${target}`);

        //show the page:
        tundra.showPage(target);
    },

    //helper function to nav to a different page without an event trigger
    navWithoutEvent: target =>{
        //update the url
        history.pushState({}, target, `${tundra.baseUrl}#${target}`);

        //show the page:
        tundra.showPage(target);
    },

    showPage: target =>{
        //scroll to the top of the page:
        window.scrollTo(0,0);

        //switch the active div:
        document.querySelector('.page.active').classList.remove('active');
        document.querySelector(`#${target}`).classList.add('active');

        // switch case method to change app properties based on which page is showing
        switch(target){
            default: 
                console.log(tundra.appTextSource.error);
                break;
            case 'home':
                console.log(tundra.appTextSource.welcome);
                break;
            case 'profiles':
                // tundra.buildProfilesPage(); //cannot do this, hit max stack error
                break;
        }
    },

    //callback function for when the back button is clicked
    backbutton: ev =>{
        //stop any default actions from the button occuring:
        ev.preventDefault();
        ev.stopPropagation();

        //the get the elememnt id from the url
        let target = location.hash.replace("#", "");
        tundra.showPage(target);
    },

    //Start of helper function definitions

    //setProfiles & getSavedProfiles will be used to save (write) the profiles to session storage
    //and then reload (read) the saved profiles, no input paramters as we are using the above variables defined
    setProfiles: () =>{
        //will use a try catch logic to save to the session storage whatever is in the 
        //saved profiles array, using JSON.stringify to convert it
        try{
            let serializedProfiles = JSON.stringify(tundra.savedProfiles);
            sessionStorage.setItem(tundra.sessionKey, serializedProfiles);
        } 
        catch (err){
            console.log(tundra.appTextSource.error, '\n', err);
        }
    },
    getSavedProfiles: () =>{
        if(sessionStorage.getItem(tundra.sessionKey)){
            tundra.savedProfiles = JSON.parse(sessionStorage.getItem(tundra.sessionKey));
        } else {
            console.log(tundra.appTextSource.retrievalIssue);
        }
    },
    //getProfiles will preform a fetch call to the tundra.profilesApiUrl + genderParameter
    //and will add the results to the tundra.currentProfiles array
    getNewProfiles: function() {
        fetch(tundra.profilesApiUrl+tundra.genderParameter)
            .then(response => response.json())
            .then(data =>{
                //first we will decode the imgBaseURL given from the api
                //and set that value to the tundra.imgBaseUrl
                tundra.imgBaseUrl = decodeURIComponent(data.imgBaseURL);
                // tundra.currentProfiles += data.profiles;

                //now we will loop through all the elements of profiles and build
                //new cards for them and push them onto the currentProfiles array
                data.profiles.forEach(profile =>{
                    tundra.currentProfiles.push(profile);
                    // tundra.buildNewProfileCards(profile);
                })
                //we want to only build one profile at a time and then build a new one each time it is removed:
                tundra.buildNewProfileCards(tundra.currentProfiles[tundra.currentProfiles.length - 1]);
                // console.log(tundra.currentProfiles, tundra.imgBaseUrl);
            })
            .catch(err => {
                //for now we will console log the error later on we will
                //switch the error overlay to active to show that an error has occured
                console.log(err);
            })
    },

    //function to check the length of the currentProfiles array and if its < 3 then we will
    //load in new profiles with the above function otherwise do nothing
    //we will preform this check in the removeCard function below
    checkCurrentLoadedProfiles: function(){
        let len = tundra.currentProfiles.length;

        if(len < tundra.PROFILE_MIN){
            tundra.getNewProfiles();
        }
        // console.log(len);
    },

    //function to use the data from the profiles to build cards
    //will be split up into two functions, one to get the data and put that into the array (above)
    //and then this function to take said data and build the cards using tiny$hell
    buildNewProfileCards: profile => {
        
        /* style of the card we want to create
                    <div class="card fixed active">
                        <header>
                            <h2>Ms. Temp Orary</h2>
                        </header>
                        <img src="#" alt="Test Image">
                        <div class="info">
                            <p>NAME</p>
                            <p>DISTANCE</p>
                        </div>
                    </div>
        */

        //first we will create all the elements of the card
        let card = document.createElement('div');
        let heading = document.createElement('header');
        let headerText = document.createElement('h2');
        let poster = document.createElement('img');
        let infoText = document.createElement('div');
        let genderText = document.createElement('p');
        let distText = document.createElement('p');

        //now we set the individual details we want to liek classes, information, etc
        card.classList.add('card', 'fixed', 'active');
        card.setAttribute('data-id', profile.id);
        infoText.classList.add('info');
        headerText.textContent = profile.first + ' ' + profile.last;
        distText.textContent = profile.distance;
        genderText.textContent = profile.gender[0].toUpperCase() + profile.gender.substring(1);
        poster.src = 'http:' + tundra.imgBaseUrl + profile.avatar;

        //now we append the elements in the proper order
        heading.appendChild(headerText);
        infoText.appendChild(genderText);
        infoText.appendChild(distText);
        card.appendChild(heading);
        card.appendChild(poster);
        card.appendChild(infoText);

        //now to make the card into its own instance of Tiny$hell
        let tinyCard = new tinyshell(card);
        tinyCard.addEventListener('swipeleft', tundra.swipeLeft);
        tinyCard.addEventListener('swiperight', tundra.swipeRight);
        document.getElementById('home-section').appendChild(card);

    },

    //functions to swipeLeft and swipeRight (delete and save)
    //swipeLeft will move the card off the screen and trigger
    //the function calls to remove the card from here and from the array
    swipeLeft: ev =>{
        let card = ev.currentTarget;
        //removing the event listeners to stop the event from triggering again
        // card.removeEventListener('swiperight',tundra.swipeRight);
        // card.removeEventListener('swipeleft',tundra.swipeLeft);
        let id = ev.currentTarget.getAttribute('data-id');
        tundra.toggleTimeout('deactive', 500, document.getElementById('deleted')); //showing the overlay
        // tundra.animateCSS(document.querySelector('.overlay .message .icon.delete'), 'heartbeat'); //change query slector to something more specific

        //add the class to the div to move it to the left and then remove the card
        card.classList.add('moveleft');
        tundra.removeCard(card);

        //now to remove the card from the currentProfiles array
        let index = tundra.currentProfiles.findIndex(person => person.id == id);
        let removed = tundra.currentProfiles.splice(index, 1);
        console.log(removed); //log out the removed card for now and the length
    },

    //function to swipe right, this will add the profile from currentProfiles to 
    //savedProfiles (we should load in the saved profiles first)
    swipeRight: ev =>{
        let card = ev.currentTarget;
        //removing the event listeners to stop the event from triggering again
        // card.removeEventListener('swiperight',tundra.swipeRight);
        // card.removeEventListener('swipeleft',tundra.swipeLeft);
        let id = ev.currentTarget.getAttribute('data-id');
        tundra.toggleTimeout('deactive', 500, document.getElementById('saved')); //showing the overlay
        // tundra.animateCSS(document.querySelector('.overlay .message .icon.heart'), 'heartbeat'); //change query slector to something more specific

        //add the class to the card to make it move to the right and then remove the card
        card.classList.add('moveright');
        tundra.removeCard(card);

        //now first we check the savedProfiles from session storage, add the correspoding
        //person object to the array of savedProfiles and then setSavedProfiles and remove from 
        //currentProfiles (while also checking the length)
        tundra.getSavedProfiles();
        let index = tundra.currentProfiles.findIndex(person => person.id == id);
        let saved = tundra.currentProfiles.splice(index, 1);
        tundra.savedProfiles.push(saved);
        tundra.setProfiles();
        // console.log(saved, tundra.savedProfiles);
    },

    //helper function to remove the card from the html:
    removeCard: card =>{
        //now using a timeout of 500ms lets remove the card
        //completely from the html
        setTimeout(
            function(){
                //remove the div from the parent element
                this.parentElement.removeChild(this);
                // this.parentElement.innerHTML = "";
            }.bind(card), 
            500 //ms
        );
        tundra.buildNewProfileCards(tundra.currentProfiles[tundra.currentProfiles.length - 1]); //build a new profile after we check
        tundra.checkCurrentLoadedProfiles();
    },

    //this is the callback function to build the saved profiles page using the data from
    //session storage when the user clicks the profiles tab
    buildProfilesPage: () => {
        //first we pull the current data from the session stroage
        tundra.getSavedProfiles();
        // console.log(tundra.savedProfiles);

        //now lets get a reference to the section of the profiles page and clear that
        //then rebuild the elememts based on whats in the tundra.savedProfiles()
        let profile_sect = document.getElementById('profile-section');
        profile_sect.innerHTML = "";

        /* build the profiles based on this html skleton: 
        <ul class="list-view">
            <li class="list-item">
                <img src="" alt="" class="avatar">
                <div class="list-text"></div>
                <div class="action-right"><span class="icon delete"></span></div>
            </li>
        </ul>
        */

        //first the ul element to contain all the profiles, add the class and create a document
        //frag
        let list_view = document.createElement('ul');
        list_view.classList.add('list-view');
        let frag = document.createDocumentFragment();

        //loop through each profile in tundra.savedProfiles and create the corresponding elements
        //setting the text values and img src from the savedprofile
        if(tundra.savedProfiles.length >= 1){ //if it is not an empty array
            tundra.savedProfiles.forEach(profile =>{

                //first create all the elements needed
                let list_item = document.createElement('li');
                let poster = document.createElement('img');
                let profile_name = document.createElement('div');
                let list_label = document.createElement('p');
                let del_button = document.createElement('div');
                let span_icon = document.createElement('span');
    
                //now to set the class names and values for text
                list_item.classList.add('list-item');
                list_item.setAttribute('data-id', profile[0].id); //set the id so we still have a link to the array
                poster.src = 'http:' + tundra.imgBaseUrl + profile[0].avatar;
                poster.alt = `Avatar image for ${profile[0].first} ${profile[0].last}`;
                poster.classList.add('avatar');
                profile_name.classList.add('list-text')
                list_label.textContent = `${profile[0].first} ${profile[0].last}`;
                del_button.classList.add('action-right');
                del_button.setAttribute('data-id', profile[0].id); //set the id so we still have a link to the array
                del_button.addEventListener('click', tundra.deleteProfile);
                span_icon.classList.add('icon', 'delete');
    
                //now to append the elements in the proper order to the list item and then
                //make it into a new instace of tiny$hell and thenappend to the document fragment 
                del_button.appendChild(span_icon);
                profile_name.appendChild(list_label);
                list_item.appendChild(poster);
                list_item.appendChild(profile_name);
                list_item.appendChild(del_button);

                // list_item = new tinyshell(list_item);

                frag.appendChild(list_item);
            });
            //now we append the frag to the ul (list_view) and show the profiles page
            list_view.appendChild(frag);
            profile_sect.appendChild(list_view);
            tundra.navWithoutEvent('profiles');
        }
    },

    //callback function to delete saved profile when the user clicks the delete button in
    // profiles page, first we get the index from the data-id attribute and then we
    //find the index based on the id and splice the element at that index finally navigating
    //back to the profiles page
    deleteProfile: ev =>{
        ev.preventDefault();
        ev.stopPropagation();

        let id = ev.currentTarget.getAttribute('data-id');
        let index = tundra.savedProfiles.findIndex(person => person[0].id == id);
        let removed = tundra.savedProfiles.splice(index, 1);
        console.log(removed); //log out the removed card for now and the length
        tundra.setProfiles();
        tundra.buildProfilesPage();
        tundra.navWithoutEvent('profiles');
    },

    //helper function to turn off or on a class, paramter will be the class name that you want to
    //toggle and the function will then untoggle that class after a timeout (in ms) that is specified 
    //on a specific element (3 param), use case will look like tundra.toggleTimeOut('deactive', 400, document.getElementById('saved')); 
    toggleTimeout: (className, duration, element) =>{
        setTimeout(() =>{
            element.classList.toggle(className)
        }, duration);
        element.classList.toggle(className);
    },

    //callback function to switch the gender parameter depending on the button clicked
    //we will clear out the currentProfiles array and reload new profiles after switching
    //the gender paramter to the data-val attribute of the button clicked
    switchGender: ev =>{
        let newParam = ev.currentTarget.getAttribute('data-val');

        //check to see if the old param is the same as the current param (otherwise do nothing)
        if(!(tundra.genderParameter == newParam)){
            tundra.genderParameter =  newParam; //we should do some validation on the parameter later
            tundra.currentProfiles = []; //clear out the current profiles
            tundra.getNewProfiles(); //get new profiles

            //change the button class depending on what is active and what is pressed
            document.querySelector('.btn-small.active').classList.remove('active');
            ev.currentTarget.classList.add('active');
        }
    }
}

//copied from https://prof3ssorst3v3.github.io/mad9014/modules/week13/#domcontentloaded-vs-deviceready
//check to see which device (broswer or phone) we are ready on:
let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";

document.addEventListener(ready, tundra.init);
