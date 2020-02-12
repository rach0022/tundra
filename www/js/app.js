
/*************************
*
*  @description iOS and Android App called Tundra, its a cold climate dating app
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Feb 11, 2020
*
***********************/

const tundra = {
    active: 'home',
    pages: [],
    baseUrl: null,
    appTextSource: {
        welcome: "Welcome to the Tundra Dating App",
        error: "Something Funky Happened, lets reload",
        confirm: "Would you like to delete profile?"
    },
    profilesApiUrl: 'http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=',
    genderParameter: null,
    currentProfiles: null,

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
        let home = document.getElementById('home');
        let p = document.createElement('p');

        p.textContent = "...Tundra Active"

        home.appendChild(p);

        //start of tundra based initilization code
        //first we set the gender parameter:
        tundra.genderParameter = 'male';
        tundra.getProfiles(); //testing the get profiles function
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
        document.querySelector('.active').classList.remove('active');
        document.querySelector(`#${target}`).classList.add('active');

        //switch case method to change app properties based on which page is showing
        // switch(target){
        //     default: 
        //         console.log(tundra.appTextSource.error);
        //         break;
        //     case 'home':
        //         break;
        //     case 'profiles':
        //         break;
        // }
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
    //getProfiles will preform a fetch call to the tundra.profilesApiUrl + genderParameter
    //and will add the results to the tundra.currentProfiles array
    getProfiles: function() {
        fetch(tundra.profilesApiUrl+tundra.genderParameter)
            .then(response => response.json())
            .then(data =>{
                //add the data to the array
                console.log(data); 
            })
            .catch(err => {
                //for now we will console log the error later on we will
                //switch the error overlay to active to show that an error has occured
                console.log(err);
            })
    }
}

//copied from https://prof3ssorst3v3.github.io/mad9014/modules/week13/#domcontentloaded-vs-deviceready
//check to see which device (broswer or phone) we are ready on:
let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";

document.addEventListener(ready, tundra.init);