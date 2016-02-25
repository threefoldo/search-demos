var lastQuery = "";

Session.setDefault('pageSize', 6);
Session.setDefault('page', 0);
Session.setDefault('loading', true);

var fields = ['title', 'yeartype', 'episode', 'outline', 'credit'];
Search = new SearchSource('movies', fields, {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
});

Template.search.onCreated(function(){
  var self = this;
  self.autorun(function(){
    var size = Session.get('pageSize'),
        page = Session.get('page');
    if(!!lastQuery){
      Search.search(lastQuery, {
        skip: page*size,
        limit: size
      });
    }
  });
});

var scrollListener = _.debounce(function() {
    var diff = $(document).height()-$(window).height();
    // All the taxing stuff you do
    if ($(window).scrollTop() === diff){
        Session.set('page', Session.get('page') + 1);
    }
}, 50);

Template.search.onCreated(function(){
    window.addEventListener('scroll', scrollListener);
});

Template.search.onDestroyed(function(){
    window.removeEventListener('scroll', scrollListener);
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
        var size = Session.get('pageSize'),
            page = Session.get('page');
        return [page*size, (page+1)*size].join('&nbsp;-&nbsp;');
    }
});

Template.search.events({
    "keyup input": _.throttle(function(e, t) {
        var query = $(e.target).val().trim();
        if(query && query.length > 0){
            if(query !== lastQuery){
                Session.set('page', 0);
                var size = Session.get('pageSize');
                lastQuery.text = query;

                Search.search(query, {
                    skip: 0,
                    limit: size
                });
            }
        } else {
            //clear result
            lastQuery = query;
            Search.store.remove({});
        }
    }, 500),
    "click #btn-mmenu": function(event) {
        console.log("open mmenu");
        $("#mmenu").trigger("open.mm");
    },
    "click #btn-search": function(event) {
        console.log("close mmenu");
        $("#mmenu").trigger("close.mm");
    }
});
