const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'Jen';
    const text = 'Some message';
    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, text });
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Adam';
    const latitude = 1;
    const longitude = 1;
    const url = 'https://www.google.com/maps?q=1,1';
    const message = generateLocationMessage(from, latitude, longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, url });
  });
});
