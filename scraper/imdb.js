var fs = require('fs');
var utils = require('utils');
var start_url = 'http://www.imdb.com/search/title?at=0&num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_infoss';

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
    }
});

function getMovies() {
    var movies = [];
    var rows = $("#main").find("tr td.title");
    rows.each(function() {
        var el = $(this);
        movies.push({
            title: el.find('a:eq(1)').text(),
            yeartype: el.find('.year_type').text(),
            episode: el.find('.episode').text(),
            outline: el.find('.outline').text(),
            credit: el.find('.credit').text(),
            genre: el.find('.genre').text()
        });
    });
    return movies;
}

casper.start(start_url, function() {
    this.waitForSelector('#main table tbody');
    // this.capture('first.png');
    this.emit('extract');
}).viewport(1280, 1024);

var final = [];
var pages = 0;

casper.on('extract', function() {
    var result = this.evaluate(getMovies);
    utils.dump(result);
    pages++;
    if (pages > 3) {
        fs.write('topmovies.json', JSON.stringify(final), 'w');
        this.exit();
    } else {
        final = final.concat(result);
        this.wait(300, function() {
            casper.echo("next page");
            this.emit('next');
        });
    }
});

casper.on('next', function() {
    this.click('.pagination a');
    this.wait(500, function() {
        this.emit('extract');
    });
});

casper.run();
