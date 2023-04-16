// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');
var md = require('markdown-it')();
const sharp = require('sharp');
// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
  `text/plain`,
  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (id) {
      this.id = id;
    } else {
      this.id = randomUUID().toString();
    }
    if (!ownerId) {
      logger.Error('ownerID is required');
      throw new Error('ownerID is missing');
    } else {
      this.ownerId = ownerId;
    }
    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }
    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }
    if (!Fragment.isSupportedType(type)) {
      logger.Error(`${type} is not a supported type`);
      throw new Error('Unsupported type');
    } else {
      this.type = type;
    }
    if (typeof size != 'number' || size < 0) {
      logger.Error(`${size} must be a positive number`);
      throw new Error('Invalid size');
    } else {
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static byUser(ownerId, expand = false) {
    logger.info(`Getting fragments for user ${ownerId}`);
    try {
      return listFragments(ownerId, expand);
    } catch (err) {
      throw new Error('listFragments by user failed');
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    logger.info(`Getting fragment by id: ${id} for ${ownerId}`);
    try {
      const fragment = await readFragment(ownerId, id);
      if (!fragment) {
        logger.Error('fragment does not exist');
      } else {
        return fragment;
      }
    } catch (err) {
      throw new Error('readFragment by Id failed');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    logger.info(`Deleting fragment by id: ${id} for ${ownerId}`);
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      logger.debug(`data is of type ${typeof data}`);
      throw new Error('data must be a Buffer');
    } else {
      this.size = Buffer.byteLength(data);
      this.save();
      return writeFragmentData(this.ownerId, this.id, data);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.includes('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/plain', 'text/markdown', 'text/html'];
      case 'text/html':
        return ['text/html', 'text/plain'];
      case 'application/json':
        return ['application/json', 'text/plain'];
      case 'image/png':
        return ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      case 'image/jpeg':
        return ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      case 'image/gif':
        return ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      case 'image/webp':
        return ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      default:
        return [this.mimeType];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    return validTypes.includes(type);
  }

  async convertType(data, type) {
    switch (type) {
      case 'text/html':
        if (this.type === 'text/markdown') {
          return md.render(data.toString());
        }
        return data;
      case 'image/png':
        return sharp(data).png();
      case 'image/jpeg':
        return sharp(data).jpeg();
      case 'image/gif':
        return sharp(data).gif();
      case 'image/webp':
        return sharp(data).webp();
      case 'text/plain':
        return data.toString();
      default:
        return data;
    }
  }
}

module.exports.Fragment = Fragment;
