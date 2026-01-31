#!/bin/bash

echo "🚀 Initializing LocalStack S3..."

# Wait for LocalStack to be ready
sleep 2

# Create S3 bucket for file storage
awslocal s3 mb s3://participa-df-files

# Set bucket ACL to public-read (for testing)
awslocal s3api put-bucket-acl --bucket participa-df-files --acl public-read

# Enable versioning (optional)
awslocal s3api put-bucket-versioning --bucket participa-df-files --versioning-configuration Status=Enabled

# Set CORS configuration
awslocal s3api put-bucket-cors --bucket participa-df-files --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}'

echo "✅ S3 bucket 'participa-df-files' created successfully!"
echo "📦 LocalStack S3 endpoint: http://localhost:4566"

# List buckets to verify
awslocal s3 ls
