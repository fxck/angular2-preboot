export function bootstrapDomReady(main): void {
  document.addEventListener('DOMContentLoaded', () => main());
};

export function bootstrapDomLoading (main): void {
  switch (document.readyState) {
    case 'loading':
      bootstrapDomReady(main);
      break;
    case 'complete':
    case 'interactive':
    default:
      main();
  }
};
