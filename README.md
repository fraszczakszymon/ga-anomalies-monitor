# Google Analytics anomalies monitor

[![Build Status](https://travis-ci.org/fraszczakszymon/ga-anomalies-monitor.svg?branch=master)](https://travis-ci.org/fraszczakszymon/ga-anomalies-monitor)

Application allows detection of anomalies in Google Analytics data based on custom events. Forecast data is calculated using [Holt's linear trend method](https://www.otexts.org/fpp/7/2) ([exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing)). Here is code base which provides API to calculate and manage data. Check out [client application](https://github.com/fraszczakszymon/ga-anomalies-monitor-client) which is UI for **Google Analytics anomalies monitor**.

![Sample graph](http://i.imgur.com/GguUELE.png)

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

### Create configuration files:

#### Server configuration:
Copy file with basic config:
```bash
cp config/config.sample.json config/config.json
```
Port provided in this file will be used to run API server - make sure it's not in use.

#### Google Analytics credentials:
```bash
cp config/credentials.sample.json config/credentials.json
```
Steps to create your credentials:

1. Go to [Google Developers Console](https://console.developers.google.com),
2. [Create a new project](https://support.google.com/cloud/answer/6251787?hl=en&ref_topic=6158848),
3. [Enable **Analytics API**](https://support.google.com/cloud/answer/6326510?hl=en&ref_topic=6262490),
4. Go to [management of service accounts](https://console.developers.google.com/permissions/serviceaccounts) and create a new service account with a private key (type: p12),
5. Save automatically downloaded .p12 file in _config/key.p12_,
6. Create _config/key.pem_ file using command:

        cat config/key.p12 | openssl pkcs12 -nodes -nocerts -passin pass:notasecret | openssl rsa > config/key.pem

7. Save newly created e-mail address in **accountEmail** field of _config/credentials.json_ file. Example below:

        {
          "accountEmail": "gaamtest-88@gaam2-1205.iam.gserviceaccount.com",
          "accountKey": "config/key.pem"
        }

8. [Grant permissions to the same e-mail address on Google Analytics](https://support.google.com/analytics/answer/1009702?hl=en). It may have read-only privileges.
 
### Verify credentials:

Run command:
```bash
node cli.js profiles
```

And check whether all available GA profiles are listed.

### Run server:
```
npm start
```

## Queries configuration

Build queries with the syntax described in [documentation](https://developers.google.com/analytics/devguides/reporting/core/v3/reference). Each json with query configuration should be placed in _config/config.json_ in **queries** array. To verify query you can use [GA Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/). Time dimensions (day, hour) are added automatically so correct configuration should look like:

```json
{
    "id": "pageview",
    "title": "Pageviews",
    "description": "Number of pageviews",
    "viewIds": "12345678",
    "metrics": [
        "pageviews"
    ],
    "dimensions": [],
    "filters": "",
    "alpha": 0.9,
    "beta": 0.6,
    "threshold": 0.15,
    "enabled": true
},
{
    "id": "my-custom-event",
    "title": "My custom event",
    "description": "Events with category here/is/category and action here.is.action.name",
    "viewIds": "12345678",
    "metrics": [
        "totalEvents"
    ],
    "dimensions": [
    	"eventCategory"
    ],
    "filters": "ga:eventCategory=@here/is/catego;ga:eventAction==here.is.action.name",
    "alpha": 0.9,
    "beta": 0.8,
    "threshold": 0.2,
    "enabled": true
}
```

### Description of parameters:

| Parameter                                | Type    | Description |
|------------------------------------------|---------|-------------|
| **id**                                   | string  | Unique query id |
| **title**                                | string  | Title to be displayed in UI panel |
| **description**                          | string  | Description to be displayed in UI panel |
| **viewIds**                              | integer | GA profile id |
| **metrics**, **dimensions**, **filters** | string  | GA filter parameters |
| **threshold**                            | float   | Decide when error should be marked as an anomaly |
| **alpha**, **beta**                      | float   | Used to calculate forecast data. Value has to be in range from 0.01 to 1.0. You can choose these values experimentally or using command: `node cli.js parameters <queryId>` |
| **enabled**                              | boolean | Decide whether include query in request to API or skip it |

## API description

### History of builds
##### GET `/build`

Returns json with created builds (max 48).

```json
[
	{
		"id": 29,
		"date": "2016-02-05T08:35:12+01:00",
		"duration": 14984,
		"status": 0
	},
	{
		"id": 28,
		"date": "2016-02-05T08:34:22+01:00",
		"duration": 14901,
		"status": 0
	},
	{
		"id": 27,
		"date": "2016-02-05T08:30:22+01:00",
		"duration": 16406,
		"status": 0
	}
]
```

| Field        | Type    | Description |
|--------------|---------|-------------|
| **id**       | integer | Build id |
| **date**     | string  | Date when build was created |
| **duration** | integer | Build duration in milliseconds |
| **status**   | integer | Current status of build: 0 - done, 1 - pending, 2 - failed |

### Build details
##### GET `/build/{id}`

Returns json with build details and calculated data.

```json
{
	"id": 29,
	"date": "2016-02-05T08:35:12+01:00",
	"duration": 14984,
	"status": 0,
	"queries": [
		{
			"id": "pageview",
			"title": "Pageviews",
			"description": "Number of pageviews",
			"data": [
				{
					"date": "2016-02-01T00:00:00-08:00",
					"value": 345248,
					"error": 0,
					"forecast": 345248,
					"max": 397035.2,
					"min": 293460.8,
					"change": 0,
					"exceeded": false
				},
				{
					"date": "2016-02-01T01:00:00-08:00",
					"value": 306954,
					"error": 0,
					"forecast": 306954,
					"max": 352997.1,
					"min": 260910.9,
					"change": -11.091736954305311,
					"exceeded": false
				}
			],
			"errors": 0
		}
	]
}
```

| Field        | Type    | Description |
|--------------|---------|-------------|
| **id**       | integer | Build id |
| **date**     | string  | Date when build was created |
| **duration** | integer | Build duration in milliseconds |
| **status**   | integer | Current status of build: 0 - done, 1 - pending, 2 - failed |
| **queries**  | array   | Array with defined queries data |

Each query object contains:

| Field           | Type    | Description |
|-----------------|---------|-------------|
| **id**          | string  | Query id (defined in config) |
| **title**       | string  | Query title (defined in config) |
| **description** | string  | Query description (defined in config) |
| **data**        | array   | Calculated data details |
| **errors**      | integer | Number of detected anomalies |

Each row in data contains:

| Field           | Type    | Description |
|-----------------|---------|-------------|
| **date**        | string  | Date with time |
| **value**       | integer | Number of event occurrences at given time |
| **forecast**    | integer | Expected number of event occurrences at given time |
| **error**       | float   | Difference between expected and real value of events |
| **max**         | float   | Maximum value of difference range (based on configured threshold) |
| **min**         | float   | Minimum value of difference range (based on configured threshold) |
| **change**      | float   | Percentage of change based on previous row |
| **exceeded**    | boolean | True if value exceeded defined threshold |

### Create build
##### POST `/build`

Starts new build.

```json
{
	"id": 29,
	"date": "2016-02-05T08:35:12+01:00",
	"duration": 0,
	"status": 1
}
```

| Field        | Type    | Description |
|--------------|---------|-------------|
| **id**       | integer | Build id |
| **date**     | string  | Date when build was created |
| **duration** | integer | Build duration in milliseconds |
| **status**   | integer | Current status of build: 0 - done, 1 - pending, 2 - failed |

## License

### The MIT License

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
