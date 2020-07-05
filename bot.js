function Bot(TOKEN)
{
    this.TOKEN = TOKEN;
    this.app = [];
    this.helpStrings = [];
}

Bot.prototype.response =  function(request)
{
    try
    {
        Logger.log(request);
        var data = JSON.parse(request.postData.contents);
        // Make sure this is a page subscription
        if ( data.message )
        {
            return this.respondToMessage(data.message);
        }
        else if (data.edited_message)
        {
            return this.respondToMessage(data.edited_message);
        }
        else
        {
            Logger.log("message not found");
            Logger.log(data);
            return ContentService.createTextOutput(JSON.stringify({"error":"message not found"})).setMimeType(ContentService.MimeType.JSON);;
        }
    }
    catch(e)
    {
        Logger.log("error "+e.name+e.message+JSON.stringify(e));
        return ContentService.createTextOutput(JSON.stringify({"error":e})).setMimeType(ContentService.MimeType.JSON);;

    }
}

Bot.prototype.respondToMessage = function (message)
{
  var i;
  for (i=0; i < this.app.length; i++)
  {
                let match = this.app[i].criteria(message);
                if (match)
                {
                    let response = this.app[i].func(message,match);
                    if (!response)
                        break;
                }
  }
  if (this.matchText(/^\/help/)(message))
  {
    let text = "Help messge:\n" + this.helpStrings.join("/n");
    this.sendMessage(message.chat.id,{"text":text});
  };
}

Bot.prototype.addResponse = function(func,criteria)
{
    this.app.push({"func":func,"criteria":criteria});
}

Bot.prototype.matchText = function(regex)
{
    return message => { return message.text.match(regex);}; 
}

Bot.prototype.addCommand = function(regex,help)
{
    this.helpStrings.push(help);
    return this.matchText(regex);
}

Bot.prototype.sendMessage = function(chat_id,message)
{
    var userProperties = PropertiesService.getUserProperties();
    var token = this.TOKEN; 
    var url = "https://api.telegram.org/bot"+ token +"/sendMessage";
    var mes = { "chat_id": String(chat_id),
                ...message
              };
    var options = {
        "method":"post",
        "payload": mes
    };
    response = UrlFetchApp.fetch(url,options);
    return response;
}


Bot.prototype.setWebhook = function(webAppUrl) {
    var token = this.TOKEN;
    var url = "https://api.telegram.org/bot"+ token +"/setWebhook?url=" + webAppUrl;
    var response = UrlFetchApp.fetch(url);
    return response;
}

Bot.prototype.getWebhookInfo = function()
{
    var token = this.TOKEN;
    var url = "https://api.telegram.org/bot"+ token +"/getWebhookInfo";
    var response = UrlFetchApp.fetch(url);
    return response;
}

Bot.prototype.getUpdates = function() {
    var token = this.TOKEN;
    var url = "https://api.telegram.org/bot"+ token +"/getUpdates";
    var response = UrlFetchApp.fetch(url);
    return response;
}

Bot.prototype.deleteWebhook = function() {
    var token = this.TOKEN;
    var url = "https://api.telegram.org/bot"+ token +"/deleteWebhook";
    var response = UrlFetchApp.fetch(url);
    return response;
}

Bot.prototype.getMe = function() {
    var token = this.TOKEN;
    var url = "https://api.telegram.org/bot"+ token +"/getMe";
    var response = UrlFetchApp.fetch(url);
    return response;
}
