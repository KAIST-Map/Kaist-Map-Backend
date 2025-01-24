#!/bin/bash

# 스크립트 실행 중 오류 발생 시 즉시 중단
set -e

# 변수 설정
AWS_REGION="ap-northeast-2"
ECR_REGISTRY="270116628011.dkr.ecr.ap-northeast-2.amazonaws.com"
IMAGE_NAME="jtkim/backend"
DOCKERFILE="dev.dockerfile"

# 로그 출력 함수
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# ECR 로그인
log "AWS ECR 로그인 중..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Docker 이미지 빌드
log "Docker 이미지 빌드 중..."
docker build --platform linux/amd64 -f ${DOCKERFILE} -t ${IMAGE_NAME} .

# 이미지 태깅
log "이미지 태깅 중..."
docker tag ${IMAGE_NAME}:latest ${ECR_REGISTRY}/${IMAGE_NAME}:latest

# ECR에 이미지 푸시
log "ECR에 이미지 푸시 중..."
docker push ${ECR_REGISTRY}/${IMAGE_NAME}:latest

log "모든 작업이 완료되었습니다!"