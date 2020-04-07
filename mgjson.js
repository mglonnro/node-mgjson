// Copied from: https://github.com/juanirache
const init = {
  "version": "MGJSON2.0.0",
  "creator": "https://github.com/mglonnro",
  "dynamicSamplesPresentB": true,
  "dynamicDataInfo": {
    "useTimecodeB": false,
    "utcInfo": {
      "precisionLength": 3,
      "isGMT": true
    }
  }, 
  "dataOutline": [],
  "dataDynamicSamples": [],
};

class MGJSON {
  constructor(config) {
    this.data = Object.assign({}, init, config);
    this.set = 1;
  }

  setConfig(d) {
    this.data = Object.assign({}, this.data, d);
  }

  addDataOutline(a) {
    this.data.dataOutline.push(Object.assign({}, a));
  }

  min(s) {
    let min = undefined;

    for (let x = 0, l = s.length; x < l; x++) {
      if (min === undefined || s[x].value < min) {
	min = s[x].value;
      }
    }

    return min;
  }
  
  max(s) {
    let max = undefined;

    for (let x = 0, l = s.length; x < l; x++) {
      if (max === undefined || s[x].value > max) {
        max = s[x].value;
      }
    }

    return max;
  }

  addSampleSet(name, matchName, samples) {
    let sampleSetID = this.set.toString().padStart(5, '0');

    this.data.dataOutline.push(Object.assign({}, {
      "objectType": "dataDynamic", 
      "displayName": name,
      "interpolation": "linear",
      "hasExpectedFrequecyB": false,
      "sampleCount": samples.length,
      "matchName": matchName,
      "sampleSetID": sampleSetID, 
      "dataType": {
        "type": "numberString",
        "numberStringProperties": {
          "pattern": {
            "digitsInteger": 3,
            "digitsDecimal": 2,
            "isSigned": false
          },
          "range": {
            "occuring": {
              "min": this.min(samples),
              "max": this.max(samples)
            },
            "legal": {
              "min": this.min(samples),
              "max": this.max(samples)
            }
          }
        }
      }
	}));

    this.data.dataDynamicSamples.push({ 
	sampleSetID: sampleSetID, 
	samples: this.formatSamples(3, 2, samples)
    });

    this.set ++;
  }

  formatSamples(digitsInteger, digitsDecimal, samples) {
    var n = [];

    for (let x = 0, l = samples.length; x < l; x++) {
      n.push({
	time: samples[x].time, 
	value: samples[x].value.toFixed(digitsDecimal).padStart(digitsDecimal+digitsInteger+1, '0')
      });
    }
    
    return n;
  }

  MGJSON() {
    return Object.assign({}, this.data);
  }
}

module.exports = MGJSON;
