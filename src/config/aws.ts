import { AwsConfigInterface } from '../common/interfaces/aws-config.interface';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET } = process.env;

export default {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  bucket: AWS_BUCKET,
} as AwsConfigInterface;
