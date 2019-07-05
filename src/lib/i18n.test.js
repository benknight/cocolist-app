import * as i18n from './i18n';

describe('getLocalizedVNMMURL', () => {
  it('should format VNMM urls correctly across all cases', () => {
    expect(
      i18n.getLocalizedVNMMURL('https://www.vietnammm.com/en/babas-kitchen', 'en'),
    ).toBe('https://www.vietnammm.com/en/babas-kitchen');
    expect(
      i18n.getLocalizedVNMMURL('https://www.vietnammm.com/babas-kitchen', 'en'),
    ).toBe('https://www.vietnammm.com/en/babas-kitchen');
    expect(
      i18n.getLocalizedVNMMURL('https://www.vietnammm.com/en/babas-kitchen', 'vi'),
    ).toBe('https://www.vietnammm.com/babas-kitchen');
    expect(
      i18n.getLocalizedVNMMURL('https://www.vietnammm.com/babas-kitchen', 'vi'),
    ).toBe('https://www.vietnammm.com/babas-kitchen');
    expect(
      i18n.getLocalizedVNMMURL('https://www.vietnammm.com/babas-kitchen', 'blah'),
    ).toBe('https://www.vietnammm.com/babas-kitchen');
    expect(
      i18n.getLocalizedVNMMURL('https://www.vietnammm.com/en/babas-kitchen', 'blah'),
    ).toBe('https://www.vietnammm.com/babas-kitchen');
  });

  it('should throw an error when a non-VNMM url is passed to it', () => {
    expect(() => {
      i18n.getLocalizedVNMMURL('https://www.google.com', 'en');
    }).toThrow();
  });
});
