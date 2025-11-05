# PM2 Webhook Chi

This is a pm2 module which monitors application processes and sends log messages of specified events, exceptions and errors.

At the first, I want to monitor my application and I want a program which can notify me on WeChat when my application crashes. But, for some reason, I have to implement this by a private webhook url. So this module is only works for me. If you want to use a public webhook url (e.g. WeChat webhook) or your own private url, you can fork this module and implement your own `notify` function in `notifier.js`. It's very easy.

## Usage

You should install this module first:

```sh

pm2 install pm2-webhook-chi

```

To get this module work, you need to tell it your webhook url:

```sh

pm2 set pm2-webhook-chi:webhookUrl https://www.webhook.com/notify.action

```

## Configuration

Here are the all configuration items and their default value.

```json
{
  "webhookUrl": null,
  "log": false,
  "error": true,
  "kill": true,
  "exception": true,
  "restart": true,
  "reload": true,
  "delete": true,
  "stop": true,
  "restart overlimit": true,
  "exit": false,
  "start": false,
  "online": false,
  "bufferMaxSecond": 5,
  "buffer": true
}
```

You can config them by using:

```sh

pm2 set pm2-webhook-chi:<key> <value>

```

## Message merge and postpone sending

When our application is executed in cluster mode, there will be many processes. And if we restart the application, every process will trigger a `restart` event and all the events will be notified to us. I think this is unnecessary and use a message queue to avoid this behaviour.

The message queue receives messages and merges the same event. Then it uses a scheduler to finish the notify task.

We can enable this by set:

```sh

pm2 set pm2-webhook-chi:buffer true

```

And the `bufferMaxSecond` specifies how long should the monitor program buffer the messages. The default value is 5, which means the message queue waits at most 5 seconds while the first message is arrived. Once the waiting time is over the limit, the notify task is executed immediately.

## update

```
pm2 module:update pm2-webhook-chi
```
