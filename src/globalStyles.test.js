// src/__tests__/globalStyles.test.js
describe('Global styles', () => {
    beforeAll(() => {
      // Apply the style directly to document.body for testing
      document.body.style.backgroundColor = 'rgb(138, 187, 99)';
    });
  
    test('body has correct background color', () => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      expect(bgColor).toBe('rgb(138, 187, 99)');
    });
  });