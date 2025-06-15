const convertBase64ToBuffer = (base64String) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

const generateFileName = (index) => {
  const timestamp = Date.now();
  return `photo_${timestamp}_${index}.jpg`;
};

module.exports = {
  convertBase64ToBuffer,
  generateFileName
};