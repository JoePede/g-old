import uuid from 'uuid/v4';
import path from 'path';
import fs from 'fs';
import User from '../data/models/User';
import knex from '../data/knex';
import cloudinary from '../data/cloudinary';

// eslint-disable-next-line no-unused-vars
function canMutate(viewer, data) {
  return true;
}
function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-confusing-arrow
    fs.unlink(filePath, err => (err ? reject(err) : resolve()));
  });
}

function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-confusing-arrow
    fs.writeFile(filePath, content, err => (err ? reject(err) : resolve()));
  });
}

const deleteFileOnCloudinary = file =>
  new Promise((resolve) => {
    cloudinary.uploader.destroy(file, data => resolve(data));
  });
const uploadToCloudinaryStream = buffer =>
  new Promise((resolve) => {
    cloudinary.uploader.upload_stream(data => resolve(data)).end(buffer);
  });

const getPublicIdFromUrl = (url) => {
  const p = url.lastIndexOf('.');
  const del = url.lastIndexOf('/') + 1;
  if (del >= p) throw Error(`Wrong cloudinary url provided:${url}`);
  return url.slice(del, p);
};

// TODO Integrate with Usermodel!

const saveToCloudinary = async ({ viewer, data: { dataUrl, id }, loaders }) => {
  if (!canMutate(viewer, { dataUrl, id })) return null;
  const userId = id || viewer.id;
  const user = await User.gen(viewer, userId, loaders);
  if (user.avatar) {
    /*  if (user.avatar.indexOf('cloudinary') !== -1) {
      throw new Error('Avatar already set');
      // TODO let avatars beeing changed, delete old file first!
    } */
  }
  const regex = /^data:.+\/(.+);base64,(.*)$/;
  const matches = dataUrl.match(regex);
  const img = matches[2];

  const buffer = new Buffer(img, 'base64');
  // update
  await knex.transaction(async (trx) => {
    // utf8 encoding! Problem?
    // TODO delete old avatar if existing
    // TODO resizing serverside
    if (user.avatar.indexOf('http') !== -1) {
      const publicId = getPublicIdFromUrl(user.avatar);
      await deleteFileOnCloudinary(publicId).catch((e) => {
        console.error(`Cloudinary delete error: ${JSON.stringify(e)}`);
      });
    }

    const response = await uploadToCloudinaryStream(buffer).catch((e) => {
      console.error(`Cloudinary upload error: ${JSON.stringify(e)}`);
    });

    if (!response || !response.url) throw Error('Cloudinary failed');
    try {
      await trx
        .where({
          id: userId,
        })
        .update({ avatar_path: response.url, updated_at: new Date() })
        .into('users');
    } catch (error) {
      await deleteFileOnCloudinary(getPublicIdFromUrl(response.url));
      throw Error(error);
    }
  });
  // invalidate cache
  loaders.users.clear(userId);
  //
  const result = await knex('users')
    .where({ id: userId })
    .select('id', 'name', 'surname', 'email', 'avatar_path', 'role_id'); // await User.gen(viewer, viewer.id, loaders);
  return result[0] || null;
};

const saveLocal = async ({ viewer, data: { dataUrl, id }, loaders }, folder) => {
  // throw Error('TEST');
  if (!canMutate(viewer, { dataUrl, id })) return null;
  const userId = id || viewer.id;
  const user = await User.gen(viewer, userId, loaders);
  if (user.avatar) {
    if (user.avatar.indexOf('cloudinary') !== -1) {
      throw new Error('Avatar already set');
      // TODO let avatars beeing changed, delete old file first!
    }
  }
  const regex = /^data:.+\/(.+);base64,(.*)$/;
  const matches = dataUrl.match(regex);
  const ext = matches[1];
  const img = matches[2];
  const name = `${uuid()}.${ext}`;
  const filepath = path.resolve(__dirname, folder, name);

  const buffer = new Buffer(img, 'base64');
  const avatarPath = path.join('/', name);
  // update
  await knex.transaction(async (trx) => {
    // utf8 encoding! Problem?
    // TODO delete old avatar if existing
    // TODO resizing serverside
    if (user.avatar.indexOf('https') === -1) {
      const pathToFile = path.resolve(__dirname, folder + user.avatar);
      await deleteFile(pathToFile);
    }
    await writeFile(filepath, buffer);

    try {
      await trx
        .where({
          id: userId,
        })
        .update({ avatar_path: avatarPath, updated_at: new Date() })
        .into('users');
    } catch (error) {
      await deleteFile(filepath);
      throw Error(error);
    }
  });
  // invalidate cache
  loaders.users.clear(userId);
  //
  const result = await knex('users')
    .where({ id: userId })
    .select('id', 'name', 'surname', 'email', 'avatar_path', 'role_id'); // await User.gen(viewer, viewer.id, loaders);
  return result[0] || null;
};

export const AvatarManager = ({ local }) => {
  if (local == null) throw Error('Please set local to true or false');
  return local ? { save: saveLocal } : { save: saveToCloudinary };
};

function FileStorage(manager) {
  return {
    save: manager.save,
  };
}

export default FileStorage;
