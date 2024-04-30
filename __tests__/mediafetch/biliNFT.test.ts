import { biliNFTVideoFetch } from '../../src/utils/mediafetch/biliNFTNew';

test('biliNFT', async () => {
  const content = await biliNFTVideoFetch({
    act_id: '161',
    lottery_id: '75',
    index: '夜间魅影 小可',
  });
  // console.log(content);
  expect(content).not.toBeNull();
  const content2 = await biliNFTVideoFetch({
    act_id: '161',
    lottery_id: '75',
    index: 1,
  });
  // console.log(content);
  expect(content2).not.toBeNull();
});
