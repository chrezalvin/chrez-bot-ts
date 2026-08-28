import fs from "fs";
import path from "path";
import {exec} from "child_process";
import util from "util";

import {supabaseModels } from "@shared/supabase";

const BACKUP_PATH = "../backups"

const execAsync = util.promisify(exec);

function createTimestamp(): string{
  return `backup-${Date.now()}`;
}

async function backupStorage(backupPath: string, options?: {
  limit?: number
}) {
  const baseDir = path.join(backupPath, "storage");
  fs.mkdirSync(baseDir)

  const {data: listBucket, error} = await supabaseModels.storage.listBuckets();

  if(error || !listBucket){
    console.log("Failed to fetch list of buckets from the database");
    return;
  }

  for (const bucket of listBucket) {
    console.log(`Processing bucket: "${bucket.name}"...`);
    
    const bucketDir = path.join(baseDir, bucket.name);
    if (!fs.existsSync(bucketDir))
      fs.mkdirSync(bucketDir, { recursive: true });

    // List all files in the root of the bucket (since you don't use nested folders)
    const { data: files, error } = await supabaseModels.storage
      .from(bucket.name)
      .list('', { limit: options?.limit ?? 1000 });

    if (error) {
      console.error(`Error listing files in bucket "${bucket}":`, error.message);
      continue;
    }

    if (!files || files.length === 0) {
      console.log(`Bucket "${bucket}" is empty.`);
      continue;
    }

    for (const file of files) {
      const filePath = path.join(bucketDir, file.name);
      console.log(`Downloading: ${file.name}...`);

      // Download file data from Supabase
      const { data: fileData, error: downloadError } = await supabaseModels.storage
        .from(bucket.name)
        .download(file.name);

      if (downloadError) {
        console.error(`Failed to download ${file.name}:`, downloadError.message);
        continue;
      }

      // Convert blob/buffer to local file
      const buffer = Buffer.from(await fileData.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
    }
  }

  console.log('Storage backup completed successfully!');
}

async function backupSchema(backupPath: string, local?: boolean) {
  try {
    // If targeting your local development database
    const command = `npx supabase db dump -f ${backupPath}/schema.sql ${local ? "--local" : ""}`;
    
    console.log('Starting schema backup...');
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr)
      console.warn('Warnings during backup:', stderr);
    
    console.log('Schema backup completed successfully!');
    console.log(stdout);
  } catch (error) {
    console.error('Failed to create schema backup:', error);
  }
}

async function backupDatabase(backupPath: string, local?: boolean) {
  try {
    // If targeting your local development database
    const command = `npx supabase db dump -f ${backupPath}/data.sql --data-only --schema public,app_models ${local ? "--local" : ""}`;
    
    console.log('Starting database backup...');
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr)
      console.warn('Warnings during backup:', stderr);
    
    console.log('Database backup completed successfully!');
    console.log(stdout);
  } catch (error) {
    console.error('Failed to create database backup:', error);
  }
}

(async () => {
  const baseDir = path.join(__dirname, BACKUP_PATH, createTimestamp());
  fs.mkdirSync(baseDir)

  await backupSchema(baseDir, true);
  await backupDatabase(baseDir, true);
  await backupStorage(baseDir);

  console.log(`backup folder created at ${baseDir}`);
})()