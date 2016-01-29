# Google Analytics anomalies monitor

Application allows detection of anomalies in Google Analytics data based on custom events. Forecast data is calculated using [Holt's linear trend method](https://www.otexts.org/fpp/7/2) ([exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing)). Here is code base which provides API to calculate and manage data. Check out [client application](https://github.com/fraszczakszymon/ga-anomalies-monitor-client) which is UI for **Google Analytics anomalies monitor**.


## Build

Dependencies:
* nodejs,
* npm.

Clone code and install app dependencies:
```bash
git clone https://github.com/fraszczakszymon/ga-anomalies-monitor.git
cd ga-anomalies-monitor
npm install
```

#### Create configuration files:

##### Server configuration:
Copy file with basic config:
```bash
cp config/config.sample.json config/config.json
```
Port provided in this file will be used to run API server.

##### Google Analytics credentials:
```bash
cp config/credentials.sample.json config/credentials.json
```
Steps to create your credentials:

1. Go to [Google Developers Console](https://console.developers.google.com),
2. [Create a new project](https://support.google.com/cloud/answer/6251787?hl=en&ref_topic=6158848),
3. [Enable **Analytics API**](https://support.google.com/cloud/answer/6326510?hl=en&ref_topic=6262490),
4. [Configure your OAuth2 consent screen](https://support.google.com/cloud/answer/6158849?hl=en&ref_topic=6262490),
5. [Set up new credentials](https://support.google.com/cloud/answer/6158862?hl=en&ref_topic=6262490) - Service account key using P12 key type,
6. Save newly created credentials ID in **accountEmail** field of _config/credentials.json_ file. Example below:

        {
          "accountEmail": "1234567890-abcdef@developer.gserviceaccount.com",
          "accountKey": "config/key.pem"
        }

7. 

#### Run server:
```
npm start
```

## Configuration

TBA

## API

TBA

## Contribution

TBA

## License

#### The MIT License

Copyright (c) 2016 Frąszczak Szymon ([@fraszczakszymon](https://github.com/fraszczakszymon))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
