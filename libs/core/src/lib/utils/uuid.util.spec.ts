import { uuidv4 } from './uuid.util';

describe('uuid', () => {
  it('should return uuid', () => {
    const uuid = uuidv4();
    const result = uuid.split('-').map((part) => part.length);

    expect(result).toEqual([8, 4, 4, 4, 12]);
  });
});
