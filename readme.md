# Fire-Read

Read multiple files line by line (to avoid chocking your RAM) and one after the other till all files are read!

This module automates the process of reading each line and automatically skipping to the next file using just one convenient method; ```read()```.

## Example Use
```javascript

// require
const fireRead = require('fire-read');

// initialize
let resp = new FireRead({

    // we want to read these three log files
	files: [
		'/logs/info-2022-08-25.log',
		'/logs/info-2022-08-24.log',
		'/logs/info-2022-01-24.log',
	],

    // We also want to read one line at a time
	lines: 1, 

    // we want all line buffers decoded into ascii
    encoding : 'ascii',

    // optionally parse lines of each file read
    // parser: JSON.parse

});

// loop through all lines and files
while ((resp = resp.read())) {
	console.log(resp);
}

console.log('Finished Reading');

```
This produces the following logs:

```javascript
{
  files: {
    current: '/home/mugz/.@fetch/logs/info-2022-01-24.log',
    selected: [
      '/logs/info-2022-08-25.log',
      '/logs/info-2022-08-24.log',
      '/logs/info-2022-01-24.log'
    ]
  },
  fileNum: 2,
  lineNum: 959,
  lines: [
    `{"level":"info","message":"hello world","timestamp":"2022-08-24 08:26:58.035 PM"}`
  ],
  read: [Function: bound read]
}

Finished Reading
```

## What is Going on?

`new FireRead(options})` returns an instance of the [fire-read](https://www.npmjs.com/package/fire-read) with the convenient `read()` method that you can use to read each line in every file given.

Every time you call `read()` it also wraps in an instance of itself so you can iterate through all reads till there are none to do.

So ```while ((resp = resp.read())) {}``` simply iterates through all line reads and files till there is nothing more to read, at which point it returns ```null```.

## Options
The following options are needed and expected by the module.

- **`files` :** an Array of files to read. Required.
- **`lines` :** the number (batch) of lines to read every time `read()` is called. Defaults to 20;
- **`encoding` :** the type encoding to use while converting the line Buffer to string. See [Buffer.toString Documentation](https://nodejs.org/api/buffer.html#buftostringencoding-start-end). Defaults to "ascii".
- **`parser` :** a function used to parse each line in your logs. Many file loggers like [bunyan](https://www.npmjs.com/package/bunyan) write each log line as JSON strings. Defaults to no parsing.

    So in the example above we could have enabled the JSON parser by passing `JSON.parse` to ensure lines are parsed as shown below.

    ```javascript
    {
        level: 'info',
        message: 'hello world',
        timestamp: '2022-08-24 09:53:53.373 PM'
    }
    ```
