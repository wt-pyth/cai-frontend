#!/bin/bash
set -e

JSON=$(cat <<-EOF
{
    "orgId": "$VERCEL_ORG_ID",
    "projectId": "$VERCEL_PROJECT_ID"
}
EOF
)
echo $JSON > .vercel/project.json
