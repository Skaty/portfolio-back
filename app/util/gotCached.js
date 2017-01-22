import path from 'path';
import fs from 'fs-promise';
import url from 'url';
import ghGot from 'gh-got';
import bunyan from 'bunyan';

const log = bunyan.createLogger({ name: 'gotCached' });

/**
 * Converts URL to equivalent valid filename.
 */
function getCachePath(urlStr, name = '', cachePath) {
  const fileUrl = url.parse(urlStr);
  const pathAndHash = fileUrl.path + (fileUrl.hash ? fileUrl.hash : '') + name;
  const hostname = encodeURIComponent(fileUrl.hostname);
  const restOfPath = encodeURIComponent(pathAndHash);
  return path.join(cachePath, hostname, restOfPath);
}

/**
 * Gets the time the file was last modified if it exists, null otherwise.
 */
async function getFileModifiedTime(cachedPath, urlStr) {
  try {
    const stats = await fs.stat(cachedPath);
    if (stats.isFile()) {
      return stats.mtime;
    }
    log.warn(`${cachedPath} is not a file`);
  } catch (err) {
    log.info(`no cached file for ${urlStr}`);
  }
  return null;
}

async function gotCached(urlStr, config) {
  const cachedPath = getCachePath(urlStr, config.name, './cache');
  function returnCached() {
    log.info(`returning cached file for ${urlStr}`);
    return fs.readJson(cachedPath);
  }

  const modifiedTime = await getFileModifiedTime(cachedPath, urlStr);
  const maxCacheAge = 3600;
  const isCachedFileValid = modifiedTime &&
    (maxCacheAge === -1 || modifiedTime > Date.now() - (maxCacheAge * 1000));
  if (isCachedFileValid) {
    return await returnCached();
  }
  if (modifiedTime) {
    config.headers = config.headers || {};
    const modifedTimeString = (new Date(modifiedTime)).toUTCString();
    config.headers['if-modified-since'] = modifedTimeString;
  }

  try {
    const response = await ghGot(urlStr, config);
    const body = response.body;
    fs.outputJson(cachedPath, body);
    return body;
  } catch (error) {
    if (error.statusCode === 304) {
      return await returnCached();
    }
    if (error.statusCode) {
      throw new Error(`got http ${error.statusCode} while fetching ${urlStr}`);
    }
    throw error;
  }
}

export default gotCached;
