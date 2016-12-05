export function bootloader (main): void {
  switch (document.readyState) {
    case 'loading':
      document.addEventListener('DOMContentLoaded', () => main());
      break;
    case 'complete':
    case 'interactive':
    default:
      main();
  }
}
