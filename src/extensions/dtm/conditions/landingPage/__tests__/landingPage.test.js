'use strict';

var mockVisitorTracking = {
  getLandingPage: function() {
    return 'http://landingpage.com/test.html';
  }
};

var conditionDelegateInjector = require('inject!../landingPage');
var publicRequire = require('../../../../../engine/publicRequire');
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  'dtm/visitorTracking': mockVisitorTracking
});

describe('landing page condition delegate', function() {
  it('returns true when the landing page matches one of the string options', function() {
    var config = {
      conditionConfig: {
        pages: ['http://foo.com/bar.html', 'http://landingpage.com/test.html']
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the landing page does not match one of the string options', function() {
    var config = {
      conditionConfig: {
        pages: ['http://foo.com/bar.html', 'http://bar.com/foo.html']
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the landing page matches one of the regex options', function() {
    var config = {
      conditionConfig: {
        pages: ['http://foo.com/bar.html', /landingpage\.com\/t.st/i]
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the landing page does not match one of the regex options', function() {
    var config = {
      conditionConfig: {
        pages: ['http://foo.com/bar.html', /f.o/i]
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
