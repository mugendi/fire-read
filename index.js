const lineByLine = require('n-readlines');
const validateOrThrow = require('validate-or-throw');

class FireRead {
	constructor(opts) {
		let schema = {
			files: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			lines: {
				type: 'number',
				optional: true,
				default: 20,
				positive: true,
				integer: true,
			},
			parser: {
				type: 'function',
				optional: true,
			},
			encoding: {
				type: 'string',
				optional: true,
				default: 'ascii',
				enum: [
					'ascii',
					'utf8',
					'utf16le',
					'ucs2',
					'base64',
					'base64url',
					'latin1',
					'binary',
					'hex',
				],
			},
		};

		validateOrThrow(opts, schema);

		// set default parser
		opts.parser =
			opts.parser ||
			function (v) {
				return v;
			};

		this.opts = opts;

		// console.log(opts);

		return this;
	}
	read() {
		let self = this;
		
		// if there are no files...
		if (this.opts.files.length == 0) {
			return {
				files: {
					current: null,
					selected: [],
				},
				fileNum: 0,
				lineNum: 0,
				lines: null,
				read: this.read.bind(self),
			};
		}

		this.selectedFiles = this.selectedFiles || [...this.opts.files];

		// pick file
		this.file = this.file || this.opts.files.shift();

		// init liner
		this.liner = this.liner || new lineByLine(this.file);

		this.fileNum =
			this.fileNum == undefined || this.fileNum == null
				? 0
				: this.fileNum;

		this.lineNum =
			this.lineNum == undefined || this.lineNum == null
				? 0
				: this.lineNum;

		//read and parse lines
		let linesArr = new Array(this.opts.lines)
			.fill(0)
			.map((v) => {
				let line = self.liner.next();
				this.lineNum++;

				return line ? line.toString(this.opts.encoding) : null;
			})
			.filter((l) => l !== null)
			.map(this.opts.parser);

		// if no more data and we have finished this file
		if (linesArr.length == 0) {
			// if we still have another file to read
			if (this.opts.files.length > 0) {
				this.file = null;
				this.liner = null;
				this.lineNum = null;

				this.fileNum++;

				return this.read();
			}

			return false;
		}

		return {
			files: {
				current: this.file,
				selected: this.selectedFiles,
			},
			fileNum: this.fileNum,
			lineNum: this.lineNum,
			lines: linesArr,
			read: this.read.bind(self),
		};
	}
}

module.exports = FireRead;
