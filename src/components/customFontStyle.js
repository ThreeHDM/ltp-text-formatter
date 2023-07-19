import Quill from 'quill';

const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'monospace'];
Quill.register(Font, true);
