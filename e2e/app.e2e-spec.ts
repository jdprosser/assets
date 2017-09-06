import { AssetPage } from './app.po';

describe('asset App', () => {
  let page: AssetPage;

  beforeEach(() => {
    page = new AssetPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
