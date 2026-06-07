export function formatSize(bytes: number) {
  if (!bytes) return '0 o';
  const units = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

export function getFileIcon(type: string) {
  if (type.startsWith('image/')) return 'bi-file-image-fill';
  if (type.startsWith('video/')) return 'bi-film';
  if (type.startsWith('audio/')) return 'bi-music-note-beamed';
  if (type.includes('pdf')) return 'bi-file-pdf-fill';
  if (type.includes('zip') || type.includes('rar')) return 'bi-file-zip-fill';
  if (type.includes('sheet') || type.includes('csv')) return 'bi-file-spreadsheet-fill';
  if (type.includes('word')) return 'bi-file-word-fill';
  return 'bi-file-earmark-fill';
}
