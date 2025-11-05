const axios = require('axios');
const os = require('os');

function getLocalIpAddress () {
  let result;

  const network = os.networkInterfaces();

  for (let key in network) {
    const networkUnit = network[key];

    networkUnit.map((item) => {
      if (item.family === 'IPv4' && !item.internal) {
        result = item.address;
      }
    });
  }

  if (!result) {
    result = 'Unknown IP Address';
  }

  return result;
}

function formUrlEncode (data) {
  const result = [];

  Object.keys(data).map((item) => {
    result.push(`${item}=${data[item]}`);
  });

  return result.join('&');
}

class Notifier {
  moduleConfig = null

  constructor(moduleConfig) {
    this.moduleConfig = moduleConfig;
  }

  notify (message) {
    const requestJson = axios.create({
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });

    const moduleConfig = this.moduleConfig;
    const notifyUrl = moduleConfig.webhookUrl;

    const msgObj = {
      'ip': `${getLocalIpAddress()}`,
      'event': `${message.event}`,
      'title': `${message.name} ${message.isRepeat ? 'and others' : ''}`,
      'description': message.description
    };

    if (message.timestamp) {
      msgObj['timestamp'] = `${new Date(message.timestamp).toLocaleString()}`;
    }

    const requestData = {
      topic: `pm2.webhook.${message.name}`,
      payload: msgObj
    };

    //
    requestJson.post(notifyUrl, requestData);
  }

  notifyAll (messageList) {
    messageList.map((item) => {
      this.notify(item);
    });
  }
}

module.exports = Notifier;
