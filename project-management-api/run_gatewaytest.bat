npx aws-api-gateway-cli-test --username worthes --password 12Characters!
--user-pool-id eu-west-2_QmN841UbB
--app-client-id 43inla4asilb5vo5l5su5sp548
--cognito-region eu-west-2
--identity-pool-id eu-west-2:50d5d904-6380-4eb3-9143-3464368f0b72
--invoke-url https://24alulm62c.execute-api.eu-west-2.amazonaws.com/dev/projects
--api-gateway-region eu-west-2 --path-template /projects --method PUT
--body "{\"content\":\"hello world\",\"attachment\":\"hello.jpg\"}"