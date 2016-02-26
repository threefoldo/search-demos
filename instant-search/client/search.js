var lastQuery = "";
var lastType = "";
var lastGenre = "";

Session.setDefault('pageSize', 6);
Session.setDefault('page', 0);
Session.setDefault('loading', true);
Session.setDefault('type', '');
Session.setDefault('genre', '');
Session.setDefault('query', '');

var fields = ['title', 'yeartype', 'episode', 'outline', 'credit'];
Search = new SearchSource('movies', fields, {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
});

Template.search.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var size, page, cat, genre, query;
        // change 'type', 'genre', 'query' to refresh
        page = Session.get('page');
        size = Session.get('size');
        cat = Session.get('type');
        genre = Session.get('genre');
        query = Session.get('query');
        if (query === lastQuery &&
            cat === lastType &&
            genre === lastGenre) {
            Search.search(query, {
                skip: page * size,
                limit: size,
                cat: cat,
                genre: genre
            });
      } else {
          Search.search(query, {
              skip: 0,
              limit: size,
              cat: cat,
              genre: genre
          });
          Session.set('page', 0);
          lastQuery = query;
          lastType = cat;
          lastGenre = genre;
      }
  });
});

Template.search.onRendered(function(){
    var self = this;
    self.lastNode._uihooks = {
        insertElement: function(node, next) {
            $(node).css('opacity', 0)
                .insertBefore(next)
                .velocity({
                    opacity:[1,0]
                }, {
                    easing: 'easeOutQuad',
                    duration: 200,
                    queue: false
                });
        },
        removeElement: function (node) {
            $(node).velocity({
                opacity:[0, 1]
            }, {
                delay: 1000,
                easing: 'easeOutQuad',
                duration: 200,
                queue: false,
                complete: function(){
                    $(node).remove();
                }
            });
        }
    };
});

Template.search.helpers({
    results: function(){
        var size, page;
        Tracker.nonreactive(function(){
            size = Session.get('pageSize');
            page = Session.get('page');
        });

        return Search.getData({
            transform: function(matchText, regExp) {
                // console.log("transform:", matchText, regExp);
                return matchText.replace(regExp, "<font color=\"coral\">$&</font>");
            },
            limit:(page+1)*size
        });
    },
    loading: function(){
        var state = Search.getStatus();
        return !!state.loading;
    },
    pageState: function(){
        var size, page;
        Tracker.nonreactive(function(){
            size = Session.get('pageSize'),
            page = Session.get('page');
        });
        return [page*size, (page+1)*size].join('&nbsp;-&nbsp;');
    }
});

Template.search.events({
    "keyup input": _.throttle(function(e, t) {
        var query = $(e.target).val().trim();
        if(query && query.length > 0){
            Session.set('query', query);
        } else {
            Session.set('query', '');
        }
    }, 500),
    "click #btn-mmenu": function(event) {
        $("#mmenu").trigger("open.mm");
    },
    "click #btn-search": function(event) {
        $("#mmenu").trigger("close.mm");
    }
});
