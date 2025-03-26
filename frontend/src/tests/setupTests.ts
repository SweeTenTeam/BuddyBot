import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
global.ReadableStream = require('stream').Readable;
global.TextEncoder = require('util').TextEncoder;

global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));