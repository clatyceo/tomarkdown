#!/bin/bash
# IndexNow Bulk Submit Script for tomdnow.com
# Submits all sitemap URLs to Bing, Naver, Yandex via IndexNow protocol

SITE_URL="https://tomdnow.com"
API_KEY="3fa9d4282d9c3ada67eadaaeb6c974b9"
KEY_LOCATION="${SITE_URL}/${API_KEY}.txt"

echo "=== IndexNow Bulk Submit ==="
echo "Fetching sitemap..."

# Extract all URLs from sitemap
URLS=$(curl -s "${SITE_URL}/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//g;s/<\/loc>//g')
URL_COUNT=$(echo "$URLS" | wc -l | tr -d ' ')

echo "Found ${URL_COUNT} URLs in sitemap"

# Build JSON array of URLs
URL_JSON=$(echo "$URLS" | python3 -c "
import sys, json
urls = [line.strip() for line in sys.stdin if line.strip()]
print(json.dumps(urls))
")

# IndexNow payload
PAYLOAD=$(cat <<EOF
{
  "host": "tomdnow.com",
  "key": "${API_KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": ${URL_JSON}
}
EOF
)

echo ""
echo "Submitting ${URL_COUNT} URLs to IndexNow endpoints..."
echo ""

# Submit to Bing (primary IndexNow endpoint)
echo "--- Bing ---"
BING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")
echo "Bing: HTTP ${BING_STATUS}"

# Submit to Naver
echo "--- Naver ---"
NAVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://searchadvisor.naver.com/indexnow" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")
echo "Naver: HTTP ${NAVER_STATUS}"

# Submit to Yandex
echo "--- Yandex ---"
YANDEX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://yandex.com/indexnow" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")
echo "Yandex: HTTP ${YANDEX_STATUS}"

echo ""
echo "=== Done ==="
echo "Expected: HTTP 200 (OK) or 202 (Accepted)"
echo "Key file: ${KEY_LOCATION}"
echo ""
echo "Verify key file is accessible:"
echo "  curl -s ${KEY_LOCATION}"
