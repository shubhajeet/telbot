# Facebook Bot from google app script

This repo intends to serve as library to ease in creation of telegram chat Bot using Google App Script.

# Usage 

ProjectId:MPYd_nqgatBHdfoP1CC636z6333tZbdFa

Go to Resources > Libraries and add the above library using the above project id.

# Learn By Example
## Sample code to create echo bot
```js
BOT = new Bot(token);
BOT.addResponse(
  (message) => {
        let mes = { "text": message.text };
        BOT.sendMessage(message.chat.id,mes);
        return true;
    }, 
    (message) => true);
    
function doPost(request)
{
   let response=BOT.response(request);
   return response;
}
```

### Manually get update
```js
  let updates = JSON.parse(BOT.getUpdates()).result;
  for ( upIndex = 0; upIndex < updates.length; upIndex++)
  {
    let update = updates[upIndex];
    BOT.respondToMessage(update.message);
  }
  ```
