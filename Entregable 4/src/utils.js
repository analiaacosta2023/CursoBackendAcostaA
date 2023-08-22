import { fileURLToPath } from 'url';
import { dirname } from 'path'

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

console.log(__dirname);

export default __dirname;