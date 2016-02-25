var process_data = function(item) {
    item.credit = item.credit.replace(/\n/g, '').trim();
    item.genre = item.genre.replace(/\s/g, '').split('|');
    item.yeartype = item.yeartype.replace(/\(|\)/g, '');
    var t = item.yeartype.split(' ', 2);
    item.year = t[0];
    item.type = item.yeartype.replace(item.year, '').trim();
    // console.log(item);
    return item;
};

// load sample data
Meteor.startup(function() {
    // Movies.remove({});
    if (Movies.find({}).count() < 10) {
        JSON.parse(Assets.getText('topmovies.json')).forEach(function(item) {
            Movies.insert(process_data(item));
        });
    }
});
