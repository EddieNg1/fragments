const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData
} = require('../../src/model/data/memory');

describe('database calls', () => {
  test('readFragment() returns metadata that we writeFragment() into the db', async () => {
    const data = {
      ownerId: 'testOwner',
      id: 'testID',
      fragment: 'test'
    };
    await writeFragment(data);
    const result = await readFragment('testOwner', 'testID');
    expect(result).toEqual(data);
  })

  test('readFragment() with incorrect ids returns nothing', async () => {
    const data = {
      ownerId: 'testOwner',
      id: 'testID',
      fragment: 'test'
    };
    await writeFragment(data);
    const result = await readFragment('incorrectOwner', 'incorrectID');
    expect(result).toBe(undefined);
  });

  test('writeFragment() returns nothing', async () => {
    const data = {
      ownerId: 'testOwner',
      id: 'testID',
      fragment: 'test'
    };
    const result = await writeFragment(data);
    expect(result).toBe(undefined);
  });

  test('readFragmentData() returns data that we writeFragmentData() into the db', async () => {
    const data = {
      fragment: 'test'
    };
    await writeFragmentData('testOwner', 'testID', data);
    const result = await readFragmentData('testOwner', 'testID');
    expect(result).toEqual(data);
  })

  test('writeFragmentData() returns nothing', async () => {
    const data = {
      fragment: 'test'
    };
    const result = await writeFragmentData('testOwner', 'testID', data);
    expect(result).toBe(undefined);
  });
});
