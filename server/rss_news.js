Meteor.publish('rss_news', function() {
  return RSS_News.find();
});

RSS_News.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});

// var RSS_URL = "http://english.astroawani.com/rss/national/public";
var RSS_URL = "https://www.digitalnewsasia.com/rss-feed.xml";

Meteor.startup(function () {
    // code to run on server at startup
    RSS_News.remove({});

    Meteor.call('getLatestNews');

    // Meteor.setInterval(function() {
    //     Meteor.call('getTrainingList');
    // }, 10000);
});

Meteor.methods({
    getLatestNews: function(params){
        this.unblock();
        console.log("get latest news..");
        var feedData = Scrape.feed(RSS_URL);

        var index = 0;

        _.each(feedData.items, function(item){
            //console.log(item);

            //var pubDate = new Date().toJSON().slice(0,10);

            var pubDate = new Date();
            //var pubDate = moment(date); //.format("DD/MM/YYYY");
            
            //var pubDate = new Date();//""; //item.pubDate;

            console.log("date: " + pubDate);

            var newsItemCount = RSS_News.find({
                'pubDate': pubDate
            }).count();

            if (newsItemCount==0){
                item.pubDate = pubDate;
                
                RSS_News.insert(item);
            }
        });

        return true;
    }
});
