# Tundra
## Cold Climate Dating App

#### Bugs to Fix:
- [ ] uncaught error when swiping right and left, removeChild is null for an element, find out why
- [x] iphone 11 seems to be slower find out why, (solved) overscroll was slowiong down the app so disallowoverscroll preference set to true was set in config.xml
- [x] Check old parameter for button so we dont keep rereshing the entire array when constantly clicking the button
- [x] Issue with switching back to home div after going to profiles (active css class wont turn off, change .page code to stop conflicting with Tiny$hell (add .page.active to the query as it wasnt specific enough and was conflicting with the .active classes from tiny$hell)
- [ ] Issue with css transition not showing the card moving in either direction
- [x] Figure out why reveal right and left do not work (wasn't using an instance of tiny$hell on the list-item)
- [x] Fix Content Security Policy for the following
- [x] fix the img-src for the content secutiry policy to allow image sto be displayed
- [x] fix the default-src to allow for calls to steve api for phone
- [x] figure out why content security policy doesnt work on android or ios (solved: use cordova whitelist to allow connection intents)
- [x] figure out why When switching from profiles to home the active class is not removed from the profiles page div (issue in firefox not chrome or on app)
- [x] figure out why i cannot delete a profile from the saved profiles array (the removed profile does not match the one clicked on and the page will not refresh itself to rebuild itself)
- [x] figure out why id does not match the proper deleted profile because I always delete the last one (array.find did not find a match) | was using person.id in for each when it was person[0].id

##### iOS Bugs:
- [ ] figure out why all swipe rights are invalid swiperights (might just be an issue on iphone 11 pro emulator, its fine on iphone 8 emulator and devices)

##### Android Bugs:
- [ ] fix icons for android, use adapative icons as well as legacy icons

#### Code:
- [ ] add my own css animations (using the keyframes)
- [ ] build only one card at a time and then build a new card each time one is swiped
- [x] setup enviroment variables for android development
- [x] learn how to use cordova merges folder: https://www.youtube.com/watch?v=PPI_9ilON7Y&
feature=emb_title
- [x] use session storage to save the saved profiles from the user (now to actually use saved profiles)
- [x] make fetch calls from http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female to get data
- [x] based on data got form above, build cards in the tiny$hell format to append to the home div
- [x] make splashscreen and icon (use https://pgicons.abiro.com/ to export)
- [x] add tiny$hell to this project (hosted for offline use)
- [x] (optional) get google fonts for this project (rokkit and Rubik)
- [x] select a colour scheme to use through the app (in /res/sass/_variables.scss)
- [x] check session storage to make sure it is saving properly
- [x] change original build cards function to append all profiles to the curerntProfiles instead of overwritting
- [x] add more cards once the user hits a minimum 
- [x] build the Profiles page based on what is in the saved profiles array using the skeleton in the html as a base using list from Tiny$hell
- [x] use action-right or reveal-right to show the delete button
- [x] add 2 overlays (one for saved and deleted) and then add a class to .overlay called hidden/ deactive that we will turn off to show the overlay for about 400ms then hide again
- [ ] finish styling for everything
- [ ] build the buttons to switch gender depending on what device we are on or switch the sections class to ios/ android depending on which device
- [x] add an "active" class to the button and change its style to show the user which is selected


#### Project Details: 
- [ ] This app will let you create a Cordova app that will run on both Android and iOS. The core JavaScript that we use will be the same for both versions. However, there may be a few script and style things that are different between the two platforms. We will use the merge folder to handle these differences.
- [x] You will building a two screen Single Page Application as a Cordova App.
- [x] The first screen will show cards with pictures, names and other details. The user will be able to swipe left or right on the card. When the user swipes left or right you need to use a CSS transition to animate the card off the screen in the correct direction.
- [x] Swiping left will delete the card and discard all that data.
- [x] Swiping right will save the person's information in an array that gets stored in sessionStorage, NOT localStorage. By using sessionStorage, the list of saved people will be cleared out each time the browser is closed.
- [x] The second screen will show a list view of all the people that the user swiped right on. This list will be retrieved from sessionStorage
- [x] When the app starts, you need to make a fetch call to the Tundra API - http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female 
- [x] The queryString parameter gender can be female, male or left blank. If left blank, you will get a random selection of people from either gender from the API.
- [x] The data that returns from the fetch will look something like this:
````JSON
{"imgBaseURL":"%2F%2Fgriffis.edumedia.ca%2Fmad9022%2Ftundra%2Fprofiles%2F",
"profiles":[
    {"id":"15180942060", "first":"Joanne", "avatar":"f-028.jpg", "last":"Eastwood", "gender":"female", "distance":"19km"},
    {"id":"15180942061", "first":"Alina", "avatar":"f-026.jpg", "last":"King", "gender":"female", "distance":"11km"},
    {"id":"15180942062", "first":"Janki", "avatar":"f-016.jpg", "last":"Cameron", "gender":"female", "distance":"9km"},
    {"id":"15180942063", "first":"Gwen", "avatar":"f-022.jpg", "last":"Jackson", "gender":"female", "distance":"9km"},
    {"id":"15180942064", "first":"Sam", "avatar":"f-028.jpg", "last":"Polanski", "gender":"female", "distance":"28km"},
    {"id":"15180942065", "first":"Tasneem", "avatar":"f-005.jpg", "last":"Lee", "gender":"female", "distance":"2km"}
]}
````
- [x] Note that each person object will contain a first name, last name, and an avatar image. The images all sit inside the folder defined in the imgBaseURL property at the root level. You will need to use the decodeURLComponent() method to use the value of imgBaseURL. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent . An example of a complete URL for an image would be //griffis.edumedia.ca/mad9022/tundra/profiles/f-009.jpg.

- [x] The profiles array from the data should be looped through and a single card created for each profile.
- [x] after the user swipes the profile card, and after the transition animation has finished be sure to remove the card from the DOM.

#### Getting New Profiles:
- [x] We don't want the user to have to ask for more profiles to be downloaded.
- [x] So, each time we remove a card from the DOM, following a swipe left or right, check the number of cards left. If the number of cards is less than 3, do another fetch to get more profiles. When those profiles are returned, create more cards.
- [x] Hint: reuse your functions from the original fetch and building of cards.

#### After Swiping Cards:
- [x] After the user has swiped a card to the left or the right, then you need to display a message to them confirming that the the profile has been rejected | dismissed | deleted OR saved | favourited | kept | stored. The terminology is up to you. What is important is that you show a confirmation.
- [x] The message should be an overlay. The user needs to be able to read it while the card is being animated off the screen. Then the message disappears while the new card appears.

#### Favourites Screen:
- [x] On the second screen when you display the saved profiles, you should show three things:
    1. The full name of the profile
    2. A small version of the image as an avatar
    3. A delete icon button
- [x] When the user clicks on the delete button you will need to remove that profile from BOTH the list view AND sessionStorage. You will need to use the id from the profile to identify which person to delete from sessionstorage.


#### Submission Requirements: 
- [ ] Step ONE:
    Do a demo during class of your app running on an Android OR iOS device. The demo must include the custom app launcher icon, the custom splashscreen images, and at least the fetch and display of one profile at a time plus the ability to swipe a card.
- [ ] Step TWO:
    - [ ] Add Steve to your private Github Repo
    - [x] Add a .gitignore file to your project that includes:
    - [ ] Submit the link to your Repo on BS LMS.
