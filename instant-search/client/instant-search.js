Movies = new Meteor.Collection('Movies');

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};

var fields = ['title', 'yeartype', 'episode', 'outline', 'credit'];
MovieSearch = new SearchSource('movies', fields, options);

Tracker.autorun(function(){
    // refresh content
    MovieSearch.search(Session.get('searchText'), {
        genre: Session.get('genre')
    });
});

FlowRouter.route('/', {
    name: "home",
    action: function(path, params) {
        if (params.genre) {
            // console.log(params.genre);
            Session.set('genre', params.genre);
        }
    }
});

Template.content.helpers({
    search: function() {
        return MovieSearch.getData({
            transform: function(matchText, regExp) {
                return matchText.replace(regExp, "<font color=\"coral\">$&</font>");
            },
            sort: {isoScore: -1}
        });
    }
});

Template.content.rendered = function() {
    // initialize mobile-menu
    $('#mmenu').mmenu({
        classes: "mm-white",
        header: true,
        buttonbar: "Buttonbar",
        counters: true,
        offCanvas: {
            position: "left",
            zposition: "front"
        },
        onClick: {
            blockUI: false,
            close: true,
            preventDefault: false,
            setSelected: true
        }
    });
};

Template.header.events({
    "keyup #search": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        // console.log(text);
        Session.set('searchText', text);
    }, 500)
});

Template.menu.helpers({
    genres: function() {
        // get distinct 'genre'
        return _.uniq(_.flatten(Movies.find({}, {
            fields: {genre: true}
        }).fetch().map(function(x) {
            return x.genre;
        })).sort(), true);
    }
});

Template.menu.events({
    'click .genre': function(e) {
        // click event will not execute but should exist
        // otherwise the item cannot be selected, not sure why
    }
});
