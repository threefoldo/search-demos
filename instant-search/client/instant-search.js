Movies = new Meteor.Collection('Movies');

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};

var fields = ['title', 'yeartype', 'episode', 'outline', 'credit'];
MovieSearch = new SearchSource('movies', fields, options);

Template.content.helpers({
    movies: function() {
        var genre = Session.get('genre') || '';
        var keyword = Session.get('search');
        return Movies.find({});
    },
    search: function() {
        return MovieSearch.getData({
            transform: function(matchText, regExp) {
                return matchText.replace(regExp, "<font color=\"coral\">$&</font>");
            },
            sort: {isoScore: -1}
        });
    }
});

Template.header.events({
    "keyup #search": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        // console.log(text);
        MovieSearch.search(text);
    }, 500)
});

Template.menu.helpers({
    genres: function() {
        // return Movies.find({}, {fields: {yeartype: true}});
        return _.uniq(_.flatten(Movies.find({}, {
            fields: {genre: true}
        }).fetch().map(function(x) {
            return x.genre;
        })).sort(), true);
    }
});

Template.content.rendered = function() {
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
}

Template.content.events({
    'click .genre': function (e) {

    }
});
