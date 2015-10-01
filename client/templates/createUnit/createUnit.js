 Array.prototype.move = function(from, to) { // Array move prototype until ECMA 2015 Array.prototype.copyWithin() is implemented
     this.splice(to, 0, this.splice(from, 1)[0]);
 };

 function applySort() { // must apply sort and dropdown properties everytime the content is changed
     Sortable.create(document.getElementById('content-sections'), {
         animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
         draggable: '.section-card', // Restricts sort start click/touch to the specified element
         handle: '.section-handle', // Specifies which items inside the element should be sortable
         onEnd: function(evt) { // When sections are moved, propagate information to session variable
             console.log(evt.oldIndex);
             console.log(evt.newIndex);
             var tempContent = Session.get('tempContent');
             console.log(tempContent);
             tempContent.move(evt.oldIndex, evt.newIndex);
             console.log(tempContent);
             Session.set('tempContent', tempContent);
         },
         disabled: true,
     });

     [].forEach.call(document.getElementById('content-sections').getElementsByClassName('content-fields'), function(el) {
         Sortable.create(el, {
             group: 'contents',
             animation: 150,
             draggable: ".collection-item",
             handle: '.content-handle',
             disabled: true,
         });
     });
 }

 function applyDropdown() { // jquery was being called before the changes were propagated to the DOM
     var sectionsInJSON = Session.get('tempContent').length;
     var sectionsInHTML = $('.dropdown-button').length;
     if (sectionsInJSON == sectionsInHTML) { // if the changes have been propagated, call jquery
         $('.dropdown-button').dropdown({
             inDuration: 300,
             outDuration: 225,
             //constrain_width: false, // Does not change width of dropdown to that of the activator
             hover: true, // Activate on hover
             //gutter: 0, // Spacing from edge
             //belowOrigin: false, // Displays dropdown below the button
             //alignment: 'left' // Displays dropdown with edge aligned to the left of button
         })
     } else {
         setTimeout(applyDropdown, 50); // re-run function asynchronously until conditions are met
     };
 }

 Template.createUnitContent.rendered = function() {
     if (Session.get('tempContent') == undefined) { // if session variable 'tempContent' does not exist, create one
         Session.set('tempContent', []);
     }

     applySort(); // apply once the template is loaded
     applyDropdown();
     Tracker.autorun(function() { // apply on every change of Session.get('tempContent')
         var tempContent = Session.get('tempContent'); // must call Session (even if not used) to make function reactive
         console.log('entered tracker autorun');
         $(document).ready(function() {
             applySort();
             applyDropdown();
         });
     });
 };

 Template.createUnitContent.events({
     'click .remove-section': function(event) {
         event.preventDefault();
         var section = event.target.id;
         var tempContent = Session.get('tempContent');
         tempContent.splice(section, 1);
         Session.set('tempContent', tempContent);
     },
     'click .add-section': function(event) {
         event.preventDefault();
         tempContent = Session.get('tempContent')
         tempContent.push({
             "type": "unitSection",
             "subContent": []
         });
         Session.set('tempContent', tempContent);
         console.log('session changed');
     },
     'click .add-text': function(event) {
         event.preventDefault();
         var section = event.target.id;
         var tempContent = Session.get('tempContent');
         tempContent[section].subContent.push({
             "type": "text",
             "text": ""
         });
         Session.set('tempContent', tempContent);
     },
     'click .add-video': function(event) {
         event.preventDefault();
         var section = event.target.id;
         var tempContent = Session.get('tempContent');
         tempContent[section].subContent.push({
             "type": "youtube",
             "youtubeVidID": ""
         });
         Session.set('tempContent', tempContent);
     },
     'click .add-image': function(event) {
         event.preventDefault();
         var section = event.target.id;
         var tempContent = Session.get('tempContent');
         tempContent[section].subContent.push({
             "type": "remoteImage",
             "remoteImgURL": ""
         });
         Session.set('tempContent', tempContent);
     },
     'click .remove-content': function(event) {
         event.preventDefault();
         var arrayOfIds = _.words(event.target.id);
         var section = arrayOfIds[0];
         var content = arrayOfIds[1];
         var tempContent = Session.get('tempContent');
         tempContent[section].subContent.splice(content, 1);
         Session.set('tempContent', tempContent);
     },
 });