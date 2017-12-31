module.exports = function (){
    this.deepQuest = function (urls,selector){
        this.debug('deepQuest');
        var Quests = [];
        var push = link=>Quests.push(link);
        if (!Array.isArray(urls)) urls = [urls];
        var getLinks = (url,then)=>{
            var options = {
                url:url,
                success:data=>{
                    var $ = this.Parser(data,url);
                    $(selector).map((i,v)=>$.location($(v).attr('href'))).toArray().forEach(push);
                    return then();
                },
                error:()=>this.request(options)
            }
            this.request(options);
        }
        var final = ()=>{
            var sources = {};
            this.database.attr('source').forEach(url=>sources[url]=true);
            this.newBooks(Quests.filter(url=>!sources[url]));
        }
        this.Thread()
        .use(getLinks)
        .end(final)
        .queue(urls)
        .setThread(this.config.get('thread.deepQuest'))
        .log(this.debug.bind(this))
        .label("deepQuest")
        .start();
    }
}