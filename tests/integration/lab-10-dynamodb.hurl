# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending an application/json fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request
{ "service": "DynamoDB" }

# Confirm that the server returns a 201
HTTP/1.1 201
# Capture the Location header value and id
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# Get the fragment info using the Location
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1
# Confirm that the server returns a 200
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
# Body of the request
```DynamoDB is **great**.```

# Confirm that the server returns a 201
HTTP/1.1 201
# Capture the Location header value and id
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# Get the fragment info using the Location
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1
# Confirm that the server returns a 200
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

# Get all the fragments
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1
# Confirm that the server returns a 200
HTTP/1.1 200
# Confirm that the list of fragments includes the two id values captured above
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# Delete the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1
# Confirm that the server returns a 200
HTTP/1.1 200

# Try to get deleted fragment
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1
# Confirm that the server returns a 404
HTTP/1.1 404

# Get all the fragments again
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1
# Confirm that the server returns a 200
HTTP/1.1 200
# Confirm that the first id is NOT included but that the second id
[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}
