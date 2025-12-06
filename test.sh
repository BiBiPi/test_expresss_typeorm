#!/bin/sh

for _ in {1..10000}; do
  curl -s -o /dev/null localhost:3000/posts \
      --request PUT \
      --data '{ "title": "Title", "content": "some content", "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY1MDE3MTM1LCJleHAiOjE3NjU2MjE5MzV9.YT1QU14iNVUh0ZVY0wb2IEaywbUKeOGlf2HQMytRex8" }' \
      --header 'Content-Type: application/json' > /dev/null
done