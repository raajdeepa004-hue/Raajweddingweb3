import express from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { defaultWeddingConfig, WeddingConfig } from '../config/wedding';
import { getGridFSBucket, getWeddingConfig, isMongoConfigured, saveWeddingConfig } from '../lib/mongodb';

dotenv.config();

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '2mb' }));

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and SVG are accepted.'));
    }
  },
});

const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const configuredToken = process.env.ADMIN_UPLOAD_TOKEN?.trim();

  if (!configuredToken) {
    res.status(503).json({ error: 'Administrator access is not configured on this server.' });
    return;
  }

  if (!authHeader || authHeader !== `Bearer ${configuredToken}`) {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing administrator token.' });
    return;
  }

  next();
};

const requirePersistentStorage = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isMongoConfigured()) {
    res.status(503).json({ error: 'Persistent storage is not configured on this server.' });
    return;
  }

  next();
};

apiRouter.get('/invitation', async (_req, res) => {
  try {
    const config = await getWeddingConfig();
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({
      success: true,
      data: config,
      isDatabaseConnected: isMongoConfigured(),
    });
  } catch {
    res.json({
      success: true,
      data: defaultWeddingConfig,
      isDatabaseConnected: false,
    });
  }
});

apiRouter.post('/invitation', requireAdminAuth, requirePersistentStorage, async (req, res) => {
  try {
    const incomingConfig = req.body as WeddingConfig;
    if (!incomingConfig || !incomingConfig.couple || !incomingConfig.milestones) {
      res.status(400).json({ error: 'Invalid invitation configuration payload.' });
      return;
    }

    await saveWeddingConfig(incomingConfig);
    res.json({
      success: true,
      message: 'Invitation configuration successfully updated.',
      data: incomingConfig,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

apiRouter.post('/media/upload', requireAdminAuth, requirePersistentStorage, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No media file provided for upload.' });
      return;
    }

    const { buffer, mimetype, originalname } = req.file;
    const bucket = await getGridFSBucket();
    const uploadStream = bucket.openUploadStream(originalname, {
      metadata: { contentType: mimetype, uploadedAt: new Date().toISOString() },
    });

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    await new Promise<void>((resolve, reject) => {
      readable
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve());
    });

    const fileId = uploadStream.id.toString();
    res.json({
      success: true,
      mediaId: fileId,
      url: `/api/media/${fileId}`,
      mimeType: mimetype,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

apiRouter.get('/media/:id', async (req, res) => {
  const { id } = req.params;

  if (!isMongoConfigured() || !ObjectId.isValid(id)) {
    res.status(404).send('Media not found');
    return;
  }

  try {
    const bucket = await getGridFSBucket();
    const files = await bucket.find({ _id: new ObjectId(id) }).toArray();
    if (!files.length) {
      res.status(404).send('Media not found');
      return;
    }

    const fileDoc = files[0];
    const mime = ((fileDoc.metadata as { contentType?: string })?.contentType)
      || (fileDoc as unknown as { contentType?: string }).contentType
      || 'image/jpeg';
    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    downloadStream.pipe(res);
  } catch {
    res.status(500).send('Error retrieving media');
  }
});

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    isMongoConfigured: isMongoConfigured(),
  });
});
