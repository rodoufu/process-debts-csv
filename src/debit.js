function separateLine(line, separator = ',') {
	line = line.trim();
	if (line.length === 0) {
		//throw Error("Empty line");
	}
	let values = line.split(separator);
	return line;
}

module.exports = {
	files: [],
	separateLine
}
