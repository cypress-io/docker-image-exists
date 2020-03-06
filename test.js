const test = require('ava')
const di = require('.')

test('listTags', async t => {
  const res = await di.listTags('cypress/included')
  t.is(res.name, 'cypress/included')
  const v3tags = res.tags.filter(s => s.startsWith('3.'))
  t.deepEqual(v3tags, [
    '3.2.0',
    '3.3.0',
    '3.3.1',
    '3.3.2',
    '3.4.0',
    '3.4.1',
    '3.5.0',
    '3.6.0',
    '3.6.1',
    '3.7.0',
    '3.8.0',
    '3.8.1',
    '3.8.2',
    '3.8.3'
  ])
})
